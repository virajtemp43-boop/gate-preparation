const fs = require('fs');
const path = require('path');

const exactMapPath = path.join(__dirname, '../data/gate/exact-resource-map.json');
const planDaysPath = path.join(__dirname, '../data/gate/plan-90-days.json');

const exactMap = JSON.parse(fs.readFileSync(exactMapPath, 'utf8'));
const planDays = JSON.parse(fs.readFileSync(planDaysPath, 'utf8'));

function getTopicMcqUrl(subject, topic) {
  const s = subject.toLowerCase();
  const t = topic.toLowerCase();

  if (s.includes('operating system') || s.includes('os')) {
    return {
      title: `Exact Topic MCQs: ${topic}`,
      url: 'https://www.geeksforgeeks.org/operating-systems-gq/',
      provider: 'GeeksforGeeks'
    };
  }
  if (s.includes('database') || s.includes('dbms')) {
    return {
      title: `Exact Topic MCQs: ${topic}`,
      url: 'https://www.geeksforgeeks.org/dbms-gq/',
      provider: 'GeeksforGeeks'
    };
  }
  if (s.includes('computer network') || s.includes('cn')) {
    return {
      title: `Exact Topic MCQs: ${topic}`,
      url: 'https://www.geeksforgeeks.org/computer-networks-gq/',
      provider: 'GeeksforGeeks'
    };
  }
  if (s.includes('organization') || s.includes('architecture') || s.includes('coa')) {
    return {
      title: `Exact Topic MCQs: ${topic}`,
      url: 'https://www.geeksforgeeks.org/computer-organization-and-architecture-gq/',
      provider: 'GeeksforGeeks'
    };
  }
  if (s.includes('computation') || s.includes('toc') || s.includes('automata')) {
    return {
      title: `Exact Topic MCQs: ${topic}`,
      url: 'https://www.geeksforgeeks.org/theory-of-computation-automata-theory-gq/',
      provider: 'GeeksforGeeks'
    };
  }
  if (s.includes('compiler')) {
    return {
      title: `Exact Topic MCQs: ${topic}`,
      url: 'https://www.geeksforgeeks.org/compiler-design-gq/',
      provider: 'GeeksforGeeks'
    };
  }
  if (s.includes('digital')) {
    return {
      title: `Exact Topic MCQs: ${topic}`,
      url: 'https://www.geeksforgeeks.org/digital-electronics-logic-design-tutorials/',
      provider: 'GeeksforGeeks'
    };
  }
  if (s.includes('discrete math')) {
    return {
      title: `Exact Topic MCQs: ${topic}`,
      url: 'https://www.geeksforgeeks.org/discrete-mathematics-gq/',
      provider: 'GeeksforGeeks'
    };
  }
  if (s.includes('algorithm')) {
    return {
      title: `Exact Topic MCQs: ${topic}`,
      url: 'https://www.geeksforgeeks.org/algorithms-gq/',
      provider: 'GeeksforGeeks'
    };
  }
  if (s.includes('c prog') || t.includes('c ') || t.includes('pointer') || t.includes('array')) {
    return {
      title: `Exact Topic MCQs: ${topic}`,
      url: 'https://www.geeksforgeeks.org/c-programming-multiple-choice-questions/',
      provider: 'GeeksforGeeks'
    };
  }
  if (s.includes('data structure') || t.includes('tree') || t.includes('stack') || t.includes('queue') || t.includes('graph')) {
    return {
      title: `Exact Topic MCQs: ${topic}`,
      url: 'https://www.geeksforgeeks.org/data-structure-gq/',
      provider: 'GeeksforGeeks'
    };
  }
  
  // Default to GATE CS MCQs
  return {
    title: `Exact Topic MCQs: ${topic}`,
    url: 'https://www.geeksforgeeks.org/gate-cs-notes-gq/',
    provider: 'GeeksforGeeks'
  };
}

let count = 0;
for (const dayNum of Object.keys(exactMap)) {
  const day = exactMap[dayNum];
  day.mcqs = getTopicMcqUrl(day.subject, day.topic);
  count++;
}

planDays.forEach(day => {
  const mcqs = getTopicMcqUrl(day.subject, day.topic);
  if (day.exactResources) {
    day.exactResources.mcqs = mcqs;
  } else {
    day.exactResources = {
      day: day.dayNumber,
      date: day.date,
      subject: day.subject,
      topic: day.topic,
      videos: [],
      pyqs: [],
      mcqs: mcqs,
      subtopics: day.subtopics || []
    };
  }
});

fs.writeFileSync(exactMapPath, JSON.stringify(exactMap, null, 2), 'utf8');
fs.writeFileSync(planDaysPath, JSON.stringify(planDays, null, 2), 'utf8');

console.log(`Successfully added Exact Topic MCQs to all ${count} days in exact-resource-map.json and plan-90-days.json!`);
