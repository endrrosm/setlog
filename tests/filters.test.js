const {test}=require('node:test');
const assert=require('node:assert/strict');
const {programGroups,filterPrograms,filterExercises,historyProgramOptions,filterSessions}=require('../src/filters');
const {groups}=require('../src/model');
test('muscle groups use requested order and cardio works in both filters',()=>{
 assert.deepEqual(groups,['Göğüs','Omuz','Triceps','Sırt','Biceps','Bacak','Karın','Kardiyo']);
 const library=[{id:'run',name:'Koşu',group:'Kardiyo'}];
 const programs=[{id:'cardio',exercises:[{exerciseId:'run',sets:1}]}];
 assert.equal(filterExercises(library,['Kardiyo'],'').length,1);
 assert.equal(filterPrograms(programs,library,['Kardiyo']).length,1);
});
const exercises=[{id:'c',name:'Göğüs Press',group:'Göğüs'},{id:'s',name:'Omuz Press',group:'Omuz'},{id:'b',name:'SIRT Row',group:'Sırt'}];
const program=(id,ids)=>({id,exercises:ids.map(exerciseId=>({exerciseId,sets:3}))});
test('multiple muscle groups match OR, clearing includes empty programs',()=>{
 const programs=[program('chest',['c']),program('shoulder',['s']),program('both',['c','s']),program('back',['b']),program('empty',[])];
 assert.deepEqual(filterPrograms(programs,exercises,['Göğüs','Omuz']).map(p=>p.id),['chest','shoulder','both']);
 assert.deepEqual(filterPrograms(programs,exercises,['Göğüs']).map(p=>p.id),['chest','both']);
 assert.deepEqual(filterPrograms(programs,exercises,[]),programs);
 assert.deepEqual(filterPrograms(programs,exercises,['Bacak']),[]);
 assert.deepEqual(programGroups(program('dedupe',['c','c','s','missing']),exercises),['Göğüs','Omuz']);
});
test('exercise search ignores group filter and uses Turkish casing',()=>{
 assert.deepEqual(filterExercises(exercises,['Göğüs','Omuz'],'').map(e=>e.id),['c','s']);
 assert.deepEqual(filterExercises(exercises,['Göğüs'],' sırt ').map(e=>e.id),['b']);
 assert.deepEqual(filterExercises(exercises,[],'PRESS').map(e=>e.id),['c','s']);
 assert.deepEqual(filterExercises(exercises,[],''),exercises);
});
test('history selection uses stable IDs across renames and includes deleted programs',()=>{
 const sessions=[{id:'1',programId:'a',programName:'Old name'},{id:'2',programId:'deleted',programName:'Archived'},{id:'3',programId:'a',programName:'Older name'},{id:'4',programId:'b',programName:'Other'}];
 assert.deepEqual(historyProgramOptions(sessions,[{id:'a',name:'New name'}]),[{id:'a',label:'New name'},{id:'deleted',label:'Archived'},{id:'b',label:'Other'}]);
 assert.deepEqual(filterSessions(sessions,['a','deleted']).map(s=>s.id),['1','2','3']);
 assert.deepEqual(filterSessions(sessions,[]),sessions);
 assert.deepEqual(filterSessions(sessions,['missing']),[]);
});
