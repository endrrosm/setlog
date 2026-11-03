const {test}=require('node:test');
const assert=require('node:assert/strict');
const {startSession,completedCount,historyFor}=require('../src/model');
const {planConfig,validMinutes,recordText,itemLabel,programSummary,sessionSummary}=require('../src/training');
const {exerciseChartData}=require('../src/chart');
const {sessionProgress}=require('../src/format');
const library=[{id:'run',name:'Koşu',group:'Kardiyo'},{id:'drop',name:'Press',group:'Göğüs',dropset:true,dropCount:2},{id:'row',name:'Row',group:'Sırt'}];
const program={id:'p',name:'Mixed',exercises:[{exerciseId:'run',minutes:20},{exerciseId:'drop',sets:3},{exerciseId:'row',sets:2}]};
test('mixed program snapshots cardio minutes, independent work/drop sets and standard sets',()=>{
 const s=startSession(program,library);
 assert.equal(s.exercises[0].kind,'cardio');assert.equal(s.exercises[0].targetMinutes,20);
 assert.deepEqual(s.exercises[0].sets,[{minutes:'',done:false}]);
 assert.equal(s.exercises[1].sets.length,6);
 assert.deepEqual(s.exercises[1].sets.map(t=>[t.workSet,t.dropSet]),[[1,1],[1,2],[2,1],[2,2],[3,1],[3,2]]);
 s.exercises[1].sets[0].weight='40';assert.equal(s.exercises[1].sets[1].weight,'');
 assert.equal(s.exercises[2].sets.length,2);
 assert.equal(programSummary(program,library),'8 set · 20 dk kardiyo');
 assert.equal(itemLabel(program.exercises[1],library[1]),'3 work-set × 2 drop-set');
});
test('new sessions ignore legacy drop targets',()=>{
 const p={id:'p',name:'Drop',exercises:[{exerciseId:'drop',sets:1,dropTargets:{'1:1':{weight:'40',reps:'8'},'1:2':{weight:'30',reps:'10'}}}]};
 const s=startSession(p,library);
 assert.equal(completedCount(s),0);assert.equal(s.exercises[0].sets[0].weight,'');
 s.exercises[0].sets[0].weight='42,5';assert.equal(p.exercises[0].dropTargets['1:1'].weight,'40');
 assert.equal(s.exercises[0].sets[1].weight,'');
});
test('cardio validates positive minutes; legacy plans default to ten minutes and drops never below two',()=>{
 for(const value of ['1','0,5','20.5'])assert.equal(validMinutes(value),true);
 for(const value of ['',0,'-2','abc','Infinity'])assert.equal(validMinutes(value),false);
 assert.equal(planConfig({sets:3},library[0]).minutes,10);
 assert.equal(planConfig({sets:2},{...library[1],dropCount:1}).dropCount,2);
 assert.equal(planConfig({sets:2},{...library[0],dropset:true,dropCount:3}).dropCount,0);
});
test('recording, reload, history and charts preserve cardio and drop metadata',()=>{
 const s=startSession(program,library,'2026-11-02T12:00:00Z');
 s.exercises[0].sets[0]={minutes:'22,5',done:true};
 Object.assign(s.exercises[1].sets[0],{weight:'40',reps:'8',done:true});
 Object.assign(s.exercises[1].sets[1],{weight:'30',reps:'10',done:true});
 const restored=JSON.parse(JSON.stringify(s));
 assert.equal(completedCount(restored),3);assert.equal(sessionProgress(restored),33);
 assert.equal(sessionSummary(restored),'2 set · 22,5 dk kardiyo');
 const cardio=historyFor([restored],'run')[0].exercise;
 assert.equal(recordText(cardio,cardio.sets[0],0),'22,5 dk');
 assert.equal(exerciseChartData([restored],'run','duration')[0].weight,22.5);
 assert.deepEqual(exerciseChartData([restored],'run'),[]);
 const drop=historyFor([restored],'drop')[0].exercise;
 assert.match(recordText(drop,drop.sets[1],1),/1\. work-set \/ 2\. drop-set/);
 const chart=exerciseChartData([restored],'drop')[0];assert.equal(chart.weight,40);assert.equal(chart.minWeight,30);
 library[1].dropCount=4;assert.equal(restored.exercises[1].dropCount,2);library[1].dropCount=2;
});
test('legacy strength records are not misinterpreted as minutes',()=>{
 const legacy={id:'old',date:'2026-10-01',programName:'Old',exercises:[{exerciseId:'run',sets:[{weight:'20',reps:'10',done:true}]}]};
 assert.equal(exerciseChartData([legacy],'run')[0].weight,20);
 assert.deepEqual(exerciseChartData([legacy],'run','duration'),[]);
 assert.equal(recordText(legacy.exercises[0],legacy.exercises[0].sets[0],0),'1. set: 20 kg × 10 tekrar');
});

test('bodyweight drops log repetitions, group by work-set and chart completed sets',()=>{
 const exercises=[{...library[1],bodyweight:true}];
 const session=startSession({ ...program,exercises:[{exerciseId:'drop',sets:2}]},exercises);
 const exercise=session.exercises[0];
 for(const [index,reps] of ['15','10','8'].entries())Object.assign(exercise.sets[index],{reps,done:true});
 assert.equal(require('../src/model').validSet(exercise.sets[0],exercise.kind),true);
 assert.deepEqual(require('../src/training').recordLines(exercise),['1. work-set / 15 tekrar + 10 tekrar','2. work-set / 8 tekrar']);
 const [point]=exerciseChartData([session],'drop','reps');
 assert.equal(point.weight,15);assert.equal(point.minWeight,8);
 assert.deepEqual(exerciseChartData([session],'drop','weight'),[]);
});
