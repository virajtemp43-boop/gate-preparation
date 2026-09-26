/**
 * 90 Daily Mindset Thoughts & Inspiration for GATE 2027 CSE Aspirants
 * Displays one sharp, practical, motivating thought on each day of preparation.
 */

export interface DailyThought {
  dayNumber: number;
  thought: string;
  author: string;
  tag: string;
}

export const DAILY_THOUGHTS: DailyThought[] = [
  {
    dayNumber: 1,
    thought: "Consistency is the DNA of AIR 1. Master today's 6 hours with full presence and let compounding do the rest.",
    author: "GATE 2027 Master Plan",
    tag: "Day 1 Momentum"
  },
  {
    dayNumber: 2,
    thought: "Speed in GATE is a byproduct of conceptual clarity. Understand memory allocation before memorizing formulas.",
    author: "Coach Insight",
    tag: "Conceptual Depth"
  },
  {
    dayNumber: 3,
    thought: "Every difficult pointer puzzle you struggle through today is a guaranteed 2 marks in February 2027.",
    author: "Topper Mindset",
    tag: "Problem Solving"
  },
  {
    dayNumber: 4,
    thought: "Do not count the hours you sit at the desk; count the concepts you can explain on a blank sheet without peeking.",
    author: "Active Recall",
    tag: "Study Technique"
  },
  {
    dayNumber: 5,
    thought: "The difference between rank 100 and rank 10,000 is an Error Book that never repeats a past mistake.",
    author: "Error Discipline",
    tag: "Accuracy"
  },
  {
    dayNumber: 6,
    thought: "When recursion feels deep, trace the stack frame step-by-step. Exact execution beats intuition every time.",
    author: "Core CS",
    tag: "Precision"
  },
  {
    dayNumber: 7,
    thought: "Week 1 is complete! Celebrate your persistence. Consistency is built by never breaking the chain two days in a row.",
    author: "Milestone",
    tag: "Weekly Review"
  },
  {
    dayNumber: 8,
    thought: "Asymptotic notation is about behavior at infinity. Don't memorize big-O; feel the rate of growth.",
    author: "Algorithm Mastery",
    tag: "Mathematics"
  },
  {
    dayNumber: 9,
    thought: "Divide and conquer divides the problem into pieces. Conquer today's workload one 50-minute block at a time.",
    author: "Focus Principle",
    tag: "Time Management"
  },
  {
    dayNumber: 10,
    thought: "Trees and graphs reflect the interconnected nature of CS. Master the traversals, and the algorithms follow.",
    author: "Data Structures",
    tag: "Foundation"
  },
  {
    dayNumber: 11,
    thought: "Greedy choice requires proof of optimality. In study, the greedy choice is always: tackle the hardest topic first.",
    author: "Study Strategy",
    tag: "Priority"
  },
  {
    dayNumber: 12,
    thought: "Dynamic programming remembers the past so you don't repeat work. Your notes are your memoization table.",
    author: "Deep Learning",
    tag: "Retention"
  },
  {
    dayNumber: 13,
    thought: "Shortest paths are discovered edge by edge. Your rank is built question by question.",
    author: "Graph Theory",
    tag: "Perseverance"
  },
  {
    dayNumber: 14,
    thought: "Fortnight check: Two full weeks of pure discipline. You are already ahead of 80% of candidates who quit early.",
    author: "Coach Reflection",
    tag: "Resilience"
  },
  {
    dayNumber: 15,
    thought: "Pipelining boosts throughput, not individual latency. Study daily to keep your learning pipeline continuously full.",
    author: "COA Principle",
    tag: "Throughput"
  },
  {
    dayNumber: 16,
    thought: "Cache memory works because of locality of reference. Keep your recent formulas close at hand for instant retrieval.",
    author: "Memory Hierarchy",
    tag: "Efficiency"
  },
  {
    dayNumber: 17,
    thought: "A structural hazard is resolved by adding resources. Your resource is time—spend it where you feel weakest.",
    author: "Architecture",
    tag: "Strategic Focus"
  },
  {
    dayNumber: 18,
    thought: "Do not fear getting questions wrong today. Mistakes made in October protect marks in February.",
    author: "Growth Mindset",
    tag: "Fearless Practice"
  },
  {
    dayNumber: 19,
    thought: "Operating Systems manage scarce resources under contention. Manage your energy like a real-time kernel.",
    author: "OS Philosophy",
    tag: "Energy Management"
  },
  {
    dayNumber: 20,
    thought: "Deadlocks happen when processes hold and wait. Don't wait for motivation; take action and motivation follows.",
    author: "Proactive Action",
    tag: "Execution"
  },
  {
    dayNumber: 21,
    thought: "Day 21: Psychological habit threshold reached. Studying 6 hours today is no longer an effort; it is who you are.",
    author: "Habit Science",
    tag: "Identity"
  },
  {
    dayNumber: 22,
    thought: "Paging separates logical from physical. Separate your self-worth from today's mock score and focus on the gaps.",
    author: "Mental Toughness",
    tag: "Objectivity"
  },
  {
    dayNumber: 23,
    thought: "Virtual memory makes the impossible fit. Your mind can absorb massive syllabus when paced deliberately.",
    author: "Capacity",
    tag: "Cognitive Load"
  },
  {
    dayNumber: 24,
    thought: "File systems organize chaos into clean trees. Organize your formula book so you can locate any rule in 5 seconds.",
    author: "Organization",
    tag: "System Design"
  },
  {
    dayNumber: 25,
    thought: "Quarter-mark reached: 25 days down. You are building unshakeable subject intuition.",
    author: "Milestone",
    tag: "Momentum"
  },
  {
    dayNumber: 26,
    thought: "Normalization eliminates redundancy without losing information. Streamline your notes to the essential truths.",
    author: "DBMS Wisdom",
    tag: "Synthesis"
  },
  {
    dayNumber: 27,
    thought: "ACID properties ensure transaction integrity. Ensure your daily review block is non-negotiable and atomic.",
    author: "Integrity",
    tag: "Discipline"
  },
  {
    dayNumber: 28,
    thought: "Serializability guarantees correctness under concurrency. Balance theory, PYQs, and revision in perfect harmony.",
    author: "Concurrency",
    tag: "Balance"
  },
  {
    dayNumber: 29,
    thought: "B-trees keep height minimal for logarithmic search. Keep your explanations concise and razor-sharp.",
    author: "Indexing",
    tag: "Clarity"
  },
  {
    dayNumber: 30,
    thought: "MONTH 1 COMPLETE! You have conquered Foundation & Core Systems. Month 2 will elevate your score into top percentile.",
    author: "Monthly Triumph",
    tag: "Month 1 Victory"
  },
  {
    dayNumber: 31,
    thought: "Month 2 Kickoff: Fresh energy, higher stakes. Let's attack Computer Networks with absolute confidence.",
    author: "Month 2 Ignition",
    tag: "Fresh Start"
  },
  {
    dayNumber: 32,
    thought: "The OSI model layers abstraction to solve massive complexity. Deconstruct intimidating GATE questions layer by layer.",
    author: "Networking",
    tag: "Modular Thinking"
  },
  {
    dayNumber: 33,
    thought: "Sliding window protocols maintain maximum link utilization. Keep your focus window locked on the active task.",
    author: "Flow Control",
    tag: "Deep Focus"
  },
  {
    dayNumber: 34,
    thought: "Subnetting is binary arithmetic under a mask. Precision in calculation saves you from negative marks in NAT questions.",
    author: "Calculations",
    tag: "Zero Errors"
  },
  {
    dayNumber: 35,
    thought: "Routing algorithms find optimal paths through unknown networks. Trust your structured study algorithm.",
    author: "Pathfinding",
    tag: "Trust the Plan"
  },
  {
    dayNumber: 36,
    thought: "TCP three-way handshake establishes trust before data transfer. Establish conceptual clarity before solving PYQs.",
    author: "Protocols",
    tag: "Foundation First"
  },
  {
    dayNumber: 37,
    thought: "Congestion control backs off when packets drop. When you feel mental fatigue, take a 10-minute walk, then resume.",
    author: "Burnout Defense",
    tag: "Recovery"
  },
  {
    dayNumber: 38,
    thought: "DNS resolves names to numbers instantly. Train your recall so formulas emerge instantly on reading a problem.",
    author: "Memory Index",
    tag: "Speed"
  },
  {
    dayNumber: 39,
    thought: "Theory of Computation asks what can be computed. You are computing your future rank with every solved question.",
    author: "TOC Philosophy",
    tag: "Purpose"
  },
  {
    dayNumber: 40,
    thought: "DFAs have finite memory but unlimited precision. Master the minimal state construction for regular languages.",
    author: "Automata",
    tag: "Elegance"
  },
  {
    dayNumber: 41,
    thought: "The Pumping Lemma exposes limits. Acknowledge your weak topics without hesitation and reinforce them today.",
    author: "Self-Awareness",
    tag: "Growth"
  },
  {
    dayNumber: 42,
    thought: "Context-Free Grammars generate infinite richness from simple rules. Master the derivation trees and ambiguity checks.",
    author: "Grammars",
    tag: "Structure"
  },
  {
    dayNumber: 43,
    thought: "Pushdown Automata use a stack for memory. Your Error Book is your persistent stack—keep it updated.",
    author: "PDA Principle",
    tag: "Documentation"
  },
  {
    dayNumber: 44,
    thought: "Turing Machines define computability. Undecidability teaches humility; discipline teaches mastery.",
    author: "Theory",
    tag: "Mastery"
  },
  {
    dayNumber: 45,
    thought: "HALFWAY MARK! 45 DAYS COMPLETED. You are in the top 5% of dedicated GATE aspirants. The summit is in view.",
    author: "Milestone 50%",
    tag: "Halfway Hero"
  },
  {
    dayNumber: 46,
    thought: "Compiler design transforms human logic into machine speed. Transform textbook definitions into problem-solving reflex.",
    author: "Compilers",
    tag: "Transformation"
  },
  {
    dayNumber: 47,
    thought: "Lexical analysis tokenizes input cleanly. Filter out social media distractions and protect your study silence.",
    author: "Distraction Defense",
    tag: "Sanctuary"
  },
  {
    dayNumber: 48,
    thought: "LL(1) parsing needs First and Follow sets without intersection. Keep your schedule free of conflicting commitments.",
    author: "Parsing",
    tag: "Singular Focus"
  },
  {
    dayNumber: 49,
    thought: "LR parsing tables are powerful and deterministic. Build deterministic study habits that leave nothing to luck.",
    author: "Determinism",
    tag: "Reliability"
  },
  {
    dayNumber: 50,
    thought: "Day 50: Half a century of focused days! What seemed impossible on Day 1 is now your daily standard.",
    author: "Century Club",
    tag: "Transformation"
  },
  {
    dayNumber: 51,
    thought: "Syntax-Directed Translation computes values during parse. Solve questions as you study, not days later.",
    author: "Immediate Practice",
    tag: "Action"
  },
  {
    dayNumber: 52,
    thought: "Code optimization removes dead code and loop invariants. Eliminate passive reading and engage in active solving.",
    author: "Optimization",
    tag: "Efficiency"
  },
  {
    dayNumber: 53,
    thought: "Digital Logic is where physics turns into pure mathematics. Master K-Maps and multiplexers for guaranteed marks.",
    author: "Digital CS",
    tag: "Scoring Topics"
  },
  {
    dayNumber: 54,
    thought: "Boolean algebra minimizes logic with zero loss. Reduce your doubts by testing them against real GATE PYQs.",
    author: "Simplification",
    tag: "Accuracy"
  },
  {
    dayNumber: 55,
    thought: "Flip-flops remember state across clock cycles. Consistent sleep locks daily learning into long-term memory.",
    author: "Sleep Science",
    tag: "Restoration"
  },
  {
    dayNumber: 56,
    thought: "Counters count predictably with each pulse. Every question solved is one point added to your score ledger.",
    author: "Progress Ledger",
    tag: "Patience"
  },
  {
    dayNumber: 57,
    thought: "Combinational circuits have no memory; sequential circuits remember. Be sequential: build on every past lesson.",
    author: "Sequential Growth",
    tag: "Compounding"
  },
  {
    dayNumber: 58,
    thought: "Engineering Mathematics carries 15 marks. Treat it with the same respect as core CS—it decides top ranks.",
    author: "Math Strategy",
    tag: "High Yield"
  },
  {
    dayNumber: 59,
    thought: "Linear Algebra: Eigenvalues reveal the hidden directions of transformations. Find your highest-leverage study habits.",
    author: "Linear Algebra",
    tag: "High Leverage"
  },
  {
    dayNumber: 60,
    thought: "MONTH 2 COMPLETE! 60 Days of unwavering discipline. Month 3 is the championship round: Revision, Accuracy & Rank!",
    author: "Month 2 Victory",
    tag: "Championship Round"
  },
  {
    dayNumber: 61,
    thought: "Month 3: The Revision & Mastery phase begins. We don't slow down; we sharpen our execution to surgical precision.",
    author: "Month 3 Kickoff",
    tag: "Final Polish"
  },
  {
    dayNumber: 62,
    thought: "Calculus explores rate of change. Small positive changes in daily problem speed compound into massive exam success.",
    author: "Calculus Insight",
    tag: "Acceleration"
  },
  {
    dayNumber: 63,
    thought: "Probability quantifies uncertainty. Thorough GATE preparation turns exam day from a gamble into a certainty.",
    author: "Certainty",
    tag: "Preparation"
  },
  {
    dayNumber: 64,
    thought: "Bayes' Theorem updates belief based on new evidence. Update your study schedule based on real diagnostic data.",
    author: "Data Driven",
    tag: "Adaptation"
  },
  {
    dayNumber: 65,
    thought: "Discrete Mathematics is the native language of Computer Science. Logic, sets, and relations are free marks.",
    author: "Discrete Math",
    tag: "Scoring Marks"
  },
  {
    dayNumber: 66,
    thought: "Combinatorics: counting without enumerating. Systematize your approach to every question category.",
    author: "Counting Principles",
    tag: "Strategy"
  },
  {
    dayNumber: 67,
    thought: "Graph coloring and planar graphs: elegant theorems with direct GATE applications. Master the chromatic bounds.",
    author: "Graph Theorems",
    tag: "Precision"
  },
  {
    dayNumber: 68,
    thought: "General Aptitude carries 15 marks. 30 minutes of daily aptitude practice guarantees 12+ marks on exam day.",
    author: "Aptitude Advantage",
    tag: "Bonus Points"
  },
  {
    dayNumber: 69,
    thought: "Spatial aptitude and verbal logic reward calm reading. Do not rush questions; read every word carefully.",
    author: "Exam Composure",
    tag: "Reading Accuracy"
  },
  {
    dayNumber: 70,
    thought: "Day 70: Only 20 days left in the master timetable! You have already covered the entire GATE CSE syllabus.",
    author: "Countdown",
    tag: "Syllabus Mastery"
  },
  {
    dayNumber: 71,
    thought: "Full syllabus revision begins. Skim your formula sheets daily to make recall instantaneous.",
    author: "Revision Sprint",
    tag: "Instant Recall"
  },
  {
    dayNumber: 72,
    thought: "Test your speed on 1-mark questions. Clearing 1-markers in 45 minutes gives you 135 minutes for 2-markers.",
    author: "Time Allocation",
    tag: "Tactics"
  },
  {
    dayNumber: 73,
    thought: "MSQs require testing every single option independently. Never assume; verify each choice with a counterexample.",
    author: "MSQ Strategy",
    tag: "Zero False Positives"
  },
  {
    dayNumber: 74,
    thought: "NAT questions have zero negative marking but require precise decimal calculation. Double-check your final arithmetic.",
    author: "NAT Mastery",
    tag: "Calculation Rigor"
  },
  {
    dayNumber: 75,
    thought: "Day 75: 15 Days Remaining. You have built a fortress of knowledge. Now we test the gates under full pressure.",
    author: "Fortress Mindset",
    tag: "Confidence"
  },
  {
    dayNumber: 76,
    thought: "Review your top 20 Error Book traps. Knowing what NOT to do is worth 10 extra marks.",
    author: "Trap Avoidance",
    tag: "Risk Defense"
  },
  {
    dayNumber: 77,
    thought: "Simulate exact exam conditions: 9:30 AM to 12:30 PM. Train your brain to peak during real examination hours.",
    author: "Circadian Sync",
    tag: "Biometrics"
  },
  {
    dayNumber: 78,
    thought: "When you face a seemingly impossible question on test day, flag it and move on. Rank is won by maximizing easy marks.",
    author: "Exam Triage",
    tag: "Triage Strategy"
  },
  {
    dayNumber: 79,
    thought: "Speed without accuracy is catastrophic. 50 accurate marks easily beats 70 rushed marks with negative penalties.",
    author: "Accuracy King",
    tag: "Discipline"
  },
  {
    dayNumber: 80,
    thought: "Day 80: Final 10-day countdown starts today! Every single review session now cements high-probability questions.",
    author: "Final Ten",
    tag: "Lock In"
  },
  {
    dayNumber: 81,
    thought: "Revisit 10-year official GATE papers. Official question style is subtle, elegant, and predictable once you know it.",
    author: "Official PYQs",
    tag: "Pattern Mastery"
  },
  {
    dayNumber: 82,
    thought: "Trust your preparation. 82 days of honest work cannot be undermined by self-doubt.",
    author: "Unshakeable Faith",
    tag: "Belief"
  },
  {
    dayNumber: 83,
    thought: "Keep your virtual calculator practice smooth. Muscle memory with the onscreen calculator saves valuable minutes.",
    author: "Tools Mastery",
    tag: "Calculator Speed"
  },
  {
    dayNumber: 84,
    thought: "Eliminate low-yield topics now. Focus strictly on high-probability formulas in Algorithms, OS, DBMS, and TOC.",
    author: "Pareto Rule",
    tag: "80/20 Rule"
  },
  {
    dayNumber: 85,
    thought: "Day 85: 5 days to complete the 90-day master blueprint. You are operating at peak mental stamina.",
    author: "Peak Performance",
    tag: "Stamina"
  },
  {
    dayNumber: 86,
    thought: "Protect your health and sleep. A sharp, rested mind on exam morning is worth 15 marks over an exhausted one.",
    author: "Mental Clarity",
    tag: "Vitality"
  },
  {
    dayNumber: 87,
    thought: "Read question instructions twice: 'Which is FALSE?', 'Which is NOT regular?'. Avoid losing marks to silly misses.",
    author: "Question Reading",
    tag: "Trap Proof"
  },
  {
    dayNumber: 88,
    thought: "Review your cheat sheet one last time. Formulas are now etched into your subconscious mind.",
    author: "Mastery",
    tag: "Final Polish"
  },
  {
    dayNumber: 89,
    thought: "Tomorrow is Day 90. Take a moment to reflect on who you were 89 days ago versus the powerhouse engineer you are today.",
    author: "Reflection",
    tag: "Growth"
  },
  {
    dayNumber: 90,
    thought: "MISSION ACCOMPLISHED! 90 Days of relentless execution completed. You are fully equipped to dominate GATE 2027!",
    author: "AIR 1 Ready",
    tag: "Victory"
  }
];

export function getDailyThought(dayNumber: number): DailyThought {
  const normalized = Math.max(1, Math.min(90, dayNumber));
  return (
    DAILY_THOUGHTS.find((t) => t.dayNumber === normalized) ||
    DAILY_THOUGHTS[0]
  );
}
