const fs = require('fs');
const path = require('path');

// Raw 90-day mapping data strictly from the specification
const raw90DaysTable = [
  {
    day: 1,
    date: "2026-10-01",
    subject: "Programming & Data Structures",
    topic: "C Variables, Data Types & Operators",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+C+Variables%2C+Data+Types+%26+Operators",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/programming-in-c/programming/programming-in-c?sort=gate",
    pyqTitle: "GATEOverflow C Programming Previous GATE Questions"
  },
  {
    day: 2,
    date: "2026-10-02",
    subject: "Programming & Data Structures",
    topic: "Control Flow: Conditionals & Loops",
    videoStatus: "verified_direct",
    directUrl: "https://www.youtube.com/watch?v=E68uezDkQxc",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Control+Flow+Conditionals+Loops",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/programming-in-c/programming/programming-in-c?sort=gate",
    pyqTitle: "GATEOverflow C Programming Previous GATE Questions"
  },
  {
    day: 3,
    date: "2026-10-03",
    subject: "Programming & Data Structures",
    topic: "Functions, Scope & Storage Classes",
    videoStatus: "verified_direct",
    directUrl: "https://www.youtube.com/watch?v=jaiKkW2j2Wo",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Storage+Classes+in+C",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/programming-in-c/programming/programming-in-c?sort=gate",
    pyqTitle: "GATEOverflow C Programming Previous GATE Questions"
  },
  {
    day: 4,
    date: "2026-10-04",
    subject: "Programming & Data Structures",
    topic: "1D & 2D Arrays: Memory Layout & Addressing",
    videoStatus: "verified_direct",
    directUrl: "https://www.youtube.com/watch?v=6e6yKtr2VGI",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+1D+%26+2D+Arrays%3A+Memory+Layout+%26+Addressing",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/array",
    pyqTitle: "GATEOverflow Tag: Array"
  },
  {
    day: 5,
    date: "2026-10-05",
    subject: "Programming & Data Structures",
    topic: "Pointers & Pointer Arithmetic",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Pointers+%26+Pointer+Arithmetic",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/pointers",
    pyqTitle: "GATEOverflow Tag: Pointers"
  },
  {
    day: 6,
    date: "2026-10-06",
    subject: "Programming & Data Structures",
    topic: "Strings & Character Arrays",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Strings+%26+Character+Arrays",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/array",
    pyqTitle: "GATEOverflow Tag: Array"
  },
  {
    day: 7,
    date: "2026-10-07",
    subject: "Programming & Data Structures",
    topic: "Structures, Unions & Week 1 Review",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Structures%2C+Unions+%26+Week+1+Review",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/programming-in-c/programming/programming-in-c?sort=gate",
    pyqTitle: "GATEOverflow C Programming Previous GATE Questions"
  },
  {
    day: 8,
    date: "2026-10-08",
    subject: "Programming & Data Structures",
    topic: "Recursion & Call Stack Tracing",
    videoStatus: "verified_direct",
    directUrl: "https://www.youtube.com/watch?v=J4ucdS7uvls",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Recursion+%26+Call+Stack+Tracing",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/recursion",
    pyqTitle: "GATEOverflow Tag: Recursion"
  },
  {
    day: 9,
    date: "2026-10-09",
    subject: "Programming & Data Structures",
    topic: "Singly Linked Lists: Operations & Pointer Updates",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Singly+Linked+Lists%3A+Operations+%26+Pointer+Updates",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/linked-list",
    pyqTitle: "GATEOverflow Tag: Linked-List"
  },
  {
    day: 10,
    date: "2026-10-10",
    subject: "Programming & Data Structures",
    topic: "Doubly & Circular Linked Lists",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Doubly+%26+Circular+Linked+Lists",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/linked-list",
    pyqTitle: "GATEOverflow Tag: Linked-List"
  },
  {
    day: 11,
    date: "2026-10-11",
    subject: "Programming & Data Structures",
    topic: "Stacks: Operations, Infix to Postfix & Evaluation",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Stacks%3A+Operations%2C+Infix+to+Postfix+%26+Evaluation",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/stack",
    pyqTitle: "GATEOverflow Tag: Stack"
  },
  {
    day: 12,
    date: "2026-10-12",
    subject: "Programming & Data Structures",
    topic: "Stack Applications: Permutations & Two-Stack Tricks",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Stack+Applications%3A+Permutations+%26+Two-Stack+Tricks",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/stack",
    pyqTitle: "GATEOverflow Tag: Stack"
  },
  {
    day: 13,
    date: "2026-10-13",
    subject: "Programming & Data Structures",
    topic: "Queues, Circular Queues & Priority Queues",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Queues%2C+Circular+Queues+%26+Priority+Queues",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/queue",
    pyqTitle: "GATEOverflow Tag: Queue"
  },
  {
    day: 14,
    date: "2026-10-14",
    subject: "Programming & Data Structures",
    topic: "Linear Data Structures Review & Timed Test",
    videoStatus: "test_resource",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Linear+Data+Structures+Review+%26+Timed+Test",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/programming-in-c/programming/programming-in-c?sort=gate",
    pyqTitle: "GATEOverflow Linear DSA Previous GATE Questions"
  },
  {
    day: 15,
    date: "2026-10-15",
    subject: "Algorithms",
    topic: "Asymptotic Notation: Big-O, Omega, Theta",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Asymptotic+Notation%3A+Big-O%2C+Omega%2C+Theta",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/design-and-analysis-of-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/asymptotic-notations",
    pyqTitle: "GATEOverflow Tag: Asymptotic Notations"
  },
  {
    day: 16,
    date: "2026-10-16",
    subject: "Algorithms",
    topic: "Recurrence Relations & Master Theorem",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Recurrence+Relations+%26+Master+Theorem",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/design-and-analysis-of-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/master-theorem",
    pyqTitle: "GATEOverflow Tag: Master Theorem"
  },
  {
    day: 17,
    date: "2026-10-17",
    subject: "Programming & Data Structures",
    topic: "Binary Trees & Tree Traversals",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Binary+Trees+%26+Tree+Traversals",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/binary-tree",
    pyqTitle: "GATEOverflow Tag: Binary Tree"
  },
  {
    day: 18,
    date: "2026-10-18",
    subject: "Programming & Data Structures",
    topic: "Binary Search Trees (BST) & AVL Trees",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Binary+Search+Trees+%28BST%29+%26+AVL+Trees",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/binary-search-tree",
    pyqTitle: "GATEOverflow Tag: Binary Search Tree"
  },
  {
    day: 19,
    date: "2026-10-19",
    subject: "Programming & Data Structures",
    topic: "Binary Heaps & Priority Queues",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Binary+Heaps+%26+Priority+Queues",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/binary-heap",
    pyqTitle: "GATEOverflow Tag: Binary Heap"
  },
  {
    day: 20,
    date: "2026-10-20",
    subject: "Algorithms",
    topic: "Sorting Algorithms & Lower Bounds",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Sorting+Algorithms+%26+Lower+Bounds",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/design-and-analysis-of-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/sorting",
    pyqTitle: "GATEOverflow Tag: Sorting"
  },
  {
    day: 21,
    date: "2026-10-21",
    subject: "Algorithms",
    topic: "Greedy Algorithms & Divide and Conquer",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Greedy+Algorithms+%26+Divide+and+Conquer",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/design-and-analysis-of-algorithms",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/greedy",
    pyqTitle: "GATEOverflow Tag: Greedy"
  },
  {
    day: 22,
    date: "2026-10-22",
    subject: "Discrete Mathematics",
    topic: "Propositional Logic & Truth Tables",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Propositional+Logic+%26+Truth+Tables",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/propositional-logic",
    pyqTitle: "GATEOverflow Tag: Propositional Logic"
  },
  {
    day: 23,
    date: "2026-10-23",
    subject: "Discrete Mathematics",
    topic: "First-Order Predicate Logic",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+First-Order+Predicate+Logic",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/first-order-logic",
    pyqTitle: "GATEOverflow Tag: First Order Logic"
  },
  {
    day: 24,
    date: "2026-10-24",
    subject: "Discrete Mathematics",
    topic: "Sets, Relations & Equivalence Relations",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Sets%2C+Relations+%26+Equivalence+Relations",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/sets",
    pyqTitle: "GATEOverflow Tag: Sets & Relations"
  },
  {
    day: 25,
    date: "2026-10-25",
    subject: "Discrete Mathematics",
    topic: "Partial Orders, Hasse Diagrams & Lattices",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Partial+Orders%2C+Hasse+Diagrams+%26+Lattices",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/poset",
    pyqTitle: "GATEOverflow Tag: POSET & Lattices"
  },
  {
    day: 26,
    date: "2026-10-26",
    subject: "Discrete Mathematics",
    topic: "Combinatorics: Permutations, Combinations & Pigeonhole",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Combinatorics%3A+Permutations%2C+Combinations+%26+Pigeonhole",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/pigeonhole-principle",
    pyqTitle: "GATEOverflow Tag: Pigeonhole Principle"
  },
  {
    day: 27,
    date: "2026-10-27",
    subject: "Engineering Mathematics",
    topic: "Probability: Conditional Probability & Bayes Theorem",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Probability%3A+Conditional+Probability+%26+Bayes+Theorem",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/bayes-theorem",
    pyqTitle: "GATEOverflow Tag: Bayes Theorem"
  },
  {
    day: 28,
    date: "2026-10-28",
    subject: "Engineering Mathematics",
    topic: "Random Variables & Distributions",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Random+Variable+Distribution+GATE",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/engineering-mathematics?sort=gate",
    pyqTitle: "GATEOverflow Engineering Math Previous GATE Questions"
  },
  {
    day: 29,
    date: "2026-10-29",
    subject: "Engineering Mathematics",
    topic: "Linear Algebra: Matrices, Rank & Systems of Equations",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Linear+Algebra%3A+Matrices%2C+Rank+%26+Systems+of+Equations",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/linear-algebra",
    pyqTitle: "GATEOverflow Tag: Linear Algebra"
  },
  {
    day: 30,
    date: "2026-10-30",
    subject: "Engineering Mathematics",
    topic: "Linear Algebra: Eigenvalues & Cayley-Hamilton",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Linear+Algebra%3A+Eigenvalues+%26+Cayley-Hamilton",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/eigenvalues",
    pyqTitle: "GATEOverflow Tag: Eigenvalues"
  },
  {
    day: 31,
    date: "2026-10-31",
    subject: "Foundation Review",
    topic: "Month 1 Comprehensive Review & Diagnostic Test",
    videoStatus: "test_resource",
    directUrl: "https://gateoverflow.in/tests",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    searchUrl: "https://gateoverflow.in/tests",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow Full Tests Portal"
  },
  {
    day: 32,
    date: "2026-11-01",
    subject: "Digital Logic",
    topic: "Number Systems & Floating Point Representation",
    videoStatus: "verified_direct",
    directUrl: "https://www.youtube.com/watch?v=2joeDD5-v3s",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Number+Systems",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/digital-logic?sort=gate",
    pyqTitle: "GATEOverflow Digital Logic Previous GATE Questions"
  },
  {
    day: 33,
    date: "2026-11-02",
    subject: "Digital Logic",
    topic: "Boolean Algebra & K-Maps",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Boolean+Algebra+%26+K-Maps",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/boolean-algebra",
    pyqTitle: "GATEOverflow Tag: Boolean Algebra"
  },
  {
    day: 34,
    date: "2026-11-03",
    subject: "Digital Logic",
    topic: "Combinational Circuits: Multiplexers & Decoders",
    videoStatus: "verified_direct",
    directUrl: "https://www.youtube.com/watch?v=p6yPvw88BJk",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Multiplexer",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/multiplexer",
    pyqTitle: "GATEOverflow Tag: Multiplexer"
  },
  {
    day: 35,
    date: "2026-11-04",
    subject: "Digital Logic",
    topic: "Sequential Circuits: Latches & Flip-Flops",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Sequential+Circuits%3A+Latches+%26+Flip-Flops",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/flip-flop",
    pyqTitle: "GATEOverflow Tag: Flip-Flop"
  },
  {
    day: 36,
    date: "2026-11-05",
    subject: "Digital Logic",
    topic: "Counters & Shift Registers",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Counters+%26+Shift+Registers",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/counter",
    pyqTitle: "GATEOverflow Tag: Counter"
  },
  {
    day: 37,
    date: "2026-11-06",
    subject: "Computer Organization & Architecture",
    topic: "Instruction Formats & Addressing Modes",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Instruction+Formats+%26+Addressing+Modes",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/instruction-format",
    pyqTitle: "GATEOverflow Tag: Instruction Format"
  },
  {
    day: 38,
    date: "2026-11-07",
    subject: "Computer Organization & Architecture",
    topic: "ALU, Datapath & Control Unit Design",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+ALU%2C+Datapath+%26+Control+Unit+Design",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/subject/co-and-architecture",
    pyqTitle: "GATEOverflow COA Previous GATE Questions"
  },
  {
    day: 39,
    date: "2026-11-08",
    subject: "Computer Organization & Architecture",
    topic: "Memory Hierarchy & Main Memory Interleaving",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Memory+Hierarchy+%26+Main+Memory+Interleaving",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/subject/co-and-architecture",
    pyqTitle: "GATEOverflow COA Previous GATE Questions"
  },
  {
    day: 40,
    date: "2026-11-09",
    subject: "Computer Organization & Architecture",
    topic: "Cache Memory: Direct, Associative & Set-Associative Mapping",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Cache+Memory%3A+Direct%2C+Associative+%26+Set-Associative+Mapping",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/cache",
    pyqTitle: "GATEOverflow Tag: Cache"
  },
  {
    day: 41,
    date: "2026-11-10",
    subject: "Computer Organization & Architecture",
    topic: "Cache Policies & Average Memory Access Time (AMAT)",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Cache+Policies+%26+Average+Memory+Access+Time+%28AMAT%29",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/cache",
    pyqTitle: "GATEOverflow Tag: Cache"
  },
  {
    day: 42,
    date: "2026-11-11",
    subject: "Computer Organization & Architecture",
    topic: "Instruction Pipelining & Hazard Analysis",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Instruction+Pipelining+%26+Hazard+Analysis",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/pipelining",
    pyqTitle: "GATEOverflow Tag: Pipelining"
  },
  {
    day: 43,
    date: "2026-11-12",
    subject: "Computer Organization & Architecture",
    topic: "I/O Interface, Interrupts & DMA",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+I%2FO+Interface%2C+Interrupts+%26+DMA",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/computer-organization-architecture",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/interrupt",
    pyqTitle: "GATEOverflow Tag: Interrupt"
  },
  {
    day: 44,
    date: "2026-11-13",
    subject: "Databases / DBMS",
    topic: "ER Modeling & Schema Mapping",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+ER+Modeling+%26+Schema+Mapping",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/dbms-sql",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/er-model",
    pyqTitle: "GATEOverflow Tag: ER Model"
  },
  {
    day: 45,
    date: "2026-11-14",
    subject: "Databases / DBMS",
    topic: "Relational Algebra & Relational Calculus",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Relational+Algebra+%26+Relational+Calculus",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/dbms-sql",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/databases?sort=gate",
    pyqTitle: "GATEOverflow DBMS Previous GATE Questions"
  },
  {
    day: 46,
    date: "2026-11-15",
    subject: "Databases / DBMS",
    topic: "SQL Queries, Aggregates & Subqueries",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+SQL+Queries%2C+Aggregates+%26+Subqueries",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/dbms-sql",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/sql",
    pyqTitle: "GATEOverflow Tag: SQL"
  },
  {
    day: 47,
    date: "2026-11-16",
    subject: "Databases / DBMS",
    topic: "Functional Dependencies & Attribute Closure",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Functional+Dependencies+%26+Attribute+Closure",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/dbms-sql",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/databases?sort=gate",
    pyqTitle: "GATEOverflow DBMS Previous GATE Questions"
  },
  {
    day: 48,
    date: "2026-11-17",
    subject: "Databases / DBMS",
    topic: "Normalization: 1NF, 2NF, 3NF, BCNF",
    videoStatus: "verified_direct",
    directUrl: "https://www.youtube.com/watch?v=EFdvRm5nse0",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/dbms-sql",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Normalization",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/database-normalization",
    pyqTitle: "GATEOverflow Tag: Database Normalization"
  },
  {
    day: 49,
    date: "2026-11-18",
    subject: "Databases / DBMS",
    topic: "Transactions, ACID Properties & Serializability",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Transactions%2C+ACID+Properties+%26+Serializability",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/dbms-sql",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/serializability",
    pyqTitle: "GATEOverflow Tag: Serializability"
  },
  {
    day: 50,
    date: "2026-11-19",
    subject: "Databases / DBMS",
    topic: "Concurrency Control & Indexing (B/B+ Trees)",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Concurrency+Control+%26+Indexing+%28B%2FB%2B+Trees%29",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/dbms-sql",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/databases?sort=gate",
    pyqTitle: "GATEOverflow DBMS Previous GATE Questions"
  },
  {
    day: 51,
    date: "2026-11-20",
    subject: "Operating Systems",
    topic: "Processes, Threads & System Calls",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Processes%2C+Threads+%26+System+Calls",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/operating-systems",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/operating-system?sort=gate",
    pyqTitle: "GATEOverflow OS Previous GATE Questions"
  },
  {
    day: 52,
    date: "2026-11-21",
    subject: "Operating Systems",
    topic: "CPU Scheduling Algorithms",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+CPU+Scheduling+Algorithms",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/operating-systems",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/operating-system?sort=gate",
    pyqTitle: "GATEOverflow OS Previous GATE Questions"
  },
  {
    day: 53,
    date: "2026-11-22",
    subject: "Operating Systems",
    topic: "Process Synchronization & Semaphores",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Process+Synchronization+%26+Semaphores",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/operating-systems",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/operating-system?sort=gate",
    pyqTitle: "GATEOverflow OS Previous GATE Questions"
  },
  {
    day: 54,
    date: "2026-11-23",
    subject: "Operating Systems",
    topic: "Deadlocks: Necessary Conditions & Banker's Algorithm",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Deadlocks%3A+Necessary+Conditions+%26+Banker%27s+Algorithm",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/operating-systems",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/deadlock",
    pyqTitle: "GATEOverflow Tag: Deadlock"
  },
  {
    day: 55,
    date: "2026-11-24",
    subject: "Operating Systems",
    topic: "Memory Management, Paging & TLB",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Memory+Management%2C+Paging+%26+TLB",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/operating-systems",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/paging",
    pyqTitle: "GATEOverflow Tag: Paging"
  },
  {
    day: 56,
    date: "2026-11-25",
    subject: "Operating Systems",
    topic: "Virtual Memory, Page Replacement & Disk Scheduling",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Virtual+Memory%2C+Page+Replacement+%26+Disk+Scheduling",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/operating-systems",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/page-replacement",
    pyqTitle: "GATEOverflow Tag: Page Replacement"
  },
  {
    day: 57,
    date: "2026-11-26",
    subject: "Computer Networks",
    topic: "Layered Models & Data Link Layer Framing / Error Control",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Layered+Models+%26+Data+Link+Layer+Framing+%2F+Error+Control",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/computer-networks",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/computer-networks?sort=gate",
    pyqTitle: "GATEOverflow CN Previous GATE Questions"
  },
  {
    day: 58,
    date: "2026-11-27",
    subject: "Computer Networks",
    topic: "Flow Control: Sliding Window Protocols",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Flow+Control%3A+Sliding+Window+Protocols",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/computer-networks",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/sliding-window",
    pyqTitle: "GATEOverflow Tag: Sliding Window"
  },
  {
    day: 59,
    date: "2026-11-28",
    subject: "Computer Networks",
    topic: "MAC Layer: ALOHA, CSMA/CD & Ethernet",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+MAC+Layer%3A+ALOHA%2C+CSMA%2FCD+%26+Ethernet",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/computer-networks",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/csma-cd",
    pyqTitle: "GATEOverflow Tag: CSMA/CD"
  },
  {
    day: 60,
    date: "2026-11-29",
    subject: "Computer Networks",
    topic: "Network Layer: IPv4, Subnetting, CIDR & Routing",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Network+Layer%3A+IPv4%2C+Subnetting%2C+CIDR+%26+Routing",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/computer-networks",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/ipv4",
    pyqTitle: "GATEOverflow Tag: IPv4"
  },
  {
    day: 61,
    date: "2026-11-30",
    subject: "Computer Networks",
    topic: "Transport Layer: TCP, Congestion Control & Month 2 Review",
    videoStatus: "test_resource",
    directUrl: "https://gateoverflow.in/tests",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/computer-networks",
    searchUrl: "https://gateoverflow.in/tests",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/tcp",
    pyqTitle: "GATEOverflow Tag: TCP"
  },
  {
    day: 62,
    date: "2026-12-01",
    subject: "Theory of Computation",
    topic: "DFA Design & State Minimization",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+DFA+Design+%26+State+Minimization",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/theory-of-computation",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/dfa",
    pyqTitle: "GATEOverflow Tag: DFA"
  },
  {
    day: 63,
    date: "2026-12-02",
    subject: "Theory of Computation",
    topic: "NFA, epsilon-NFA & Regular Expressions",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+NFA%2C+epsilon-NFA+%26+Regular+Expressions",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/theory-of-computation",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/nfa",
    pyqTitle: "GATEOverflow Tag: NFA"
  },
  {
    day: 64,
    date: "2026-12-03",
    subject: "Theory of Computation",
    topic: "Pumping Lemma & Regular Language Identification",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Pumping+Lemma+%26+Regular+Language+Identification",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/theory-of-computation",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/pumping-lemma",
    pyqTitle: "GATEOverflow Tag: Pumping Lemma"
  },
  {
    day: 65,
    date: "2026-12-04",
    subject: "Theory of Computation",
    topic: "Context-Free Grammars (CFG) & Ambiguity",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Context-Free+Grammars+%28CFG%29+%26+Ambiguity",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/theory-of-computation",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/context-free-grammar",
    pyqTitle: "GATEOverflow Tag: Context Free Grammar"
  },
  {
    day: 66,
    date: "2026-12-05",
    subject: "Theory of Computation",
    topic: "Pushdown Automata (PDA) & CFL Closure Properties",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Pushdown+Automata+%28PDA%29+%26+CFL+Closure+Properties",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/theory-of-computation",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/pushdown-automata",
    pyqTitle: "GATEOverflow Tag: Pushdown Automata"
  },
  {
    day: 67,
    date: "2026-12-06",
    subject: "Theory of Computation",
    topic: "Turing Machines, Decidability & Halting Problem",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Turing+Machines%2C+Decidability+%26+Halting+Problem",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/theory-of-computation",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/turing-machine",
    pyqTitle: "GATEOverflow Tag: Turing Machine"
  },
  {
    day: 68,
    date: "2026-12-07",
    subject: "Compiler Design",
    topic: "Lexical Analysis & Tokenization",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Lexical+Analysis+%26+Tokenization",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/compiler-design",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/compiler-design?sort=gate",
    pyqTitle: "GATEOverflow Compiler Design Previous GATE Questions"
  },
  {
    day: 69,
    date: "2026-12-08",
    subject: "Compiler Design",
    topic: "Top-Down Parsing: FIRST & FOLLOW Sets, LL(1)",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Top-Down+Parsing%3A+FIRST+%26+FOLLOW+Sets%2C+LL%281%29",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/compiler-design",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/ll1",
    pyqTitle: "GATEOverflow Tag: LL(1)"
  },
  {
    day: 70,
    date: "2026-12-09",
    subject: "Compiler Design",
    topic: "Bottom-Up Parsing: LR(0), SLR(1), LALR(1), CLR(1)",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Bottom-Up+Parsing%3A+LR%280%29%2C+SLR%281%29%2C+LALR%281%29%2C+CLR%281%29",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/compiler-design",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/lr0",
    pyqTitle: "GATEOverflow Tag: LR(0)"
  },
  {
    day: 71,
    date: "2026-12-10",
    subject: "Compiler Design",
    topic: "Syntax-Directed Translation (SDT)",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Syntax-Directed+Translation+%28SDT%29",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/compiler-design",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/compiler-design?sort=gate",
    pyqTitle: "GATEOverflow Compiler Design Previous GATE Questions"
  },
  {
    day: 72,
    date: "2026-12-11",
    subject: "Compiler Design",
    topic: "Intermediate Code & Code Optimization",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Intermediate+Code+%26+Code+Optimization",
    roadmapUrl: "https://www.gatesmashers.com/roadmaps/compiler-design",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/compiler-design?sort=gate",
    pyqTitle: "GATEOverflow Compiler Design Previous GATE Questions"
  },
  {
    day: 73,
    date: "2026-12-12",
    subject: "Engineering Mathematics",
    topic: "Calculus: Limits, Continuity & Differentiability",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Calculus%3A+Limits%2C+Continuity+%26+Differentiability",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/engineering-mathematics?sort=gate",
    pyqTitle: "GATEOverflow Engineering Math Previous GATE Questions"
  },
  {
    day: 74,
    date: "2026-12-13",
    subject: "Engineering Mathematics",
    topic: "Calculus: Maxima, Minima & Definite Integrals",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Calculus%3A+Maxima%2C+Minima+%26+Definite+Integrals",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/engineering-mathematics?sort=gate",
    pyqTitle: "GATEOverflow Engineering Math Previous GATE Questions"
  },
  {
    day: 75,
    date: "2026-12-14",
    subject: "Discrete Mathematics",
    topic: "Graph Theory: Fundamentals, Paths & Degrees",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Graph+Theory%3A+Fundamentals%2C+Paths+%26+Degrees",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/graph-theory",
    pyqTitle: "GATEOverflow Tag: Graph Theory"
  },
  {
    day: 76,
    date: "2026-12-15",
    subject: "Discrete Mathematics",
    topic: "Graph Theory: Planarity, Trees & Chromatic Number",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Graph+Theory%3A+Planarity%2C+Trees+%26+Chromatic+Number",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/graph-theory",
    pyqTitle: "GATEOverflow Tag: Graph Theory"
  },
  {
    day: 77,
    date: "2026-12-16",
    subject: "General Aptitude",
    topic: "General Aptitude: Comprehensive Speed Revision",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+General+Aptitude%3A+Comprehensive+Speed+Revision",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions/general-aptitude?sort=gate",
    pyqTitle: "GATEOverflow General Aptitude Previous GATE Questions"
  },
  {
    day: 78,
    date: "2026-12-17",
    subject: "Full Revision",
    topic: "High-Yield Revision 1: Programming & Data Structures",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+High-Yield+Revision+1%3A+Programming+%26+Data+Structures",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow GATE Questions"
  },
  {
    day: 79,
    date: "2026-12-18",
    subject: "Full Revision",
    topic: "High-Yield Revision 2: Algorithms & Discrete Math",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+High-Yield+Revision+2%3A+Algorithms+%26+Discrete+Math",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow GATE Questions"
  },
  {
    day: 80,
    date: "2026-12-19",
    subject: "Full Revision",
    topic: "High-Yield Revision 3: Digital Logic & COA",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+High-Yield+Revision+3%3A+Digital+Logic+%26+COA",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "verified_topic_tag",
    pyqUrl: "https://gateoverflow.in/tag/propositional-logic",
    pyqTitle: "GATEOverflow Tag: Digital & Architecture Review"
  },
  {
    day: 81,
    date: "2026-12-20",
    subject: "Full Revision",
    topic: "High-Yield Revision 4: DBMS & Operating Systems",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+High-Yield+Revision+4%3A+DBMS+%26+Operating+Systems",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow Core Systems Review"
  },
  {
    day: 82,
    date: "2026-12-21",
    subject: "Full Revision",
    topic: "High-Yield Revision 5: Computer Networks & TOC",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+High-Yield+Revision+5%3A+Computer+Networks+%26+TOC",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow Networks & TOC Review"
  },
  {
    day: 83,
    date: "2026-12-22",
    subject: "Full Revision",
    topic: "High-Yield Revision 6: Compiler Design & Engg Math",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+High-Yield+Revision+6%3A+Compiler+Design+%26+Engg+Math",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow Compiler & Math Review"
  },
  {
    day: 84,
    date: "2026-12-23",
    subject: "Weak-Topic Repair",
    topic: "Targeted Weak-Topic Repair: Core Systems (COA, OS, DBMS)",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Targeted+Weak-Topic+Repair%3A+Core+Systems+%28COA%2C+OS%2C+DBMS%29",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow Systems Weak-Topic PYQs"
  },
  {
    day: 85,
    date: "2026-12-24",
    subject: "Weak-Topic Repair",
    topic: "Targeted Weak-Topic Repair: Programming, DSA & Algorithms",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Targeted+Weak-Topic+Repair%3A+Programming%2C+DSA+%26+Algorithms",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow DSA Weak-Topic PYQs"
  },
  {
    day: 86,
    date: "2026-12-25",
    subject: "Weak-Topic Repair",
    topic: "Targeted Weak-Topic Repair: Theory & Mathematics",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Targeted+Weak-Topic+Repair%3A+Theory+%26+Mathematics",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow Math & Theory Weak-Topic PYQs"
  },
  {
    day: 87,
    date: "2026-12-26",
    subject: "Mock & Exam Simulation",
    topic: "Full-Length Mock 1 (3 Hours) + Detailed Diagnostic Analysis",
    videoStatus: "test_resource",
    directUrl: "https://gateoverflow.in/tests",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    searchUrl: "https://gateoverflow.in/tests",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow Full Mock 1"
  },
  {
    day: 88,
    date: "2026-12-27",
    subject: "Mock & Exam Simulation",
    topic: "Full-Length Mock 2 (3 Hours) + Mistake Repair",
    videoStatus: "test_resource",
    directUrl: "https://gateoverflow.in/tests",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    searchUrl: "https://gateoverflow.in/tests",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow Full Mock 2"
  },
  {
    day: 89,
    date: "2026-12-28",
    subject: "Mock & Exam Simulation",
    topic: "Full-Length Mock 3 (3 Hours) + Formula Speed-Drill",
    videoStatus: "test_resource",
    directUrl: "https://gateoverflow.in/tests",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    searchUrl: "https://gateoverflow.in/tests",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow Full Mock 3"
  },
  {
    day: 90,
    date: "2026-12-29",
    subject: "90-Day Master Milestone",
    topic: "Day 90 Master Assessment & Final Preparation Report",
    videoStatus: "topic_locator",
    searchUrl: "https://www.youtube.com/results?search_query=Gate+Smashers+Day+90+Master+Assessment+%26+Final+Preparation+Report",
    roadmapUrl: "https://www.gatesmashers.com/learn",
    pyqStatus: "subject_previous_gate",
    pyqUrl: "https://gateoverflow.in/questions?sort=gate",
    pyqTitle: "GATEOverflow Final GATE Milestone"
  }
];

// Load existing 90-day plan
const planPath = path.join(__dirname, '../data/gate/plan-90-days.json');
const planDays = JSON.parse(fs.readFileSync(planPath, 'utf8'));

// Build day resource map dictionary and merge into plan
const dayResourceMap = {};

raw90DaysTable.forEach(item => {
  const matchDay = planDays.find(d => d.dayNumber === item.day);
  const subtopics = matchDay ? matchDay.subtopics : [];

  const videoLocator = {
    title: item.directUrl ? `Watch Lecture: ${item.topic}` : `Gate Smashers: ${item.topic}`,
    directUrl: item.directUrl || undefined,
    roadmapUrl: item.roadmapUrl,
    searchFallbackUrl: item.searchUrl,
    status: item.videoStatus,
    provider: "Gate Smashers"
  };

  const pyqLocator = {
    title: item.pyqTitle || `GATEOverflow: ${item.topic}`,
    url: item.pyqUrl,
    status: item.pyqStatus,
    provider: "GATEOverflow"
  };

  const resourceMapEntry = {
    day: item.day,
    date: item.date,
    subject: item.subject,
    topic: item.topic,
    videos: [videoLocator],
    pyqs: [pyqLocator],
    subtopics: subtopics
  };

  dayResourceMap[item.day] = resourceMapEntry;

  // Also update matchDay directly in plan-90-days
  if (matchDay) {
    matchDay.exactResources = resourceMapEntry;
    matchDay.learningResource = {
      provider: "Gate Smashers",
      title: item.directUrl ? `Watch Lecture: ${item.topic}` : `Gate Smashers Roadmap: ${item.topic}`,
      url: item.directUrl || item.roadmapUrl,
      timeMin: 90
    };
    matchDay.pyqResource = {
      provider: "GATEOverflow",
      title: pyqLocator.title,
      url: item.pyqUrl,
      target: matchDay.pyqResource?.target || 8
    };

    // Update first task learning url and pyq task url
    if (matchDay.tasks) {
      const learningTask = matchDay.tasks.find(t => t.type === 'learning');
      if (learningTask) {
        learningTask.resourceUrl = item.directUrl || item.roadmapUrl;
        learningTask.provider = "Gate Smashers";
      }
      const pyqTask = matchDay.tasks.find(t => t.type === 'pyq');
      if (pyqTask) {
        pyqTask.resourceUrl = item.pyqUrl;
        pyqTask.provider = "GATEOverflow";
      }
    }
  }
});

// Write exact-resource-map.json
const mapPath = path.join(__dirname, '../data/gate/exact-resource-map.json');
fs.writeFileSync(mapPath, JSON.stringify(dayResourceMap, null, 2), 'utf8');
console.log(`Saved exact resource map to ${mapPath}`);

// Write updated plan-90-days.json
fs.writeFileSync(planPath, JSON.stringify(planDays, null, 2), 'utf8');
console.log(`Successfully merged exact resource map into ${planPath} (all 90 days updated)`);
