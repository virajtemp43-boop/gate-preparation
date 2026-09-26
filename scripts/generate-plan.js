const fs = require('fs');
const path = require('path');

// Exact 90-Day Master Schedule according to Section 9 of MASTER BUILD PROMPT
// Month 1: October 1–31 (Foundation)
// Month 2: November 1–30 (Core Systems)
// Month 3: December 1–29 (Theory + Completion + Consolidation)

const scheduleBlueprint = [
  // MONTH 1: FOUNDATION (October 1 - 31)
  // Oct 1-7: C Programming fundamentals
  {
    day: 1, date: "2026-10-01", month: 1, monthName: "October",
    subject: "Programming & Data Structures", topic: "C Variables, Data Types & Operators",
    subtopics: ["Primitive types & qualifiers", "Arithmetic, logical & bitwise operators", "Operator precedence & associativity"],
    hours: 6,
    briefing: {
      mission: "Master C primitive types, operator precedence, and basic input/output behavior.",
      whyItMatters: "Almost every C output question in GATE tests subtle operator evaluation and type promotions.",
      prerequisites: "Basic high school mathematics and logic.",
      whatToStudy: "Integer division, bitwise AND/OR/XOR/shifts, pre/post increment evaluation.",
      whatNotToStudy: "Do NOT study pointers, dynamic memory, or recursion today. Focus solely on scalar types and operators.",
      successCondition: "You should be able to predict the exact output of compound operator expressions without compiling."
    },
    learningResource: { provider: "Gate Smashers", title: "C Programming Course / Learning Library", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "C Operators & Expressions PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 5 },
    tasks: [
      { id: "d1-t1", title: "Learn C Operators & Evaluation Rules", type: "learning", estMinutes: 90, resourceUrl: "https://www.gatesmashers.com/learn", isCore: true },
      { id: "d1-t2", title: "Write key operator precedence rules into personal notes", type: "notes", estMinutes: 20, isCore: true },
      { id: "d1-t3", title: "Solve basic expression tracing problems", type: "practice", estMinutes: 60, isCore: true },
      { id: "d1-t4", title: "Solve GATE C Operators PYQs on GATEOverflow", type: "pyq", estMinutes: 60, resourceUrl: "https://gateoverflow.in/questions?sort=gate", targetCount: 5, isCore: true },
      { id: "d1-t5", title: "Generate 5 fresh AI practice questions on operators", type: "ai_practice", estMinutes: 40, isCore: false },
      { id: "d1-t6", title: "General Aptitude: Numerical computation & ratios", type: "aptitude", estMinutes: 30, isCore: true },
      { id: "d1-t7", title: "Daily Review & update Error Book with tricky precedence cases", type: "review", estMinutes: 15, isCore: true }
    ]
  },
  {
    day: 2, date: "2026-10-02", month: 1, monthName: "October",
    subject: "Programming & Data Structures", topic: "Control Flow: Conditionals & Loops",
    subtopics: ["if-else nesting & short-circuit evaluation", "switch-case fallthrough rules", "while, for, do-while loop termination"],
    hours: 6,
    briefing: {
      mission: "Understand short-circuit logic in && and ||, and switch-case execution mechanics.",
      whyItMatters: "GATE frequently crafts output tracing questions where expressions inside && are skipped due to short-circuiting.",
      prerequisites: "Day 1 C Operators.",
      whatToStudy: "Short-circuit behavior of logical operators, loop bounds, switch without break.",
      whatNotToStudy: "Do NOT study functions or pointers yet.",
      successCondition: "Predict exact loop iteration counts and value changes across nested conditions."
    },
    learningResource: { provider: "Gate Smashers", title: "C Control Flow & Loops", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "C Loops & Conditionals PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 6 },
    tasks: [
      { id: "d2-t1", title: "Study Short-Circuiting and Loop Mechanics", type: "learning", estMinutes: 90, resourceUrl: "https://www.gatesmashers.com/learn", isCore: true },
      { id: "d2-t2", title: "Note down switch fallthrough and short-circuit traps", type: "notes", estMinutes: 20, isCore: true },
      { id: "d2-t3", title: "Solve loop iteration count numericals", type: "practice", estMinutes: 60, isCore: true },
      { id: "d2-t4", title: "Solve 6 GATE PYQs on loops on GATEOverflow", type: "pyq", estMinutes: 60, resourceUrl: "https://gateoverflow.in/questions?sort=gate", targetCount: 6, isCore: true },
      { id: "d2-t5", title: "Generate 5 fresh AI questions on loop tracing", type: "ai_practice", estMinutes: 40, isCore: false },
      { id: "d2-t6", title: "General Aptitude: Percentages & profit/loss", type: "aptitude", estMinutes: 30, isCore: true },
      { id: "d2-t7", title: "Day 2 Review: Log tricky loop boundary errors", type: "review", estMinutes: 15, isCore: true }
    ]
  },
  {
    day: 3, date: "2026-10-03", month: 1, monthName: "October",
    subject: "Programming & Data Structures", topic: "Functions, Scope & Storage Classes",
    subtopics: ["Pass by value mechanics", "auto, register, static, extern", "Scope, lifetime and visibility"],
    hours: 6,
    briefing: {
      mission: "Master static variables inside functions and call-by-value argument passing.",
      whyItMatters: "Static variables retain their values across invocations—a favorite examiner trap.",
      prerequisites: "Day 1 & Day 2 C fundamentals.",
      whatToStudy: "How static variables are initialized once; stack activation records for nested calls.",
      whatNotToStudy: "Pointers to functions or dynamic heap allocation.",
      successCondition: "Trace variable state through multiple calls of a function with static variables."
    },
    learningResource: { provider: "Gate Smashers", title: "C Storage Classes & Scope", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "C Storage Classes PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 6 },
    tasks: [
      { id: "d3-t1", title: "Study Static, Extern and Function Stack Frames", type: "learning", estMinutes: 90, resourceUrl: "https://www.gatesmashers.com/learn", isCore: true },
      { id: "d3-t2", title: "Create comparison table of storage classes in notes", type: "notes", estMinutes: 20, isCore: true },
      { id: "d3-t3", title: "Trace 5 function call execution diagrams", type: "practice", estMinutes: 60, isCore: true },
      { id: "d3-t4", title: "Solve 6 GATE PYQs on functions & static variables", type: "pyq", estMinutes: 60, resourceUrl: "https://gateoverflow.in/questions?sort=gate", targetCount: 6, isCore: true },
      { id: "d3-t5", title: "AI Practice: 5 fresh static variable challenge questions", type: "ai_practice", estMinutes: 40, isCore: false },
      { id: "d3-t6", title: "General Aptitude: Verbal analogies & vocabulary", type: "aptitude", estMinutes: 30, isCore: true },
      { id: "d3-t7", title: "Daily Review & Day 1 formula revision check", type: "review", estMinutes: 15, isCore: true }
    ]
  },
  {
    day: 4, date: "2026-10-04", month: 1, monthName: "October",
    subject: "Programming & Data Structures", topic: "1D & 2D Arrays: Memory Layout & Addressing",
    subtopics: ["Row-major vs Column-major order", "Address computation formula for A[i][j]", "Array as function arguments"],
    hours: 6,
    briefing: {
      mission: "Derive and memorize the row-major and column-major address calculation formulas.",
      whyItMatters: "Direct 2-mark numerical NAT questions on array address calculation appear frequently.",
      prerequisites: "Basic array indexing.",
      whatToStudy: "Base address + ((i - L1)*N2 + (j - L2)) * size for row-major. Same for column-major.",
      whatNotToStudy: "Pointers to multi-dimensional arrays (studied tomorrow).",
      successCondition: "Solve any multi-dimensional array address NAT problem in under 2 minutes."
    },
    learningResource: { provider: "Gate Smashers", title: "Arrays & Address Calculation", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Array Address Calculation PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 },
    tasks: [
      { id: "d4-t1", title: "Study Row-Major and Column-Major Address Derivations", type: "learning", estMinutes: 90, resourceUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", isCore: true },
      { id: "d4-t2", title: "Write both 2D and 3D address formulas on cheat sheet", type: "notes", estMinutes: 20, isCore: true },
      { id: "d4-t3", title: "Hand-solve 5 address numericals with varying lower bounds", type: "practice", estMinutes: 60, isCore: true },
      { id: "d4-t4", title: "Solve 8 GATE PYQs on array addresses on GATEOverflow", type: "pyq", estMinutes: 60, resourceUrl: "https://gateoverflow.in/questions?sort=gate", targetCount: 8, isCore: true },
      { id: "d4-t5", title: "AI Practice: 5 fresh address calculation numericals", type: "ai_practice", estMinutes: 40, isCore: false },
      { id: "d4-t6", title: "General Aptitude: Speed, distance & time", type: "aptitude", estMinutes: 30, isCore: true },
      { id: "d4-t7", title: "Review mistakes and log wrong formula index calculations", type: "review", estMinutes: 15, isCore: true }
    ]
  },
  {
    day: 5, date: "2026-10-05", month: 1, monthName: "October",
    subject: "Programming & Data Structures", topic: "Pointers & Pointer Arithmetic",
    subtopics: ["Pointer syntax & dereference (*p)", "Pointer arithmetic scaling rules", "*(a + i) == a[i] identity and pointers to arrays"],
    hours: 6,
    briefing: {
      mission: "Master pointer scaling and the equivalences between array syntax and pointer notation.",
      whyItMatters: "Pointers are the single highest-yield topic in GATE programming.",
      prerequisites: "Days 1-4 fundamentals.",
      whatToStudy: "p + 1 moves by sizeof(*p); difference between `int *p` and `int (*p)[5]`.",
      whatNotToStudy: "Complex function pointers or void pointers.",
      successCondition: "Correctly evaluate nested pointer expressions like *(*(p+i)+j)."
    },
    learningResource: { provider: "Gate Smashers", title: "C Pointers In-Depth", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "C Pointers GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 },
    tasks: [
      { id: "d5-t1", title: "Study Pointer Arithmetic and Array-Pointer Equivalence", type: "learning", estMinutes: 90, resourceUrl: "https://www.gatesmashers.com/learn", isCore: true },
      { id: "d5-t2", title: "Draw pointer memory diagrams in your notebook", type: "notes", estMinutes: 20, isCore: true },
      { id: "d5-t3", title: "Trace 6 complex pointer manipulation code snippets", type: "practice", estMinutes: 60, isCore: true },
      { id: "d5-t4", title: "Solve 8 GATE Pointers PYQs on GATEOverflow", type: "pyq", estMinutes: 60, resourceUrl: "https://gateoverflow.in/questions?sort=gate", targetCount: 8, isCore: true },
      { id: "d5-t5", title: "AI Practice: 5 fresh pointer arithmetic code puzzles", type: "ai_practice", estMinutes: 40, isCore: false },
      { id: "d5-t6", title: "General Aptitude: Syllogisms & logical deductions", type: "aptitude", estMinutes: 30, isCore: true },
      { id: "d5-t7", title: "Log pointer mistakes into Error Book folder 01_C_PROGRAMMING", type: "review", estMinutes: 15, isCore: true }
    ]
  },
  {
    day: 6, date: "2026-10-06", month: 1, monthName: "October",
    subject: "Programming & Data Structures", topic: "Strings & Character Arrays",
    subtopics: ["Null character '\\0' termination", "String literals vs char array buffers", "Standard library string functions (strlen, strcpy, strcmp)"],
    hours: 6,
    briefing: {
      mission: "Understand how strings are represented in memory and how null terminators govern loop termination.",
      whyItMatters: "Off-by-one errors with strlen vs sizeof(str) are examiner favorites.",
      prerequisites: "Pointers and 1D arrays.",
      whatToStudy: "char *s = 'hello' vs char s[] = 'hello'; pointer traversal until *s != '\\0'.",
      whatNotToStudy: "Dynamic heap string manipulation.",
      successCondition: "Accurately trace string modification and print loops."
    },
    learningResource: { provider: "Gate Smashers", title: "Strings & Character Pointers", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "C Strings GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 6 },
    tasks: [
      { id: "d6-t1", title: "Study String Memory Representation and Traversal", type: "learning", estMinutes: 90, resourceUrl: "https://www.gatesmashers.com/learn", isCore: true },
      { id: "d6-t2", title: "Summarize string traps: sizeof vs strlen", type: "notes", estMinutes: 20, isCore: true },
      { id: "d6-t3", title: "Trace 5 string pointer increment programs", type: "practice", estMinutes: 60, isCore: true },
      { id: "d6-t4", title: "Solve 6 GATE String PYQs on GATEOverflow", type: "pyq", estMinutes: 60, resourceUrl: "https://gateoverflow.in/questions?sort=gate", targetCount: 6, isCore: true },
      { id: "d6-t5", title: "AI Practice: 5 fresh string output tracing questions", type: "ai_practice", estMinutes: 40, isCore: false },
      { id: "d6-t6", title: "General Aptitude: Data interpretation & bar graphs", type: "aptitude", estMinutes: 30, isCore: true },
      { id: "d6-t7", title: "Daily Review & prepare for Week 1 Review", type: "review", estMinutes: 15, isCore: true }
    ]
  },
  {
    day: 7, date: "2026-10-07", month: 1, monthName: "October",
    subject: "Programming & Data Structures", topic: "Structures, Unions & Week 1 Review",
    subtopics: ["Structure padding & memory alignment", "Union shared memory representation", "Week 1 Comprehensive C Programming Test"],
    hours: 6, isTest: true,
    briefing: {
      mission: "Master structure padding rules and test your full C fundamentals under timed pressure.",
      whyItMatters: "Structure size questions require understanding alignment boundaries (multiples of word size).",
      prerequisites: "Days 1-6 C fundamentals.",
      whatToStudy: "Padding rules; Union size = max element size aligned to largest member.",
      whatNotToStudy: "Bit fields in depth.",
      successCondition: "Calculate exact sizeof(struct) and review all C mistakes from Days 1-7."
    },
    learningResource: { provider: "Gate Smashers", title: "Structures & Unions in C", url: "https://www.gatesmashers.com/learn", timeMin: 80 },
    pyqResource: { provider: "GATEOverflow", title: "C Comprehensive Tests on GATEOverflow", url: "https://db.gateoverflow.in/tests", target: 12 },
    tasks: [
      { id: "d7-t1", title: "Study Structure Padding and Memory Alignment Rules", type: "learning", estMinutes: 80, resourceUrl: "https://www.gatesmashers.com/learn", isCore: true },
      { id: "d7-t2", title: "Take 1-Hour Timed C Programming Topic Test on GATEOverflow", type: "test", estMinutes: 60, resourceUrl: "https://db.gateoverflow.in/tests", isCore: true },
      { id: "d7-t3", title: "Solve 8 mixed C Programming PYQs", type: "pyq", estMinutes: 60, resourceUrl: "https://gateoverflow.in/questions?sort=gate", targetCount: 8, isCore: true },
      { id: "d7-t4", title: "Deep Error Book Analysis: Classify every mistake into 01_C_PROGRAMMING", type: "review", estMinutes: 60, isCore: true },
      { id: "d7-t5", title: "General Aptitude: 30 min timed mixed section", type: "aptitude", estMinutes: 30, isCore: true },
      { id: "d7-t6", title: "Week 1 Self-Score out of 10 & preview Data Structures", type: "review", estMinutes: 20, isCore: true }
    ]
  },

  // Oct 8-14: Data Structures fundamentals
  { day: 8, date: "2026-10-08", month: 1, monthName: "October", subject: "Programming & Data Structures", topic: "Recursion & Call Stack Tracing", subtopics: ["Base conditions & infinite recursion", "Head vs Tail recursion", "Activation record call stack tracing"], hours: 6,
    briefing: { mission: "Master call-stack tree tracing for recursive functions.", whyItMatters: "GATE recursion questions always test execution order of statements before vs after recursive calls.", prerequisites: "C Functions & Stack concept.", whatToStudy: "Trace call trees step-by-step; static variable state in recursive functions.", whatNotToStudy: "Dynamic programming memoization (studied in Algorithms).", successCondition: "Correctly determine printed output of 2-branch recursive functions." },
    learningResource: { provider: "Gate Smashers", title: "Recursion in C & Data Structures", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "GATE Recursion PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 9, date: "2026-10-09", month: 1, monthName: "October", subject: "Programming & Data Structures", topic: "Singly Linked Lists: Operations & Pointer Updates", subtopics: ["Node insertion & deletion edge cases", "In-place list reversal", "Cycle detection (Floyd’s Tortoise and Hare)"], hours: 6,
    briefing: { mission: "Learn in-place linked list manipulations without memory leaks.", whyItMatters: "Direct algorithm questions on pointer updates and time complexities appear regularly.", prerequisites: "Pointers & struct node.", whatToStudy: "Reversing a list in $O(n)$ time and $O(1)$ space; finding middle node.", whatNotToStudy: "Skip lists or unrolled linked lists.", successCondition: "Write clean pointer swap sequences for list reversal and cycle detection." },
    learningResource: { provider: "Gate Smashers", title: "Linked Lists Roadmap", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Linked Lists GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 10, date: "2026-10-10", month: 1, monthName: "October", subject: "Programming & Data Structures", topic: "Doubly & Circular Linked Lists", subtopics: ["Circular list boundary conditions", "Doubly linked list deletion pointer updates", "Polynomial representation using lists"], hours: 6,
    briefing: { mission: "Understand circular and doubly linked pointer structures and time bounds.", whyItMatters: "Examiners test whether you can delete a node given only a pointer to it.", prerequisites: "Singly linked lists.", whatToStudy: "Circular list full traversal termination condition; constant time deletion tricks.", whatNotToStudy: "Multi-list indexing structures.", successCondition: "State the exact time complexity of inserting/deleting at head/tail across list variants." },
    learningResource: { provider: "Gate Smashers", title: "Doubly & Circular Linked Lists", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Circular & Doubly Lists PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 6 }
  },
  { day: 11, date: "2026-10-11", month: 1, monthName: "October", subject: "Programming & Data Structures", topic: "Stacks: Operations, Infix to Postfix & Evaluation", subtopics: ["Array & Linked Stack implementations", "Shunting Yard algorithm (Infix to Postfix)", "Evaluation of postfix and prefix expressions"], hours: 6,
    briefing: { mission: "Master stack-based expression conversion and evaluation.", whyItMatters: "Infix to postfix conversion is tested almost every alternate year.", prerequisites: "Arrays and operator precedence.", whatToStudy: "Operator stack rules; associativity rules during conversion; postfix evaluation algorithm.", whatNotToStudy: "Compiler parser stacks (covered in Compiler Design).", successCondition: "Convert complex infix expressions to postfix by hand without errors in under 3 minutes." },
    learningResource: { provider: "Gate Smashers", title: "Stacks & Infix to Postfix", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Stack Expression PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 12, date: "2026-10-12", month: 1, monthName: "October", subject: "Programming & Data Structures", topic: "Stack Applications: Permutations & Two-Stack Tricks", subtopics: ["Valid stack permutation checking", "Catalan number formula for stack permutations", "Implementing two stacks in one array"], hours: 6,
    briefing: { mission: "Learn how to determine if a given output permutation is obtainable via a stack.", whyItMatters: "Given sequence 1,2,3,4, which permutation is NOT possible? This is a classic GATE question.", prerequisites: "Stack push and pop operations.", whatToStudy: "Rule: forbidden pattern 312 in permutations; $\\frac{1}{n+1}\\binom{2n}{n}$ formula.", whatNotToStudy: "Monotonic queues.", successCondition: "Instantly identify invalid stack permutations among 4 options." },
    learningResource: { provider: "Gate Smashers", title: "Stack Permutations & Applications", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Stack Permutations PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 13, date: "2026-10-13", month: 1, monthName: "October", subject: "Programming & Data Structures", topic: "Queues, Circular Queues & Priority Queues", subtopics: ["Circular queue full and empty conditions", "Queue using two stacks amortized analysis", "Deques & Priority queue representation"], hours: 6,
    briefing: { mission: "Master circular queue index modulo arithmetic: $(rear + 1) \\% N == front$.", whyItMatters: "Index boundary arithmetic is frequently tested in NAT format.", prerequisites: "Stacks and array modulo operations.", whatToStudy: "Circular queue empty vs full condition with (N-1) elements; cost of queue via 2 stacks.", whatNotToStudy: "Heap implementation details (covered on Day 17).", successCondition: "Accurately state front and rear index values after a sequence of enqueue/dequeue operations." },
    learningResource: { provider: "Gate Smashers", title: "Queues & Circular Queues", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Queues GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 6 }
  },
  { day: 14, date: "2026-10-14", month: 1, monthName: "October", subject: "Programming & Data Structures", topic: "Linear Data Structures Review & Timed Test", subtopics: ["Lists, Stacks, Queues combined test", "Error Book review for linear structures", "Week 2 progress checkpoint"], hours: 6, isTest: true,
    briefing: { mission: "Consolidate all linear data structures and evaluate speed on GATEOverflow.", whyItMatters: "Week 2 exit criterion: solve any stack, queue, or list question without notes.", prerequisites: "Days 8-13.", whatToStudy: "Review formulas on cheat sheet; solve weak areas identified during the week.", whatNotToStudy: "Trees or graphs today.", successCondition: "Score at least 70% on the linear structures timed test." },
    learningResource: { provider: "Gate Smashers", title: "Linear Data Structures Review", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 60 },
    pyqResource: { provider: "GATEOverflow", title: "Linear Data Structures Online Test", url: "https://db.gateoverflow.in/tests", target: 12 }
  },

  // Oct 15-21: Algorithms fundamentals
  { day: 15, date: "2026-10-15", month: 1, monthName: "October", subject: "Algorithms", topic: "Asymptotic Notation: Big-O, Omega, Theta", subtopics: ["Formal mathematical definitions of O, Omega, Theta, o, omega", "Properties of asymptotic bounds (transitivity, symmetry)", "Comparing growth rates of functions"], hours: 6,
    briefing: { mission: "Master the mathematical definitions with constants $c$ and $n_0$.", whyItMatters: "Comparing complex functions like $n^{\\log n}$ vs $2^{\\sqrt{\\log n}}$ is tested every year.", prerequisites: "Logarithms and limits.", whatToStudy: "Limit rule: $\\lim_{n\\to\\infty} \\frac{f(n)}{g(n)}$; log manipulation rules.", whatNotToStudy: "Recurrence relations (studied tomorrow).", successCondition: "Order any set of 5 mathematical functions by increasing asymptotic growth." },
    learningResource: { provider: "Gate Smashers", title: "Asymptotic Notations Roadmap", url: "https://www.gatesmashers.com/roadmaps/design-and-analysis-of-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Asymptotic Notation PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 16, date: "2026-10-16", month: 1, monthName: "October", subject: "Algorithms", topic: "Recurrence Relations & Master Theorem", subtopics: ["Master Theorem Case 1, 2, 3", "Extended Master Theorem for logarithmic factors", "Substitution method & recursion trees for non-Master recurrences"], hours: 6,
    briefing: { mission: "Solve any divide-and-conquer recurrence in 30 seconds using Master Theorem.", whyItMatters: "Guaranteed 1-2 marks in every single GATE exam.", prerequisites: "Asymptotic notations.", whatToStudy: "Standard form $T(n) = aT(n/b) + \\Theta(n^k \\log^p n)$; compare $\\log_b a$ with $k$.", whatNotToStudy: "Generating functions.", successCondition: "Instantly solve standard and logarithmic Master Theorem recurrences." },
    learningResource: { provider: "Gate Smashers", title: "Master Theorem & Recurrences", url: "https://www.gatesmashers.com/roadmaps/design-and-analysis-of-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Recurrence Relations GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 17, date: "2026-10-17", month: 1, monthName: "October", subject: "Programming & Data Structures", topic: "Binary Trees & Tree Traversals", subtopics: ["Full, Complete, Strict Binary Tree properties", "Inorder, Preorder, Postorder traversals", "Constructing unique tree from given traversals"], hours: 6,
    briefing: { mission: "Learn binary tree height/node mathematical bounds and traversal reconstruction.", whyItMatters: "Given Inorder + Preorder, finding Postorder is a guaranteed question.", prerequisites: "Recursion and linked structures.", whatToStudy: "Minimum/maximum nodes for height $h$; Inorder + one other traversal gives unique tree.", whatNotToStudy: "B-Trees or Red-Black trees.", successCondition: "Reconstruct a binary tree and state its postorder sequence given inorder and preorder." },
    learningResource: { provider: "Gate Smashers", title: "Binary Trees Roadmap", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Binary Tree Traversals PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 18, date: "2026-10-18", month: 1, monthName: "October", subject: "Programming & Data Structures", topic: "Binary Search Trees (BST) & AVL Trees", subtopics: ["BST property & search/insert/delete", "Inorder of BST is always sorted", "AVL tree rotations (LL, RR, LR, RL) and balance factor"], hours: 6,
    briefing: { mission: "Understand BST node deletion cases and AVL self-balancing rotations.", whyItMatters: "Catalan numbers for counting distinct BSTs and AVL rotation types are tested repeatedly.", prerequisites: "Binary Trees.", whatToStudy: "Inorder predecessor/successor replacement on 2-child delete; balance factor $\\in \\{-1, 0, 1\\}$.", whatNotToStudy: "Splay trees or Treaps.", successCondition: "Determine the exact single or double rotation needed after inserting a sequence into an AVL tree." },
    learningResource: { provider: "Gate Smashers", title: "BST and AVL Trees", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "BST and AVL Tree PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 19, date: "2026-10-19", month: 1, monthName: "October", subject: "Programming & Data Structures", topic: "Binary Heaps & Priority Queues", subtopics: ["Min-Heap & Max-Heap properties and array storage", "Heapify algorithm: O(n) construction", "Heap Sort & priority queue operations"], hours: 6,
    briefing: { mission: "Understand why building a heap takes $O(n)$ time while inserting $n$ elements takes $O(n \\log n)$.", whyItMatters: "GATE frequently tests the difference between building a heap vs successive insertions.", prerequisites: "Complete Binary Trees.", whatToStudy: "Parent at $\\lfloor i/2 \\rfloor$, children at $2i, 2i+1$; bottom-up heapify mathematical proof.", whatNotToStudy: "Fibonacci heaps or Binomial heaps.", successCondition: "Draw the exact array representation of a heap after given sequence of insertions and deletes." },
    learningResource: { provider: "Gate Smashers", title: "Heaps & Heap Sort", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Binary Heaps GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 20, date: "2026-10-20", month: 1, monthName: "October", subject: "Algorithms", topic: "Sorting Algorithms & Lower Bounds", subtopics: ["Merge Sort, Quick Sort analysis", "Counting Sort, Radix Sort", "Comparison sort lower bound Omega(n log n) proof"], hours: 6,
    briefing: { mission: "Know stability, in-place behavior, and best/worst/average complexities of all standard sorts.", whyItMatters: "Direct MSQ questions test stability and space trade-offs across sorting algorithms.", prerequisites: "Asymptotic notation & recurrences.", whatToStudy: "Decision tree model for $\\Omega(n \\log n)$; Quicksort worst case $\\Theta(n^2)$ when pivot is extreme.", whatNotToStudy: "External sorting (covered in DBMS).", successCondition: "Fill the complete 7-algorithm sorting comparison table from memory." },
    learningResource: { provider: "Gate Smashers", title: "Sorting Algorithms Roadmap", url: "https://www.gatesmashers.com/roadmaps/design-and-analysis-of-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Sorting Algorithms PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 21, date: "2026-10-21", month: 1, monthName: "October", subject: "Algorithms", topic: "Greedy Algorithms & Divide and Conquer", subtopics: ["Greedy choice property & optimal substructure", "Huffman coding & prefix tree calculation", "Activity selection & fractional knapsack"], hours: 6, isTest: true,
    briefing: { mission: "Master Huffman tree code-length calculations and the greedy paradigm.", whyItMatters: "Huffman coding is a frequent 2-mark numerical problem in GATE.", prerequisites: "Binary trees & priority queues.", whatToStudy: "Huffman variable-length prefix code construction; optimal merge pattern.", whatNotToStudy: "0/1 Knapsack (that requires DP, covered later).", successCondition: "Calculate total bits required to encode a file given character frequencies using Huffman coding." },
    learningResource: { provider: "Gate Smashers", title: "Greedy Algorithms & Huffman Coding", url: "https://www.gatesmashers.com/roadmaps/design-and-analysis-of-algorithms", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Greedy & Huffman Coding PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },

  // Oct 22-26: Discrete Mathematics
  { day: 22, date: "2026-10-22", month: 1, monthName: "October", subject: "Discrete Mathematics", topic: "Propositional Logic & Truth Tables", subtopics: ["Tautology, Contradiction, Contingency", "Logical equivalences (De Morgan, Implication rule)", "Inference rules (Modus Ponens, Modus Tollens)"], hours: 6,
    briefing: { mission: "Master truth values, implication $p \\to q \\equiv \\neg p \\lor q$, and logical equivalence.", whyItMatters: "Propositional logic forms the foundation for digital logic and formal verification.", prerequisites: "Basic high-school logic.", whatToStudy: "Truth tables; converting English sentences into symbolic propositional logic.", whatNotToStudy: "First-order predicate quantifiers (covered tomorrow).", successCondition: "Prove whether a compound proposition is a tautology using equivalence laws." },
    learningResource: { provider: "Gate Smashers", title: "Propositional Logic Library", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Propositional Logic GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 23, date: "2026-10-23", month: 1, monthName: "October", subject: "Discrete Mathematics", topic: "First-Order Predicate Logic", subtopics: ["Universal and existential quantifiers (\\forall, \\exists)", "Negation of quantified statements", "Translating complex English sentences to predicate logic"], hours: 6,
    briefing: { mission: "Master translation of 'All', 'Some', 'None' into predicate logic with correct implication vs conjunction.", whyItMatters: "Examiners deliberately test if you know that $\\forall x (P(x) \\to Q(x))$ uses $\\to$ while $\\exists x (P(x) \\land Q(x))$ uses $\\land$.", prerequisites: "Propositional logic.", whatToStudy: "Quantifier negation rules; scope of variables; nested quantifiers $\\forall x \\exists y$ vs $\\exists y \\forall x$.", whatNotToStudy: "Model checking algorithms.", successCondition: "Translate complex mathematical and English statements into first-order logic without error." },
    learningResource: { provider: "Gate Smashers", title: "First-Order Logic & Quantifiers", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Predicate Logic GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 24, date: "2026-10-24", month: 1, monthName: "October", subject: "Discrete Mathematics", topic: "Sets, Relations & Equivalence Relations", subtopics: ["Set identities & Power set properties", "Reflexive, Symmetric, Transitive, Antisymmetric relations", "Equivalence relations & equivalence classes"], hours: 6,
    briefing: { mission: "Count the number of reflexive, symmetric, and transitive relations on a set with $n$ elements.", whyItMatters: "Direct combinatorial relation-counting questions appear frequently.", prerequisites: "Set operations.", whatToStudy: "Number of relations: $2^{n^2}$; Reflexive: $2^{n(n-1)}$; Symmetric: $2^{\\frac{n(n+1)}{2}}$.", whatNotToStudy: "Lattices (studied tomorrow).", successCondition: "Classify any given relation into equivalence, partial order, or neither." },
    learningResource: { provider: "Gate Smashers", title: "Relations & Equivalence Classes", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Relations & Sets GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 25, date: "2026-10-25", month: 1, monthName: "October", subject: "Discrete Mathematics", topic: "Partial Orders, Hasse Diagrams & Lattices", subtopics: ["Posets & drawing Hasse diagrams", "Maximal, minimal, greatest, least elements", "Lattices: Join (LUB) and Meet (GLB) properties"], hours: 6,
    briefing: { mission: "Read Hasse diagrams and determine whether a poset forms a lattice.", whyItMatters: "A poset is a lattice if and only if EVERY pair of elements has a unique LUB and GLB.", prerequisites: "Partial order relations.", whatToStudy: "Finding greatest vs maximal elements; distributive and complemented lattices.", whatNotToStudy: "Boolean rings.", successCondition: "Inspect any Hasse diagram and verify whether it represents a lattice." },
    learningResource: { provider: "Gate Smashers", title: "Hasse Diagrams & Lattices", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Lattices & Posets PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 26, date: "2026-10-26", month: 1, monthName: "October", subject: "Discrete Mathematics", topic: "Combinatorics: Permutations, Combinations & Pigeonhole", subtopics: ["Pigeonhole Principle and generalized PHP", "Inclusion-Exclusion Principle", "Generating functions and binomial coefficients"], hours: 6,
    briefing: { mission: "Solve Pigeonhole Principle and Inclusion-Exclusion word problems.", whyItMatters: "Pigeonhole principle numericals are easy marks if you identify pigeons vs holes correctly.", prerequisites: "Basic arithmetic counting.", whatToStudy: "$\\lceil n/k \\rceil$ rule; counting derangements $D_n$; distribution of identical items in distinct boxes.", whatNotToStudy: "Polya counting theory.", successCondition: "Solve standard pigeonhole and derangement numerical questions accurately." },
    learningResource: { provider: "Gate Smashers", title: "Combinatorics & Counting Principles", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Combinatorics GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },

  // Oct 27-30: Probability + Linear Algebra fundamentals
  { day: 27, date: "2026-10-27", month: 1, monthName: "October", subject: "Engineering Mathematics", topic: "Probability: Conditional Probability & Bayes Theorem", subtopics: ["Sample space, events, independence", "Conditional probability formula $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$", "Bayes Theorem for posterior probability"], hours: 6,
    briefing: { mission: "Master conditional probability, independence, and Bayes Theorem.", whyItMatters: "Bayes Theorem is the most tested probability topic in GATE CS.", prerequisites: "Set theory and counting.", whatToStudy: "Total Probability theorem; independent events $P(A \\cap B) = P(A)P(B)$.", whatNotToStudy: "Continuous probability density functions (studied tomorrow).", successCondition: "Solve medical diagnosis or transmission channel Bayes Theorem word problems without confusion." },
    learningResource: { provider: "Gate Smashers", title: "Probability & Bayes Theorem", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Probability GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 28, date: "2026-10-28", month: 1, monthName: "October", subject: "Engineering Mathematics", topic: "Random Variables & Distributions", subtopics: ["Discrete random variables: Expectation & Variance", "Binomial distribution and Poisson distribution", "Uniform distribution & basic Normal distribution"], hours: 6,
    briefing: { mission: "Calculate Mean, Variance, and Poisson probabilities: $P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$.", whyItMatters: "Expectation of sum of random variables $E[X+Y] = E[X] + E[Y]$ always holds, even without independence.", prerequisites: "Conditional probability.", whatToStudy: "Properties of variance: $\\text{Var}(aX + b) = a^2 \\text{Var}(X)$; Poisson approximation.", whatNotToStudy: "Multivariate normal distributions.", successCondition: "Compute expectation and variance of discrete and continuous random variables." },
    learningResource: { provider: "Gate Smashers", title: "Random Variables & Distributions", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Distributions GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 29, date: "2026-10-29", month: 1, monthName: "October", subject: "Engineering Mathematics", topic: "Linear Algebra: Matrices, Rank & Systems of Equations", subtopics: ["Matrix determinants and row operations", "Rank of a matrix via echelon form", "Consistency of $AX = B$ (Unique, Infinite, No solution)"], hours: 6,
    briefing: { mission: "Determine rank and system consistency using $\\text{rank}(A)$ vs $\\text{rank}(A|B)$.", whyItMatters: "Guaranteed 1-2 marks on determining whether a system has unique, infinite, or no solution.", prerequisites: "Basic matrix multiplication.", whatToStudy: "Augmented matrix row reduction; condition for non-trivial solution of $AX = 0$: $\\det(A) = 0$.", whatNotToStudy: "Vector spaces in abstract algebra.", successCondition: "Quickly determine the value of a parameter $k$ for which a system of linear equations is consistent." },
    learningResource: { provider: "Gate Smashers", title: "Linear Algebra: Rank & Systems", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Linear Algebra Rank PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 30, date: "2026-10-30", month: 1, monthName: "October", subject: "Engineering Mathematics", topic: "Linear Algebra: Eigenvalues & Cayley-Hamilton", subtopics: ["Characteristic equation $\\det(A - \\lambda I) = 0$", "Properties of Eigenvalues (Sum = Trace, Product = Determinant)", "Cayley-Hamilton Theorem: $A$ satisfies its own characteristic equation"], hours: 6,
    briefing: { mission: "Use Trace and Determinant shortcuts to find eigenvalues without expanding full polynomials.", whyItMatters: "Shortcut: Sum of eigenvalues = Trace of matrix; Product of eigenvalues = Determinant.", prerequisites: "Determinants and matrix rank.", whatToStudy: "Eigenvalues of triangular matrices are diagonal elements; computing matrix inverse via Cayley-Hamilton.", whatNotToStudy: "Singular Value Decomposition (SVD).", successCondition: "Find all eigenvalues of a $3 \\times 3$ matrix in under 90 seconds using trace and determinant." },
    learningResource: { provider: "Gate Smashers", title: "Eigenvalues & Cayley-Hamilton", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Eigenvalues GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 31, date: "2026-10-31", month: 1, monthName: "October", subject: "Foundation Review", topic: "Month 1 Comprehensive Review & Diagnostic Test", subtopics: ["C + DSA + Algorithms + Discrete Math + Engg Math", "Timed Full Month 1 Test on GATEOverflow", "Error Book review & Month 2 readiness check"], hours: 6, isTest: true,
    briefing: { mission: "Complete Month 1 exit test: Verify solid fundamentals before launching into Core Systems.", whyItMatters: "Month 1 is the prerequisite foundation for all Month 2 subjects (COA, OS, DBMS).", prerequisites: "All Month 1 topics (Days 1-30).", whatToStudy: "Review high-frequency formulas; re-attempt all Class C mistakes from Error Book.", whatNotToStudy: "Do NOT begin Digital Logic today.", successCondition: "Achieve at least 65% accuracy across mixed Month 1 questions." },
    learningResource: { provider: "Gate Smashers", title: "Month 1 Foundation Review", url: "https://www.gatesmashers.com/learn", timeMin: 60 },
    pyqResource: { provider: "GATEOverflow", title: "GATEOverflow Test Series", url: "https://db.gateoverflow.in/tests", target: 20 }
  },

  // MONTH 2: CORE SYSTEMS (November 1 - 30)
  // Nov 1-5: Digital Logic
  { day: 32, date: "2026-11-01", month: 2, monthName: "November", subject: "Digital Logic", topic: "Number Systems & Floating Point Representation", subtopics: ["Binary, Octal, Hexadecimal conversions", "1's and 2's complement arithmetic", "IEEE 754 Floating point format (Single & Double precision)"], hours: 6,
    briefing: { mission: "Master IEEE 754 floating point representation and 2's complement range.", whyItMatters: "IEEE 754 single precision (1 sign, 8 exponent with bias 127, 23 mantissa) is tested directly.", prerequisites: "Binary arithmetic.", whatToStudy: "Normalized vs Denormalized numbers; 2's complement range $-2^{n-1}$ to $2^{n-1}-1$.", whatNotToStudy: "BCD codes.", successCondition: "Convert any fractional decimal into IEEE 754 hexadecimal representation." },
    learningResource: { provider: "Gate Smashers", title: "Number Systems & Floating Point", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Number Systems GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 33, date: "2026-11-02", month: 2, monthName: "November", subject: "Digital Logic", topic: "Boolean Algebra & K-Maps", subtopics: ["Canonical SOP and POS forms", "K-Maps up to 4 variables with Don't Care conditions", "Prime Implicants (PI) and Essential Prime Implicants (EPI)"], hours: 6,
    briefing: { mission: "Minimize Boolean functions and accurately count Prime Implicants and EPIs.", whyItMatters: "Distinguishing between Essential Prime Implicants and non-essential PIs is a standard GATE MCQ.", prerequisites: "Number systems.", whatToStudy: "Grouping rules in K-maps; utilizing Don't Cares only when they enlarge groups.", whatNotToStudy: "Quine-McCluskey tabular method.", successCondition: "Identify all EPIs and minimal SOP expressions for any 4-variable K-map." },
    learningResource: { provider: "Gate Smashers", title: "Boolean Minimization & K-Maps", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "K-Map Minimization PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 34, date: "2026-11-03", month: 2, monthName: "November", subject: "Digital Logic", topic: "Combinational Circuits: Multiplexers & Decoders", subtopics: ["Multiplexer tree and implementing Boolean functions", "Decoders with active-low enables", "Half/Full Adders & Carry Lookahead delay"], hours: 6,
    briefing: { mission: "Implement arbitrary Boolean functions using $2^n \\times 1$ and smaller multiplexers.", whyItMatters: "Multiplexer logic questions appear in almost every GATE exam.", prerequisites: "K-Maps and truth tables.", whatToStudy: "Connecting inputs to 0, 1, or variable; Lookahead carry adder propagation delay.", whatNotToStudy: "Custom PAL/PLA architectures.", successCondition: "Implement any 3-variable function using a $4 \\times 1$ MUX." },
    learningResource: { provider: "Gate Smashers", title: "Multiplexers & Combinational Circuits", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Multiplexers & Decoders PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 35, date: "2026-11-04", month: 2, monthName: "November", subject: "Digital Logic", topic: "Sequential Circuits: Latches & Flip-Flops", subtopics: ["SR, JK, D, T Flip-flops", "Characteristic & Excitation tables", "Race-around condition and Master-Slave JK flip-flop"], hours: 6,
    briefing: { mission: "Master flip-flop conversion and characteristic equations ($Q_{next} = J\\bar{Q} + \\bar{K}Q$).", whyItMatters: "Sequential circuits require calculating state transitions cycle by cycle.", prerequisites: "Logic gates.", whatToStudy: "Excitation tables for designing counters; setup time and hold time constraints.", whatNotToStudy: "Asynchronous circuit hazard races.", successCondition: "Determine the state sequence of cross-coupled flip-flops given clock pulses." },
    learningResource: { provider: "Gate Smashers", title: "Flip-Flops & Sequential Circuits", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Flip-Flops GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 36, date: "2026-11-05", month: 2, monthName: "November", subject: "Digital Logic", topic: "Counters & Shift Registers", subtopics: ["Synchronous vs Asynchronous (Ripple) counters", "Designing Mod-N counters with arbitrary sequences", "Ring counter and Johnson counter states"], hours: 6,
    briefing: { mission: "Calculate modulus of synchronous counters and ripple counter clock delays.", whyItMatters: "Tracing the state trajectory $Q_2 Q_1 Q_0$ until repeat is a standard question.", prerequisites: "Flip-flops.", whatToStudy: "Number of unused states in Johnson counter: $2^n - 2n$; maximum clock frequency of ripple counter.", whatNotToStudy: "Semiconductor RAM circuits.", successCondition: "Determine the exact counting sequence and modulus of any synchronous counter." },
    learningResource: { provider: "Gate Smashers", title: "Counters & Shift Registers", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Counters & Registers PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },

  // Nov 6-12: Computer Organization & Architecture
  { day: 37, date: "2026-11-06", month: 2, monthName: "November", subject: "Computer Organization & Architecture", topic: "Instruction Formats & Addressing Modes", subtopics: ["0, 1, 2, 3 address instruction formats", "Immediate, Direct, Indirect, Register, Indexed addressing", "PC-relative addressing and offset calculations"], hours: 6,
    briefing: { mission: "Calculate effective addresses across addressing modes and instruction encoding bit sizes.", whyItMatters: "Direct 2-mark questions on instruction word bit fields (Opcode + Mode + Reg + Address).", prerequisites: "Digital logic number systems.", whatToStudy: "Effective address calculation; PC relative = PC + Offset; expanding opcode technique.", whatNotToStudy: "x86 architecture specifics.", successCondition: "Calculate maximum possible instructions given instruction length and address bits." },
    learningResource: { provider: "Gate Smashers", title: "COA Roadmap: Addressing Modes", url: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Addressing Modes GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 38, date: "2026-11-07", month: 2, monthName: "November", subject: "Computer Organization & Architecture", topic: "ALU, Datapath & Control Unit Design", subtopics: ["Hardwired control vs Microprogrammed control", "Horizontal vs Vertical microinstructions", "Control store sizing and micro-operation sequencing"], hours: 6,
    briefing: { mission: "Compare horizontal and vertical microprogramming and calculate control word sizes.", whyItMatters: "Control word sizing numericals are common in GATE COA.", prerequisites: "Instruction formats.", whatToStudy: "Horizontal (no decoding, faster, wider word) vs Vertical (decoded, slower, narrower).", whatNotToStudy: "Microcode optimization compilers.", successCondition: "Calculate control memory size in bits given control signals and branch addresses." },
    learningResource: { provider: "Gate Smashers", title: "Control Unit & Datapath", url: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Control Unit Design PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 39, date: "2026-11-08", month: 2, monthName: "November", subject: "Computer Organization & Architecture", topic: "Memory Hierarchy & Main Memory Interleaving", subtopics: ["Memory chip capacity and address decoding", "High-order vs Low-order interleaving", "Effective memory bandwidth"], hours: 6,
    briefing: { mission: "Calculate chips needed to construct memory modules and compare interleaving modes.", whyItMatters: "Low-order interleaving achieves pipelined memory access across modules.", prerequisites: "Binary addressing.", whatToStudy: "Chip configuration: $2^k \\times w$; number of chips = Total Capacity / Chip Capacity.", whatNotToStudy: "DRAM refresh circuitry.", successCondition: "Design memory modules using smaller memory chips and decode address lines." },
    learningResource: { provider: "Gate Smashers", title: "Memory Organization & Interleaving", url: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Memory Hierarchy PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 40, date: "2026-11-09", month: 2, monthName: "November", subject: "Computer Organization & Architecture", topic: "Cache Memory: Direct, Associative & Set-Associative Mapping", subtopics: ["Direct mapping: Tag, Line, Word offset", "Fully associative mapping: Tag, Word offset", "K-way Set-Associative mapping: Tag, Set, Word offset"], hours: 6,
    briefing: { mission: "Master the address bit breakdown for Direct, Fully Associative, and Set-Associative cache.", whyItMatters: "Guaranteed 2-mark question in EVERY GATE CS paper without exception.", prerequisites: "Memory hierarchy.", whatToStudy: "Address = Tag + Set Index + Offset; Tag Directory size = Lines * (Tag bits + Valid + Dirty).", whatNotToStudy: "Multi-core snooping cache protocols (MESI).", successCondition: "Calculate Tag, Set, and Offset bits in under 60 seconds given cache and block parameters." },
    learningResource: { provider: "Gate Smashers", title: "Cache Memory Mapping In-Depth", url: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Cache Mapping GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 12 }
  },
  { day: 41, date: "2026-11-10", month: 2, monthName: "November", subject: "Computer Organization & Architecture", topic: "Cache Policies & Average Memory Access Time (AMAT)", subtopics: ["Write-Through vs Write-Back", "LRU, FIFO, Optimal replacement policies", "Multi-level cache AMAT calculations"], hours: 6,
    briefing: { mission: "Calculate hierarchical AMAT: $T_1 + (1 - H_1)(T_2 + (1 - H_2)T_{mem})$.", whyItMatters: "AMAT equations with local vs global hit rates are frequent numerical traps.", prerequisites: "Cache mapping.", whatToStudy: "AMAT formula; Dirty bit requirement in write-back cache; LRU hit/miss simulation.", whatNotToStudy: "Non-blocking cache buffers.", successCondition: "Compute multi-level cache access time and simulate LRU block replacements without error." },
    learningResource: { provider: "Gate Smashers", title: "AMAT & Cache Write Policies", url: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Cache AMAT GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 42, date: "2026-11-11", month: 2, monthName: "November", subject: "Computer Organization & Architecture", topic: "Instruction Pipelining & Hazard Analysis", subtopics: ["Pipeline throughput, speedup & efficiency", "Structural, Data (RAW, WAR, WAW), Control hazards", "Operand forwarding and branch penalty stalls"], hours: 6,
    briefing: { mission: "Calculate pipeline execution clock cycles, speedup, and stall penalty cycles.", whyItMatters: "Instruction pipelining is tested every year with 2-mark questions.", prerequisites: "Instruction execution cycle.", whatToStudy: "Speedup = $\\frac{n \\cdot k}{k + n - 1}$; Read-After-Write (RAW) hazard resolution using forwarding.", whatNotToStudy: "Out-of-order Tomasulo execution.", successCondition: "Calculate total clock cycles required to execute a given assembly sequence with branch delays." },
    learningResource: { provider: "Gate Smashers", title: "Pipelining & Hazards In-Depth", url: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Pipelining GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 43, date: "2026-11-12", month: 2, monthName: "November", subject: "Computer Organization & Architecture", topic: "I/O Interface, Interrupts & DMA", subtopics: ["Programmed I/O vs Interrupt-driven I/O", "Direct Memory Access (DMA) cycle stealing vs burst mode", "DMA transfer time and bus utilization calculations"], hours: 6, isTest: true,
    briefing: { mission: "Calculate percentage CPU time consumed during interrupt servicing and DMA transfers.", whyItMatters: "DMA numerical questions appear regularly in the 1-2 mark range.", prerequisites: "Memory hierarchy.", whatToStudy: "Cycle stealing: percentage time bus is idle; interrupt latency and vector tables.", whatNotToStudy: "PCIe physical signaling.", successCondition: "Calculate CPU slowdown and bus utilization during high-speed DMA transfers." },
    learningResource: { provider: "Gate Smashers", title: "DMA & Interrupts in COA", url: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "DMA & I/O GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },

  // Nov 13-19: DBMS
  { day: 44, date: "2026-11-13", month: 2, monthName: "November", subject: "Databases / DBMS", topic: "ER Modeling & Schema Mapping", subtopics: ["Entity sets, attributes, relationships", "Cardinality and participation constraints", "Mapping ER diagrams to minimum number of relational tables"], hours: 6,
    briefing: { mission: "Find the minimum number of relational tables needed to represent an ER diagram.", whyItMatters: "Counting minimum tables for 1:M, M:N, and weak entity relationships is a classic question.", prerequisites: "Basic database understanding.", whatToStudy: "Combining 1:M relationships into the 'Many' side table; weak entity key includes identifying owner's key.", whatNotToStudy: "Extended ER specialization hierarchies in detail.", successCondition: "Determine the exact minimum number of tables required for any given ER diagram." },
    learningResource: { provider: "Gate Smashers", title: "DBMS Roadmap: ER Model", url: "https://www.gatesmashers.com/roadmaps/dbms-sql", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "ER Model GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 45, date: "2026-11-14", month: 2, monthName: "November", subject: "Databases / DBMS", topic: "Relational Algebra & Relational Calculus", subtopics: ["Select, Project, Cartesian Product, Natural Join", "Set difference, Division operator", "Tuple Relational Calculus (TRC) safe expressions"], hours: 6,
    briefing: { mission: "Translate queries between Relational Algebra, SQL, and Tuple Relational Calculus.", whyItMatters: "The division operator ($\\div$) for 'Find students who enrolled in ALL courses' is a top GATE pattern.", prerequisites: "Set theory and relations.", whatToStudy: "Division operator equivalent; safe vs unsafe TRC expressions; Natural Join conditions.", whatNotToStudy: "Domain Relational Calculus in depth.", successCondition: "Determine the output of complex relational algebra join and division expressions." },
    learningResource: { provider: "Gate Smashers", title: "Relational Algebra In-Depth", url: "https://www.gatesmashers.com/roadmaps/dbms-sql", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Relational Algebra PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 46, date: "2026-11-15", month: 2, monthName: "November", subject: "Databases / DBMS", topic: "SQL Queries, Aggregates & Subqueries", subtopics: ["GROUP BY, HAVING vs WHERE clauses", "INNER, LEFT, RIGHT, FULL OUTER JOINS", "Correlated subqueries & NULL handling (3-valued logic)"], hours: 6,
    briefing: { mission: "Evaluate complex SQL queries with GROUP BY, HAVING, and correlated subqueries.", whyItMatters: "Subtle SQL questions involving NULL values and aggregate function rules appear every year.", prerequisites: "Relational Algebra.", whatToStudy: "COUNT(*) vs COUNT(column); 3-valued logic (TRUE, FALSE, UNKNOWN); uncorrelated vs correlated subqueries.", whatNotToStudy: "Triggers and stored procedures.", successCondition: "Predict the exact table output and row count for nested SQL queries." },
    learningResource: { provider: "Gate Smashers", title: "SQL Queries & Joins", url: "https://www.gatesmashers.com/roadmaps/dbms-sql", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "SQL Queries GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 47, date: "2026-11-16", month: 2, monthName: "November", subject: "Databases / DBMS", topic: "Functional Dependencies & Attribute Closure", subtopics: ["Armstrong axioms (Sound & Complete)", "Computing attribute closure $X^+$", "Finding all Candidate Keys and Super Keys"], hours: 6,
    briefing: { mission: "Compute attribute closures and find all candidate keys systematically.", whyItMatters: "Finding candidate keys is the prerequisite for all normalization questions.", prerequisites: "Relational model.", whatToStudy: "Systematic algorithm to find Candidate Keys; minimal cover (canonical cover) computation.", whatNotToStudy: "Multi-valued dependencies (4NF).", successCondition: "Identify all candidate keys of any relation with up to 6 attributes in under 2 minutes." },
    learningResource: { provider: "Gate Smashers", title: "Functional Dependencies & Keys", url: "https://www.gatesmashers.com/roadmaps/dbms-sql", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Candidate Keys & FD PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 48, date: "2026-11-17", month: 2, monthName: "November", subject: "Databases / DBMS", topic: "Normalization: 1NF, 2NF, 3NF, BCNF", subtopics: ["Lossless join decomposition test ($R_1 \\cap R_2 \\to R_1$ or $R_2$)", "Dependency preservation test", "Determining highest normal form of a relation"], hours: 6,
    briefing: { mission: "Determine the highest normal form of a schema and verify lossless join decomposition.", whyItMatters: "Normalization is tested in EVERY GATE CS paper. Guaranteed marks if rules are followed.", prerequisites: "Candidate keys and attribute closure.", whatToStudy: "3NF allows $X$ is superkey OR $Y$ is prime attribute; BCNF requires $X$ is superkey; Lossless join check.", whatNotToStudy: "5NF or Domain-Key normal form.", successCondition: "Correctly classify any schema into 1NF, 2NF, 3NF, or BCNF and prove lossless join." },
    learningResource: { provider: "Gate Smashers", title: "Normalization: 1NF to BCNF", url: "https://www.gatesmashers.com/roadmaps/dbms-sql", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Normalization GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 12 }
  },
  { day: 49, date: "2026-11-18", month: 2, monthName: "November", subject: "Databases / DBMS", topic: "Transactions, ACID Properties & Serializability", subtopics: ["Conflict serializability and Precedence Graph testing", "View serializability & blind writes", "Recoverable, Cascadeless, and Strict schedules"], hours: 6,
    briefing: { mission: "Draw precedence graphs to detect conflict serializability and test recoverability.", whyItMatters: "Testing whether a concurrent schedule is conflict serializable is a guaranteed 2-mark question.", prerequisites: "Relational transactions.", whatToStudy: "Conflict operations (Read-Write, Write-Read, Write-Write on same item); topological sort for serial order.", whatNotToStudy: "Distributed 2-phase commit protocols.", successCondition: "Determine conflict serializability and serial schedule order in under 2 minutes." },
    learningResource: { provider: "Gate Smashers", title: "Transactions & Serializability", url: "https://www.gatesmashers.com/roadmaps/dbms-sql", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Serializability GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 50, date: "2026-11-19", month: 2, monthName: "November", subject: "Databases / DBMS", topic: "Concurrency Control & Indexing (B/B+ Trees)", subtopics: ["Two-Phase Locking (2PL), Strict 2PL, Rigorous 2PL", "B-Tree and B+ Tree node order, keys, pointers", "Maximum and minimum keys in B/B+ trees of order $m$"], hours: 6, isTest: true,
    briefing: { mission: "Calculate maximum/minimum keys and record pointer capacities for B/B+ trees.", whyItMatters: "B/B+ tree node structure and order calculations are tested almost every year.", prerequisites: "Binary search trees and file systems.", whatToStudy: "Order $p$ definition; block size formula: $p \\times \\text{ptr} + (p-1) \\times \\text{key} \\le \\text{BlockSize}$; 2PL guarantees conflict serializability.", whatNotToStudy: "Dynamic hashing extensible hash tables.", successCondition: "Calculate tree order, height, and maximum stored records given disk block parameters." },
    learningResource: { provider: "Gate Smashers", title: "B/B+ Trees & Concurrency Control", url: "https://www.gatesmashers.com/roadmaps/dbms-sql", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "B/B+ Trees GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },

  // Nov 20-25: Operating Systems
  { day: 51, date: "2026-11-20", month: 2, monthName: "November", subject: "Operating Systems", topic: "Processes, Threads & System Calls", subtopics: ["Process state transition diagram & PCB", "fork() system call tree calculations", "User level threads vs Kernel level threads"], hours: 6,
    briefing: { mission: "Calculate exact number of child processes and printed outputs for nested fork() trees.", whyItMatters: "Code questions containing loops with fork() calls are standard GATE fare.", prerequisites: "C Programming functions.", whatToStudy: "$2^n - 1$ child processes for $n$ consecutive fork()s; user vs kernel thread context switch cost.", whatNotToStudy: "Linux kernel source architecture.", successCondition: "Draw process trees and calculate exact output counts for programs with fork() system calls." },
    learningResource: { provider: "Gate Smashers", title: "OS Roadmap: Processes & Threads", url: "https://www.gatesmashers.com/roadmaps/operating-systems", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Processes & fork() PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 52, date: "2026-11-21", month: 2, monthName: "November", subject: "Operating Systems", topic: "CPU Scheduling Algorithms", subtopics: ["FCFS, SJF, Shortest Remaining Time First (SRTF)", "Round Robin scheduling with time quantum", "Calculating Turnaround Time (TAT) and Waiting Time (WT)"], hours: 6,
    briefing: { mission: "Draw Gantt charts and calculate average turnaround time and waiting time accurately.", whyItMatters: "SRTF and Round Robin scheduling numericals appear almost every year.", prerequisites: "Process states and ready queues.", whatToStudy: "Gantt chart construction; tie-breaking rules; Round Robin ready queue insertion order.", whatNotToStudy: "Multi-processor real-time scheduling (EDF).", successCondition: "Draw Gantt charts and compute average WT and TAT with zero calculation errors." },
    learningResource: { provider: "Gate Smashers", title: "CPU Scheduling In-Depth", url: "https://www.gatesmashers.com/roadmaps/operating-systems", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "CPU Scheduling GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 53, date: "2026-11-22", month: 2, monthName: "November", subject: "Operating Systems", topic: "Process Synchronization & Semaphores", subtopics: ["Critical Section: Mutual Exclusion, Progress, Bounded Waiting", "Peterson's Algorithm proof", "Counting and Binary Semaphores (Wait/Signal)"], hours: 6,
    briefing: { mission: "Trace semaphore values and prove mutual exclusion and progress for concurrent code.", whyItMatters: "Classic Producer-Consumer, Reader-Writer, and custom semaphore code tracing are top GATE patterns.", prerequisites: "Processes and threads.", whatToStudy: "Semaphores: wait() decrements, signal() increments; analyzing whether deadlocks can occur.", whatNotToStudy: "Hardware atomic instructions like Compare-And-Swap.", successCondition: "Determine whether given concurrent processes satisfy mutual exclusion, progress, and bounded waiting." },
    learningResource: { provider: "Gate Smashers", title: "Synchronization & Semaphores", url: "https://www.gatesmashers.com/roadmaps/operating-systems", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Semaphores GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 54, date: "2026-11-23", month: 2, monthName: "November", subject: "Operating Systems", topic: "Deadlocks: Necessary Conditions & Banker's Algorithm", subtopics: ["4 Coffman conditions for deadlock", "Resource Allocation Graph (RAG) and cycle detection", "Banker's Algorithm for deadlock avoidance (Need = Max - Alloc)"], hours: 6,
    briefing: { mission: "Execute Banker's Algorithm to find safe sequences and determine deadlock-free resource bounds.", whyItMatters: "Formula: $\\sum (\\text{MaxNeed}_i - 1) + 1$ guarantees deadlock freedom for single resource type.", prerequisites: "Process synchronization.", whatToStudy: "Safe state vs deadlock state; Banker's algorithm matrix calculations; single vs multi-unit resource graphs.", whatNotToStudy: "Deadlock recovery mechanisms in distributed databases.", successCondition: "Determine whether a state is safe and find all valid execution sequences." },
    learningResource: { provider: "Gate Smashers", title: "Deadlocks & Banker's Algorithm", url: "https://www.gatesmashers.com/roadmaps/operating-systems", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Deadlocks GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 55, date: "2026-11-24", month: 2, monthName: "November", subject: "Operating Systems", topic: "Memory Management, Paging & TLB", subtopics: ["Logical to physical address translation", "Page table size calculations & Multi-level paging", "Translation Lookaside Buffer (TLB) and Effective Memory Access Time (EMAT)"], hours: 6,
    briefing: { mission: "Calculate page table sizes and effective memory access time with TLB.", whyItMatters: "Multi-level paging address breakdown (Outer page | Inner page | Offset) is a guaranteed numerical.", prerequisites: "Binary memory addressing.", whatToStudy: "Page size determines offset bits; $\\text{EMAT} = H \\cdot (t_{tlb} + t_{mem}) + (1-H)(t_{tlb} + (k+1)t_{mem})$.", whatNotToStudy: "Inverted page table hashing collisions.", successCondition: "Calculate exact multi-level page table size and EMAT given system specifications." },
    learningResource: { provider: "Gate Smashers", title: "Paging, TLB & Multi-Level Paging", url: "https://www.gatesmashers.com/roadmaps/operating-systems", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Paging & TLB GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 56, date: "2026-11-25", month: 2, monthName: "November", subject: "Operating Systems", topic: "Virtual Memory, Page Replacement & Disk Scheduling", subtopics: ["FIFO, Belady's Anomaly, Optimal, LRU page replacement", "Thrashing and Working Set Model", "Disk Scheduling: FCFS, SSTF, SCAN, C-SCAN"], hours: 6, isTest: true,
    briefing: { mission: "Count page faults for reference strings and calculate total disk arm head movement.", whyItMatters: "Belady's anomaly (more frames = more page faults in FIFO) is a frequent concept check.", prerequisites: "Paging and memory hierarchy.", whatToStudy: "LRU stack property (never suffers from Belady's anomaly); SCAN vs C-SCAN boundary cylinder handling.", whatNotToStudy: "RAID level 6 mathematics.", successCondition: "Count page faults for reference strings across FIFO, LRU, and Optimal algorithms accurately." },
    learningResource: { provider: "Gate Smashers", title: "Virtual Memory & Disk Scheduling", url: "https://www.gatesmashers.com/roadmaps/operating-systems", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Page Replacement GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },

  // Nov 26-30: Computer Networks
  { day: 57, date: "2026-11-26", month: 2, monthName: "November", subject: "Computer Networks", topic: "Layered Models & Data Link Layer Framing / Error Control", subtopics: ["OSI 7-layer vs TCP/IP model responsibilities", "Framing & Bit/Byte stuffing", "Cyclic Redundancy Check (CRC) polynomial division"], hours: 6,
    briefing: { mission: "Perform CRC polynomial division and identify layer-specific protocols and header encapsulation.", whyItMatters: "CRC modulo-2 division is a frequent 2-mark numerical problem in GATE.", prerequisites: "Binary polynomial arithmetic.", whatToStudy: "CRC generator polynomial division; bit stuffing (insert 0 after five consecutive 1s).", whatNotToStudy: "ATM networks or physical transmission line impedance.", successCondition: "Compute transmitted codeword and verify received error detection via CRC." },
    learningResource: { provider: "Gate Smashers", title: "CN Roadmap: Data Link Layer & CRC", url: "https://www.gatesmashers.com/roadmaps/computer-networks", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "CRC & Data Link GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 58, date: "2026-11-27", month: 2, monthName: "November", subject: "Computer Networks", topic: "Flow Control: Sliding Window Protocols", subtopics: ["Stop and Wait efficiency $\\eta = \\frac{1}{1 + 2a}$", "Go-Back-N protocol window size $W_s = 2^k - 1, W_r = 1$", "Selective Repeat protocol window size $W_s = W_r = 2^{k-1}$"], hours: 6,
    briefing: { mission: "Master sliding window efficiency, throughput, and sequence number formulas.", whyItMatters: "Guaranteed 2-mark numerical problem in EVERY GATE CS exam without fail.", prerequisites: "Propagation time $T_p$ and Transmission time $T_t$.", whatToStudy: "$a = T_p / T_t$; minimum sequence bits: $N \\le 2^k$; throughput = $\\eta \\times \\text{Bandwidth}$.", whatNotToStudy: "HDLC frame format specifics.", successCondition: "Calculate maximum utilization and required sequence bits for GBN and Selective Repeat in under 2 minutes." },
    learningResource: { provider: "Gate Smashers", title: "Sliding Window Protocols In-Depth", url: "https://www.gatesmashers.com/roadmaps/computer-networks", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Sliding Window GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 59, date: "2026-11-28", month: 2, monthName: "November", subject: "Computer Networks", topic: "MAC Layer: ALOHA, CSMA/CD & Ethernet", subtopics: ["Pure ALOHA (18.4%) & Slotted ALOHA (36.8%) throughput", "CSMA/CD minimum frame length condition: $L \\ge 2 \\cdot T_p \\cdot B$", "Binary exponential backoff algorithm"], hours: 6,
    briefing: { mission: "Calculate minimum frame size in CSMA/CD to ensure collision detection before transmission ends.", whyItMatters: "Formula $L_{min} = 2 \\cdot T_p \\cdot \\text{Bandwidth}$ is tested repeatedly.", prerequisites: "Propagation delay and bandwidth.", whatToStudy: "Why sender must transmit for at least $2 T_p$; backoff interval after $k$ collisions.", whatNotToStudy: "Wireless 802.11 CSMA/CA IFS timings.", successCondition: "Calculate minimum frame size or maximum cable distance for Ethernet networks." },
    learningResource: { provider: "Gate Smashers", title: "ALOHA, CSMA/CD & Ethernet", url: "https://www.gatesmashers.com/roadmaps/computer-networks", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "CSMA/CD & ALOHA GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 60, date: "2026-11-29", month: 2, monthName: "November", subject: "Computer Networks", topic: "Network Layer: IPv4, Subnetting, CIDR & Routing", subtopics: ["Classful addressing vs CIDR (/n notation)", "Subnet mask, Network ID, Broadcast ID calculations", "Longest Prefix Match in router forwarding tables"], hours: 6,
    briefing: { mission: "Master CIDR block partitioning and router Longest Prefix Match forwarding.", whyItMatters: "Subnetting and longest prefix matching appear in almost every GATE exam.", prerequisites: "Binary IP representation.", whatToStudy: "Block size in octet $= 2^{32-n}$; usable hosts $= 2^{32-n} - 2$; Distance Vector count-to-infinity.", whatNotToStudy: "BGP path attribute details.", successCondition: "Determine matching outgoing interface for incoming IP packet using Longest Prefix Match." },
    learningResource: { provider: "Gate Smashers", title: "IPv4 Subnetting & CIDR Roadmap", url: "https://www.gatesmashers.com/roadmaps/computer-networks", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Subnetting & CIDR GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 12 }
  },
  { day: 61, date: "2026-11-30", month: 2, monthName: "November", subject: "Computer Networks", topic: "Transport Layer: TCP, Congestion Control & Month 2 Review", subtopics: ["TCP 3-way handshake & connection teardown", "TCP Congestion Control: Slow Start, Congestion Avoidance, Fast Retransmit", "Month 2 Core Systems Comprehensive Review"], hours: 6, isTest: true,
    briefing: { mission: "Trace TCP congestion window size across transmission rounds (Slow Start vs Additive Increase).", whyItMatters: "Calculating window size after threshold or packet loss is a classic 2-mark problem.", prerequisites: "Network layer and sliding windows.", whatToStudy: "Threshold set to $\\text{cwnd}/2$ on timeout; cwnd drops to 1 MSS (Tahoe) vs halves (Reno); UDP vs TCP headers.", whatNotToStudy: "TLS cryptographic handshakes.", successCondition: "Calculate exact TCP congestion window size after $N$ RTTs including timeout and duplicate ACK events." },
    learningResource: { provider: "Gate Smashers", title: "TCP Congestion Control & Transport", url: "https://www.gatesmashers.com/roadmaps/computer-networks", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "TCP Congestion Control PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },

  // MONTH 3: THEORY + COMPLETION + CONSOLIDATION (December 1 - 29)
  // Dec 1-6: Theory of Computation
  { day: 62, date: "2026-12-01", month: 3, monthName: "December", subject: "Theory of Computation", topic: "DFA Design & State Minimization", subtopics: ["DFA formal definition $(Q, \\Sigma, \\delta, q_0, F)$", "Designing DFAs for modulo, substring, and prefix conditions", "Myhill-Nerode theorem and DFA state minimization"], hours: 6,
    briefing: { mission: "Design minimum-state DFAs for given regular language constraints.", whyItMatters: "Minimum number of states to accept strings ending in '01' or modulo $k$ is a classic question.", prerequisites: "Set theory and relations.", whatToStudy: "Table-filling state minimization algorithm; product automata for union and intersection.", whatNotToStudy: "Two-way finite automata.", successCondition: "Determine minimum number of states in a DFA accepting given string conditions." },
    learningResource: { provider: "Gate Smashers", title: "TOC Roadmap: DFA Design", url: "https://www.gatesmashers.com/roadmaps/theory-of-computation", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "DFA Design GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 63, date: "2026-12-02", month: 3, monthName: "December", subject: "Theory of Computation", topic: "NFA, epsilon-NFA & Regular Expressions", subtopics: ["Subset construction algorithm (NFA to DFA)", "Regular expression identities (Arden's Theorem)", "Closure properties of regular languages"], hours: 6,
    briefing: { mission: "Convert NFAs to DFAs and apply Arden's theorem for regular expressions.", whyItMatters: "NFA with $n$ states can result in at most $2^n$ states in DFA.", prerequisites: "DFA concepts.", whatToStudy: "$\\epsilon$-closures; Arden theorem $R = Q + RP \\implies R = QP^*$; regular language closure under complement, reverse, star.", whatNotToStudy: "Generalized transition networks.", successCondition: "Convert regular expressions to equivalent finite automata and vice-versa." },
    learningResource: { provider: "Gate Smashers", title: "NFA, Regex & Arden's Theorem", url: "https://www.gatesmashers.com/roadmaps/theory-of-computation", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "NFA & Regex GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 64, date: "2026-12-03", month: 3, monthName: "December", subject: "Theory of Computation", topic: "Pumping Lemma & Regular Language Identification", subtopics: ["Pumping Lemma for regular languages", "Proving languages non-regular using pumping lemma", "Counting vs memory limitations of finite automata"], hours: 6,
    briefing: { mission: "Prove non-regularity for languages requiring counting ($L = \\{a^n b^n\\}$).", whyItMatters: "Given 4 language definitions, which one is regular? This is a guaranteed 2-mark question.", prerequisites: "Regular languages and DFAs.", whatToStudy: "Pumping lemma conditions: $w = xyz, |xy| \\le p, |y| \\ge 1$; why finite bounds keep languages regular.", whatNotToStudy: "Pumping lemma for context-sensitive languages.", successCondition: "Classify any language into regular vs non-regular in under 60 seconds." },
    learningResource: { provider: "Gate Smashers", title: "Pumping Lemma & Language Checks", url: "https://www.gatesmashers.com/roadmaps/theory-of-computation", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Pumping Lemma GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 65, date: "2026-12-04", month: 3, monthName: "December", subject: "Theory of Computation", topic: "Context-Free Grammars (CFG) & Ambiguity", subtopics: ["CFG derivations, parse trees, leftmost vs rightmost", "Ambiguous grammars & inherently ambiguous languages", "Chomsky Normal Form (CNF) parsing length bounds"], hours: 6,
    briefing: { mission: "Detect grammar ambiguity and parse tree derivations.", whyItMatters: "If a grammar generates 2 distinct parse trees for the same string, it is ambiguous.", prerequisites: "Grammar definitions.", whatToStudy: "Inherent ambiguity; CNF: derivations for string of length $n$ take $2n - 1$ steps.", whatNotToStudy: "CYK algorithm matrix computation.", successCondition: "Prove grammar ambiguity by constructing two distinct leftmost derivations for a string." },
    learningResource: { provider: "Gate Smashers", title: "CFG & Grammar Ambiguity", url: "https://www.gatesmashers.com/roadmaps/theory-of-computation", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "CFG & Ambiguity GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 66, date: "2026-12-05", month: 3, monthName: "December", subject: "Theory of Computation", topic: "Pushdown Automata (PDA) & CFL Closure Properties", subtopics: ["Deterministic PDA (DPDA) vs Non-Deterministic PDA (NPDA)", "DCFL vs CFL distinctions", "Closure properties of CFLs (Closed under union, concatenation, star; NOT closed under intersection, complement)"], hours: 6,
    briefing: { mission: "Master the closure table of CFLs and understand the power of DPDA vs NPDA.", whyItMatters: "CFLs are NOT closed under intersection or complement—a top GATE question pattern.", prerequisites: "CFGs and stack mechanisms.", whatToStudy: "DCFLs are closed under complement, but not union; intersection of CFL with Regular is always CFL.", whatNotToStudy: "Multi-stack PDAs (equivalent to Turing machines).", successCondition: "State the closure result of combining languages across the Chomsky hierarchy." },
    learningResource: { provider: "Gate Smashers", title: "Pushdown Automata & CFL Closures", url: "https://www.gatesmashers.com/roadmaps/theory-of-computation", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "PDA & CFL Closures PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 67, date: "2026-12-06", month: 3, monthName: "December", subject: "Theory of Computation", topic: "Turing Machines, Decidability & Halting Problem", subtopics: ["Turing Machine formal definition", "Recursive (Decidable) vs Recursively Enumerable (RE / Semi-decidable)", "Undecidability proofs, Halting Problem, and Rice's Theorem"], hours: 6, isTest: true,
    briefing: { mission: "Master Rice's Theorem to determine undecidability of language properties.", whyItMatters: "Rice's Theorem: ANY non-trivial semantic property of RE languages is undecidable.", prerequisites: "Chomsky Hierarchy.", whatToStudy: "Decidability table across Regular, CFL, DCFL, CSL, Recursive, RE; Halting problem reduction.", whatNotToStudy: "Post Correspondence Problem (PCP) deep proofs.", successCondition: "Apply Rice's Theorem to classify decision problems as decidable or undecidable." },
    learningResource: { provider: "Gate Smashers", title: "Turing Machines & Decidability", url: "https://www.gatesmashers.com/roadmaps/theory-of-computation", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Decidability GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },

  // Dec 7-11: Compiler Design
  { day: 68, date: "2026-12-07", month: 3, monthName: "December", subject: "Compiler Design", topic: "Lexical Analysis & Tokenization", subtopics: ["Tokens, Patterns, Lexemes differentiation", "Handling whitespace, comments, and longest match rule", "Counting tokens in C program snippets"], hours: 6,
    briefing: { mission: "Accurately count tokens in C snippets without counting comments or preprocessor directives.", whyItMatters: "Token counting in C code snippets appears every alternate year.", prerequisites: "C Programming syntax and regular expressions.", whatToStudy: "Token definition: keywords, identifiers, constants, string literals, operators, punctuation.", whatNotToStudy: "Lex/Flex source code specification syntax.", successCondition: "Count the exact number of tokens in any given C function snippet." },
    learningResource: { provider: "Gate Smashers", title: "Compiler Design: Lexical Analysis", url: "https://www.gatesmashers.com/roadmaps/compiler-design", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Lexical Analysis GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 69, date: "2026-12-08", month: 3, monthName: "December", subject: "Compiler Design", topic: "Top-Down Parsing: FIRST & FOLLOW Sets, LL(1)", subtopics: ["Computing FIRST and FOLLOW sets systematically", "LL(1) parsing table construction", "Eliminating left recursion and left factoring"], hours: 6,
    briefing: { mission: "Compute FIRST and FOLLOW sets with 100% accuracy and verify LL(1) grammar condition.", whyItMatters: "FIRST & FOLLOW computations are required for both top-down and bottom-up parsing.", prerequisites: "Context-free grammars.", whatToStudy: "Rules for $\\epsilon$ propagation in FIRST; FOLLOW never contains $\\epsilon$; LL(1) conflict if table has multiple entries.", whatNotToStudy: "Recursive descent parser C implementation.", successCondition: "Compute FIRST and FOLLOW sets for any grammar in under 2 minutes." },
    learningResource: { provider: "Gate Smashers", title: "FIRST, FOLLOW & LL(1) Parsing", url: "https://www.gatesmashers.com/roadmaps/compiler-design", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "LL(1) Parsing GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 70, date: "2026-12-09", month: 3, monthName: "December", subject: "Compiler Design", topic: "Bottom-Up Parsing: LR(0), SLR(1), LALR(1), CLR(1)", subtopics: ["Canonical LR(0) items collection", "Shift-Reduce and Reduce-Reduce conflicts", "Comparison of parser power: LR(0) < SLR(1) < LALR(1) < CLR(1)"], hours: 6,
    briefing: { mission: "Construct LR(0) item sets and classify grammars into SLR(1), LALR(1), and CLR(1).", whyItMatters: "Number of states in LALR(1) == Number of states in LR(0) < Number of states in CLR(1).", prerequisites: "FIRST and FOLLOW sets.", whatToStudy: "Shift-Reduce and Reduce-Reduce conflict conditions; LALR merges states with identical core items.", whatNotToStudy: "Operator precedence parsing.", successCondition: "Determine if a grammar has shift-reduce or reduce-reduce conflicts in LR(0) / SLR(1)." },
    learningResource: { provider: "Gate Smashers", title: "LR Parsing In-Depth", url: "https://www.gatesmashers.com/roadmaps/compiler-design", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "LR Parsers GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 71, date: "2026-12-10", month: 3, monthName: "December", subject: "Compiler Design", topic: "Syntax-Directed Translation (SDT)", subtopics: ["Synthesized vs Inherited attributes", "S-attributed definitions (bottom-up evaluable)", "L-attributed definitions (left-to-right top-down evaluable)"], hours: 6,
    briefing: { mission: "Distinguish S-attributed vs L-attributed definitions and evaluate attribute values.", whyItMatters: "Evaluating semantic actions during bottom-up parsing is a standard 2-mark question.", prerequisites: "Parse trees and LR parsing.", whatToStudy: "S-attributed uses only synthesized attributes; L-attributed allows inherited from parent or left siblings.", whatNotToStudy: "Type checking unification algorithms.", successCondition: "Evaluate the synthesized value at the root of a parse tree for an annotated grammar." },
    learningResource: { provider: "Gate Smashers", title: "Syntax Directed Translation (SDT)", url: "https://www.gatesmashers.com/roadmaps/compiler-design", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "SDT GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 72, date: "2026-12-11", month: 3, monthName: "December", subject: "Compiler Design", topic: "Intermediate Code & Code Optimization", subtopics: ["Three-Address Code (TAC), Quadruples, Triples", "Basic Blocks and Control Flow Graphs (CFG)", "Loop optimizations, dead code elimination, common subexpression elimination"], hours: 6, isTest: true,
    briefing: { mission: "Partition TAC into basic blocks and identify dead code and loop invariants.", whyItMatters: "Counting leaders and basic blocks in a TAC snippet is a frequent 1-mark question.", prerequisites: "Control flow and TAC.", whatToStudy: "Leader identification rules (1st instruction, targets of jumps, instructions following jumps).", whatNotToStudy: "Register allocation via graph coloring.", successCondition: "Determine the exact number of basic blocks and edges in a Control Flow Graph." },
    learningResource: { provider: "Gate Smashers", title: "Intermediate Code & Optimization", url: "https://www.gatesmashers.com/roadmaps/compiler-design", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Code Optimization GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },

  // Dec 12-16: Engineering Mathematics remaining areas
  { day: 73, date: "2026-12-12", month: 3, monthName: "December", subject: "Engineering Mathematics", topic: "Calculus: Limits, Continuity & Differentiability", subtopics: ["L'Hopital's Rule for 0/0 and inf/inf indeterminate forms", "Continuity at a point", "Mean Value Theorems (Rolle's & Lagrange's MVT)"], hours: 6,
    briefing: { mission: "Evaluate limits using L'Hopital's rule and series expansions.", whyItMatters: "Direct 1-2 mark questions on limits appear consistently.", prerequisites: "Basic differentiation.", whatToStudy: "L'Hopital's rule; handling $1^\\infty$ and $0^0$ by taking logarithms.", whatNotToStudy: "Multiple integrals or vector calculus (not in GATE CS).", successCondition: "Evaluate indeterminate limits in under 90 seconds." },
    learningResource: { provider: "Gate Smashers", title: "Calculus: Limits & MVT", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Calculus Limits GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 74, date: "2026-12-13", month: 3, monthName: "December", subject: "Engineering Mathematics", topic: "Calculus: Maxima, Minima & Definite Integrals", subtopics: ["First and Second derivative tests for local extrema", "Global maxima and minima on closed intervals", "Properties of definite integrals"], hours: 6,
    briefing: { mission: "Find maxima and minima of single-variable functions on closed intervals.", whyItMatters: "Checking boundary endpoints in closed intervals $[a, b]$ is the most common student omission.", prerequisites: "Differentiation rules.", whatToStudy: "Critical points where $f'(x) = 0$; comparing critical values with endpoints $f(a)$ and $f(b)$.", whatNotToStudy: "Differential equations (removed from GATE CS syllabus).", successCondition: "Determine global maximum and minimum values on a closed interval." },
    learningResource: { provider: "Gate Smashers", title: "Maxima, Minima & Integrals", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Calculus Extrema GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 8 }
  },
  { day: 75, date: "2026-12-14", month: 3, monthName: "December", subject: "Discrete Mathematics", topic: "Graph Theory: Fundamentals, Paths & Degrees", subtopics: ["Handshaking Lemma: $\\sum \\text{deg}(v) = 2|E|$", "Bipartite graphs & 2-colorability ($K_{m,n}$)", "Eulerian and Hamiltonian graphs"], hours: 6,
    briefing: { mission: "Apply Handshaking lemma and verify bipartite and Eulerian conditions.", whyItMatters: "A graph is bipartite if and only if it contains NO odd-length cycles.", prerequisites: "Sets and relations.", whatToStudy: "Handshaking lemma; Eulerian path condition (at most 2 odd-degree vertices); complete bipartite graph edges.", whatNotToStudy: "Planar graph four-color theorem proofs.", successCondition: "Determine if a graph is Eulerian, Hamiltonian, or bipartite from its degree sequence." },
    learningResource: { provider: "Gate Smashers", title: "Graph Theory Roadmap", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Graph Theory GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 76, date: "2026-12-15", month: 3, monthName: "December", subject: "Discrete Mathematics", topic: "Graph Theory: Planarity, Trees & Chromatic Number", subtopics: ["Euler's planar formula: $V - E + F = 2$", "Maximum edges in planar graphs: $E \\le 3V - 6$", "Spanning trees, Cayley's formula $n^{n-2}$, Chromatic number"], hours: 6,
    briefing: { mission: "Use Euler's formula $V - E + F = 2$ and Kuratowski's theorem ($K_5, K_{3,3}$) for planarity.", whyItMatters: "Planar graph edge bounds are tested directly in NAT format.", prerequisites: "Basic graph properties.", whatToStudy: "Planar graph conditions; chromatic number of trees (2), odd cycles (3), even cycles (2).", whatNotToStudy: "Topological graph embeddings.", successCondition: "Calculate number of faces in a planar graph and test planarity." },
    learningResource: { provider: "Gate Smashers", title: "Planar Graphs & Spanning Trees", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "Planar Graphs GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  },
  { day: 77, date: "2026-12-16", month: 3, monthName: "December", subject: "General Aptitude", topic: "General Aptitude: Comprehensive Speed Revision", subtopics: ["Spatial reasoning & paper folding", "Time & work, pipes & cisterns", "Reading comprehension speed-drills"], hours: 6, isTest: true,
    briefing: { mission: "Maximize your 15 fixed marks in General Aptitude.", whyItMatters: "GA has the highest return on investment: 15 marks out of 100 with lower conceptual overhead.", prerequisites: "High school arithmetic and English.", whatToStudy: "Spatial reasoning rotation rules; work-rate reciprocals; grammar error detection.", whatNotToStudy: "Extensive dictionary memorization.", successCondition: "Score at least 12/15 on a timed 10-question GA test." },
    learningResource: { provider: "Gate Smashers", title: "General Aptitude Library", url: "https://www.gatesmashers.com/learn", timeMin: 90 },
    pyqResource: { provider: "GATEOverflow", title: "General Aptitude GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 15 }
  },

  // Dec 17-22: Subject revision + high-frequency PYQs
  { day: 78, date: "2026-12-17", month: 3, monthName: "December", subject: "Full Revision", topic: "High-Yield Revision 1: Programming & Data Structures", subtopics: ["Pointers, recursion, stack expression evaluation", "BST, AVL, Heap operations blitz", "Re-solving all Class B & C mistakes from Month 1"], hours: 6,
    briefing: { mission: "Re-solve every Programming & DSA question you missed or solved slowly in Month 1.", whyItMatters: "Month 3 rule: Focus heavily on B + C + D questions from your previous attempts.", prerequisites: "Month 1 logs.", whatToStudy: "Review Error Book folder 01_C_PROGRAMMING and 02_DATA_STRUCTURES.", whatNotToStudy: "Do not watch long introductory lectures.", successCondition: "Re-attempt and correctly solve 15 previously missed DSA questions." },
    learningResource: { provider: "Gate Smashers", title: "DSA Quick Revision", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 60 },
    pyqResource: { provider: "GATEOverflow", title: "DSA High-Yield PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 15 }
  },
  { day: 79, date: "2026-12-18", month: 3, monthName: "December", subject: "Full Revision", topic: "High-Yield Revision 2: Algorithms & Discrete Math", subtopics: ["Master theorem, sorting stability, Huffman coding", "Logic, relation counting, graph planarity", "Re-solving Class B & C mistakes"], hours: 6,
    briefing: { mission: "Consolidate Algorithms and Discrete Math numerical formulas.", whyItMatters: "Algorithms and Discrete Math constitute ~16 marks combined.", prerequisites: "Error Book folders 03 & 04.", whatToStudy: "Formula flashcards; graph theory formulas; recurrence bounds.", whatNotToStudy: "Do not restart chapters from scratch.", successCondition: "Achieve 80%+ accuracy on a 15-question mixed Algo/DM set." },
    learningResource: { provider: "Gate Smashers", title: "Algorithms Roadmap", url: "https://www.gatesmashers.com/roadmaps/design-and-analysis-of-algorithms", timeMin: 60 },
    pyqResource: { provider: "GATEOverflow", title: "Algorithms GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 15 }
  },
  { day: 80, date: "2026-12-19", month: 3, monthName: "December", subject: "Full Revision", topic: "High-Yield Revision 3: Digital Logic & COA", subtopics: ["K-Maps, float IEEE 754, counters", "Cache mapping, AMAT, pipeline speedup", "Error Book repairs in folders 06 & 07"], hours: 6,
    briefing: { mission: "Master numerical speed in Cache AMAT, Pipeline stalls, and K-Map minimization.", whyItMatters: "COA and Digital Logic are numerical-heavy; speed under pressure is essential.", prerequisites: "Error Book folders 06 & 07.", whatToStudy: "Cache address breakdown formulas; pipeline branch penalty equations.", whatNotToStudy: "Theoretical history of microprocessors.", successCondition: "Solve 10 mixed COA/DL numerical questions without referring to notes." },
    learningResource: { provider: "Gate Smashers", title: "COA Roadmap", url: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture", timeMin: 60 },
    pyqResource: { provider: "GATEOverflow", title: "COA & Digital Logic PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 15 }
  },
  { day: 81, date: "2026-12-20", month: 3, monthName: "December", subject: "Full Revision", topic: "High-Yield Revision 4: DBMS & Operating Systems", subtopics: ["SQL joins, 3NF/BCNF, conflict serializability", "Scheduling Gantt charts, Banker's algorithm, TLB paging", "Error Book repairs in folders 08 & 09"], hours: 6,
    briefing: { mission: "Consolidate DBMS normalization and OS paging/scheduling calculations.", whyItMatters: "DBMS and OS are the twin pillars of core CS (~18 marks combined).", prerequisites: "Error Book folders 08 & 09.", whatToStudy: "Precedence graphs; EMAT formulas; normal form checklist.", whatNotToStudy: "Implementation code for database engines.", successCondition: "Correctly classify 5 normalization problems and 5 OS scheduling problems." },
    learningResource: { provider: "Gate Smashers", title: "DBMS & OS Roadmaps", url: "https://www.gatesmashers.com/roadmaps/dbms-sql", timeMin: 60 },
    pyqResource: { provider: "GATEOverflow", title: "DBMS & OS GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 15 }
  },
  { day: 82, date: "2026-12-21", month: 3, monthName: "December", subject: "Full Revision", topic: "High-Yield Revision 5: Computer Networks & TOC", subtopics: ["Sliding window efficiency, subnetting, CIDR", "DFA state minimization, pumping lemma, decidability", "Error Book repairs in folders 10 & 11"], hours: 6,
    briefing: { mission: "Consolidate Sliding Window protocols, CIDR subnetting, and TOC decidability.", whyItMatters: "Network formulas + TOC decidability table provide guaranteed quick marks.", prerequisites: "Error Book folders 10 & 11.", whatToStudy: "Sliding window formula $\\eta = \\frac{1}{1+2a}$; Decidability table.", whatNotToStudy: "Socket programming API calls.", successCondition: "Achieve 80%+ on mixed CN and TOC questions." },
    learningResource: { provider: "Gate Smashers", title: "CN & TOC Roadmaps", url: "https://www.gatesmashers.com/roadmaps/computer-networks", timeMin: 60 },
    pyqResource: { provider: "GATEOverflow", title: "CN & TOC GATE PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 15 }
  },
  { day: 83, date: "2026-12-22", month: 3, monthName: "December", subject: "Full Revision", topic: "High-Yield Revision 6: Compiler Design & Engg Math", subtopics: ["FIRST & FOLLOW sets, LL(1) / LR conflicts, SDT", "Eigenvalues, Bayes Theorem, Calculus limits", "Error Book repairs in folders 05 & 12"], hours: 6, isTest: true,
    briefing: { mission: "Final subject consolidation: Compiler parsing tables and Engineering Math shortcuts.", whyItMatters: "Completes 100% first-pass and second-pass coverage of the entire GATE syllabus.", prerequisites: "All subject notes.", whatToStudy: "FIRST/FOLLOW rules; Bayes Theorem; Eigenvalue trace/determinant shortcut.", whatNotToStudy: "Do NOT begin any new book.", successCondition: "Verify that all 12 subject cheat sheets are ready." },
    learningResource: { provider: "Gate Smashers", title: "Compiler & Math Roadmaps", url: "https://www.gatesmashers.com/roadmaps/compiler-design", timeMin: 60 },
    pyqResource: { provider: "GATEOverflow", title: "Compiler & Math PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 15 }
  },

  // Dec 23-25: Weak-topic repair
  { day: 84, date: "2026-12-23", month: 3, monthName: "December", subject: "Weak-Topic Repair", topic: "Targeted Weak-Topic Repair: Core Systems (COA, OS, DBMS)", subtopics: ["Repairing concepts where accuracy was < 60%", "Re-attempting 3-times repeated mistakes from Error Book", "One-on-one AI Coach diagnostics on stubborn doubts"], hours: 6,
    briefing: { mission: "Repair your worst core systems concepts. If you make the same mistake 3 times, fix it today.", whyItMatters: "Eliminating silly mistakes in familiar topics boosts marks faster than learning new chapters.", prerequisites: "Error Book repeat records.", whatToStudy: "Only your personal weak topics identified by the Analytics dashboard.", whatNotToStudy: "Do NOT re-read topics where your accuracy is already > 75%.", successCondition: "Successfully solve 3 questions in each of your top 2 weakest topics." },
    learningResource: { provider: "Gate Smashers", title: "Gate Smashers Learning Library", url: "https://www.gatesmashers.com/learn", timeMin: 60 },
    pyqResource: { provider: "GATEOverflow", title: "Targeted Topic PYQs on GATEOverflow", url: "https://gateoverflow.in/questions?sort=gate", target: 12 }
  },
  { day: 85, date: "2026-12-24", month: 3, monthName: "December", subject: "Weak-Topic Repair", topic: "Targeted Weak-Topic Repair: Programming, DSA & Algorithms", subtopics: ["Pointer arithmetic edge cases & recursion tracing", "Dynamic programming & graph algorithm complexities", "Error Book folder review"], hours: 6,
    briefing: { mission: "Eliminate recurring errors in Programming, DSA, and Algorithms.", whyItMatters: "Programming & DSA questions are scoring—every error eliminated directly protects 2 marks.", prerequisites: "Error Book records.", whatToStudy: "Trace pointer examples; review sorting stability edge cases.", whatNotToStudy: "Advanced competitive programming tricks.", successCondition: "Clear all unresolved items in 01_C_PROGRAMMING and 02_DATA_STRUCTURES." },
    learningResource: { provider: "Gate Smashers", title: "DSA Roadmap", url: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms", timeMin: 60 },
    pyqResource: { provider: "GATEOverflow", title: "DSA PYQs on GATEOverflow", url: "https://gateoverflow.in/questions?sort=gate", target: 12 }
  },
  { day: 86, date: "2026-12-25", month: 3, monthName: "December", subject: "Weak-Topic Repair", topic: "Targeted Weak-Topic Repair: Theory & Mathematics", subtopics: ["TOC state bounds & pumping lemma", "Probability distributions and linear system consistency", "Final Error Book reconciliation"], hours: 6, isTest: true,
    briefing: { mission: "Final weak-topic sweep across TOC, Compiler, and Engineering Math.", whyItMatters: "Ensures you enter the full 3-day mock phase with zero unaddressed doubts.", prerequisites: "Error Book folders 05, 11, 12.", whatToStudy: "Decidability table; Bayes theorem; LR conflict resolution.", whatNotToStudy: "Do not attempt new out-of-syllabus questions.", successCondition: "All Error Book entries marked as 'revising' or 'mastered'." },
    learningResource: { provider: "Gate Smashers", title: "TOC & Math Library", url: "https://www.gatesmashers.com/learn", timeMin: 60 },
    pyqResource: { provider: "GATEOverflow", title: "Math & TOC PYQs", url: "https://gateoverflow.in/questions?sort=gate", target: 12 }
  },

  // Dec 26-28: Full-length mock + analysis + revision
  { day: 87, date: "2026-12-26", month: 3, monthName: "December", subject: "Mock & Exam Simulation", topic: "Full-Length Mock 1 (3 Hours) + Detailed Diagnostic Analysis", subtopics: ["Full 65 Questions, 100 Marks, 3 Hours CBT Simulation", "Filling the 14-metric Mock Analysis Table", "Classifying Silly vs Concept mistakes"], hours: 6, isTest: true,
    briefing: { mission: "Simulate exact GATE conditions: 3 hours, no pauses, virtual calculator, strict environment.", whyItMatters: "Mock analysis is as important as the mock itself. Identify where time was wasted.", prerequisites: "Entire 90-day syllabus.", whatToStudy: "3 hours exam + 3 hours deep diagnostic mistake classification.", whatNotToStudy: "Do NOT look at solutions during the 3-hour test.", successCondition: "Complete the full 3 hours and fill out the Mock Analysis Table." },
    learningResource: { provider: "Official GATE", title: "GATE 2027 Pattern & Mock", url: "https://gate2027.iitm.ac.in/question_paper_pattern", timeMin: 30 },
    pyqResource: { provider: "GATEOverflow", title: "GATEOverflow 3-Hour Full Test", url: "https://db.gateoverflow.in/tests", target: 65 }
  },
  { day: 88, date: "2026-12-27", month: 3, monthName: "December", subject: "Mock & Exam Simulation", topic: "Full-Length Mock 2 (3 Hours) + Mistake Repair", subtopics: ["Full 65 Questions, 100 Marks, 3 Hours CBT Simulation", "Testing modified time allocation strategy (GA first vs CS first)", "Repairing concepts for questions missed"], hours: 6, isTest: true,
    briefing: { mission: "Test your adjusted time-allocation strategy in a second full 3-hour paper.", whyItMatters: "Fine-tune question skipping strategy: never get stuck on one 2-mark numerical for 8 minutes.", prerequisites: "Mock 1 analysis notes.", whatToStudy: "3 hours mock + 3 hours repair of missed questions.", whatNotToStudy: "Do NOT change your core preparation strategy now.", successCondition: "Improve accuracy and reduce time lost on silly mistakes compared to Mock 1." },
    learningResource: { provider: "Official GATE", title: "Official GATE Papers", url: "https://gate2027.iitm.ac.in/exam_papers_and_syllabus", timeMin: 30 },
    pyqResource: { provider: "GATEOverflow", title: "GATE Previous Official Papers", url: "https://gateoverflow.in/questions?sort=gate", target: 65 }
  },
  { day: 89, date: "2026-12-28", month: 3, monthName: "December", subject: "Mock & Exam Simulation", topic: "Full-Length Mock 3 (3 Hours) + Formula Speed-Drill", subtopics: ["Final 3-Hour CBT Simulation", "Quick-fire review of 12-subject formula cheat sheets", "Finalizing exam-day question selection protocol"], hours: 6, isTest: true,
    briefing: { mission: "Peak mental rehearsal: 3 hours full paper followed by formula sheet speed-drills.", whyItMatters: "Build calm confidence under time pressure. Know your strengths.", prerequisites: "Mocks 1 & 2.", whatToStudy: "3 hours mock + review high-yield formula sheets.", whatNotToStudy: "Do NOT study brand-new hard questions today.", successCondition: "Demonstrate steady pacing with zero time panic." },
    learningResource: { provider: "Gate Smashers", title: "Gate Smashers Final Revision Hub", url: "https://www.gatesmashers.com/learn", timeMin: 30 },
    pyqResource: { provider: "GATEOverflow", title: "GATE Full Paper Test", url: "https://db.gateoverflow.in/tests", target: 65 }
  },

  // Dec 29: 90-day final assessment and next-phase plan
  { day: 90, date: "2026-12-29", month: 3, monthName: "December", subject: "90-Day Master Milestone", topic: "Day 90 Master Assessment & Final Preparation Report", subtopics: ["Complete 90-Day Plan execution review", "Master Error Book full sweep", "Generating your official GATE Preparation Report"], hours: 6, isTest: true,
    briefing: { mission: "CELEBRATE YOUR 90-DAY JOURNEY: You have completed the 90-day master preparation!", whyItMatters: "You have built concepts from scratch, practiced PYQs, logged mistakes, and tested under CBT pressure.", prerequisites: "Days 1 to 89.", whatToStudy: "Read your Error Book observations; review key formulas; breathe.", whatNotToStudy: "Do NOT cram. Your foundation is built.", successCondition: "Export your GATE Preparation Report and enter the final revision phase with confidence." },
    learningResource: { provider: "Official GATE", title: "GATE 2027 Official Portal", url: "https://gate2027.iitm.ac.in/", timeMin: 30 },
    pyqResource: { provider: "GATEOverflow", title: "GATEOverflow Discussion Directory", url: "https://gateoverflow.in/questions?sort=gate", target: 10 }
  }
];

// Ensure all 90 days have complete task sets with explicit resource launchers
const fullPlan = scheduleBlueprint.map((item) => {
  const tasks = item.tasks || [
    {
      id: `d${item.day}-t1`,
      title: `Learn ${item.topic}`,
      type: "learning",
      estMinutes: 90,
      resourceUrl: item.learningResource?.url || "https://www.gatesmashers.com/learn",
      provider: item.learningResource?.provider || "Gate Smashers",
      isCore: true,
      completed: false
    },
    {
      id: `d${item.day}-t2`,
      title: `Write core concepts & formulas into personal notebook`,
      type: "notes",
      estMinutes: 20,
      isCore: true,
      completed: false
    },
    {
      id: `d${item.day}-t3`,
      title: `Solve basic worked examples & numerical derivations`,
      type: "practice",
      estMinutes: 60,
      resourceUrl: item.learningResource?.url || "https://www.gatesmashers.com/learn",
      isCore: true,
      completed: false
    },
    {
      id: `d${item.day}-t4`,
      title: `Solve ${item.pyqResource?.target || 8} GATE PYQs on GATEOverflow`,
      type: "pyq",
      estMinutes: 60,
      resourceUrl: item.pyqResource?.url || "https://gateoverflow.in/questions?sort=gate",
      provider: "GATEOverflow",
      targetCount: item.pyqResource?.target || 8,
      isCore: true,
      completed: false
    },
    {
      id: `d${item.day}-t5`,
      title: `AI Practice: Generate 5 fresh GATE-style questions`,
      type: "ai_practice",
      estMinutes: 40,
      isCore: false,
      completed: false
    },
    {
      id: `d${item.day}-t6`,
      title: `General Aptitude practice (Numerical / Verbal / Spatial)`,
      type: "aptitude",
      estMinutes: 30,
      isCore: true,
      completed: false
    },
    {
      id: `d${item.day}-t7`,
      title: `Daily Review: Log wrong answers into Error Book`,
      type: "review",
      estMinutes: 15,
      isCore: true,
      completed: false
    }
  ];

  return {
    dayNumber: item.day,
    date: item.date,
    month: item.month,
    monthName: item.monthName,
    subject: item.subject,
    topic: item.topic,
    subtopics: item.subtopics || [],
    plannedHours: item.hours || 6,
    briefing: item.briefing,
    learningResource: item.learningResource,
    pyqResource: item.pyqResource,
    isTestDay: !!item.isTest,
    tasks: tasks.map(t => ({ ...t, completed: false }))
  };
});

const outPath = path.join(__dirname, '..', 'data', 'gate', 'plan-90-days.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(fullPlan, null, 2), 'utf-8');
console.log(`Successfully generated exact 90-day manager data in ${outPath}`);
