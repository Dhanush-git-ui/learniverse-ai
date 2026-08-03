/**
 * codeExecutionService.ts
 * LeetCode-style code execution via the self-hosted backend compiler engine (Judge0).
 *
 * How it works:
 *  1. User writes only the solve() function body.
 *  2. We generate a full "test harness" that:
 *       - Parses each example's input string into typed variables.
 *       - Calls solve() with those variables.
 *       - Compares the return value against the expected output.
 *       - Prints structured markers that we parse back into pass/fail results.
 *  3. Results are displayed per test case in the OutputConsolePanel.
 */

const EXECUTE_API = '/api/code/execute-raw';

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  python:     { language: 'python',     version: '3.10.0' },
  cpp:        { language: 'c++',        version: '10.2.0' },
  java:       { language: 'java',       version: '15.0.2' },
  javascript: { language: 'javascript', version: '18.15.0' },
};

/** Unique line prefixes so we can parse harness output reliably */
const PFX_I = '__CODE_I__';   // test case index
const PFX_P = '__CODE_P__';   // passed: true | false
const PFX_A = '__CODE_A__';   // actual output from solve()
const PFX_E = '__CODE_E__';   // expected output from example

// ─── Input Parser ─────────────────────────────────────────────────────────────

function parseInputPairs(inputStr: string): { name: string; value: string }[] {
  if (!inputStr?.trim()) return [];
  const result: { name: string; value: string }[] = [];
  const regex = /(\w+)\s*=/g;
  const matches = [...inputStr.matchAll(regex)];
  for (let i = 0; i < matches.length; i++) {
    const name = matches[i][1];
    const valueStart = matches[i].index! + matches[i][0].length;
    const valueEnd   = i + 1 < matches.length ? matches[i + 1].index! : inputStr.length;
    const value = inputStr.slice(valueStart, valueEnd).trim().replace(/,\s*$/, '').trim();
    result.push({ name, value });
  }
  return result;
}

// ─── Type Inference ───────────────────────────────────────────────────────────

function inferCppType(name: string, value: string): string {
  if (name.toLowerCase().includes('head')) return 'ListNode*';
  if (value.startsWith('[['))   return 'vector<vector<int>>';
  if (value.startsWith('['))    return value.includes('"') ? 'vector<string>' : 'vector<int>';
  if (value === 'true' || value === 'false') return 'bool';
  if (value.startsWith('"') || value.startsWith("'")) return 'string';
  if (value.includes('.'))      return 'double';
  return 'int';
}

function inferJavaType(name: string, value: string): string {
  if (name.toLowerCase().includes('head')) return 'ListNode';
  if (value.startsWith('[['))   return 'int[][]';
  if (value.startsWith('['))    return value.includes('"') ? 'String[]' : 'int[]';
  if (value === 'true' || value === 'false') return 'boolean';
  if (value.startsWith('"') || value.startsWith("'")) return 'String';
  if (value.includes('.'))      return 'double';
  return 'int';
}

// ─── Value Converters (input string → language literal) ───────────────────────

function toPythonValue(value: string): string {
  if (value === 'true')  return 'True';
  if (value === 'false') return 'False';
  if (value === 'null')  return 'None';
  const v = value?.trim();
  if (!v) return "''";
  // Already a list/object literal or quoted string or Python None/True/False
  if (v.startsWith('[') || v.startsWith('{') || v.startsWith('"') || v.startsWith("'") || v === 'None' || v === 'True' || v === 'False') return v;
  // Numeric literal? leave as-is
  if (/^-?\d+(?:\.\d+)?$/.test(v)) return v;
  // Otherwise treat as a plain string and return a proper Python quoted literal
  try {
    return JSON.stringify(v);
  } catch (e) {
    return '"' + v.replace(/"/g, '\\"') + '"';
  }
}

function toJSValue(value: string): string {
  const v = value?.trim();
  if (!v) return "''";
  if (v === 'true' || v === 'false' || v === 'null') return v;
  if (v.startsWith('[') || v.startsWith('{') || v.startsWith('"') || v.startsWith("'")) return v;
  if (/^-?\d+(?:\.\d+)?$/.test(v)) return v;
  try { return JSON.stringify(v); } catch (e) { return '"' + v.replace(/"/g, '\\"') + '"'; }
}

function toCppValue(value: string): string {
  return value.replace(/\[/g, '{').replace(/\]/g, '}');
}

function toJavaValue(value: string, javaType: string): string {
  if (javaType === 'int[]' && value.startsWith('['))
    return `new int[]{${value.slice(1, -1)}}`;
  if (javaType === 'int[][]' && value.startsWith('['))
    return `new int[][]${value.replace(/\[/g, '{').replace(/\]/g, '}')}`;
  if (javaType === 'String[]' && value.startsWith('['))
    return `new String[]{${value.slice(1, -1)}}`;
  return value;
}

// ─── C++ Result Serializer ────────────────────────────────────────────────────

function cppSerializerLines(returnType: string, i: number): string[] {
  const rt     = returnType.replace(/\s+/g, '').replace(/&/g, '');
  const out    = `__out_${i}`;
  const actual = `__actual_${i}`;

  if (rt === 'ListNode*') return [
    `vector<int> __out_lst_${i} = __linked_list_to_list(${out});`,
    `string ${actual} = "[";`,
    `for(int _i=0;_i<(int)__out_lst_${i}.size();_i++){`,
    `  if(_i) ${actual} += ",";`,
    `  ${actual} += to_string(__out_lst_${i}[_i]);`,
    `}`,
    `${actual} += "]";`,
  ];

  if (rt.startsWith('vector<vector<')) return [
    `string ${actual} = "[";`,
    `for(int _i=0;_i<(int)${out}.size();_i++){`,
    `  if(_i) ${actual} += ",";`,
    `  ${actual} += "[";`,
    `  for(int _j=0;_j<(int)${out}[_i].size();_j++){if(_j)${actual}+=",";${actual}+=to_string(${out}[_i][_j]);}`,
    `  ${actual} += "]";`,
    `}`,
    `${actual} += "]";`,
  ];

  if (rt.startsWith('vector<string>')) return [
    `string ${actual} = "[";`,
    `for(int _i=0;_i<(int)${out}.size();_i++){if(_i)${actual}+=",";${actual}+=${out}[_i];}`,
    `${actual} += "]";`,
  ];

  if (rt.startsWith('vector<')) return [
    `string ${actual} = "[";`,
    `for(int _i=0;_i<(int)${out}.size();_i++){if(_i)${actual}+=",";${actual}+=to_string(${out}[_i]);}`,
    `${actual} += "]";`,
  ];

  if (rt === 'bool')   return [`string ${actual} = (${out} ? "true" : "false");`];
  if (rt === 'string') return [`string ${actual} = ${out};`];
  return [`string ${actual} = to_string(${out});`];
}

// ─── Harness Builders ─────────────────────────────────────────────────────────

function buildPythonHarness(
  code: string,
  examples: { input: string; output: string }[],
  pfx_i = PFX_I,
  pfx_p = PFX_P,
  pfx_a = PFX_A,
  pfx_e = PFX_E
): string {
  let targetFuncName = 'solve';
  const m = code.match(/def\s+(\w+)\s*\(/);
  if (m && m[1] !== '__normalize') {
    targetFuncName = m[1];
  }

  const lines: string[] = [
    code,
    '',
    '# ── LeetCode-style Test Runner (auto-generated) ──────────────────',
    'try:',
    `    solve = ${targetFuncName}`,
    'except NameError:',
    '    def solve(*args, **kwargs): return None',
    '',
    'class ListNode:',
    '    def __init__(self, val=0, next=None):',
    '        self.val = val',
    '        self.next = next',
    '',
    'def __list_to_linked_list(lst, pos=-1):',
    '    if not lst or not isinstance(lst, list):',
    '        return None',
    '    nodes = [ListNode(val) for val in lst]',
    '    for i in range(len(nodes) - 1):',
    '        nodes[i].next = nodes[i+1]',
    '    if pos >= 0 and pos < len(nodes):',
    '        nodes[-1].next = nodes[pos]',
    '    return nodes[0] if nodes else None',
    '',
    'def __linked_list_to_list(node):',
    '    lst = []',
    '    visited = set()',
    '    curr = node',
    '    while curr:',
    '        if id(curr) in visited:',
    '            break',
    '        visited.add(id(curr))',
    '        lst.append(curr.val)',
    '        curr = curr.next',
    '    return lst',
    '',
    'def __normalize(v):',
    '    import json',
    '    if isinstance(v, ListNode):',
    '        v = __linked_list_to_list(v)',
    '    s = str(v).strip().replace(\' \', \'\')',
    '    try: return json.dumps(json.loads(s), separators=(",", ":"))',
    '    except: return s.lower()',
    '',
  ];

  examples.forEach((ex, i) => {
    let pairs = parseInputPairs(ex.input);
    if (pairs.length === 0 && ex.input?.trim()) {
      pairs = [{ name: 'input_data', value: ex.input }];
    }
    const posPair = pairs.find(p => p.name === 'pos');
    const posVal = posPair ? posPair.value : '-1';

    const safeComment = (ex.input || '').split('\n').map(l => `# ${l}`).join('\n');
    lines.push(`# Case ${i}:`);
    lines.push(safeComment);
    pairs.forEach(p => {
      if (p.name.toLowerCase() === 'head') {
        lines.push(`${p.name} = __list_to_linked_list(${toPythonValue(p.value)}, ${posVal})`);
      } else {
        lines.push(`${p.name} = ${toPythonValue(p.value)}`);
      }
    });

    const params = pairs.map(p => p.name).join(', ');
    lines.push(`__out_${i} = solve(${params || 'None'})`);
    lines.push(`if isinstance(__out_${i}, ListNode):`);
    lines.push(`    __out_${i} = __linked_list_to_list(__out_${i})`);
    lines.push(`__exp_${i} = ${toPythonValue(ex.output)}`);
    lines.push(`__pass_${i} = __normalize(__out_${i}) == __normalize(__exp_${i})`);
    lines.push(`print("${pfx_i}" + str(${i}))`);
    lines.push(`print("${pfx_p}" + str(__pass_${i}).lower())`);
    lines.push(`print("${pfx_a}" + str(__out_${i}))`);
    lines.push(`print("${pfx_e}" + str(__exp_${i}))`);
    lines.push('');
  });

  return lines.join('\n');
}

function buildJavaScriptHarness(
  code: string,
  examples: { input: string; output: string }[],
  pfx_i = PFX_I,
  pfx_p = PFX_P,
  pfx_a = PFX_A,
  pfx_e = PFX_E
): string {
  let targetFuncName = 'solve';
  const m = code.match(/function\s+(\w+)\s*\(/) || code.match(/(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\([^)]*\)\s*=>)/);
  if (m && m[1] !== '__normalize') {
    targetFuncName = m[1];
  }

  const lines: string[] = [
    code,
    '',
    'let __solve_harness = () => null;',
    'try {',
    `  __solve_harness = ${targetFuncName};`,
    '} catch (e) {}',
    'const solve = __solve_harness;',
    '',
    'class ListNode {',
    '  constructor(val, next) {',
    '    this.val = (val===undefined ? 0 : val);',
    '    this.next = (next===undefined ? null : next);',
    '  }',
    '}',
    '',
    'function __listToLinkedList(lst, pos = -1) {',
    '  if (!Array.isArray(lst) || lst.length === 0) return null;',
    '  const nodes = lst.map(val => new ListNode(val));',
    '  for (let i = 0; i < nodes.length - 1; i++) {',
    '    nodes[i].next = nodes[i+1];',
    '  }',
    '  if (pos >= 0 && pos < nodes.length) {',
    '    nodes[nodes.length - 1].next = nodes[pos];',
    '  }',
    '  return nodes[0];',
    '}',
    '',
    'function __linkedListToList(node) {',
    '  const lst = [];',
    '  const visited = new Set();',
    '  let curr = node;',
    '  while (curr) {',
    '    if (visited.has(curr)) break;',
    '    visited.add(curr);',
    '    lst.push(curr.val);',
    '    curr = curr.next;',
    '  }',
    '  return lst;',
    '}',
    '',
    '// ── LeetCode-style Test Runner (auto-generated) ─────────────────',
    'function __normalize(v) {',
    '  if (v instanceof ListNode) v = __linkedListToList(v);',
    '  const s = (typeof v === "object" ? JSON.stringify(v) : String(v)).replace(/\\s/g,"");',
    '  try { return JSON.stringify(JSON.parse(s), null, 0); }',
    '  catch { return s.toLowerCase(); }',
    '}',
    '',
  ];

  examples.forEach((ex, i) => {
    let pairs = parseInputPairs(ex.input);
    if (pairs.length === 0 && ex.input?.trim()) {
      pairs = [{ name: 'input_data', value: ex.input }];
    }
    const posPair = pairs.find(p => p.name === 'pos');
    const posVal = posPair ? posPair.value : '-1';

    const safeComment = (ex.input || '').split('\n').map(l => `// ${l}`).join('\n');
    lines.push(`// Case ${i}:`);
    lines.push(safeComment);
    pairs.forEach(p => {
      if (p.name.toLowerCase() === 'head') {
        lines.push(`const ${p.name}_${i} = __listToLinkedList(${toJSValue(p.value)}, ${posVal});`);
      } else {
        lines.push(`const ${p.name}_${i} = ${toJSValue(p.value)};`);
      }
    });

    const params = pairs.map(p => `${p.name}_${i}`).join(', ');
    lines.push(`let __out_${i} = solve(${params});`);
    lines.push(`if (__out_${i} instanceof ListNode) { __out_${i} = __linkedListToList(__out_${i}); }`);
    lines.push(`const __exp_${i} = ${toJSValue(ex.output)};`);
    lines.push(`const __outStr_${i} = typeof __out_${i} === "object" ? JSON.stringify(__out_${i}) : String(__out_${i});`);
    lines.push(`const __expStr_${i} = typeof __exp_${i} === "object" ? JSON.stringify(__exp_${i}) : String(__exp_${i});`);
    lines.push(`const __pass_${i} = __normalize(__outStr_${i}) === __normalize(__expStr_${i});`);
    lines.push(`console.log("${pfx_i}" + ${i});`);
    lines.push(`console.log("${pfx_p}" + __pass_${i});`);
    lines.push(`console.log("${pfx_a}" + __outStr_${i});`);
    lines.push(`console.log("${pfx_e}" + __expStr_${i});`);
    lines.push('');
  });

  return lines.join('\n');
}

function buildCppHarness(
  code: string,
  examples: { input: string; output: string }[],
  pfx_i = PFX_I,
  pfx_p = PFX_P,
  pfx_a = PFX_A,
  pfx_e = PFX_E
): string {
  let targetFuncName = 'solve';
  const mFunc = code.match(/([\w<>,\s*]+?)\s+(\w+)\s*\(/);
  if (mFunc && mFunc[2] !== 'main' && mFunc[2] !== 'solve' && mFunc[2] !== '__normalize' && mFunc[2] !== '__list_to_linked_list' && mFunc[2] !== '__linked_list_to_list') {
    targetFuncName = mFunc[2];
  }

  let returnType = 'int';
  if (mFunc) {
    returnType = mFunc[1].trim().replace(/\s+/g, ' ');
  }

  let wrapper = '';
  if (targetFuncName !== 'solve') {
    const firstEx = examples[0];
    const pairs = firstEx ? parseInputPairs(firstEx.input) : [];
    const paramDefs = pairs.map(p => {
      const cppType = inferCppType(p.name, p.value);
      return `${cppType} ${p.name}`;
    }).join(', ');
    const paramNames = pairs.map(p => p.name).join(', ');
    wrapper = `\n${returnType} solve(${paramDefs}) {\n    return ${targetFuncName}(${paramNames});\n}\n`;
  }

  const strippedCode = code
    .replace(/#include\s*<[^>]+>/g, '')
    .replace(/using\s+namespace\s+std\s*;/g, '')
    .trim();

  const header = [
    '#include <iostream>',
    '#include <vector>',
    '#include <string>',
    '#include <algorithm>',
    '#include <cctype>',
    'using namespace std;',
    '',
    'struct ListNode {',
    '    int val;',
    '    ListNode *next;',
    '    ListNode(int x) : val(x), next(NULL) {}',
    '};',
    '',
    'ListNode* __list_to_linked_list(const vector<int>& lst, int pos = -1) {',
    '    if (lst.empty()) return NULL;',
    '    vector<ListNode*> nodes;',
    '    for (int val : lst) {',
    '        nodes.push_back(new ListNode(val));',
    '    }',
    '    for (size_t i = 0; i < nodes.size() - 1; ++i) {',
    '        nodes[i]->next = nodes[i+1];',
    '    }',
    '    if (pos >= 0 && pos < (int)nodes.size()) {',
    '        nodes.back()->next = nodes[pos];',
    '    }',
    '    return nodes[0];',
    '}',
    '',
    'vector<int> __linked_list_to_list(ListNode* node) {',
    '    vector<int> lst;',
    '    vector<ListNode*> visited;',
    '    ListNode* curr = node;',
    '    while (curr != NULL) {',
    '        if (find(visited.begin(), visited.end(), curr) != visited.end()) break;',
    '        visited.push_back(curr);',
    '        lst.push_back(curr->val);',
    '        curr = curr->next;',
    '    }',
    '    return lst;',
    '}',
    '',
  ].join('\n');

  const helpers = [
    '// ── LeetCode-style Test Runner (auto-generated) ─────────────────',
    'string __normalize(const string& s) {',
    '  string r;',
    '  for (char c : s) if (c != \' \') r += (char)tolower(c);',
    '  return r;',
    '}',
    '',
  ].join('\n');

  const mainLines: string[] = ['int main() {'];

  examples.forEach((ex, i) => {
    const pairs = parseInputPairs(ex.input);
    const posPair = pairs.find(p => p.name === 'pos');
    const posVal = posPair ? posPair.value : '-1';

    mainLines.push(`  // Case ${i}: ${ex.input}`);
    pairs.forEach(p => {
      const cppType = inferCppType(p.name, p.value);
      if (cppType === 'ListNode*') {
        mainLines.push(`  vector<int> __head_vec_${i} = ${toCppValue(p.value)};`);
        mainLines.push(`  ListNode* ${p.name}_${i} = __list_to_linked_list(__head_vec_${i}, ${posVal});`);
      } else {
        const cppVal  = cppType.startsWith('vector') ? toCppValue(p.value) : p.value;
        mainLines.push(`  ${cppType} ${p.name}_${i} = ${cppVal};`);
      }
    });

    const params = pairs.map(p => `${p.name}_${i}`).join(', ');
    mainLines.push(`  auto __out_${i} = solve(${params});`);

    cppSerializerLines(returnType, i).forEach(l => mainLines.push('  ' + l));

    const expEsc = ex.output.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    mainLines.push(`  string __exp_${i} = "${expEsc}";`);
    mainLines.push(`  bool __pass_${i} = __normalize(__actual_${i}) == __normalize(__exp_${i});`);
    mainLines.push(`  cout << "${pfx_i}" << ${i} << "\\n";`);
    mainLines.push(`  cout << "${pfx_p}" << (__pass_${i} ? "true" : "false") << "\\n";`);
    mainLines.push(`  cout << "${pfx_a}" << __actual_${i} << "\\n";`);
    mainLines.push(`  cout << "${pfx_e}" << __exp_${i} << "\\n";`);
    mainLines.push('');
  });

  mainLines.push('  return 0;');
  mainLines.push('}');

  return `${header}\n${strippedCode}\n${wrapper}\n\n${helpers}\n${mainLines.join('\n')}`;
}

function buildJavaHarness(
  code: string,
  examples: { input: string; output: string }[],
  pfx_i = PFX_I,
  pfx_p = PFX_P,
  pfx_a = PFX_A,
  pfx_e = PFX_E
): string {
  let targetFuncName = 'solve';
  const mFunc = code.match(/public\s+([\w\[\]]+)\s+(\w+)\s*\(/);
  if (mFunc && mFunc[2] !== 'main') {
    targetFuncName = mFunc[2];
  }

  let returnType = 'int[]';
  if (mFunc) {
    returnType = mFunc[1].trim();
  }

  let wrapper = '';
  if (targetFuncName !== 'solve') {
    const firstEx = examples[0];
    const pairs = firstEx ? parseInputPairs(firstEx.input) : [];
    const paramDefs = pairs.map(p => {
      const javaType = inferJavaType(p.name, p.value);
      return `${javaType} ${p.name}`;
    }).join(', ');
    const paramNames = pairs.map(p => p.name).join(', ');
    wrapper = `\n    public ${returnType} solve(${paramDefs}) {\n        return ${targetFuncName}(${paramNames});\n    }\n`;
  }

  const lastBrace = code.lastIndexOf('}');
  const classBody = code.substring(0, lastBrace) + wrapper;

  const mainLines: string[] = [
    '  // ── LeetCode-style Test Runner (auto-generated) ─────────────────',
    '  static class ListNode {',
    '      int val;',
    '      ListNode next;',
    '      ListNode() {}',
    '      ListNode(int val) { this.val = val; }',
    '      ListNode(int val, ListNode next) { this.val = val; this.next = next; }',
    '  }',
    '  static ListNode __listToLinkedList(int[] lst, int pos) {',
    '      if (lst == null || lst.length == 0) return null;',
    '      ListNode[] nodes = new ListNode[lst.length];',
    '      for (int i = 0; i < lst.length; i++) {',
    '          nodes[i] = new ListNode(lst[i]);',
    '      }',
    '      for (int i = 0; i < nodes.length - 1; i++) {',
    '          nodes[i].next = nodes[i+1];',
    '      }',
    '      if (pos >= 0 && pos < nodes.length) {',
    '          nodes[nodes.length - 1].next = nodes[pos];',
    '      }',
    '      return nodes[0];',
    '  }',
    '  static int[] __linkedListToArray(ListNode node) {',
    '      java.util.List<Integer> lst = new java.util.ArrayList<>();',
    '      java.util.Set<ListNode> visited = new java.util.HashSet<>();',
    '      ListNode curr = node;',
    '      while (curr != null) {',
    '          if (visited.contains(curr)) break;',
    '          visited.add(curr);',
    '          lst.add(curr.val);',
    '          curr = curr.next;',
    '      }',
    '      int[] arr = new int[lst.size()];',
    '      for (int i = 0; i < lst.size(); i++) arr[i] = lst.get(i);',
    '      return arr;',
    '  }',
    '  static String __normalize(String s) {',
    '    return s.replace(" ", "").toLowerCase();',
    '  }',
    '  static String __serialize(Object v) {',
    '    if (v instanceof int[])     return java.util.Arrays.toString((int[])v).replace(", ",",");',
    '    if (v instanceof boolean[]) return java.util.Arrays.toString((boolean[])v).replace(", ",",");',
    '    if (v instanceof String[])  return java.util.Arrays.toString((String[])v).replace(", ",",");',
    '    if (v instanceof long[])    return java.util.Arrays.toString((long[])v).replace(", ",",");',
    '    if (v instanceof ListNode)  return java.util.Arrays.toString(__linkedListToArray((ListNode)v)).replace(", ",",");',
    '    return String.valueOf(v);',
    '  }',
    '  public static void main(String[] args) {',
    '    Solution sol = new Solution();',
  ];

  examples.forEach((ex, i) => {
    const pairs = parseInputPairs(ex.input);
    const posPair = pairs.find(p => p.name === 'pos');
    const posVal = posPair ? posPair.value : '-1';

    mainLines.push(`    // Case ${i}: ${ex.input}`);
    pairs.forEach(p => {
      const jt = inferJavaType(p.name, p.value);
      if (jt === 'ListNode') {
        mainLines.push(`    int[] __head_arr_${i} = ${toJavaValue(p.value, 'int[]')};`);
        mainLines.push(`    ListNode ${p.name}_${i} = __listToLinkedList(__head_arr_${i}, ${posVal});`);
      } else {
        const jv = toJavaValue(p.value, jt);
        mainLines.push(`    ${jt} ${p.name}_${i} = ${jv};`);
      }
    });
    const params = pairs.map(p => `${p.name}_${i}`).join(', ');
    mainLines.push(`    Object __out_${i} = sol.solve(${params});`);
    mainLines.push(`    String __actual_${i} = __serialize(__out_${i});`);
    const expEsc = ex.output.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    mainLines.push(`    String __exp_${i} = "${expEsc}";`);
    mainLines.push(`    boolean __pass_${i} = __normalize(__actual_${i}).equals(__normalize(__exp_${i}));`);
    mainLines.push(`    System.out.println("${pfx_i}" + ${i});`);
    mainLines.push(`    System.out.println("${pfx_p}" + __pass_${i});`);
    mainLines.push(`    System.out.println("${pfx_a}" + __actual_${i});`);
    mainLines.push(`    System.out.println("${pfx_e}" + __exp_${i});`);
  });

  mainLines.push('  }');
  mainLines.push('}');

  return classBody + '\n' + mainLines.join('\n');
}

// ─── Parsing Output ───────────────────────────────────────────────────────────

function parseHarnessOutput(
  stdout: string,
  examples: { input: string; output: string }[],
  pfx_i = PFX_I,
  pfx_p = PFX_P,
  pfx_a = PFX_A,
  pfx_e = PFX_E
): any[] {
  const lines   = stdout.split('\n');
  const results: any[] = [];
  let cur: any  = null;

  for (const line of lines) {
    if (line.startsWith(pfx_i)) {
      if (cur) results.push(cur);
      const idx = parseInt(line.slice(pfx_i.length));
      cur = { idx, input: examples[idx]?.input ?? '', passed: false, actual: '', expected: '' };
    } else if (cur) {
      if (line.startsWith(pfx_p)) cur.passed   = line.slice(pfx_p.length).trim() === 'true';
      if (line.startsWith(pfx_a)) cur.actual   = line.slice(pfx_a.length).trim();
      if (line.startsWith(pfx_e)) cur.expected = line.slice(pfx_e.length).trim();
    }
  }
  if (cur) results.push(cur);
  return results;
}

// ─── Core Executor ─────────────────────────────────────────────────────

async function executeCodeOnBackend(code: string, lang: string) {
  const mapped = LANGUAGE_MAP[lang];
  if (!mapped) throw new Error(`Unsupported language: ${lang}`);

  const apiKey = import.meta.env.VITE_API_SECRET_KEY || 'devsecretkey';

  const fileNames: Record<string, string> = {
    python: 'solution.py', cpp: 'solution.cpp', java: 'Solution.java', javascript: 'solution.js',
  };

  const payload = {
    language: mapped.language,
    version:  mapped.version,
    files:    [{ name: fileNames[lang] ?? 'solution.txt', content: code }],
  };

  const res = await fetch(EXECUTE_API, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 429) {
    throw new Error("Server is currently busy running other students' code. Please wait a few seconds and try again.");
  }

  if (!res.ok) {
    throw new Error(`Code execution service returned status ${res.status}. Please check backend logs.`);
  }

  const data = await res.json();
  return {
    stdout:  data.run?.stdout  ?? '',
    stderr:  data.run?.stderr  ?? '',
    compile: data.compile      ?? null,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function runAndEvaluate(
  code:     string,
  lang:     string,
  examples: { input: string; output: string }[],
): Promise<any> {
  const t0 = performance.now();

  const runId = Math.random().toString(36).substring(2, 10);
  const pfx_i = `__CODE_I_${runId}__`;
  const pfx_p = `__CODE_P_${runId}__`;
  const pfx_a = `__CODE_A_${runId}__`;
  const pfx_e = `__CODE_E_${runId}__`;

  const builders: Record<string, (c: string, e: typeof examples, pi: string, pp: string, pa: string, pe: string) => string> = {
    python:     buildPythonHarness,
    javascript: buildJavaScriptHarness,
    cpp:        buildCppHarness,
    java:       buildJavaHarness,
  };
  const fullCode = (builders[lang] ?? buildPythonHarness)(code, examples, pfx_i, pfx_p, pfx_a, pfx_e);

  const { stdout, stderr, compile } = await executeCodeOnBackend(fullCode, lang);
  const runtime = ((performance.now() - t0) / 1000).toFixed(2) + 's';

  if (compile && compile.code !== 0 && compile.stderr?.trim()) {
    return {
      results: [{ actual: compile.stderr.trim(), expected: '', input: 'Compilation Error', passed: false }],
      runtime,
      memory: 'N/A',
    };
  }

  const caseResults = parseHarnessOutput(stdout, examples, pfx_i, pfx_p, pfx_a, pfx_e);

  if (caseResults.length === 0) {
    const errorMsg = stderr?.trim() || stdout?.trim() || 'No output produced. Check your solve() function.';
    return {
      results: [{ actual: errorMsg, expected: '', input: 'Runtime Error', passed: false }],
      runtime,
      memory: 'N/A',
    };
  }

  const passedCount = caseResults.filter(r => r.passed).length;
  return {
    passed_cases: passedCount,
    total_cases:  examples.length || caseResults.length,
    runtime,
    memory:       'N/A',
    results: caseResults.map(r => ({
      input:    r.input,
      expected: r.expected,
      actual:   r.actual,
      passed:   r.passed,
    })),
    raw_output: stdout,
  };
}
