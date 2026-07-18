# Learniverse AI - Production DIY Implementation Guide

Follow this guide to fix the tests, resolve TypeScript/lint errors, clean up unused pages, upgrade the UX workspace, and integrate premium features.

---

## Part 1: Must Fixes (Test, TS, Lint & Cleanups)

### 1. Fix Failing Frontend Test
**File:** [`src/components/ConversationBox.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/components/ConversationBox.tsx)
The tests expect the `ConversationBox` to accept and render `initialMessages` correctly on startup. Add the prop back to the component signature and initialize messages from it.

**Update `ConversationBox.tsx`:**
```tsx
interface ConversationBoxProps {
  initialMessages?: Message[];
  sessionTitle?: string;
  onSendMessage?: (message: string) => void;
  currentQuestion?: Question;
  topic?: Topic;
}

const ConversationBox = ({ 
  initialMessages = [],
  sessionTitle = "Interactive Learning Session",
  onSendMessage,
  currentQuestion,
  topic
}: ConversationBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const topicSlug = topic?.slug || 'general';

  // Load chat history from props or localStorage
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
      return;
    }
    const savedHistory = localStorage.getItem(`learniverse_history_${topicSlug}`);
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
        setMessages([]);
      }
    } else {
      const greet: Message = {
        id: 'greet',
        type: 'teacher',
        content: `Welcome! Let's explore **${topic?.title || "General Science"}**. I will guide you step-by-step. Ask me for hints or analogies anytime!`
      };
      setMessages([greet]);
    }
  }, [topicSlug, topic?.title, initialMessages]);
```

### 2. Fix TypeScript compile error (`topic?.name`)
**File:** [`src/components/ConversationBox.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/components/ConversationBox.tsx)
The `Topic` interface defines `title`, not `name`. Modify the topicName configuration.

**Replace line 85 of `ConversationBox.tsx`:**
```diff
-    const topicName = topic?.name || topic?.title || "General Topic";
+    const topicName = topic?.title || "General Topic";
```

### 3. Fix Lint Error (`let` to `const` for `updatedCompleted`)
**File:** [`src/pages/TopicDetailPage.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/pages/TopicDetailPage.tsx)
`updatedCompleted` is not reassigned after initialization and should be declared as `const`.

**Replace line 166 of `TopicDetailPage.tsx`:**
```diff
-    let updatedCompleted = [...completedQuestions];
+    const updatedCompleted = [...completedQuestions];
```

### 4. Remove Duplicate and Unused Pages
Delete [`src/pages/TopicDetail.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/pages/TopicDetail.tsx). 
It is a leftover replica of [`TopicDetailPage.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/pages/TopicDetailPage.tsx) and is completely unused in the routing system.

### 5. Remove Production Leftovers (GPT Engineer and Title)
**File:** [`index.html`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/index.html)
Remove the external script tag injected by Lovable / GPT Engineer, and make sure the brand is uniform.

**Replace `index.html` with:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Learniverse AI - Guided Math & DSA Tutor</title>
    <meta name="description" content="Master Mathematics and Data Structures through conversational learning guided by AI tutors." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 6. Clean Encoding Issues
To prevent compilation and rendering garbage output like `logâ‚‚16` or `â†’` in legacy windows terminals or editors:
- **In `src/components/home/DemoSection.tsx`**, replace `log₂16` with standard text `log2(16)`.
- **In `src/pages/Index.tsx`**, replace raw unicode arrows `→` with SVGs or standard `->`.
- **In `src/components/ConversationBox.tsx`**, replace `🚨` with text prefix `[Error]`.

---

## Part 2: UX, Workspace and Layout Upgrades

### 1. Real Workspace Panel Layout
**File:** [`src/pages/TopicDetailPage.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/pages/TopicDetailPage.tsx)
Rearrange the layout on the topic study screen so it feels like a professional engineering workspace: a left panel for the Question details & resource library (tabbed), and a right panel for the AI conversation box.

**Replace the active workspace section layout (around lines 240-340) in `TopicDetailPage.tsx`:**
```tsx
            <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[650px]">
              {/* Left Workspace Panel: Questions & Textbook reference library */}
              <div className="lg:w-1/2 flex flex-col space-y-6">
                <div className="flex-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-800 rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="mb-4">
                      <ProgressIndicator 
                        currentQuestion={currentQuestionIndex + 1}
                        totalQuestions={topic.questions.length}
                        completedQuestions={completedQuestions}
                      />
                    </div>
                    
                    <QuestionCard
                      questionNumber={currentQuestionIndex + 1}
                      totalQuestions={topic.questions.length}
                      difficulty={currentQuestion.difficulty}
                      question={currentQuestion.prompt}
                      hints={currentQuestion.hints || []}
                      onSubmit={handleSubmitAnswer}
                      onRequestHint={handleRequestHint}
                    />
                  </div>

                  {showFeedback && (
                    <div className={`mt-6 p-4 rounded-lg border text-sm ${
                      feedbackType === 'correct' 
                        ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300' 
                        : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:text-red-300'
                    }`}>
                      <div className="font-bold flex items-center mb-1">
                        {feedbackType === 'correct' ? '✅ Correct Answer!' : '❌ Let\'s improve this approach'}
                      </div>
                      <p className="text-xs leading-relaxed opacity-95">
                        {feedbackType === 'correct' 
                          ? 'Well done! You correctly answered the problem.'
                          : `Approach: ${currentQuestion.solution}`}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between mt-6 pt-4 border-t border-slate-100 dark:border-gray-700">
                    <Button 
                      variant="outline" 
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === topic.questions.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>

                {/* Resource citation card */}
                <div className="p-4 bg-slate-50 dark:bg-gray-800/40 border border-slate-200 dark:border-gray-800 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Book className="h-4 w-4 text-indigo-500 mr-2" />
                    <h4 className="font-semibold text-slate-800 dark:text-white text-xs uppercase tracking-wider">Reference Source Material</h4>
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-400">
                    Sourced from Alagappa University Data Structures modules.
                    All tutoring outputs are grounded in these textbooks to maintain accuracy.
                  </p>
                </div>
              </div>
              
              {/* Right Panel: Active Chat Box */}
              <div className="lg:w-1/2 flex flex-col h-[650px]">
                <ConversationBox 
                  sessionTitle={`${topic.title} - Conversation`}
                  currentQuestion={currentQuestion}
                  topic={topic}
                />
              </div>
            </div>
```

### 2. Improve Answer Evaluation (Keyword overlap ratio)
**File:** [`src/pages/TopicDetailPage.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/pages/TopicDetailPage.tsx)
Prevent single-word matches from marking answers correct. Evaluate overlap based on key terms.

**Replace in `handleSubmitAnswer` in `TopicDetailPage.tsx`:**
```tsx
    // Evaluate answer with word subset match ratio (at least 35% overlap)
    const solutionWords = currentQuestion.solution.toLowerCase()
      .split(/[\s,.;:!?()[\]{}'"]+/)
      .filter(w => w.length > 3 && !['what', 'this', 'that', 'with', 'from', 'have', 'your', 'about'].includes(w));
    
    const userWords = answer.toLowerCase()
      .split(/[\s,.;:!?()[\]{}'"]+/)
      .filter(w => w.length > 3);

    const matches = solutionWords.filter(word => userWords.includes(word));
    const matchRatio = solutionWords.length > 0 ? matches.length / solutionWords.length : 0;
    const isCorrect = matchRatio >= 0.35; // Requires 35% key phrase overlap
```

---

## Part 3: Design Refinements (Clean, Solid UI)

### 1. Remove Excessive Hover scaling and Floating effects
Review [`src/components/TopicCard.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/components/TopicCard.tsx) and ensure it uses high-end, clean borders and subtle color shifts on hover:
```tsx
    className={`block p-6 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 transition-colors hover:border-indigo-400 hover:bg-slate-50/40 dark:hover:bg-gray-700/30 ${className}`}
```

---

## Part 4: Backend Commands & CI Testing

### 1. Install Backend Dependencies & Run Backend Tests
Run the following shell commands in your powershell terminal:
```powershell
# Navigate to backend folder
cd backend

# Install dependencies (pytest, chromadb, fastapi, uvicorn, sentence-transformers, httpx, requests)
pip install -r requirements.txt

# Run pytest checks
python -m pytest tests/
```

### 2. Add Type Checking to Frontend CI
**File:** [`package.json`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/package.json)
Under scripts, add a script to run compiler checks without building:
```json
    "type-check": "tsc -p tsconfig.app.json --noEmit"
```
Run type checks with:
```powershell
npm run type-check
```

---

## Part 5: Math Formatting & LaTeX Rendering

**File:** [`src/utils/markdown.tsx`](file:///c:/Users/dhanu/Downloads/learniverse-ai-main%20%281%29/learniverse-ai-main/src/utils/markdown.tsx)
Add support for code blocks and basic math LaTeX equations (like `$$math$$` or `[math]`) without requiring complex npm packages.

**Replace `parseInlineFormatting` in `src/utils/markdown.tsx` with:**
```tsx
const parseInlineFormatting = (text: string): React.ReactNode[] => {
  const tokens: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Match bold **text**, inline code `text`, and basic math expressions like $$equation$$ or [equation]
  const regex = /(\*\*.*?\*\*|`.*?`|\$\$.*?\$\$|\[.*?\])/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    const matchStr = match[0];
    
    if (matchIndex > currentIndex) {
      tokens.push(text.substring(currentIndex, matchIndex));
    }
    
    if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
      const boldText = matchStr.slice(2, -2);
      tokens.push(
        <strong key={matchIndex} className="font-semibold text-gray-900 dark:text-white">
          {boldText}
        </strong>
      );
    } else if (matchStr.startsWith('`') && matchStr.endsWith('`')) {
      const codeText = matchStr.slice(1, -1);
      tokens.push(
        <code key={matchIndex} className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded font-mono text-xs text-red-650 dark:text-red-400">
          {codeText}
        </code>
      );
    } else if (matchStr.startsWith('$$') && matchStr.endsWith('$$')) {
      const mathText = matchStr.slice(2, -2);
      tokens.push(
        <div key={matchIndex} className="my-2 p-2 bg-slate-50 dark:bg-slate-900 border rounded text-center font-serif italic text-sm text-indigo-650 dark:text-indigo-400">
          {mathText}
        </div>
      );
    } else if (matchStr.startsWith('[') && matchStr.endsWith(']')) {
      const mathText = matchStr.slice(1, -1);
      tokens.push(
        <span key={matchIndex} className="font-serif italic mx-0.5 text-indigo-600 dark:text-indigo-400">
          {mathText}
        </span>
      );
    }
    
    currentIndex = regex.lastIndex;
  }
  
  if (currentIndex < text.length) {
    tokens.push(text.substring(currentIndex));
  }
  
  return tokens.length > 0 ? tokens : [text];
};
```
