const { test } = require('node:test');
const assert = require('node:assert/strict');
const { startSession, validSet, historyFor, completedCount } = require('../src/model');
const { initialState, deleteProgram, deleteExercise, recentHistory } = require('../src/model');
test('program set counts become independent workout snapshots', () => {
 const p={id:'p',name:'Push',exercises:[{exerciseId:'e',sets:3}]};
 const s=startSession(p,[{id:'e',name:'Press'}]);
 s.exercises[0].sets[0].weight='30';
 assert.equal(s.exercises[0].sets.length,3); assert.equal(s.exercises[0].sets[1].weight,'');
 p.name='Changed'; assert.equal(s.programName,'Push');
});
test('set validation supports decimal comma and bodyweight, rejects invalid values',()=>{
 for(const weight of ['0','27,5','30']) assert.equal(validSet({weight,reps:'8'}),true);
 for(const set of [{weight:'',reps:'8'},{weight:'-1',reps:'8'},{weight:'20',reps:'0'},{weight:'20',reps:'2.5'},{weight:'Infinity',reps:'8'}]) assert.equal(validSet(set),false);
});
test('history combines programs and excludes unfinished sets',()=>{
 const make=(id,date,done)=>({programId:id,date,exercises:[{exerciseId:'e',sets:[{weight:'20',reps:'8',done}]}]});
 const sessions=[make('a','2026-10-01',true),make('b','2026-10-03',true),make('c','2026-10-04',false)];
 assert.deepEqual(historyFor(sessions,'e').map(s=>s.programId),['b','a']);
 assert.equal(completedCount(sessions[0]),1);
});
test('deleting a program preserves exercise library, historical and active snapshots',()=>{
 const p={id:'p',name:'Push',exercises:[{exerciseId:'e',sets:1}]};
 const exercises=[{id:'e',name:'Press'}];
 const active=startSession(p,exercises);
 const state={...initialState(),exercises,programs:[p,{...p,id:'other'}],sessions:[active],active};
 const next=deleteProgram(state,'p');
 assert.deepEqual(next.programs.map(p=>p.id),['other']);
 assert.equal(next.exercises,state.exercises); assert.equal(next.sessions,state.sessions); assert.equal(next.active,active);
 assert.equal(state.programs.length,2);
});
test('deleting an exercise removes all program references without changing workout records',()=>{
 const exercises=[{id:'e',name:'Press'},{id:'keep',name:'Row'}];
 const p={id:'p',name:'Push',exercises:[{exerciseId:'e',sets:1}]};
 const active=startSession(p,exercises); active.exercises[0].sets[0]={weight:'20',reps:'8',done:true};
 const state={...initialState(),exercises,programs:[p,{...p,id:'other',exercises:[...p.exercises,{exerciseId:'keep',sets:2}]}],sessions:[active],active};
 const next=deleteExercise(state,'e');
 assert.deepEqual(next.exercises.map(e=>e.id),['keep']);
 assert.deepEqual(next.programs.map(p=>p.exercises),[[],[{exerciseId:'keep',sets:2}]]);
 assert.equal(next.active,active); assert.equal(historyFor(next.sessions,'e')[0].exercise.name,'Press');
 assert.equal(state.programs[0].exercises.length,1);
});
test('recent history returns up to three newest completed records across programs',()=>{
 const make=(day,done=true)=>({id:day,programId:day,date:`2026-10-${day}`,exercises:[{exerciseId:'e',sets:[{weight:'30',reps:'8',done}]}]});
 const records=[make('01'),make('04'),make('05',false),make('02'),make('03')];
 assert.deepEqual(recentHistory(records,'e').map(x=>x.id),['04','03','02']);
 assert.equal(recentHistory(records.slice(0,1),'e').length,1);
 assert.deepEqual(recentHistory(records,'missing'),[]);
});
