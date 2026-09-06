// All lesson/challenge content lives here as plain data.
// To add more content later: copy an existing lesson or challenge object
// and edit it -- nothing elsewhere in the code needs to change.
//
// Challenge types:
//   "quiz"       - multiple choice. Needs: choices[], correctIndex
//   "fill_blank" - short text answer. Needs: accepted[] (any match wins, case/space-insensitive)
//   "code"       - real Python, run for real via Pyodide. Needs: mode + starterCode
//       mode "stdout"   - checks what your code prints.      Needs: expectedPrinted
//       mode "function" - checks a function's return value.  Needs: functionName, tests[]
//       mode "class"    - checks a class's attributes/methods. Needs: className, tests[]
//
// Every challenge has: id, prompt, xp, hints[] (shown one at a time on request).

export const CURRICULUM = [
  {
    id: "basics",
    title: "Python Basics",
    icon: "🌱",
    description: "Variables, printing, and the building blocks of every Python program.",
    lessons: [
      {
        id: "basics-1",
        title: "Variables & print()",
        explanation: `
A <b>variable</b> is just a name that stores a value. In Python you create one by assigning a value with <code>=</code> -- there's no need to declare a type first.

<pre><code>name = "Ada"
age = 36
print(name, age)</code></pre>

<code>print()</code> displays whatever you give it. Pass it several values separated by commas and it will print them with a space in between.`,
        challenges: [
          {
            id: "basics-1-q1",
            type: "quiz",
            prompt: "What will <code>print(2 + 3)</code> output?",
            choices: ["23", "5", "2 + 3", "Error"],
            correctIndex: 1,
            xp: 5,
            hints: ["Python does the math first, before printing.", "2 + 3 is being added together as numbers."],
          },
          {
            id: "basics-1-c1",
            type: "code",
            mode: "stdout",
            prompt: "Set the variable <code>message</code> to the exact text <code>Hello, World!</code> and print it.",
            starterCode: `message = ""  # TODO: set this to "Hello, World!"\nprint(message)`,
            expectedPrinted: "Hello, World!",
            xp: 10,
            hints: [
              "Strings need quotes around them, like \"this\".",
              "Assign the text exactly: message = \"Hello, World!\"",
              'The full fix: message = "Hello, World!"',
            ],
          },
        ],
      },
      {
        id: "basics-2",
        title: "Data Types & input()",
        explanation: `
Python has a few core data types you'll use constantly:
<ul>
<li><code>str</code> -- text, like <code>"hello"</code></li>
<li><code>int</code> -- whole numbers, like <code>7</code></li>
<li><code>float</code> -- decimal numbers, like <code>3.14</code></li>
<li><code>bool</code> -- <code>True</code> or <code>False</code></li>
</ul>
Use <code>type(x)</code> to check what type something is.

<code>input("question: ")</code> asks the user a question and <b>always returns a string</b> -- even if they typed a number! To do math with it, convert it first with <code>int(...)</code> or <code>float(...)</code>.

<pre><code>age_text = input("Your age? ")
age = int(age_text)
print(age + 1)</code></pre>`,
        challenges: [
          {
            id: "basics-2-q1",
            type: "quiz",
            prompt: "What type does <code>input()</code> always return, no matter what the user types?",
            choices: ["Whatever type makes sense", "A string", "An integer", "A list"],
            correctIndex: 1,
            xp: 5,
            hints: ["It's the same every single time, regardless of what the user types.", "It's text -- str."],
          },
          {
            id: "basics-2-fb1",
            type: "fill_blank",
            prompt: 'What function converts a string like "5" into the integer 5?',
            accepted: ["int", "int()"],
            xp: 5,
            hints: ["It's named after the type it converts to.", "It starts with 'i'."],
          },
          {
            id: "basics-2-c1",
            type: "code",
            mode: "function",
            prompt: "Write a function <code>to_double(text)</code> that takes a string containing a number and returns double its integer value.",
            functionName: "to_double",
            starterCode: `def to_double(text):\n    # convert text to an int, then double it\n    pass`,
            tests: [
              { args: ["3"], expected: 6 },
              { args: ["10"], expected: 20 },
              { args: ["0"], expected: 0 },
            ],
            xp: 10,
            hints: [
              "First convert text to an int with int(text).",
              "Then multiply that number by 2.",
              "return int(text) * 2",
            ],
          },
        ],
      },
      {
        id: "basics-3",
        title: "Operators & Type Casting",
        explanation: `
Python's math operators: <code>+</code> <code>-</code> <code>*</code> <code>/</code> (always gives a float), <code>//</code> (floor/integer division), <code>%</code> (remainder), <code>**</code> (exponent).

<pre><code>print(7 / 2)    # 3.5
print(7 // 2)   # 3   -- floor division, drops the remainder
print(7 % 2)    # 1   -- the remainder</code></pre>

Boolean logic combines conditions with <code>and</code>, <code>or</code>, <code>not</code>. And you can explicitly convert between types: <code>int(x)</code>, <code>float(x)</code>, <code>str(x)</code>, <code>bool(x)</code>.`,
        challenges: [
          {
            id: "basics-3-q1",
            type: "quiz",
            prompt: "What does <code>7 // 2</code> evaluate to?",
            choices: ["3.5", "3", "4", "3.0"],
            correctIndex: 1,
            xp: 5,
            hints: ["// rounds DOWN to the nearest whole number, dropping any remainder."],
          },
          {
            id: "basics-3-q2",
            type: "quiz",
            prompt: "What does <code>7 % 2</code> evaluate to?",
            choices: ["3", "1", "0", "3.5"],
            correctIndex: 1,
            xp: 5,
            hints: ["% gives you what's LEFT OVER after dividing as many whole times as possible.", "7 divided by 2 is 3 with 1 left over."],
          },
          {
            id: "basics-3-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>is_even(n)</code> that returns <code>True</code> if <code>n</code> is even, else <code>False</code>.",
            functionName: "is_even",
            starterCode: `def is_even(n):\n    pass`,
            tests: [
              { args: [4], expected: true },
              { args: [7], expected: false },
              { args: [0], expected: true },
            ],
            xp: 10,
            hints: ["A number is even if dividing it by 2 leaves no remainder.", "return n % 2 == 0"],
          },
        ],
      },
    ],
  },

  {
    id: "control-flow",
    title: "Control Flow",
    icon: "🔀",
    description: "Making decisions and repeating actions with if/else and loops.",
    lessons: [
      {
        id: "control-flow-1",
        title: "if / elif / else",
        explanation: `
An <code>if</code> statement runs code only when a condition is true. Add <code>elif</code> for more conditions, and <code>else</code> for "anything else".

<pre><code>score = 85
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C or below")</code></pre>

Comparison operators: <code>==</code> (equal), <code>!=</code> (not equal), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>.`,
        challenges: [
          {
            id: "control-flow-1-q1",
            type: "quiz",
            prompt: "Which operator checks if two values are equal (not assignment)?",
            choices: ["=", "==", "eq", "==="],
            correctIndex: 1,
            xp: 5,
            hints: ["A single = assigns a value instead of comparing.", "It's two equal signs."],
          },
          {
            id: "control-flow-1-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>classify(n)</code> that returns the string <code>\"positive\"</code>, <code>\"negative\"</code>, or <code>\"zero\"</code> depending on the number <code>n</code>.",
            functionName: "classify",
            starterCode: `def classify(n):\n    # return "positive", "negative", or "zero"\n    pass`,
            tests: [
              { args: [5], expected: "positive" },
              { args: [-3], expected: "negative" },
              { args: [0], expected: "zero" },
            ],
            xp: 10,
            hints: [
              "Use if / elif / else with n > 0, n < 0, and the rest.",
              "Check n > 0 first, then n < 0, then it must be zero.",
            ],
          },
        ],
      },
      {
        id: "control-flow-2",
        title: "for and while loops",
        explanation: `
A <code>for</code> loop repeats once per item in a sequence. <code>range(n)</code> generates the numbers 0 through n-1.

<pre><code>for i in range(5):
    print(i)   # prints 0, 1, 2, 3, 4</code></pre>

A <code>while</code> loop repeats as long as a condition stays true -- useful when you don't know in advance how many times you'll loop.

<pre><code>count = 0
while count < 3:
    print(count)
    count += 1</code></pre>`,
        challenges: [
          {
            id: "control-flow-2-q1",
            type: "quiz",
            prompt: "How many numbers does <code>range(5)</code> produce, and what is the last one?",
            choices: ["5 numbers, last one is 5", "5 numbers, last one is 4", "4 numbers, last one is 4", "6 numbers, last one is 5"],
            correctIndex: 1,
            xp: 5,
            hints: ["range(5) starts counting at 0.", "It produces 0, 1, 2, 3, 4 -- five numbers total."],
          },
          {
            id: "control-flow-2-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>sum_to(n)</code> that returns the sum of all whole numbers from 1 up to and including <code>n</code>, using a loop (not a formula).",
            functionName: "sum_to",
            starterCode: `def sum_to(n):\n    total = 0\n    # loop from 1 to n, adding each number to total\n    return total`,
            tests: [
              { args: [1], expected: 1 },
              { args: [5], expected: 15 },
              { args: [10], expected: 55 },
            ],
            xp: 10,
            hints: [
              "Use for i in range(1, n + 1): to include n itself.",
              "Inside the loop, do total += i.",
            ],
          },
          {
            id: "control-flow-2-c2",
            type: "code",
            mode: "stdout",
            prompt: "Write a loop that prints the numbers 1 through 5, each on its own line.",
            starterCode: `# your loop here`,
            expectedPrinted: "1\n2\n3\n4\n5",
            xp: 10,
            hints: [
              "for i in range(1, 6): will give you 1 through 5.",
              "print(i) inside the loop prints each one on its own line.",
            ],
          },
        ],
      },
      {
        id: "control-flow-3",
        title: "Nested Loops & break/continue",
        explanation: `
Loops can contain other loops -- the inner loop finishes all its rounds for every single round of the outer loop.

<pre><code>for row in range(2):
    for col in range(3):
        print(row, col)</code></pre>

<code>break</code> exits the nearest loop immediately, skipping anything left in it. <code>continue</code> skips straight to the next iteration without breaking out entirely.

<pre><code>for n in range(10):
    if n == 5:
        break        # stops the loop completely
    if n % 2 == 0:
        continue     # skips even numbers, keeps looping
    print(n)</code></pre>`,
        challenges: [
          {
            id: "control-flow-3-q1",
            type: "quiz",
            prompt: "What does <code>break</code> do inside a loop?",
            choices: ["Skips to the next iteration", "Exits the loop immediately", "Restarts the loop from the beginning", "Pauses the program"],
            correctIndex: 1,
            xp: 5,
            hints: ["It's the more drastic of the two -- it leaves the loop entirely, for good."],
          },
          {
            id: "control-flow-3-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>first_even(nums)</code> that returns the first even number found in <code>nums</code> using a loop and <code>break</code>, or <code>-1</code> if there isn't one.",
            functionName: "first_even",
            starterCode: `def first_even(nums):\n    for n in nums:\n        pass  # TODO: if n is even, return it right away\n    return -1`,
            tests: [
              { args: [[1, 3, 4, 5]], expected: 4 },
              { args: [[1, 3, 5]], expected: -1 },
              { args: [[2, 3, 4]], expected: 2 },
            ],
            xp: 10,
            hints: ["Check n % 2 == 0 inside the loop.", "return n as soon as you find an even one -- that exits the function immediately, same idea as break."],
          },
          {
            id: "control-flow-3-c2",
            type: "code",
            mode: "stdout",
            prompt: "Using nested loops, print a 3x3 multiplication grid: for rows 1-3 and columns 1-3, print each row's products separated by spaces, like:\n<pre>1 2 3\n2 4 6\n3 6 9</pre>",
            starterCode: `for i in range(1, 4):\n    row = []\n    for j in range(1, 4):\n        pass  # TODO: append the product i * j (as a string) to row\n    print(" ".join(row))`,
            expectedPrinted: "1 2 3\n2 4 6\n3 6 9",
            xp: 15,
            hints: [
              "row.append(str(i * j)) builds up each row as a list of strings.",
              '" ".join(row) turns that list into a single spaced-out line.',
            ],
          },
        ],
      },
    ],
  },

  {
    id: "functions",
    title: "Functions",
    icon: "🧩",
    description: "Packaging up code you can reuse, with inputs and outputs.",
    lessons: [
      {
        id: "functions-1",
        title: "Defining & Calling Functions",
        explanation: `
A function is a named, reusable block of code. Define one with <code>def</code>, and send a result back with <code>return</code>.

<pre><code>def greet(name):
    return f"Hello, {name}!"

message = greet("Ada")
print(message)</code></pre>

The <code>f"..."</code> syntax is an <b>f-string</b> -- anything inside <code>{'{'}...{'}'}</code> gets replaced with its value.`,
        challenges: [
          {
            id: "functions-1-q1",
            type: "quiz",
            prompt: "What keyword sends a value back out of a function?",
            choices: ["print", "return", "output", "yield"],
            correctIndex: 1,
            xp: 5,
            hints: ["It's the opposite of taking a value in as a parameter.", "It starts with 'r'."],
          },
          {
            id: "functions-1-c1",
            type: "code",
            mode: "function",
            prompt: 'Write <code>greet(name)</code> that returns the string <code>"Hello, NAME!"</code> using an f-string.',
            functionName: "greet",
            starterCode: `def greet(name):\n    pass`,
            tests: [
              { args: ["Ada"], expected: "Hello, Ada!" },
              { args: ["Sam"], expected: "Hello, Sam!" },
            ],
            xp: 10,
            hints: [
              'Use an f-string: f"Hello, {name}!"',
              'return f"Hello, {name}!"',
            ],
          },
        ],
      },
      {
        id: "functions-2",
        title: "Default & Keyword Arguments",
        explanation: `
Parameters can have a default value, used when the caller doesn't provide one:

<pre><code>def power(base, exponent=2):
    return base ** exponent

power(3)        # 9  (exponent defaults to 2)
power(3, 3)     # 27 (exponent explicitly set to 3)
power(base=2, exponent=5)   # 32, using keyword arguments</code></pre>

Keyword arguments (<code>name=value</code>) let you pass arguments by name instead of position, in any order.`,
        challenges: [
          {
            id: "functions-2-q1",
            type: "quiz",
            prompt: "In <code>def power(base, exponent=2):</code>, what happens if you call <code>power(5)</code>?",
            choices: ["Error, exponent is required", "exponent is treated as 5", "exponent defaults to 2, so it returns 25", "It returns 5"],
            correctIndex: 2,
            xp: 5,
            hints: ["exponent=2 is the default used when nothing else is given."],
          },
          {
            id: "functions-2-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>power(base, exponent=2)</code> that returns <code>base</code> raised to <code>exponent</code>, defaulting to squaring.",
            functionName: "power",
            starterCode: `def power(base, exponent=2):\n    pass`,
            tests: [
              { args: [3], expected: 9 },
              { args: [2, 5], expected: 32 },
              { args: [10, 0], expected: 1 },
            ],
            xp: 10,
            hints: ["Python's exponent operator is **.", "return base ** exponent"],
          },
        ],
      },
      {
        id: "functions-3",
        title: "*args and **kwargs",
        explanation: `
Sometimes you don't know in advance how many arguments a function will get. <code>*args</code> collects any extra positional arguments into a tuple, and <code>**kwargs</code> collects extra keyword arguments into a dict.

<pre><code>def total(*args):
    return sum(args)

total(1, 2, 3)     # 6 -- args is (1, 2, 3)

def describe(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

describe(name="Ada", age=36)</code></pre>`,
        challenges: [
          {
            id: "functions-3-q1",
            type: "quiz",
            prompt: "<code>*args</code> collects extra positional arguments into a ____?",
            choices: ["list", "tuple", "dict", "set"],
            correctIndex: 1,
            xp: 5,
            hints: ["It's an immutable, ordered collection -- not a list."],
          },
          {
            id: "functions-3-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>total(*args)</code> that returns the sum of however many numbers are passed in.",
            functionName: "total",
            starterCode: `def total(*args):\n    pass`,
            tests: [
              { args: [1, 2, 3], expected: 6 },
              { args: [], expected: 0 },
              { args: [5], expected: 5 },
            ],
            xp: 10,
            hints: ["args behaves just like a tuple of numbers here.", "return sum(args)"],
          },
        ],
      },
    ],
  },

  {
    id: "data-structures",
    title: "Data Structures",
    icon: "🗂️",
    description: "Storing collections of data: lists, dictionaries, tuples, and sets.",
    lessons: [
      {
        id: "data-structures-1",
        title: "Lists",
        explanation: `
A <code>list</code> stores an ordered, changeable collection of items.

<pre><code>fruits = ["apple", "banana"]
fruits.append("cherry")
print(fruits[0])     # "apple" -- indexing starts at 0
print(len(fruits))   # 3</code></pre>`,
        challenges: [
          {
            id: "data-structures-1-q1",
            type: "quiz",
            prompt: "What is <code>fruits[0]</code> if <code>fruits = [\"apple\", \"banana\"]</code>?",
            choices: ["\"banana\"", "\"apple\"", "0", "Error"],
            correctIndex: 1,
            xp: 5,
            hints: ["Python list indexes start counting from 0, not 1."],
          },
          {
            id: "data-structures-1-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>add_item(lst, item)</code> that appends <code>item</code> to <code>lst</code> and returns the updated list.",
            functionName: "add_item",
            starterCode: `def add_item(lst, item):\n    pass`,
            tests: [
              { args: [[1, 2], 3], expected: [1, 2, 3] },
              { args: [[], "a"], expected: ["a"] },
            ],
            xp: 10,
            hints: ["lst.append(item) adds to the end of the list.", "Don't forget to return lst afterward."],
          },
        ],
      },
      {
        id: "data-structures-2",
        title: "Dictionaries, Tuples & Sets",
        explanation: `
A <code>dict</code> stores key-value pairs:
<pre><code>person = {"name": "Ada", "age": 36}
print(person["name"])          # "Ada"
print(person.get("job", "unknown"))  # "unknown" -- safe lookup with a default</code></pre>

A <code>tuple</code> is like a list but <b>can't be changed</b> after creation: <code>point = (3, 4)</code>.

A <code>set</code> stores unique items with no order or duplicates: <code>colors = {"red", "green", "red"}</code> is just <code>{'{'}"red", "green"{'}'}</code>.`,
        challenges: [
          {
            id: "data-structures-2-q1",
            type: "quiz",
            prompt: "Which data structure cannot be changed after it's created?",
            choices: ["list", "dict", "tuple", "set"],
            correctIndex: 2,
            xp: 5,
            hints: ["Think about which one is 'locked' once made."],
          },
          {
            id: "data-structures-2-c1",
            type: "code",
            mode: "function",
            prompt: 'Write <code>get_value(d, key)</code> that returns <code>d[key]</code> if it exists, otherwise the string <code>"not found"</code>.',
            functionName: "get_value",
            starterCode: `def get_value(d, key):\n    pass`,
            tests: [
              { args: [{ a: 1 }, "a"], expected: 1 },
              { args: [{ a: 1 }, "b"], expected: "not found" },
            ],
            xp: 10,
            hints: ['Use d.get(key, "not found") -- it handles the missing case for you.'],
          },
        ],
      },
      {
        id: "data-structures-3",
        title: "Nested Data & sorted()",
        explanation: `
Real data is often a list of dictionaries -- like rows in a table:

<pre><code>people = [{"name": "Bob", "age": 30}, {"name": "Amy", "age": 25}]</code></pre>

<code>sorted(iterable, key=..., reverse=...)</code> returns a brand-new sorted list without touching the original (unlike <code>list.sort()</code>, which sorts in place and returns <code>None</code>). The <code>key</code> argument says what to sort by:

<pre><code>sorted(people, key=lambda p: p["age"])
# [{"name": "Amy", "age": 25}, {"name": "Bob", "age": 30}]</code></pre>`,
        challenges: [
          {
            id: "data-structures-3-q1",
            type: "quiz",
            prompt: "Which one returns a NEW sorted list, leaving the original list unchanged?",
            choices: ["list.sort()", "sorted(list)", "Both do", "Neither does"],
            correctIndex: 1,
            xp: 5,
            hints: ["One sorts 'in place' and returns None; the other hands you back a fresh list."],
          },
          {
            id: "data-structures-3-c1",
            type: "code",
            mode: "function",
            prompt: 'Write <code>sort_by_age(people)</code> where <code>people</code> is a list of dicts each with <code>"name"</code> and <code>"age"</code> keys, returning them sorted by age ascending.',
            functionName: "sort_by_age",
            starterCode: `def sort_by_age(people):\n    pass`,
            tests: [
              {
                args: [[{ name: "Bob", age: 30 }, { name: "Amy", age: 25 }]],
                expected: [{ name: "Amy", age: 25 }, { name: "Bob", age: 30 }],
              },
            ],
            xp: 10,
            hints: ['Use sorted(people, key=lambda p: p["age"])', 'return sorted(people, key=lambda p: p["age"])'],
          },
        ],
      },
    ],
  },

  {
    id: "slicing",
    title: "Sequences & Slicing",
    icon: "🔪",
    description: "Grabbing pieces of lists and strings with indexing and slices.",
    lessons: [
      {
        id: "slicing-1",
        title: "Indexing & Slicing",
        explanation: `
Any sequence (string, list, tuple) can be indexed and sliced the same way.

<pre><code>word = "hello"
print(word[0])     # "h"       -- single index
print(word[-1])    # "o"       -- negative index counts from the end
print(word[1:4])   # "ell"     -- slice: [start:stop), stop not included
print(word[:3])    # "hel"     -- start defaults to 0
print(word[::-1])  # "olleh"   -- step of -1 reverses it!</code></pre>

The full slice syntax is <code>sequence[start:stop:step]</code> -- any part can be left out to use its default.`,
        challenges: [
          {
            id: "slicing-1-q1",
            type: "quiz",
            prompt: 'What does <code>"hello"[1:4]</code> evaluate to?',
            choices: ["\"hell\"", "\"ell\"", "\"ello\"", "\"h\""],
            correctIndex: 1,
            xp: 5,
            hints: ["The slice includes index 1 but stops BEFORE index 4.", "Indexes 1, 2, 3 are 'e', 'l', 'l'."],
          },
          {
            id: "slicing-1-q2",
            type: "quiz",
            prompt: "What does <code>[0, 1, 2, 3, 4][::-1]</code> evaluate to?",
            choices: ["[4, 3, 2, 1, 0]", "[0, 1, 2, 3, 4]", "[]", "Error"],
            correctIndex: 0,
            xp: 5,
            hints: ["A step of -1 walks through the sequence backwards."],
          },
          {
            id: "slicing-1-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>first_n(lst, n)</code> that returns the first <code>n</code> items of <code>lst</code> using slicing.",
            functionName: "first_n",
            starterCode: `def first_n(lst, n):\n    pass`,
            tests: [
              { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2] },
              { args: [["a", "b", "c"], 0], expected: [] },
            ],
            xp: 10,
            hints: ["return lst[:n]"],
          },
          {
            id: "slicing-1-c2",
            type: "code",
            mode: "function",
            prompt: "Write <code>reverse_string(s)</code> that returns <code>s</code> reversed, using slicing (no loops needed).",
            functionName: "reverse_string",
            starterCode: `def reverse_string(s):\n    pass`,
            tests: [
              { args: ["hello"], expected: "olleh" },
              { args: [""], expected: "" },
            ],
            xp: 10,
            hints: ["A step of -1 reverses any sequence.", "return s[::-1]"],
          },
        ],
      },
      {
        id: "slicing-2",
        title: "Slice Assignment & Patterns",
        explanation: `
A step value in a slice lets you skip elements: <code>lst[::2]</code> takes every other item starting from the first.

<pre><code>nums = [1, 2, 3, 4, 5]
print(nums[::2])     # [1, 3, 5]  -- every other item

nums[1:3] = [20, 30] # slice assignment: replaces that chunk in place
print(nums)          # [1, 20, 30, 4, 5]</code></pre>`,
        challenges: [
          {
            id: "slicing-2-q1",
            type: "quiz",
            prompt: "What does <code>[1, 2, 3, 4, 5][::2]</code> evaluate to?",
            choices: ["[1, 3, 5]", "[2, 4]", "[1, 2, 3, 4, 5]", "[5, 4, 3, 2, 1]"],
            correctIndex: 0,
            xp: 5,
            hints: ["A step of 2 means: take one, skip one, take one, skip one..."],
          },
          {
            id: "slicing-2-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>evens_only(lst)</code> that returns every other element of <code>lst</code>, starting from index 0, using slicing.",
            functionName: "evens_only",
            starterCode: `def evens_only(lst):\n    pass`,
            tests: [
              { args: [[1, 2, 3, 4, 5]], expected: [1, 3, 5] },
              { args: [["a", "b", "c", "d"]], expected: ["a", "c"] },
            ],
            xp: 10,
            hints: ["return lst[::2]"],
          },
        ],
      },
    ],
  },

  {
    id: "strings",
    title: "Strings & Text Processing",
    icon: "🔤",
    description: "Methods for cleaning, splitting, and formatting text.",
    lessons: [
      {
        id: "strings-1",
        title: "String Methods & f-strings",
        explanation: `
Strings come with lots of built-in methods:

<pre><code>s = "  Hello World  "
print(s.strip())          # "Hello World" -- removes outer whitespace
print(s.strip().upper())  # "HELLO WORLD"
print(s.strip().lower())  # "hello world"
print(s.strip().split())  # ["Hello", "World"] -- splits on whitespace
print("-".join(["a", "b", "c"]))  # "a-b-c"</code></pre>

f-strings can also format numbers: <code>f"{'{'}3.14159:.2f{'}'}"</code> gives <code>"3.14"</code>.`,
        challenges: [
          {
            id: "strings-1-q1",
            type: "quiz",
            prompt: 'What does <code>"a-b-c".split("-")</code> return?',
            choices: ['"abc"', '["a", "b", "c"]', '("a", "b", "c")', "Error"],
            correctIndex: 1,
            xp: 5,
            hints: ["split() always returns a list of pieces."],
          },
          {
            id: "strings-1-c1",
            type: "code",
            mode: "function",
            prompt: 'Write <code>shout(s)</code> that returns <code>s</code> in uppercase with an exclamation mark added, e.g. <code>"hi"</code> -> <code>"HI!"</code>.',
            functionName: "shout",
            starterCode: `def shout(s):\n    pass`,
            tests: [
              { args: ["hi"], expected: "HI!" },
              { args: ["python"], expected: "PYTHON!" },
            ],
            xp: 10,
            hints: ["s.upper() capitalizes everything.", 'return s.upper() + "!"'],
          },
          {
            id: "strings-1-c2",
            type: "code",
            mode: "function",
            prompt: "Write <code>word_count(s)</code> that returns how many words are in the string <code>s</code>.",
            functionName: "word_count",
            starterCode: `def word_count(s):\n    pass`,
            tests: [
              { args: ["hello world"], expected: 2 },
              { args: ["one"], expected: 1 },
              { args: ["a b c d"], expected: 4 },
            ],
            xp: 10,
            hints: ["s.split() breaks the string into a list of words.", "len(...) counts how many items are in that list."],
          },
        ],
      },
      {
        id: "strings-2",
        title: "Formatting & More Methods",
        explanation: `
f-strings support format specs after a colon: <code>f"{'{'}value:.2f{'}'}"</code> rounds a number to 2 decimal places.

<pre><code>price = 9.5
print(f"${'{'}price:.2f{'}'}")   # "$9.50"</code></pre>

More handy string methods: <code>.replace(old, new)</code>, <code>.startswith(x)</code>, <code>.endswith(x)</code>, <code>.isdigit()</code>.`,
        challenges: [
          {
            id: "strings-2-q1",
            type: "quiz",
            prompt: 'What does <code>f"{3.14159:.2f}"</code> evaluate to?',
            choices: ['"3.14159"', '"3.14"', '"3.1"', '"3"'],
            correctIndex: 1,
            xp: 5,
            hints: [".2f means: show exactly 2 digits after the decimal point."],
          },
          {
            id: "strings-2-c1",
            type: "code",
            mode: "function",
            prompt: 'Write <code>format_price(amount)</code> that returns <code>amount</code> formatted as a price string like <code>"$9.50"</code> (always 2 decimal places).',
            functionName: "format_price",
            starterCode: `def format_price(amount):\n    pass`,
            tests: [
              { args: [9.5], expected: "$9.50" },
              { args: [10], expected: "$10.00" },
              { args: [3.14159], expected: "$3.14" },
            ],
            xp: 10,
            hints: ['Use an f-string with a format spec: f"${amount:.2f}"'],
          },
        ],
      },
    ],
  },

  {
    id: "references",
    title: "References & Memory (\"Pointers\" in Python)",
    icon: "🔗",
    description: "How Python variables actually work under the hood.",
    lessons: [
      {
        id: "references-1",
        title: "Variables as References",
        explanation: `
In Python, a variable name doesn't hold a value directly -- it holds a <b>reference</b> (like a labeled arrow) pointing to an object somewhere in memory. This is Python's version of a "pointer", and it matters most for <b>mutable</b> objects like lists and dicts.

<pre><code>a = [1, 2, 3]
b = a          # b points to the SAME list as a, not a copy!
b.append(4)
print(a)       # [1, 2, 3, 4]  -- a changed too, since they share one list

c = [1, 2, 3, 4]
print(a == c)  # True  -- == compares VALUES
print(a is c)  # False -- is compares IDENTITY (same object in memory)</code></pre>

To actually copy a list so the two are independent, use <code>.copy()</code> or <code>list(a)</code>:
<pre><code>b = a.copy()
b.append(99)
print(a)   # unaffected now</code></pre>

Immutable types (<code>int</code>, <code>str</code>, <code>tuple</code>) don't have this surprise -- you can never "mutate them in place", so reassigning never affects other variables pointing at the same value.`,
        challenges: [
          {
            id: "references-1-q1",
            type: "quiz",
            prompt: "<code>a = [1, 2]; b = a; b.append(3)</code>. What is <code>a</code> now?",
            choices: ["[1, 2]", "[1, 2, 3]", "Error", "[3]"],
            correctIndex: 1,
            xp: 5,
            hints: ["b isn't a copy of a -- it points at the exact same list."],
          },
          {
            id: "references-1-q2",
            type: "quiz",
            prompt: "Which operator checks whether two variables point to the exact same object in memory?",
            choices: ["==", "is", "equals", "==="],
            correctIndex: 1,
            xp: 5,
            hints: ["== checks value equality; something else checks identity."],
          },
          {
            id: "references-1-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>make_independent_copy(lst)</code> that returns a copy of <code>lst</code> (so modifying the result won't affect the original).",
            functionName: "make_independent_copy",
            starterCode: `def make_independent_copy(lst):\n    pass`,
            tests: [
              { args: [[1, 2, 3]], expected: [1, 2, 3] },
              { args: [[]], expected: [] },
            ],
            xp: 10,
            hints: ["lst.copy() or list(lst) both make an independent copy.", "return lst.copy()"],
          },
        ],
      },
      {
        id: "references-2",
        title: "Shallow vs Deep Copy",
        explanation: `
<code>.copy()</code> is a <b>shallow</b> copy -- it copies the outer list, but if that list contains other lists/dicts inside it, those inner ones are still shared references!

<pre><code>import copy

matrix = [[1, 2], [3, 4]]
shallow = matrix.copy()
shallow[0].append(99)
print(matrix)   # [[1, 2, 99], [3, 4]]  -- the inner list was shared, so it changed too!

deep = copy.deepcopy(matrix)
deep[0].append(100)
print(matrix)   # unaffected -- deepcopy copies everything, all the way down</code></pre>`,
        challenges: [
          {
            id: "references-2-q1",
            type: "quiz",
            prompt: "If you use <code>.copy()</code> on a list of lists, and then modify one of the INNER lists, what happens to the original?",
            choices: ["Nothing, it's fully independent", "The inner list changes too, since it's still shared", "It raises an error", "Only the outer list changes"],
            correctIndex: 1,
            xp: 5,
            hints: [".copy() only copies one level deep -- the outer list, not what's inside it."],
          },
          {
            id: "references-2-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>deep_copy_matrix(matrix)</code> that returns a fully independent copy of a list of lists, using the <code>copy</code> module.",
            functionName: "deep_copy_matrix",
            starterCode: `import copy\n\ndef deep_copy_matrix(matrix):\n    pass`,
            tests: [
              { args: [[[1, 2], [3, 4]]], expected: [[1, 2], [3, 4]] },
            ],
            xp: 10,
            hints: ["copy.deepcopy(matrix) copies every level, not just the outer one.", "return copy.deepcopy(matrix)"],
          },
        ],
      },
    ],
  },

  {
    id: "files",
    title: "File Handling",
    icon: "📄",
    description: "Reading and writing files with open().",
    lessons: [
      {
        id: "files-1",
        title: "Reading & Writing Files",
        explanation: `
<code>open(filename, mode)</code> opens a file. Common modes: <code>"r"</code> read, <code>"w"</code> write (overwrites!), <code>"a"</code> append.

Using <code>with</code> automatically closes the file for you, even if something goes wrong:

<pre><code>with open("notes.txt", "w") as f:
    f.write("Hello, file!")

with open("notes.txt", "r") as f:
    contents = f.read()
    print(contents)</code></pre>

<i>Note: in this browser-based sandbox, files live in a temporary virtual filesystem just for practice -- on your own computer running regular Python, these would be real files saved to disk.</i>`,
        challenges: [
          {
            id: "files-1-q1",
            type: "quiz",
            prompt: "Which mode opens a file for writing, overwriting anything already there?",
            choices: ['"r"', '"w"', '"a"', '"x"'],
            correctIndex: 1,
            xp: 5,
            hints: ['"a" appends instead of overwriting -- this one replaces everything.'],
          },
          {
            id: "files-1-c1",
            type: "code",
            mode: "stdout",
            prompt: 'Write code that opens "notes.txt" in write mode and writes the exact text <code>Hello, file!</code>, then reopens it in read mode and prints its contents.',
            starterCode: `with open("notes.txt", "w") as f:\n    f.write("")  # TODO: write "Hello, file!" instead\n\nwith open("notes.txt", "r") as f:\n    print(f.read())`,
            expectedPrinted: "Hello, file!",
            xp: 10,
            hints: [
              'Replace f.write("") with f.write("Hello, file!")',
              "Make sure the text matches exactly, including the comma and exclamation mark.",
            ],
          },
        ],
      },
      {
        id: "files-2",
        title: "Processing Lines of Data",
        explanation: `
You can loop over an open file directly, one line at a time, and split each line to pull out its pieces:

<pre><code>lines = ["Alice,30", "Bob,25"]
with open("people.csv", "w") as f:
    for line in lines:
        f.write(line + "\\n")

with open("people.csv", "r") as f:
    for line in f:
        print(line.strip().split(","))</code></pre>
<code>.strip()</code> removes the trailing newline before splitting, so you don't end up with a stray <code>"\\n"</code> stuck to the last field.`,
        challenges: [
          {
            id: "files-2-c1",
            type: "code",
            mode: "stdout",
            prompt: 'Write code that writes the three lines <code>"Alice,30"</code>, <code>"Bob,25"</code>, <code>"Cara,40"</code> to a file called "people.csv" (each on its own line), then reads it back line by line, splitting each line on the comma and printing the resulting list.',
            starterCode: `lines = ["Alice,30", "Bob,25", "Cara,40"]\n\nwith open("people.csv", "w") as f:\n    for line in lines:\n        pass  # TODO: write each line to the file, followed by a newline\n\nwith open("people.csv", "r") as f:\n    for line in f:\n        pass  # TODO: strip the newline, split on ",", and print the result`,
            expectedPrinted: "['Alice', '30']\n['Bob', '25']\n['Cara', '40']",
            xp: 15,
            hints: [
              'f.write(line + "\\n") writes each line with its own newline.',
              'print(line.strip().split(",")) strips the newline first, then splits.',
            ],
          },
        ],
      },
    ],
  },

  {
    id: "oop",
    title: "Object-Oriented Programming",
    icon: "🏗️",
    description: "Bundling data and behavior together with classes.",
    lessons: [
      {
        id: "oop-1",
        title: "Classes & Objects",
        explanation: `
A <code>class</code> is a blueprint for creating objects. <code>__init__</code> runs when a new object is created, and <code>self</code> refers to that specific object.

<pre><code>class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return f"{self.name} says woof!"

rex = Dog("Rex")
print(rex.name)     # "Rex"
print(rex.bark())   # "Rex says woof!"</code></pre>`,
        challenges: [
          {
            id: "oop-1-q1",
            type: "quiz",
            prompt: "What does <code>self</code> refer to inside a method?",
            choices: ["The class itself", "The specific object the method was called on", "Nothing, it's just convention", "The __init__ function"],
            correctIndex: 1,
            xp: 5,
            hints: ["Every object gets its own self when a method runs on it."],
          },
          {
            id: "oop-1-c1",
            type: "code",
            mode: "class",
            className: "Dog",
            prompt: 'Write a class <code>Dog</code> with <code>__init__(self, name)</code> storing <code>self.name</code>, and a method <code>bark(self)</code> that returns <code>"NAME says woof!"</code>.',
            starterCode: `class Dog:\n    def __init__(self, name):\n        pass\n\n    def bark(self):\n        pass`,
            tests: [
              {
                constructorArgs: ["Rex"],
                checks: [
                  { type: "attr", name: "name", expected: "Rex" },
                  { type: "method", name: "bark", args: [], expected: "Rex says woof!" },
                ],
              },
              {
                constructorArgs: ["Fido"],
                checks: [
                  { type: "method", name: "bark", args: [], expected: "Fido says woof!" },
                ],
              },
            ],
            xp: 15,
            hints: [
              "self.name = name inside __init__ stores it.",
              'return f"{self.name} says woof!" inside bark.',
            ],
          },
        ],
      },
      {
        id: "oop-2",
        title: "Inheritance & Polymorphism",
        explanation: `
A class can inherit from another, reusing its behavior and overriding what's different. <code>super()</code> calls the parent class's version of a method.

<pre><code>class Animal:
    def __init__(self, name):
        self.name = name

    def make_sound(self):
        return "..."

class Dog(Animal):
    def make_sound(self):       # overrides Animal's version
        return "Woof!"

rex = Dog("Rex")
print(rex.name)          # "Rex" -- inherited from Animal
print(rex.make_sound())  # "Woof!" -- Dog's own version</code></pre>`,
        challenges: [
          {
            id: "oop-2-q1",
            type: "quiz",
            prompt: "What does <code>super().__init__(name)</code> do inside a subclass's <code>__init__</code>?",
            choices: ["Creates a brand new object", "Calls the parent class's __init__ to reuse its setup logic", "Deletes the parent class", "Nothing, it's optional syntax with no effect"],
            correctIndex: 1,
            xp: 5,
            hints: ["It lets the subclass reuse the parent's own setup code instead of rewriting it."],
          },
          {
            id: "oop-2-c1",
            type: "code",
            mode: "class",
            className: "Dog",
            prompt: 'Write a class <code>Animal</code> with <code>__init__(self, name)</code> storing <code>self.name</code>, and a method <code>make_sound(self)</code> returning <code>"..."</code>. Then write <code>Dog(Animal)</code> that overrides <code>make_sound</code> to return <code>"Woof!"</code>.',
            starterCode: `class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def make_sound(self):\n        return "..."\n\nclass Dog(Animal):\n    def make_sound(self):\n        pass  # TODO: return "Woof!"`,
            tests: [
              {
                constructorArgs: ["Rex"],
                checks: [
                  { type: "attr", name: "name", expected: "Rex" },
                  { type: "method", name: "make_sound", args: [], expected: "Woof!" },
                ],
              },
            ],
            xp: 15,
            hints: ['Dog automatically inherits __init__ from Animal -- you only need to override make_sound.', 'return "Woof!"'],
          },
        ],
      },
    ],
  },

  {
    id: "errors",
    title: "Error Handling & Debugging",
    icon: "🐞",
    description: "try/except, and reading tracebacks to fix your own bugs.",
    lessons: [
      {
        id: "errors-1",
        title: "try / except",
        explanation: `
Code that might fail can be wrapped in <code>try</code>, with <code>except</code> handling specific problems:

<pre><code>try:
    result = 10 / 0
except ZeroDivisionError:
    result = "Cannot divide by zero"
print(result)</code></pre>

A <code>finally</code> block always runs, whether or not an error happened -- useful for cleanup. When your code crashes, Python prints a <b>traceback</b> showing exactly which line failed and why -- read it bottom-up: the last line names the actual error.`,
        challenges: [
          {
            id: "errors-1-q1",
            type: "quiz",
            prompt: "Which block always runs, whether or not an exception occurred?",
            choices: ["try", "except", "finally", "else"],
            correctIndex: 2,
            xp: 5,
            hints: ["It's meant for cleanup that must always happen."],
          },
          {
            id: "errors-1-c1",
            type: "code",
            mode: "function",
            prompt: 'Write <code>safe_divide(a, b)</code> that returns <code>a / b</code>, or the string <code>"Cannot divide by zero"</code> if <code>b</code> is 0.',
            functionName: "safe_divide",
            starterCode: `def safe_divide(a, b):\n    pass`,
            tests: [
              { args: [10, 2], expected: 5.0 },
              { args: [5, 0], expected: "Cannot divide by zero" },
            ],
            xp: 10,
            hints: [
              "Wrap a / b in a try block, catching ZeroDivisionError.",
              'except ZeroDivisionError: return "Cannot divide by zero"',
            ],
          },
        ],
      },
      {
        id: "errors-2",
        title: "Custom Exceptions & Multiple Excepts",
        explanation: `
You can catch several exception types in one block using a tuple, and define your own exception types by subclassing <code>Exception</code>:

<pre><code>class NegativeNumberError(Exception):
    pass

def parse_positive(text):
    try:
        n = int(text)
    except ValueError:
        return "Invalid input"
    if n <= 0:
        return "Must be positive"
    return n

try:
    risky()
except (TypeError, ValueError) as e:
    print("Something went wrong:", e)</code></pre>`,
        challenges: [
          {
            id: "errors-2-q1",
            type: "quiz",
            prompt: "How do you catch both <code>TypeError</code> and <code>ValueError</code> in a single except block?",
            choices: ["except TypeError, ValueError:", "except [TypeError, ValueError]:", "except (TypeError, ValueError):", "except TypeError or ValueError:"],
            correctIndex: 2,
            xp: 5,
            hints: ["Group them in parentheses, like a tuple."],
          },
          {
            id: "errors-2-c1",
            type: "code",
            mode: "function",
            prompt: 'Write <code>parse_positive_int(text)</code> that returns the integer value of <code>text</code> if it\'s a positive whole number, <code>"Invalid input"</code> if it can\'t be converted to an int, or <code>"Must be positive"</code> if it converts but isn\'t greater than zero.',
            functionName: "parse_positive_int",
            starterCode: `def parse_positive_int(text):\n    pass`,
            tests: [
              { args: ["5"], expected: 5 },
              { args: ["-3"], expected: "Must be positive" },
              { args: ["abc"], expected: "Invalid input" },
              { args: ["0"], expected: "Must be positive" },
            ],
            xp: 15,
            hints: [
              "Wrap int(text) in a try/except ValueError.",
              "After successfully converting, check if the number is <= 0.",
            ],
          },
        ],
      },
    ],
  },

  {
    id: "modules",
    title: "Modules & Libraries",
    icon: "📦",
    description: "Using Python's built-in tools instead of reinventing them.",
    lessons: [
      {
        id: "modules-1",
        title: "import & the Standard Library",
        explanation: `
Python ships with a huge standard library. Bring a module in with <code>import</code>:

<pre><code>import math
print(math.pi)          # 3.14159...
print(math.sqrt(16))    # 4.0

from random import randint
print(randint(1, 6))    # a random number 1-6

import datetime
print(datetime.date.today())</code></pre>

For code other people wrote and published (not built into Python), you'd install it first with <code>pip install package-name</code>. In this browser sandbox, only the standard library is available without extra setup -- on your own computer, <code>pip</code> can install anything from PyPI.`,
        challenges: [
          {
            id: "modules-1-q1",
            type: "quiz",
            prompt: "Which line correctly imports just the sqrt function from the math module?",
            choices: ["import math.sqrt", "from math import sqrt", "import sqrt from math", "use math.sqrt"],
            correctIndex: 1,
            xp: 5,
            hints: ["The pattern is: from MODULE import THING."],
          },
          {
            id: "modules-1-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>circle_area(radius)</code> that returns the area of a circle using <code>math.pi</code>.",
            functionName: "circle_area",
            starterCode: `import math\n\ndef circle_area(radius):\n    pass`,
            tests: [
              { args: [1], expected: 3.14159, tolerance: 0.001 },
              { args: [2], expected: 12.56637, tolerance: 0.001 },
            ],
            xp: 10,
            hints: ["Area = pi * radius squared.", "return math.pi * radius ** 2"],
          },
        ],
      },
      {
        id: "modules-2",
        title: "More of the Standard Library",
        explanation: `
A few more standard-library tools worth knowing:

<pre><code>import random
print(random.randint(1, 6))     # random number from 1 to 6, inclusive
print(random.choice(["a", "b"]))  # random item from a list

from collections import Counter
print(Counter(["a", "b", "a", "c", "a"]))
# Counter({'a': 3, 'b': 1, 'c': 1})
print(Counter(["a", "b", "a"]).most_common(1))
# [('a', 2)] -- the most frequent item, with its count</code></pre>`,
        challenges: [
          {
            id: "modules-2-q1",
            type: "quiz",
            prompt: "What does <code>collections.Counter</code> help you do?",
            choices: ["Sort a list", "Count how often each item appears", "Reverse a string", "Read a file"],
            correctIndex: 1,
            xp: 5,
            hints: ["The name is a strong hint -- it counts things."],
          },
          {
            id: "modules-2-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>most_common_word(words)</code> that returns the most frequently occurring word in the list <code>words</code>, using <code>collections.Counter</code>.",
            functionName: "most_common_word",
            starterCode: `from collections import Counter\n\ndef most_common_word(words):\n    pass`,
            tests: [
              { args: [["a", "b", "a", "c", "a"]], expected: "a" },
              { args: [["x", "y", "y"]], expected: "y" },
            ],
            xp: 15,
            hints: ["Counter(words).most_common(1) returns a list like [('a', 3)].", "return Counter(words).most_common(1)[0][0]"],
          },
        ],
      },
    ],
  },

  {
    id: "algorithms",
    title: "Algorithms & Problem Solving",
    icon: "🧠",
    description: "Putting it all together to solve classic coding challenges.",
    lessons: [
      {
        id: "algorithms-1",
        title: "Thinking Like a Programmer",
        explanation: `
Most coding problems come down to: break the problem into small steps, handle one case at a time, and test with examples as you go. Here are a few classic beginner challenges that combine everything so far -- loops, conditionals, strings, and lists.`,
        challenges: [
          {
            id: "algorithms-1-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>is_palindrome(s)</code> that returns <code>True</code> if <code>s</code> reads the same forwards and backwards (ignoring case), else <code>False</code>.",
            functionName: "is_palindrome",
            starterCode: `def is_palindrome(s):\n    pass`,
            tests: [
              { args: ["racecar"], expected: true },
              { args: ["Level"], expected: true },
              { args: ["hello"], expected: false },
            ],
            xp: 15,
            hints: [
              "Compare s.lower() to its reverse, s.lower()[::-1].",
              "return s.lower() == s.lower()[::-1]",
            ],
          },
          {
            id: "algorithms-1-c2",
            type: "code",
            mode: "function",
            prompt: 'Write <code>fizzbuzz(n)</code> that returns a list of strings for numbers 1 to <code>n</code>: <code>"Fizz"</code> for multiples of 3, <code>"Buzz"</code> for multiples of 5, <code>"FizzBuzz"</code> for both, otherwise the number itself as a string.',
            functionName: "fizzbuzz",
            starterCode: `def fizzbuzz(n):\n    result = []\n    # loop from 1 to n, appending the right string each time\n    return result`,
            tests: [
              { args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] },
              { args: [15], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] },
            ],
            xp: 20,
            hints: [
              "Check divisible by both 3 and 5 FIRST, before checking them separately.",
              "Use n % 3 == 0 and n % 5 == 0 to test divisibility.",
            ],
          },
          {
            id: "algorithms-1-c3",
            type: "code",
            mode: "function",
            prompt: "Write <code>find_max(lst)</code> that returns the largest value in <code>lst</code> WITHOUT using the built-in <code>max()</code> function.",
            functionName: "find_max",
            starterCode: `def find_max(lst):\n    biggest = lst[0]\n    # loop through lst, updating biggest when you find something bigger\n    return biggest`,
            tests: [
              { args: [[3, 7, 2]], expected: 7 },
              { args: [[-5, -1, -10]], expected: -1 },
              { args: [[42]], expected: 42 },
            ],
            xp: 15,
            hints: [
              "Start by assuming the first item is the biggest, then compare each other item to it.",
              "if item > biggest: biggest = item",
            ],
          },
        ],
      },
      {
        id: "algorithms-2",
        title: "Searching & Sorting Basics",
        explanation: `
Two foundational algorithms worth understanding by writing them yourself at least once (even though Python's built-in <code>sorted()</code> and the <code>in</code> operator are usually what you'd actually use):

<b>Linear search</b> checks each item one at a time until it finds a match. <b>Bubble sort</b> repeatedly compares neighboring pairs and swaps them if they're out of order, "bubbling" the largest values to the end.`,
        challenges: [
          {
            id: "algorithms-2-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>linear_search(lst, target)</code> that returns the index of <code>target</code> in <code>lst</code>, or <code>-1</code> if it's not present.",
            functionName: "linear_search",
            starterCode: `def linear_search(lst, target):\n    for i in range(len(lst)):\n        pass  # TODO: if lst[i] equals target, return i\n    return -1`,
            tests: [
              { args: [[5, 3, 8, 1], 8], expected: 2 },
              { args: [[5, 3, 8, 1], 9], expected: -1 },
            ],
            xp: 15,
            hints: ["if lst[i] == target: return i"],
          },
          {
            id: "algorithms-2-c2",
            type: "code",
            mode: "function",
            prompt: "Write <code>bubble_sort(lst)</code> that returns a new list with <code>lst</code>'s items sorted ascending, implemented manually with nested loops (no <code>sorted()</code> or <code>.sort()</code>).",
            functionName: "bubble_sort",
            starterCode: `def bubble_sort(lst):\n    result = list(lst)\n    n = len(result)\n    for i in range(n):\n        for j in range(n - 1 - i):\n            pass  # TODO: if result[j] > result[j+1], swap them\n    return result`,
            tests: [
              { args: [[5, 3, 8, 1]], expected: [1, 3, 5, 8] },
              { args: [[1]], expected: [1] },
              { args: [[]], expected: [] },
            ],
            xp: 20,
            hints: [
              "if result[j] > result[j + 1]: result[j], result[j + 1] = result[j + 1], result[j]",
              "That comma-swap syntax swaps both values in one line.",
            ],
          },
        ],
      },
    ],
  },

  {
    id: "comprehensions",
    title: "Comprehensions",
    icon: "⚡",
    description: "A compact, Pythonic way to build lists, dicts, and sets in one line.",
    lessons: [
      {
        id: "comprehensions-1",
        title: "List, Dict & Set Comprehensions",
        explanation: `
A comprehension builds a new collection in one line: <code>[expression for item in iterable if condition]</code>.

<pre><code>nums = [1, 2, 3, 4]
squares = [n ** 2 for n in nums]        # [1, 4, 9, 16]
evens = [n for n in nums if n % 2 == 0] # [2, 4]

words = ["hi", "hello"]
lengths = {w: len(w) for w in words}    # {"hi": 2, "hello": 5}  -- dict comprehension
unique = {n % 2 for n in nums}          # {0, 1}                -- set comprehension</code></pre>

It's just a more compact way to write a for-loop that builds up a list/dict/set -- anything a comprehension does, a regular loop can do too.`,
        challenges: [
          {
            id: "comprehensions-1-q1",
            type: "quiz",
            prompt: "Which syntax creates a dictionary using a comprehension?",
            choices: ["[k: v for ...]", "{k: v for ...}", "(k: v for ...)", "<k: v for ...>"],
            correctIndex: 1,
            xp: 5,
            hints: ["Dictionaries use curly braces, same as their normal literal syntax."],
          },
          {
            id: "comprehensions-1-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>squares(nums)</code> that returns a list of every number in <code>nums</code> squared, using a list comprehension.",
            functionName: "squares",
            starterCode: `def squares(nums):\n    pass`,
            tests: [
              { args: [[1, 2, 3]], expected: [1, 4, 9] },
              { args: [[]], expected: [] },
            ],
            xp: 10,
            hints: ["return [n ** 2 for n in nums]"],
          },
          {
            id: "comprehensions-1-c2",
            type: "code",
            mode: "function",
            prompt: "Write <code>evens(nums)</code> that returns only the even numbers from <code>nums</code>, using a list comprehension with a condition.",
            functionName: "evens",
            starterCode: `def evens(nums):\n    pass`,
            tests: [
              { args: [[1, 2, 3, 4, 5, 6]], expected: [2, 4, 6] },
              { args: [[1, 3, 5]], expected: [] },
            ],
            xp: 10,
            hints: ["return [n for n in nums if n % 2 == 0]"],
          },
          {
            id: "comprehensions-1-c3",
            type: "code",
            mode: "function",
            prompt: "Write <code>word_lengths(words)</code> that returns a dict mapping each word to its length, using a dict comprehension.",
            functionName: "word_lengths",
            starterCode: `def word_lengths(words):\n    pass`,
            tests: [
              { args: [["hi", "hello"]], expected: { hi: 2, hello: 5 } },
            ],
            xp: 10,
            hints: ["return {w: len(w) for w in words}"],
          },
        ],
      },
    ],
  },

  {
    id: "lambda-functional",
    title: "Lambda & Functional Tools",
    icon: "🪄",
    description: "Small anonymous functions, and the tools that love using them.",
    lessons: [
      {
        id: "lambda-functional-1",
        title: "lambda, map, filter & sorted(key=)",
        explanation: `
A <code>lambda</code> is a tiny, anonymous, single-expression function: <code>lambda x: x * 2</code> is equivalent to a full <code>def</code> that just returns <code>x * 2</code>. They're most useful as quick throwaway functions passed into other functions.

<pre><code>words = ["banana", "kiwi", "fig"]
print(sorted(words, key=lambda w: len(w)))   # ["fig", "kiwi", "banana"]

nums = [1, 2, 3, 4]
doubled = list(map(lambda n: n * 2, nums))    # [2, 4, 6, 8]
positives = list(filter(lambda n: n > 0, [-1, 2, -3, 4]))  # [2, 4]</code></pre>

<code>map()</code> transforms every item, <code>filter()</code> keeps only items where the lambda returns True -- both return an iterator, so wrap them in <code>list()</code> to see the results.`,
        challenges: [
          {
            id: "lambda-functional-1-q1",
            type: "quiz",
            prompt: "What best describes a <code>lambda</code>?",
            choices: ["A loop shortcut", "A small anonymous function written in one expression", "A type of list", "A built-in error type"],
            correctIndex: 1,
            xp: 5,
            hints: ["It's a function -- just a compact, unnamed one."],
          },
          {
            id: "lambda-functional-1-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>sort_by_length(words)</code> that returns <code>words</code> sorted from shortest to longest, using <code>sorted()</code> with a <code>lambda</code> key.",
            functionName: "sort_by_length",
            starterCode: `def sort_by_length(words):\n    pass`,
            tests: [
              { args: [["banana", "kiwi", "fig"]], expected: ["fig", "kiwi", "banana"] },
            ],
            xp: 10,
            hints: ["return sorted(words, key=lambda w: len(w))"],
          },
          {
            id: "lambda-functional-1-c2",
            type: "code",
            mode: "function",
            prompt: "Write <code>double_all(nums)</code> that returns every number in <code>nums</code> doubled, using <code>map()</code> and a <code>lambda</code>.",
            functionName: "double_all",
            starterCode: `def double_all(nums):\n    pass`,
            tests: [
              { args: [[1, 2, 3]], expected: [2, 4, 6] },
            ],
            xp: 10,
            hints: ["return list(map(lambda n: n * 2, nums))"],
          },
          {
            id: "lambda-functional-1-c3",
            type: "code",
            mode: "function",
            prompt: "Write <code>keep_positive(nums)</code> that returns only the positive numbers from <code>nums</code>, using <code>filter()</code> and a <code>lambda</code>.",
            functionName: "keep_positive",
            starterCode: `def keep_positive(nums):\n    pass`,
            tests: [
              { args: [[-1, 2, -3, 4]], expected: [2, 4] },
            ],
            xp: 10,
            hints: ["return list(filter(lambda n: n > 0, nums))"],
          },
        ],
      },
    ],
  },

  {
    id: "recursion",
    title: "Recursion",
    icon: "🌀",
    description: "Functions that solve a problem by calling themselves on a smaller version of it.",
    lessons: [
      {
        id: "recursion-1",
        title: "Recursive Functions",
        explanation: `
A recursive function calls itself, working toward a <b>base case</b> -- the simplest version of the problem, which stops the recursion.

<pre><code>def factorial(n):
    if n <= 1:          # base case
        return 1
    return n * factorial(n - 1)   # calls itself on a smaller problem

factorial(5)   # 5 * 4 * 3 * 2 * 1 = 120</code></pre>

Without a base case (or if it's never reached), a recursive function calls itself forever until Python gives up with a <code>RecursionError</code>.`,
        challenges: [
          {
            id: "recursion-1-q1",
            type: "quiz",
            prompt: "What happens if a recursive function has no base case?",
            choices: ["It runs once and stops", "It calls itself forever until Python raises a RecursionError", "Python automatically adds one", "It behaves like a normal loop"],
            correctIndex: 1,
            xp: 5,
            hints: ["Without something to stop it, it just keeps calling itself."],
          },
          {
            id: "recursion-1-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>factorial(n)</code> recursively (it should call itself), returning n! (n factorial).",
            functionName: "factorial",
            starterCode: `def factorial(n):\n    if n <= 1:\n        return 1\n    pass  # TODO: return n times factorial(n - 1)`,
            tests: [
              { args: [0], expected: 1 },
              { args: [1], expected: 1 },
              { args: [5], expected: 120 },
            ],
            xp: 15,
            hints: ["return n * factorial(n - 1)"],
          },
          {
            id: "recursion-1-c2",
            type: "code",
            mode: "function",
            prompt: "Write <code>fibonacci(n)</code> recursively, where <code>fibonacci(0) == 0</code>, <code>fibonacci(1) == 1</code>, and each later number is the sum of the two before it.",
            functionName: "fibonacci",
            starterCode: `def fibonacci(n):\n    if n <= 1:\n        return n\n    pass  # TODO: return fibonacci(n - 1) + fibonacci(n - 2)`,
            tests: [
              { args: [0], expected: 0 },
              { args: [1], expected: 1 },
              { args: [6], expected: 8 },
            ],
            xp: 15,
            hints: ["return fibonacci(n - 1) + fibonacci(n - 2)"],
          },
        ],
      },
    ],
  },

  {
    id: "generators",
    title: "Generators & Iterators",
    icon: "♻️",
    description: "Producing a sequence of values one at a time, lazily, with yield.",
    lessons: [
      {
        id: "generators-1",
        title: "Generators & yield",
        explanation: `
A normal function computes everything and returns it all at once. A <b>generator function</b> uses <code>yield</code> instead of <code>return</code> to produce values one at a time, pausing in between:

<pre><code>def countdown(n):
    while n > 0:
        yield n
        n -= 1

for value in countdown(3):
    print(value)
# prints: 3, then 2, then 1

print(list(countdown(3)))  # [3, 2, 1] -- collect them all into a list</code></pre>

This is memory-efficient for big sequences, since values are produced one at a time instead of all being built and stored at once.`,
        challenges: [
          {
            id: "generators-1-q1",
            type: "quiz",
            prompt: "How is <code>yield</code> different from <code>return</code>?",
            choices: [
              "There's no real difference",
              "yield pauses the function and produces one value at a time, instead of ending it with one final value",
              "yield can only be used with numbers",
              "yield immediately ends the loop",
            ],
            correctIndex: 1,
            xp: 5,
            hints: ["return exits for good; yield exits temporarily and can resume right where it left off."],
          },
          {
            id: "generators-1-c1",
            type: "code",
            mode: "stdout",
            prompt: "Write a generator function <code>countdown(n)</code> using <code>yield</code> that produces <code>n, n-1, ..., 1</code>. Then loop over <code>countdown(3)</code> and print each value.",
            starterCode: `def countdown(n):\n    while n > 0:\n        pass  # TODO: yield n, then decrease n by 1\n\nfor value in countdown(3):\n    print(value)`,
            expectedPrinted: "3\n2\n1",
            xp: 15,
            hints: [
              "yield n produces the current value and pauses.",
              "n -= 1 afterward moves toward the base case, same idea as a while loop.",
            ],
          },
        ],
      },
    ],
  },

  {
    id: "decorators",
    title: "Decorators",
    icon: "🎀",
    description: "Wrapping a function to add extra behavior, without changing its code.",
    lessons: [
      {
        id: "decorators-1",
        title: "Writing a Decorator",
        explanation: `
A decorator is a function that takes another function and returns a new, "wrapped" version of it with extra behavior added -- without touching the original function's code.

<pre><code>def shout(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper() + "!"
    return wrapper

@shout
def greet(name):
    return f"hello {name}"

print(greet("world"))   # "HELLO WORLD!"</code></pre>

<code>@shout</code> above <code>def greet(...)</code> is shorthand for <code>greet = shout(greet)</code> -- every call to <code>greet</code> now actually runs the wrapped version.`,
        challenges: [
          {
            id: "decorators-1-q1",
            type: "quiz",
            prompt: "What does a decorator do?",
            choices: [
              "Deletes a function",
              "Wraps a function to add extra behavior around it, without changing its original code",
              "Only works on classes",
              "Converts a function into a string",
            ],
            correctIndex: 1,
            xp: 5,
            hints: ["Think of it as gift-wrapping a function -- the function inside is unchanged, but something extra happens around it."],
          },
          {
            id: "decorators-1-c1",
            type: "code",
            mode: "stdout",
            prompt: 'Finish the <code>shout</code> decorator so it takes whatever string a function returns, uppercases it, and adds <code>"!"</code>. It\'s already applied to <code>greet</code> below with <code>@shout</code>.',
            starterCode: `def shout(func):\n    def wrapper(*args, **kwargs):\n        result = func(*args, **kwargs)\n        pass  # TODO: return result, uppercased, with "!" added\n    return wrapper\n\n@shout\ndef greet(name):\n    return f"hello {name}"\n\nprint(greet("world"))`,
            expectedPrinted: "HELLO WORLD!",
            xp: 15,
            hints: [
              'return result.upper() + "!"',
              "func(*args, **kwargs) calls the original, un-wrapped greet function first.",
            ],
          },
        ],
      },
    ],
  },

  {
    id: "regex",
    title: "Regular Expressions",
    icon: "🔎",
    description: "Finding and extracting patterns of text with the re module.",
    lessons: [
      {
        id: "regex-1",
        title: "Matching Patterns with re",
        explanation: `
A regular expression (regex) is a pattern used to search text. Python's <code>re</code> module works with them:

<pre><code>import re

text = "I have 3 cats and 12 dogs"
print(re.findall(r"\\d+", text))     # ['3', '12'] -- \\d+ means "one or more digits"
print(re.search(r"\\d+", text).group())  # '3' -- the FIRST match only</code></pre>

Common pattern pieces: <code>\\d</code> a digit, <code>\\w</code> a letter/digit/underscore, <code>+</code> one or more, <code>*</code> zero or more. The <code>r"..."</code> prefix means "raw string" -- it stops Python from treating backslashes specially, which regex patterns rely on heavily.`,
        challenges: [
          {
            id: "regex-1-q1",
            type: "quiz",
            prompt: "What does <code>\\d</code> match in a regex pattern?",
            choices: ["Any letter", "Any digit", "A space", "Any character at all"],
            correctIndex: 1,
            xp: 5,
            hints: ["'d' is short for 'digit'."],
          },
          {
            id: "regex-1-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>extract_numbers(text)</code> that returns a list of every run of digits found in <code>text</code>, using <code>re.findall</code>.",
            functionName: "extract_numbers",
            starterCode: `import re\n\ndef extract_numbers(text):\n    pass`,
            tests: [
              { args: ["I have 3 cats and 12 dogs"], expected: ["3", "12"] },
              { args: ["no numbers here"], expected: [] },
            ],
            xp: 15,
            hints: ['re.findall(r"\\d+", text) finds every run of one-or-more digits.', 'return re.findall(r"\\d+", text)'],
          },
        ],
      },
    ],
  },

  {
    id: "json",
    title: "Working with JSON",
    icon: "🗃️",
    description: "Reading and writing the data format used almost everywhere on the web.",
    lessons: [
      {
        id: "json-1",
        title: "json.loads & json.dumps",
        explanation: `
JSON (JavaScript Object Notation) is a text format for structured data -- most web APIs send and receive it. Python's <code>json</code> module converts between JSON text and Python objects:

<pre><code>import json

text = '{"name": "Ada", "age": 36}'
data = json.loads(text)      # parses JSON text into a Python dict
print(data["name"])          # "Ada"

back_to_text = json.dumps(data)   # converts a Python dict back into JSON text
print(back_to_text)</code></pre>

A JSON object becomes a Python <code>dict</code>, a JSON array becomes a <code>list</code> -- everything nests the same way you'd expect.`,
        challenges: [
          {
            id: "json-1-q1",
            type: "quiz",
            prompt: "Which function converts a JSON string into a Python dictionary?",
            choices: ["json.dumps()", "json.loads()", "json.parse()", "json.read()"],
            correctIndex: 1,
            xp: 5,
            hints: ["'loads' means LOAD a String -- parsing JSON text into Python data."],
          },
          {
            id: "json-1-c1",
            type: "code",
            mode: "function",
            prompt: "Write <code>get_field(json_str, field)</code> that parses <code>json_str</code> and returns the value of <code>field</code>.",
            functionName: "get_field",
            starterCode: `import json\n\ndef get_field(json_str, field):\n    pass`,
            tests: [
              { args: ['{"name": "Ada", "age": 36}', "name"], expected: "Ada" },
              { args: ['{"name": "Ada", "age": 36}', "age"], expected: 36 },
            ],
            xp: 10,
            hints: ["json.loads(json_str) turns the text into a dict.", "return json.loads(json_str)[field]"],
          },
        ],
      },
    ],
  },
];

export function findLesson(lessonId) {
  for (const subject of CURRICULUM) {
    const lesson = subject.lessons.find((l) => l.id === lessonId);
    if (lesson) return { subject, lesson };
  }
  return null;
}

export function findChallenge(challengeId) {
  for (const subject of CURRICULUM) {
    for (const lesson of subject.lessons) {
      const challenge = lesson.challenges.find((c) => c.id === challengeId);
      if (challenge) return { subject, lesson, challenge };
    }
  }
  return null;
}

export function allChallengeIds() {
  const ids = [];
  for (const subject of CURRICULUM) {
    for (const lesson of subject.lessons) {
      for (const challenge of lesson.challenges) {
        ids.push(challenge.id);
      }
    }
  }
  return ids;
}
