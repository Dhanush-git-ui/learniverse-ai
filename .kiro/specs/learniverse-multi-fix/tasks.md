# Implementation Plan

- [ ] 1. Write bug condition exploration tests (BEFORE implementing fixes)
  - **Property 1: Bug Condition** - Mobile Gate, isCaseBased Regex, Submit Delay
  - **CRITICAL**: These tests MUST FAIL on unfixed code — failure confirms bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode expected behavior — they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples demonstrating bugs before applying any fix
  - **Scoped PBT Approach**: Scope each property to concrete failing input(s)

  **Bug Condition A — Mobile Device Not Blocked at Render (Group 2)**
  - Render `PlacementAssessment` at the `system_check` step with `navigator.maxTouchPoints = 2`
  - Assert the "Activate Proctor Webcam" button has `disabled=true` immediately at render (before any click)
  - Bug condition: `isMobileDevice() == true` AND `step == 'system_check'` AND button `disabled` prop uses `mobileWarning` state (initially `false`) rather than a direct `isMobileDevice()` call
  - Expected failure on unfixed code: button `disabled={mobileWarning}` where `mobileWarning=false` at render → button is enabled
  - Document counterexample: mobile user can click "Activate Proctor Webcam" before any warning appears
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (proves the bug exists)
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.4, 2.4_

  **Bug Condition B — isCaseBased Regex Misses Table/Chart Keywords (Group 5)**
  - Render `QuestionImage` with `question.question = "Study the following table and answer."` and no `imgUrl`
  - Assert a placeholder `<div>` with "Refer to the diagram" text is rendered
  - Bug condition: question text contains "following table" but existing regex `/\bcase\b.*\bfollowing\b|\brefer.*\bfigure\b|\bdiagram\b|\bshown.*\bbelow\b/i` does not match
  - Expected failure on unfixed code: no placeholder rendered → `QuestionImage` returns `null`
  - Also test: "Based on the given data below, find the percentage" → regex misses "data below" → null
  - Document counterexample: case-based table questions show no visual placeholder
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (proves the bug exists)
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.9, 2.9_

  **Bug Condition C — Submit Waits for exitFullscreen Before Showing Score (Group 6)**
  - Mock `document.exitFullscreen()` to resolve after 300ms
  - Invoke `submitAssessment()` and measure time from call to when `step === 'score'`
  - Bug condition: `await document.exitFullscreen()` is blocking the `setStep('score')` call
  - Expected failure on unfixed code: step transitions after ≥ 300ms (not within 50ms)
  - Document counterexample: user sees spinner for 300ms+ while waiting for fullscreen teardown
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (proves the bug exists)
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.10, 2.10_

- [ ] 2. Write preservation property tests (BEFORE implementing fixes)
  - **Property 2: Preservation** - Desktop Flow, Non-Chart Questions, Non-Table Questions, Score Accuracy
  - **IMPORTANT**: Follow observation-first methodology — run UNFIXED code with non-buggy inputs first
  - Run tests on UNFIXED code and verify they PASS (confirms baseline behavior to preserve)
  - **EXPECTED OUTCOME**: Tests PASS on unfixed code (confirming baseline)

  **Preservation A — Desktop does not get mobile warning**
  - Observe: render `PlacementAssessment` at `system_check` with `navigator.maxTouchPoints = 0` and desktop UA
  - Observe: `isMobileDevice()` returns `false`, mobile warning banner NOT shown
  - Write property: for all desktop sessions (`isMobileDevice() == false`), button is NOT disabled at render
  - Verify passes on unfixed code
  - _Requirements: 3.2_

  **Preservation B — Non-table questions get no case placeholder**
  - Observe: render `QuestionImage` with a plain MCQ question like "What is the time complexity of binary search?" and no imgUrl
  - Observe: `QuestionImage` returns `null`
  - Write property: for all questions that do NOT contain case/table/chart/diagram/data keywords AND have no imgUrl, `QuestionImage` returns `null`
  - Verify passes on unfixed code
  - _Requirements: 3.8_

  **Preservation C — computeLocalScore tallies correctly**
  - Observe: `computeLocalScore(questions, answers, {})` with known correct/incorrect answers returns correct totals
  - Write property-based test: generate random answer maps where N answers match correct options → total equals N
  - Verify passes on unfixed code
  - _Requirements: 3.1_

  **Preservation D — camera flow on desktop proceeds normally**
  - Observe: `startCamera()` with `navigator.maxTouchPoints = 0` (desktop) does NOT return early
  - Verify step transitions to `camera_check` after getUserMedia succeeds
  - Verify passes on unfixed code
  - _Requirements: 3.2_

- [ ] 3. Apply all six bug group fixes

  - [ ] 3.1 Fix Group 2 — Mobile device gate: disable button proactively at render
    - In the `system_check` JSX block of `src/pages/PlacementAssessment.tsx`, change the "Activate Proctor Webcam" button's `disabled` prop from `disabled={mobileWarning}` to `disabled={isMobileDevice()}`
    - This ensures the button is disabled immediately at render time on mobile, without requiring a click first
    - Also add a proactive mobile warning block that renders when `isMobileDevice()` is true, regardless of `mobileWarning` state (belt-and-suspenders: keep `mobileWarning` for the camera-step guard)
    - Keep `startCamera()`'s existing early-return guard (`if (isMobileDevice()) { setMobileWarning(true); return; }`) as-is
    - _Bug_Condition: isBugCondition_Group2(step, 'mobile') — isMobileDevice()==true AND step=='system_check' AND button not disabled at render_
    - _Expected_Behavior: button is disabled at render when isMobileDevice()==true; mobile user cannot click through to camera step_
    - _Preservation: desktop users (isMobileDevice()==false) must see the button enabled and be able to proceed normally_
    - _Requirements: 1.4, 2.4, 3.2_

  - [ ] 3.2 Fix Group 5 — Broaden isCaseBased regex in QuestionImage
    - In `src/pages/PlacementAssessment.tsx`, update the `isCaseBased` regex inside `QuestionImage` component
    - Change from:
      ```
      /\bcase\b.*\bfollowing\b|\brefer.*\bfigure\b|\bdiagram\b|\bshown.*\bbelow\b/i
      ```
    - Change to:
      ```
      /\bcase\b.*\bfollowing\b|\brefer.*(?:figure|chart|table)\b|\bdiagram\b|\bshown.*\bbelow\b|\bfollowing\s+(?:table|chart|graph)\b|\bdata\s+below\b/i
      ```
    - This adds "following table", "following chart", "following graph", "data below", and "refer to the chart/table" patterns
    - _Bug_Condition: isBugCondition_Group5(question) — imgUrl==null AND isCaseBased==false AND question contains "table"/"data below"/"following table/chart"_
    - _Expected_Behavior: placeholder diagram block rendered for these question patterns_
    - _Preservation: plain text MCQ questions without these keywords still return null from QuestionImage_
    - _Requirements: 1.9, 2.9, 3.8_

  - [ ] 3.3 Fix Group 6 — Make exitFullscreen non-blocking in submitAssessment
    - In `src/pages/PlacementAssessment.tsx`, in the `submitAssessment` async function, change `await document.exitFullscreen()` to a fire-and-forget call
    - Change from:
      ```typescript
      if (document.fullscreenElement) {
        try { await document.exitFullscreen(); } catch (err) {}
      }
      ```
    - Change to:
      ```typescript
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {}); // non-blocking fire-and-forget
      }
      ```
    - The local score computation and `setStep('score')` must now immediately follow without any `await` blocking them
    - _Bug_Condition: isBugCondition_Group6(submitFlow) — setIsSubmitting(true) called AND exitFullscreen awaited AND setStep('score') delayed_
    - _Expected_Behavior: setStep('score') fires within 50ms of button click; teardown happens in background_
    - _Preservation: score computation, report generation, and background server submission must remain unchanged_
    - _Requirements: 1.10, 2.10, 3.1, 3.3_

  - [ ] 3.4 Fix Group 1 — Audit backend exception serialization (app.py)
    - Review all `except Exception as e: raise HTTPException(...)` blocks in `backend/app.py`
    - Confirm every `detail` argument uses `str(e)` or a literal string — never a raw exception object
    - The global `global_exception_handler` already returns a correct structured JSON with `detail` as a plain string and `error_type`; verify no raw exception objects are passed as `detail` anywhere
    - Specifically audit: `/api/chat` (already uses literal string), `/api/topic/overview` (already uses literal string), `/api/topic/mcqs` (already uses literal string), `/api/topic/coding` (already uses literal string)
    - Confirm `backend/placement_assessment_system/api.py` `get_db_cursor()` raises `HTTPException(503)` with plain string detail (already correct)
    - No code changes required if audit confirms all paths use `str()` coercion — mark as verified
    - _Bug_Condition: isBugCondition_Group1(request, exception) — exception propagates AND detail is non-string object_
    - _Expected_Behavior: all API errors return JSON with detail as plain string and error_type field_
    - _Preservation: rate limiting 429, auth 401/403, validation 422 responses unchanged_
    - _Requirements: 1.1, 1.3, 2.1, 2.3, 3.7_

  - [ ] 3.5 Verify Group 3 — Run/Submit buttons and codeExecutionService shape
    - Confirm both "Run Code" and "Submit Code" buttons are rendered in the editor toolbar JSX in `PlacementAssessment.tsx` (they are)
    - Confirm `handleRunCode` and `handleSubmitCode` are wired to the respective buttons (they are)
    - Confirm `runAndEvaluate` in `src/services/codeExecutionService.ts` returns `{ results, passed_cases, total_cases, runtime, memory }` shape (it does)
    - Confirm the console panel renders `compilationResult.results` as per-test-case rows when results array has entries (it does)
    - Confirm `handleSubmitCode` stores `{ passed_cases, total_cases, runtime }` in `codingSubmissions[q.id]` state (it does)
    - No code changes required if verification confirms all paths are correct — mark as verified
    - _Bug_Condition: isBugCondition_Group3(compilationResult) — results array present but not rendered_
    - _Expected_Behavior: Run Code shows per-test-case pass/fail rows; Submit Code records passed_cases/total_cases_
    - _Preservation: TopicDetail page code execution via /api/code/execute-raw unchanged (3.5)_
    - _Requirements: 1.6, 1.7, 2.6, 2.7, 3.5_

  - [ ] 3.6 Verify Group 4 — AutoChart mount and extractChartData
    - Confirm `AutoChart` is mounted in the non-coding question render branch in `PlacementAssessment.tsx` (it is)
    - Confirm `extractChartData` correctly handles "Science: 40%, Arts: 30%" style text (test with the regex)
    - Confirm `detectChartType` returns correct chart type for "pie chart", "bar graph", "line chart" keywords
    - Confirm `AutoChart` returns `null` when `chartType === null` or `data.length < 2` (non-chart questions unaffected)
    - Note: the `pattern1` regex requires `name.length > 1` — single character labels like "A" are filtered. This is acceptable for typical chart questions.
    - No code changes required if verification confirms all paths are correct — mark as verified
    - _Bug_Condition: isBugCondition_Group4(questionText) — chartType!=null AND data.length<2 despite numeric data present_
    - _Expected_Behavior: AutoChart renders Recharts chart when chartType detected and ≥2 data points parsed_
    - _Preservation: non-chart questions always render as plain text with no chart injection (3.8)_
    - _Requirements: 1.8, 2.8, 3.8_

  - [ ] 3.7 Verify bug condition exploration test now passes (Group 2 — mobile gate)
    - **Property 1: Expected Behavior** - Mobile Button Disabled at Render
    - **IMPORTANT**: Re-run the SAME test from task 1 (Bug Condition A) — do NOT write a new test
    - After applying fix 3.1, re-render `PlacementAssessment` at `system_check` with `navigator.maxTouchPoints = 2`
    - Assert button `disabled=true` immediately at render
    - **EXPECTED OUTCOME**: Test PASSES (confirms Group 2 mobile gate bug is fixed)
    - _Requirements: 2.4_

  - [ ] 3.8 Verify bug condition exploration test now passes (Group 5 — isCaseBased regex)
    - **Property 1: Expected Behavior** - Case-Based Placeholder for Table Questions
    - **IMPORTANT**: Re-run the SAME test from task 1 (Bug Condition B) — do NOT write a new test
    - After applying fix 3.2, render `QuestionImage` with "Study the following table and answer." and no imgUrl
    - Assert placeholder element is rendered
    - Also test "Based on the given data below, find the percentage" → placeholder rendered
    - **EXPECTED OUTCOME**: Test PASSES (confirms Group 5 isCaseBased bug is fixed)
    - _Requirements: 2.9_

  - [ ] 3.9 Verify bug condition exploration test now passes (Group 6 — instant result)
    - **Property 1: Expected Behavior** - Score Step Within 50ms
    - **IMPORTANT**: Re-run the SAME test from task 1 (Bug Condition C) — do NOT write a new test
    - After applying fix 3.3, mock `document.exitFullscreen()` to resolve after 300ms, invoke `submitAssessment()`
    - Assert `step === 'score'` within 50ms of call
    - **EXPECTED OUTCOME**: Test PASSES (confirms Group 6 submit delay bug is fixed)
    - _Requirements: 2.10_

  - [ ] 3.10 Verify preservation tests still pass after all fixes
    - **Property 2: Preservation** - All Non-Buggy Behaviors Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run all four preservation tests (A, B, C, D) after applying fixes 3.1, 3.2, 3.3
    - Confirm desktop users still see enabled camera button (Preservation A)
    - Confirm plain MCQ questions still return null from QuestionImage (Preservation B)
    - Confirm computeLocalScore tallies correctly (Preservation C)
    - Confirm desktop camera flow still proceeds normally (Preservation D)
    - **EXPECTED OUTCOME**: All preservation tests PASS (confirms no regressions)
    - _Requirements: 3.1, 3.2, 3.5, 3.8_

- [ ] 4. Checkpoint — Ensure all tests pass
  - Run the full test suite for the project
  - Verify exploration tests now pass (bug conditions resolved)
  - Verify all preservation tests still pass (no regressions)
  - Manually smoke-test the frontend: open assessment on desktop, confirm camera button enabled, confirm submit goes to score page immediately
  - Manually smoke-test case-based question rendering: add a test question containing "following table" and verify placeholder appears
  - Confirm backend exception handler returns structured JSON (can test with curl or Postman)
  - Ask the user if any questions arise before closing
