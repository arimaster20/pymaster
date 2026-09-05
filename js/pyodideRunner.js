// Runs real Python in the browser using Pyodide (Python compiled to
// WebAssembly). No server, no backend -- your code actually executes,
// right here, for real.

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/";

let pyodideReadyPromise = null;

/** Kicks off loading Pyodide (if not already started) and returns a promise for it. */
export function ensurePyodide(onStatus) {
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = (async () => {
      onStatus?.("Loading Python engine (first time only, a few seconds)...");
      const pyodide = await window.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
      onStatus?.("ready");
      return pyodide;
    })();
  }
  return pyodideReadyPromise;
}

export function isPyodideReady() {
  return pyodideReadyPromise !== null;
}

function indentCode(code) {
  return code
    .split("\n")
    .map((line) => "    " + line)
    .join("\n");
}

function buildHarness(challenge, userCode) {
  const indented = indentCode(userCode);
  const testsJson = JSON.stringify(challenge.tests || []).replace(/'''/g, "\\'\\'\\'");

  const lines = [
    "import sys, io, json, traceback",
    "__buf = io.StringIO()",
    "__old_stdout = sys.stdout",
    "sys.stdout = __buf",
    "__setup_error = None",
    "try:",
    indented,
    "    pass",
    "except Exception:",
    "    __setup_error = traceback.format_exc()",
    "sys.stdout = __old_stdout",
    "__printed = __buf.getvalue()",
    '__output = {"printed": __printed, "setup_error": __setup_error, "tests": []}',
    `__tests = json.loads(r'''${testsJson}''')`,
  ];

  if (challenge.mode === "function") {
    lines.push(
      "if __setup_error is None:",
      "    for __tc in __tests:",
      "        try:",
      "            __args = __tc.get('args', [])",
      "            __kwargs = __tc.get('kwargs', {})",
      `            __result = ${challenge.functionName}(*__args, **__kwargs)`,
      "            __expected = __tc.get('expected')",
      "            __tol = __tc.get('tolerance')",
      "            if __tol is not None:",
      "                __passed = isinstance(__result, (int, float)) and abs(__result - __expected) <= __tol",
      "            else:",
      "                __passed = __result == __expected",
      "            __output['tests'].append({'passed': bool(__passed), 'got': repr(__result), 'expected': repr(__expected)})",
      "        except Exception:",
      "            __output['tests'].append({'passed': False, 'error': traceback.format_exc()})",
    );
  } else if (challenge.mode === "class") {
    lines.push(
      "if __setup_error is None:",
      "    for __tc in __tests:",
      "        try:",
      `            __obj = ${challenge.className}(*__tc.get('constructorArgs', []))`,
      "            __checks_results = []",
      "            __all_passed = True",
      "            for __chk in __tc.get('checks', []):",
      "                if __chk['type'] == 'attr':",
      "                    __got = getattr(__obj, __chk['name'], None)",
      "                else:",
      "                    __method = getattr(__obj, __chk['name'])",
      "                    __got = __method(*__chk.get('args', []))",
      "                __expected = __chk.get('expected')",
      "                __passed_chk = __got == __expected",
      "                if not __passed_chk:",
      "                    __all_passed = False",
      "                __checks_results.append({'name': __chk.get('name'), 'passed': bool(__passed_chk), 'got': repr(__got), 'expected': repr(__expected)})",
      "            __output['tests'].append({'passed': __all_passed, 'checks': __checks_results})",
      "        except Exception:",
      "            __output['tests'].append({'passed': False, 'error': traceback.format_exc()})",
    );
  }
  // mode "stdout" needs no per-test loop -- __printed is compared in JS.

  lines.push("json.dumps(__output)");
  return lines.join("\n");
}

/**
 * Runs a challenge's harness against the user's code.
 * Returns { printed, setup_error, tests: [...] } (tests empty for stdout mode).
 */
export async function runChallenge(challenge, userCode, onStatus) {
  const pyodide = await ensurePyodide(onStatus);
  const script = buildHarness(challenge, userCode);
  try {
    const resultJson = await pyodide.runPythonAsync(script);
    return JSON.parse(resultJson);
  } catch (err) {
    return { printed: "", setup_error: String(err), tests: [] };
  }
}

/** Grades a run result against the challenge, returning { passed, details }. */
export function gradeResult(challenge, result) {
  if (result.setup_error) {
    return { passed: false, details: `Your code raised an error:\n${result.setup_error}` };
  }
  if (challenge.mode === "stdout") {
    const got = (result.printed || "").replace(/\s+$/, "");
    const expected = (challenge.expectedPrinted || "").replace(/\s+$/, "");
    const passed = got === expected;
    return {
      passed,
      details: passed
        ? "Output matched exactly!"
        : `Expected your code to print:\n${expected}\n\nBut it printed:\n${got || "(nothing)"}`,
    };
  }
  // function / class modes
  const tests = result.tests || [];
  const passed = tests.length > 0 && tests.every((t) => t.passed);
  const lines = tests.map((t, i) => {
    if (t.error) return `Test ${i + 1}: crashed -- ${t.error.split("\n").pop()}`;
    if (t.checks) {
      const failed = t.checks.filter((c) => !c.passed);
      if (t.passed) return `Test ${i + 1}: passed`;
      return `Test ${i + 1}: failed -- ` + failed.map((c) => `${c.name}: expected ${c.expected}, got ${c.got}`).join("; ");
    }
    return t.passed ? `Test ${i + 1}: passed` : `Test ${i + 1}: expected ${t.expected}, got ${t.got}`;
  });
  return { passed, details: lines.join("\n") };
}
