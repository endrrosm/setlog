const {test}=require('node:test');
const assert=require('node:assert/strict');
const {exerciseChartData,weightScale}=require('../src/chart');
const session=(day,sets,id=String(day))=>({id,date:new Date(2026,9,day,12).toISOString(),programName:day%2?'Push A':'Push B',exercises:[{exerciseId:'press',sets}]});
test('chart shows the last seven sessions chronologically with the highest completed weight',()=>{
 const sessions=Array.from({length:9},(_,i)=>session(i+1,[{done:true,weight:String(i+20)},{done:true,weight:'27,5'},{done:false,weight:'200'}]));
 const points=exerciseChartData(sessions,'press');
 assert.deepEqual(points.map(p=>p.id),['3','4','5','6','7','8','9']);
 assert.equal(points[0].weight,27.5);assert.equal(points[6].weight,28);
 assert.equal(points[0].minWeight,22);assert.equal(points[6].minWeight,27.5);
 assert.equal(points[0].programName,'Push A');assert.equal(points[1].programName,'Push B');
});
test('minimum line uses only completed sets and participates in the shared scale',()=>{
 const points=exerciseChartData([session(1,[{done:true,weight:'27,5'},{done:true,weight:'100'},{done:false,weight:'0'}]),session(2,[{done:true,weight:'0'},{done:true,weight:'90'}])],'press');
 assert.equal(points[0].minWeight,27.5);assert.equal(points[0].weight,100);
 assert.equal(points[1].minWeight,0);
 const scale=weightScale(points);
 assert.equal(scale.min,0);assert.ok(scale.max>=100);
});
test('chart handles same-day sessions, zero weights and missing records',()=>{
 const records=[session(1,[{done:true,weight:'0'}],'a'),session(1,[{done:true,weight:'10'}],'b'),session(2,[{done:false,weight:'30'}]),session(3,[{done:true,weight:''}])];
 const points=exerciseChartData(records,'press');
 assert.equal(points.length,2);assert.deepEqual(points.map(p=>p.weight).sort((a,b)=>a-b),[0,10]);
 assert.deepEqual(exerciseChartData(records,'missing'),[]);
 assert.deepEqual(exerciseChartData([],'press'),[]);
});
test('dynamic scale encloses zero, constant, decimal and widely varying weights',()=>{
 for(const values of [[0],[30],[27.5,30,32.5],[.1,.2],[0,250],[97.5,100]]){
  const scale=weightScale(values.map(weight=>({weight})));
  assert.ok(scale.max>scale.min);assert.ok(scale.min>=0);
  assert.ok(scale.min<=Math.min(...values));assert.ok(scale.max>=Math.max(...values));
  assert.ok(scale.ticks.length>=2&&scale.ticks.length<=7);
  assert.ok(scale.ticks.every(Number.isFinite));
 }
 assert.ok(weightScale([{weight:100}]).max>weightScale([{weight:10}]).max);
});
