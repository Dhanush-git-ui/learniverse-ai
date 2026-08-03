# Bugfix Requirements Document

## Introduction

The Learniverse AI application has six interrelated issues spanning performance, proctoring, the coding editor UI, question rendering, and result delivery. These range from latent 500 errors caused by unhandled exceptions to missing UI features (Run/Submit buttons, chart rendering, pictorial case questions) and a delayed result page after submission. All six are addressed together because they share the same frontend/backend codebase and several require coordinated frontend+backend changes.

---

## Bug Analysis

### Current Behavior (Defect)

**Group 1 – Performance / 500 Errors**

1.1 WHEN any API endpoint throws an unhandled Python exception THEN the system returns a raw HTTP 500 response with no user-facing detail, causing the UI to stall with a spinner.

1.2 WHEN the user clicks a button that triggers a slow AI generation call (e.g., topic overview, MCQ fetch) THEN the system blocks the request thread for several seconds with no feedback, making the UI feel frozen.

1.3 WHEN the database connection pool is exhausted under concurrent load THEN the system raises a runtime exception that propagates as a 500 instead of a graceful 503 with retry guidance.

**Group 2 – Placement Test — Device Detection**

1.4 WHEN a candidate opens the placement test on a mobile device (viewport width ≤ 768 px or `navigator.maxTouchPoints > 0`) THEN the system does not detect or warn about the mobile device; the proctoring bypass risk is not flagged.

1.5 WHEN a candidate uses a dual-monitor setup (window.screen.width significantly wider than window.innerWidth, or `window.screenLeft` far from zero indicating a secondary display) THEN the system does not detect or record the dual-screen configuration.

**Group 3 – Coding Section — Missing Run / Submit Buttons**

1.6 WHEN the candidate is on a Coding question inside the placement assessment THEN the system only shows a "Run Code" button in the editor toolbar but has no visible "Submit Code" button distinct from the global "Submit Assessment" button; candidates cannot individually submit a coding solution for evaluation without ending the whole exam.

1.7 WHEN the candidate clicks "Run Code" in the placement assessment editor THEN the output panel shows only `compilationResult.results[0].actual` (a single raw string) rather than a structured per-test-case pass/fail breakdown.

**Group 4 – Chart Generation**

1.8 WHEN a question's text contains chart-related keywords (e.g., "pie chart", "bar graph", "histogram", "line graph") AND the question includes structured data values THEN the system renders the question as plain text with no visual chart, making data interpretation unnecessarily difficult.

**Group 5 – Case-Based Questions — Pictorial Representation**

1.9 WHEN a question is categorized as case-based or contains a `case_image` / `diagram_url` field THEN the system does not render any visual alongside the question text, losing the contextual diagram that aids comprehension.

**Group 6 – Submit → Delayed Result Page**

1.10 WHEN the candidate clicks "Submit Assessment" THEN the system shows a spinner overlay while waiting for the `/api/assessment/submit` HTTP response before transitioning to the score page, introducing a noticeable delay of several seconds.

---

### Expected Behavior (Correct)

**Group 1 – Performance / 500 Errors**

2.1 WHEN any API endpoint throws an unhandled Python exception THEN the system SHALL catch it via the existing global exception handler and return a structured JSON 500 response with a user-friendly message, and the UI SHALL display an actionable error toast rather than stalling.

2.2 WHEN the user clicks a button that triggers a slow AI generation call THEN the system SHALL immediately show a loading indicator and the button SHALL be disabled (not clickable again) until the response arrives.

2.3 WHEN the database connection pool is exhausted THEN the system SHALL return HTTP 503 with a "service temporarily unavailable, please retry" message, and the UI SHALL display a retry prompt.

**Group 2 – Placement Test — Device Detection**

2.4 WHEN a candidate opens the placement test on a mobile device THEN the system SHALL detect the mobile environment during the system-check step, display a prominent warning ("Mobile devices are not permitted for this assessment"), and SHALL prevent advancement to the camera-check step until the candidate acknowledges or switches to a desktop.

2.5 WHEN a candidate has a dual-monitor setup THEN the system SHALL detect it at the fullscreen-gate step (by comparing `window.screen.width` to `window.innerWidth` with a threshold), log a `dual_screen` violation to the backend, and display a warning banner during the test.

**Group 3 – Coding Section — Run / Submit Buttons**

2.6 WHEN the candidate is on a Coding question THEN the system SHALL render both a "Run Code" button (executes code against sample test cases and shows output) and a separate "Submit Code" button (submits the solution for final scoring and records `passed_cases`/`total_cases` for that question) in the editor toolbar.

2.7 WHEN the candidate clicks "Run Code" THEN the output panel SHALL display a structured breakdown of each test case (Input / Expected / Actual / Passed status) rather than a raw string.

**Group 4 – Chart Generation**

2.8 WHEN a question's text contains chart keywords AND parseable data is present THEN the system SHALL automatically render an appropriate Recharts chart (PieChart for pie/donut data, BarChart for bar/histogram data, LineChart for line/trend data) below the question text using the data extracted from the question.

**Group 5 – Case-Based Questions — Pictorial Representation**

2.9 WHEN a question contains a `case_image`, `diagram_url`, or `image_url` field THEN the system SHALL render the image in a styled container above the question text; if no URL is present but the question type is "case-based", the system SHALL render a placeholder diagram block indicating a visual aid is associated.

**Group 6 – Submit → Immediate Result Page**

2.10 WHEN the candidate clicks "Submit Assessment" THEN the system SHALL immediately transition to a local "calculating results" state (computing scores from the already-cached `answers` and `questions` arrays client-side) and display the result page without waiting for the server round-trip; the server submission SHALL happen in the background and reconcile scores when it responds.

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a candidate submits correct MCQ answers THEN the system SHALL CONTINUE TO score them accurately and include them in the detailed report.

3.2 WHEN a candidate completes all setup steps (instructions → system check → camera → fullscreen) on a desktop browser THEN the system SHALL CONTINUE TO launch the test without any additional friction.

3.3 WHEN the placement assessment timer reaches zero THEN the system SHALL CONTINUE TO auto-submit the test exactly as before.

3.4 WHEN a violation is logged (tab switch, fullscreen exit, face missing) THEN the system SHALL CONTINUE TO increment the violation count and auto-submit at 3 violations.

3.5 WHEN the "Run Code" button is clicked in the separate `/topic` coding workspace (TopicDetail page, not the placement test) THEN the system SHALL CONTINUE TO execute code via Piston API and display results as before.

3.6 WHEN a candidate downloads the PDF report THEN the system SHALL CONTINUE TO generate the detailed PDF with all sections (Wrong, Unattempted, Correct, Coding Reviews) intact.

3.7 WHEN API rate limits are reached THEN the system SHALL CONTINUE TO return 429 responses with the existing retry-after behavior.

3.8 WHEN coding questions that do not contain chart keywords are rendered THEN the system SHALL CONTINUE TO display them as plain text with no chart injection.
