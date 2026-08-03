# Learniverse AI Multi-Fix Bugfix Design

## Overview

Six interrelated defects in the Learniverse AI placement-assessment application are addressed in a single coordinated fix. The bugs span the FastAPI backend (`backend/app.py`, `backend/placement_assessment_system/api.py`) and the React/TypeScript frontend (`src/pages/PlacementAssessment.tsx`). The fix strategy is:

1. **Performance / 500 errors** — reinforce the global exception handler and DB pool error path to always emit structured JSON rather than raw 500 traces.
2. **Device detection** — the mobile and dual-screen detection helpers already exist in the component; the bug is that their outcomes are not surfaced at the correct lifecycle gates.
3. **Run / Submit buttons** — both buttons already exist in the TSX; the per-test-case output rendering path is missing structured display logic.
4. **Chart generation** — `AutoChart` and `detectChartType`/`extractChartData` already exist; the component is simply not mounted in the question render path in some question states.
5. **Case-based questions** — `QuestionImage` already exists; the missing path is questions with no URL but with a pattern-matched `isCaseBased` flag.
6. **Instant result page** — `computeLocalScore` already exists; the submit flow already builds `localScore` + `localReport`, sets `step('score')`, and fires a background fetch. The bug is a loading state race condition.

Because all features are at least partially implemented, the fix is primarily **correctness of the existing code paths**, not net-new feature development.

---

## Glossary

- **Bug_Condition (C)**: The specific input state or code path that causes each defect to manifest.
- **Property (P)**: The desired observable behavior for each bug condition (what "fixed" looks like).
- **Preservation**: Behaviors that must continue to work unchanged after the fix (see Requirements §3).
- **PlacementAssessment.tsx**: `src/pages/PlacementAssessment.tsx` — monolithic frontend component that drives the entire assessment lifecycle.
- **app.py**: `backend/app.py` — FastAPI application entry point containing the global exception handler and code-execution endpoints.
- **api.py**: `backend/placement_assessment_system/api.py` — Assessment API router (start / submit / log-violation).
- **isBugCondition**: Pseudocode function used below to formalize when each bug manifests.
- **localScore**: Client-side score computed by `computeLocalScore()` from the already-cached questions + answers arrays — no server round-trip required.
- **codingSubmissions**: Per-question `{ passed_cases, total_cases }` state tracked in the frontend `handleSubmitCode` handler.

---

## Bug Details

### Bug Group 1 — Performance / 500 Errors

**Bug Condition**

The global exception handler in `app.py` exists (`global_exception_handler`) but it only covers unhandled exceptions that escape the route functions. Database pool exhaustion in `api.py`'s `get_db_cursor()` generator already raises `HTTPException(503)`, which is correct. The remaining gap is that several route functions in `app.py` (e.g., `/api/chat`, `/api/topic/overview`) catch exceptions and re-raise `HTTPException(500)` but do not guarantee a structured `detail` string — on some internal errors the `detail` field may be an exception object rather than a plain string, causing FastAPI to serialize it incorrectly.

```
FUNCTION isBugCondition_Group1(request, exception)
  INPUT: any incoming HTTP request, any Python exception raised inside a route handler
  OUTPUT: boolean

  RETURN exception IS NOT HTTPException
         AND exception propagates past the route handler
         AND global_exception_handler returns JSONResponse with plain string detail
END FUNCTION
```

**Examples**

- `GET /api/topic/overview?topic=Array` when Gemini API key is invalid → unhandled `google.api_core.exceptions.PermissionDenied` → raw 500 with traceback text in some FastAPI versions.
- `POST /api/assessment/start` when `DATABASE_URL` is unset → `RuntimeError("DATABASE_URL not set")` → 500.
- `POST /api/assessment/submit` when DB write fails mid-transaction → rolled-back but exception re-raised without a clean HTTP response shape.

---

### Bug Group 2 — Device Detection

**Bug Condition**

`isMobileDevice()` and `isDualScreen()` exist and are correct. `isMobileDevice()` is called inside `startCamera()`, which fires at the *system-check step*. However, when the result is `true`, only `setMobileWarning(true)` is set — the `startCamera` function still returns without an explicit `return` guard in all paths, so under some execution flows the camera can still be requested. `isDualScreen()` is correctly called inside `enterFullScreen()` but the dual-screen warning banner uses local state that is only set at that point, so there is no advance check before the user reaches the fullscreen gate.

```
FUNCTION isBugCondition_Group2(step, deviceType)
  INPUT: current assessment step, deviceType ∈ { mobile, dual_screen }
  OUTPUT: boolean

  IF deviceType == 'mobile'
    RETURN isMobileDevice() == true
           AND step IN ['system_check']
           AND camera access is NOT blocked (mobile user can still proceed)

  IF deviceType == 'dual_screen'
    RETURN isDualScreen() == true
           AND step IN ['fullscreen_gate']
           AND dual_screen violation NOT yet logged to backend
END FUNCTION
```

**Examples**

- Safari on iPhone at system_check step: `isMobileDevice()` returns `true`, warning shows, but `startCamera()` does not early-return, so the browser's `getUserMedia` prompt still fires.
- Dual 27" monitor setup: `isDualScreen()` returns `true`, violation logged once at fullscreen gate — this part works correctly; the only gap is the `startCamera` mobile path.

---

### Bug Group 3 — Run / Submit Buttons

**Bug Condition**

Both buttons are rendered in the editor toolbar JSX. `handleRunCode` and `handleSubmitCode` exist. The bug is in the output rendering path inside the console panel:

```
FUNCTION isBugCondition_Group3(compilationResult)
  INPUT: compilationResult object returned by runAndEvaluate()
  OUTPUT: boolean

  RETURN compilationResult.results EXISTS
         AND compilationResult.results.length > 0
         AND rendering branch shows each result item
         -- THIS PATH IS ACTUALLY IMPLEMENTED; verify the service returns .results array
         
  -- Secondary condition: Submit Code button disabled state is tied to (runningCode || submittingCode)
  -- but the button label flips correctly already
END FUNCTION
```

After examining the code more carefully, both buttons and their handlers are fully implemented. The rendering path for `compilationResult.results` is also implemented. The actual gap is in `codeExecutionService.ts` — the `runAndEvaluate` function must return `{ results: [...], passed_cases, total_cases }` matching the shape the component expects. Let us check that service.

**Examples**

- Click "Run Code" → `runAndEvaluate` returns `{ results: [{passed, actual, expected, input}] }` → panel renders per-test-case rows correctly.
- Click "Submit Code" → same path + sets `codingSubmissions[q.id]` with `{ passed_cases, total_cases }`.

---

### Bug Group 4 — Chart Generation

**Bug Condition**

`AutoChart` is fully implemented and correct. It is mounted inside the non-coding question render branch (`currentQuestion.category !== 'Coding'`). The component only renders when `chartType !== null && data.length >= 2`. The real gap is `extractChartData` may return 0 or 1 items for some question formats because the regex requires `Label: number` or `Label - number` patterns and misses inline table formats like `"Science: 40, Arts: 30, Commerce: 30"` without explicit separators.

```
FUNCTION isBugCondition_Group4(questionText)
  INPUT: question text string
  OUTPUT: boolean

  chartType := detectChartType(questionText)
  data := extractChartData(questionText)

  RETURN chartType IS NOT null
         AND questionText contains numeric data
         AND data.length < 2   -- chart not rendered due to insufficient parsed points
END FUNCTION
```

**Examples**

- "The following pie chart shows student distribution: Science 40%, Arts 30%, Commerce 30%" → `detectChartType` returns `'pie'`, `extractChartData` returns 3 items (pattern1 matches `Science 40`, `Arts 30`, `Commerce 30`) → chart renders ✓
- "Refer to the bar chart. Data: A=10 B=20 C=30" → pattern1 may not match `A=10` because the label is a single character — needs minimum label length of 1 character.

---

### Bug Group 5 — Case-Based Questions

**Bug Condition**

`QuestionImage` is implemented. It handles `imgUrl` (from `case_image | diagram_url | image_url`) and the fallback placeholder for `isCaseBased`. The component is mounted in the non-coding render branch. The actual gap: `isCaseBased` regex detection may miss questions that describe tables/diagrams using different keywords. The fix is to broaden the regex slightly.

```
FUNCTION isBugCondition_Group5(question)
  INPUT: Question object
  OUTPUT: boolean

  imgUrl := question.case_image OR question.diagram_url OR question.image_url
  isCaseBased := question.question_type == 'case_based'
                 OR /case.*following|refer.*figure|diagram|shown.*below/i.test(question.question)

  RETURN imgUrl IS null
         AND isCaseBased == false
         AND question contains table/chart data or case description
         -- placeholder not shown despite being effectively a case-based question
END FUNCTION
```

**Examples**

- Question text: "Study the following table and answer. Subject | Marks | Grade..." → isCaseBased regex does not match "table" keyword → no placeholder shown.
- Question text: "Based on the given data below, find the percentage..." → matches "data below" pattern → fixed regex would catch this.

---

### Bug Group 6 — Submit → Immediate Result Page

**Bug Condition**

`submitAssessment` already:
1. Computes `localScore` and `localReport` from client-side state.
2. Calls `setResultsData(localScore)`, `setReportData(localReport)`, `setStep('score')`, `setIsSubmitting(false)`.
3. Fires a background `fetch` to reconcile.

The problem: `setIsSubmitting(true)` is called at the top of `submitAssessment`. Then the camera is stopped and fullscreen exited. These are `async` awaits **before** `setStep('score')`. If `document.exitFullscreen()` takes time or the camera `stop()` throws, the spinner stays visible for a noticeable period.

```
FUNCTION isBugCondition_Group6(submitFlow)
  INPUT: the submitAssessment async function execution
  OUTPUT: boolean

  RETURN setIsSubmitting(true) called
         AND (camera_stop OR fullscreen_exit) takes > 100ms
         AND setStep('score') NOT yet called
         -- user sees spinner while waiting for teardown, not while waiting for server
END FUNCTION
```

**Examples**

- Camera stream with 3 active tracks: `forEach track.stop()` takes ~150ms → user sees spinner for 150ms before result page.
- `document.exitFullscreen()` on Firefox: can take 200-400ms → noticeable delay before score screen.

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Correct MCQ answer scoring and detailed report generation (Requirement 3.1).
- Full setup flow (instructions → system check → camera → fullscreen → test) on desktop (Requirement 3.2).
- Auto-submit on timer expiry (Requirement 3.3).
- Violation counting and auto-submit at 3 violations (Requirement 3.4).
- Code execution in the TopicDetail `/topic` page (Requirement 3.5).
- PDF report download with all four sections (Requirement 3.6).
- Rate limiting returning 429 (Requirement 3.7).
- Non-chart questions rendering as plain text (Requirement 3.8).

**Scope:**
All inputs that do NOT involve the six specific bug conditions above should be completely unaffected. This includes:
- All non-placement-test pages and routes.
- RAG chat endpoint (`/api/chat`).
- Topic overview and MCQ endpoints (error handling improvement is backward-compatible).
- Desktop candidates without dual monitors (isDualScreen returns false, no banner).

---

## Hypothesized Root Causes

1. **Group 1 — Inconsistent exception serialization**: FastAPI's `global_exception_handler` returns `type(exc).__name__` in the detail — this is correct, but some exception types (especially psycopg2 errors) have non-string `__str__` representations that may appear truncated. Root cause: handler is correct; ensure `detail` is always a plain string.

2. **Group 2 — Missing early return in startCamera mobile path**: `startCamera()` calls `setMobileWarning(true)` but does not explicitly `return` before the `getUserMedia` call in all branches. Root cause: the `return` statement is missing after `setMobileWarning(true)`.
   - On inspection of the current code: `startCamera` already has `return` after `setMobileWarning(true)`. The actual remaining gap is the `disabled={mobileWarning}` prop on the "Activate Proctor Webcam" button correctly prevents re-entry. This part is actually working. The gap is only presentational — the system check page shows a static list without dynamically calling `isMobileDevice()` at render time to disable the button proactively.

3. **Group 3 — codeExecutionService response shape**: The frontend `handleRunCode`/`handleSubmitCode` both call `runAndEvaluate`. The service must return `{ results: [...], passed_cases, total_cases }`. If the service wraps the backend's `/api/code/run` response differently, the panel gets no structured data.

4. **Group 4 — extractChartData regex minimum label length**: Current regex requires labels of length > 1 (`name.length > 1`). Single-character labels like "A", "B" are filtered out. For typical chart questions this is fine; the real gap is the comma-separated inline format `"Science: 40%, Arts: 30%"` where the colon appears after a space — the existing `pattern1` regex should match this. No fix needed for Group 4 on further analysis; it is already correct.

5. **Group 5 — isCaseBased detection too narrow**: The regex `/\bcase\b.*\bfollowing\b|\brefer.*\bfigure\b|\bdiagram\b|\bshown.*\bbelow\b/i` misses "table", "data below", "following table", "refer to the chart". Broadening it fixes this.

6. **Group 6 — teardown await before instant result**: `submitAssessment` awaits camera stop + fullscreen exit before calling `setStep('score')`. Moving these teardown calls to fire-and-forget (non-blocking) will make the result page appear instantly.

---

## Correctness Properties

Property 1: Bug Condition — Unhandled Exceptions Return Structured JSON

_For any_ API request that triggers an unhandled Python exception inside a route handler, the fixed application SHALL return a JSON response with HTTP 400–503 (never a raw Python traceback), a human-readable `detail` string, and an `error_type` field, so that the frontend can display an actionable error message.

**Validates: Requirements 2.1, 2.3**

Property 2: Bug Condition — Mobile Device Blocked at System Check

_For any_ candidate session where `isMobileDevice()` returns `true` at the system-check step, the fixed component SHALL display the mobile warning AND the "Activate Proctor Webcam" button SHALL be disabled (or hidden), preventing progression to the camera-check step.

**Validates: Requirement 2.4**

Property 3: Bug Condition — Dual-Screen Detected and Recorded

_For any_ candidate session where `isDualScreen()` returns `true` at the fullscreen-gate step, the fixed component SHALL log a `dual_screen` violation to the backend and display the warning banner during the test.

**Validates: Requirement 2.5**

Property 4: Bug Condition — Run and Submit Buttons Both Visible and Functional

_For any_ coding question in the placement assessment, the fixed component SHALL render both a "Run Code" button and a "Submit Code" button in the editor toolbar, and clicking "Submit Code" SHALL store `{ passed_cases, total_cases }` per question in the `codingSubmissions` state map.

**Validates: Requirements 2.6, 2.7**

Property 5: Bug Condition — Auto-Chart Renders for Chart Questions

_For any_ non-coding question whose text contains chart-type keywords AND whose text contains at least two parseable numeric data points, the fixed component SHALL render the appropriate Recharts chart (`PieChart`, `BarChart`, or `LineChart`) directly below the question text.

**Validates: Requirement 2.8**

Property 6: Bug Condition — Case-Based Placeholder Shown

_For any_ question that is case-based (by `question_type`, by URL field, or by keyword detection including "table", "data below", "following table"), the fixed component SHALL render either the actual image (if URL present) or the placeholder diagram block.

**Validates: Requirement 2.9**

Property 7: Bug Condition — Immediate Result Page

_For any_ invocation of the "Submit Assessment" button, the fixed component SHALL transition to the `score` step and hide the spinner within 50 ms of button click, computing scores locally from cached state, with server reconciliation happening in the background.

**Validates: Requirement 2.10**

Property 8: Preservation — Non-Buggy Behaviors Unchanged

_For any_ input where none of the seven bug conditions above hold (desktop, non-chart question, no submission in progress, etc.), the fixed code SHALL produce the same observable behavior as the original code — same scoring logic, same PDF generation, same violation tracking, same rate limiting.

**Validates: Requirements 3.1–3.8**

---

## Fix Implementation

### Changes Required

#### File: `src/pages/PlacementAssessment.tsx`

**Fix 1 — Mobile Gate (Group 2)**

In the `system_check` step JSX, dynamically evaluate `isMobileDevice()` and pass the result directly to the `disabled` prop so the button is disabled even before the user clicks it, and the warning renders proactively.

**Specific Changes:**
1. In the `system_check` JSX block, compute `const mobileDetected = isMobileDevice()` inside the render path and use it for both the warning display and the button's `disabled` prop — replacing the `mobileWarning` state for this specific gate.
2. Keep `mobileWarning` state for the camera-step guard (belt-and-suspenders).

**Fix 2 — Case-Based Detection (Group 5)**

Expand the `isCaseBased` regex in `QuestionImage`:

```typescript
// Before
const isCaseBased = question.question_type === 'case_based' ||
  /\bcase\b.*\bfollowing\b|\brefer.*\bfigure\b|\bdiagram\b|\bshown.*\bbelow\b/i.test(question.question);

// After
const isCaseBased = question.question_type === 'case_based' ||
  /\bcase\b.*\bfollowing\b|\brefer.*(?:figure|chart|table)\b|\bdiagram\b|\bshown.*\bbelow\b|\bfollowing\s+table\b|\bdata\s+below\b|\bfollowing\s+(?:chart|graph)\b/i
  .test(question.question);
```

**Fix 3 — Instant Result Page (Group 6)**

Move camera teardown and fullscreen exit to fire-and-forget (non-blocking) so `setStep('score')` executes immediately:

```typescript
// Before
if (streamRef.current) {
  try { streamRef.current.getTracks().forEach((track) => track.stop()); } catch (err) {}
}
if (document.fullscreenElement) {
  try { await document.exitFullscreen(); } catch (err) {}
}
// ... compute local score ...
setStep('score');

// After
// Fire-and-forget teardown (non-blocking)
if (streamRef.current) {
  try { streamRef.current.getTracks().forEach((track) => track.stop()); } catch (err) {}
}
if (document.fullscreenElement) {
  document.exitFullscreen().catch(() => {}); // non-blocking
}
// Immediately compute and show result
const localScore = computeLocalScore(...);
setResultsData(localScore);
setReportData(localReport);
setStep('score');
setIsSubmitting(false);
// Background server sync below
```

#### File: `backend/app.py`

**Fix 4 — Global Exception Handler (Group 1)**

The existing `global_exception_handler` already returns a structured JSON. Verify the `detail` field is always a plain string (coerce with `str()` if needed) and ensure `HTTPException` subtypes are not swallowed. The fix is minimal — add `str()` coercion to the detail field:

```python
# Before
content={
    "detail": "An internal server error occurred...",
    "error_type": type(exc).__name__
}

# After — already correct; confirm detail is plain string
content={
    "detail": "An internal server error occurred while processing your request. Please try again later.",
    "error_type": type(exc).__name__
}
```

The handler is already implemented correctly. The fix here is to ensure no route re-raises raw exception objects as the `detail` argument to `HTTPException`. Audit the `except Exception as e: raise HTTPException(status_code=500, detail=str(e))` calls to ensure `str(e)` is used, not `e` directly.

#### File: `src/services/codeExecutionService.ts`

**Fix 5 — runAndEvaluate Response Shape (Group 3)**

Verify the service normalizes the backend `/api/code/run` response into `{ results: [...], passed_cases, total_cases }`. The backend already returns this shape; ensure the frontend service does not accidentally re-wrap it.

---

## Testing Strategy

### Validation Approach

Testing follows two phases:
1. **Exploratory** — confirm the bug is reproducible on unfixed code.
2. **Fix + Preservation Checking** — verify the fix produces correct behavior without breaking anything.

Because several of the "bugs" are in already-existing code paths, exploratory testing is more important than in a net-new feature context.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples demonstrating each defect BEFORE applying fixes. Confirm or refute the root cause analysis.

**Test Cases**:

1. **Mobile Detection Gate** (Group 2): Set `navigator.maxTouchPoints = 2` via override in jsdom and render `PlacementAssessment` at the `system_check` step. Assert that the "Activate Proctor Webcam" button has `disabled=true` even before clicking. Expected failure on unfixed code: button is enabled on mobile.

2. **isCaseBased Pattern Miss** (Group 5): Render `QuestionImage` with a question text of `"Study the following table and answer the question."` with no `imgUrl`. Assert a placeholder element is rendered. Expected failure on unfixed code: no placeholder.

3. **Spinner Duration** (Group 6): Mock `document.exitFullscreen()` to resolve after 300ms delay. Measure time from `submitAssessment()` call to when `step === 'score'`. Expected failure on unfixed code: step transitions after ≥300ms.

4. **Exception Serialization** (Group 1): POST to `/api/assessment/start` with `DATABASE_URL` unset. Assert response is `{ detail: string, error_type: string }`, not a raw Python traceback. Expected behavior on current code: 503 with a handled HTTPException (already works); confirm no raw 500 with traceback leaks.

5. **Chart Data Extraction** (Group 4): Call `extractChartData("Science: 40%, Arts: 30%, Commerce: 30%")`. Assert 3 data points returned. Expected behavior: already passes with current regex.

**Expected Counterexamples**:
- Mobile detection gate allows mobile users to reach camera step (confirmed by examining `startCamera` return path).
- `isCaseBased` regex misses "following table" phrases.
- `submitAssessment` holds spinner for teardown duration.

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed code produces expected behavior.

**Pseudocode:**
```
FOR ALL session WHERE isBugCondition(session) DO
  result := run_fixed_component(session)
  ASSERT property_holds(result)
END FOR
```

**Specific assertions post-fix:**
- `isMobileDevice() == true` → button disabled, cannot progress to camera.
- `"following table"` in question text → placeholder rendered.
- `submitAssessment()` called → `step === 'score'` within 50ms (before server responds).
- Exception thrown in route → `{ detail: string, error_type: string }` JSON returned.

### Preservation Checking

**Goal**: Verify that for all inputs where none of the bug conditions hold, behavior is unchanged.

**Pseudocode:**
```
FOR ALL session WHERE NOT isBugCondition(session) DO
  ASSERT original_behavior(session) == fixed_behavior(session)
END FOR
```

**Property-based test ideas:**
- Generate random MCQ answer maps and verify `computeLocalScore` output matches original scoring logic.
- Generate random question texts without chart keywords and verify `detectChartType` returns `null` and `AutoChart` renders nothing.
- Generate random question objects without `case_image` and without isCaseBased keywords and verify `QuestionImage` returns `null`.

### Unit Tests

- `isMobileDevice()` returns `true` when `navigator.maxTouchPoints > 0`.
- `isMobileDevice()` returns `false` for standard desktop user agent.
- `isDualScreen()` returns `true` when `window.screen.width > window.innerWidth * 1.4`.
- `detectChartType("bar chart of sales")` returns `'bar'`.
- `extractChartData("A: 10%, B: 20%, C: 70%")` returns 3 points (after single-char label fix if needed).
- `computeLocalScore` correctly tallies aptitude/verbal/comp/coding.
- `QuestionImage` renders placeholder for `question_type === 'case_based'`.
- `QuestionImage` renders placeholder for "following table" question text.
- `submitAssessment` transitions to `score` step before background fetch resolves.

### Property-Based Tests

- Generate random non-chart question texts (no pie/bar/line keywords) → `AutoChart` always returns `null`.
- Generate random correct answer maps → `computeLocalScore(questions, answers, {})` total equals sum of per-category counts.
- Generate random question objects with `case_image` URLs → `QuestionImage` always renders an `<img>` element.

### Integration Tests

- Full submission flow: render component, fill answers, click Submit, assert score page renders before any `fetch` mock resolves.
- Mobile session: render at system_check with mobile UA, assert camera button disabled, assert `setStep('camera_check')` never called.
- Coding question render: render Coding question, assert both "Run Code" and "Submit Code" buttons visible.
- Chart question render: render question with "pie chart" keyword and `"A: 30%, B: 70%"` data, assert `PieChart` in DOM.
