const planDays = require('../data/gate/plan-90-days.json');

function testSearch(query) {
  const lower = query.toLowerCase();
  console.log(`\n--- Searching for: "${query}" ---`);
  
  const matches = planDays.filter(d => 
    d.topic.toLowerCase().includes(lower) || 
    (d.subtopics && d.subtopics.some(s => s.toLowerCase().includes(lower))) ||
    d.subject.toLowerCase().includes(lower)
  );
  
  console.log(`Found ${matches.length} matches:`);
  matches.slice(0, 3).forEach(m => {
    console.log(`- Day ${m.dayNumber}: ${m.topic} (${m.subject})`);
    console.log(`  Video: ${m.exactResources?.videos?.[0]?.directUrl || m.exactResources?.videos?.[0]?.roadmapUrl}`);
    console.log(`  PYQ: ${m.exactResources?.pyqs?.[0]?.url}`);
  });
}

testSearch("cache memory");
testSearch("paging");
testSearch("dijkstra");
testSearch("binary search tree");
