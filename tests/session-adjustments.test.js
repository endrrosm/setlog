const {test}=require('node:test');
const assert=require('node:assert/strict');
const {startSession,historyFor}=require('../src/model');
const {addExtraSet,replaceSessionExercise,extraSetStatus}=require('../src/training');
const library=[{id:'smith',name:'Smith',group:'Göğüs'},{id:'dumbbell',name:'Dumbbell',group:'Göğüs'},{id:'drop',name:'Drop',group:'Göğüs',dropset:true,dropCount:3}];
const program={id:'p',name:'Push',exercises:[{exerciseId:'smith',sets:3}]};
test('extra sets stop at original count after reload and leave program intact',()=>{
 const session=startSession(program,library);
 let exercise=session.exercises[0];
 exercise.sets[0]={weight:'30',reps:'12',done:true};
 for(let i=0;i<6;i++)exercise=addExtraSet(JSON.parse(JSON.stringify(exercise)));
 assert.equal(exercise.sets.length,6);
 assert.equal(extraSetStatus(exercise).available,false);
 assert.equal(exercise.sets[0].weight,'30');
 assert.equal(startSession(program,library).exercises[0].sets.length,3);
});
test('extra drop work sets include all drops and obey work-set limit',()=>{
 let exercise=startSession({...program,exercises:[{exerciseId:'drop',sets:2}]},library).exercises[0];
 for(let i=0;i<5;i++)exercise=addExtraSet(exercise);
 assert.equal(exercise.workSets,4);
 assert.equal(exercise.sets.length,12);
 assert.deepEqual(exercise.sets.slice(-3).map(s=>[s.workSet,s.dropSet]),[[4,1],[4,2],[4,3]]);
});
test('replacement records belong to alternative and next session uses original',()=>{
 const session=startSession(program,library);
 const replaced=replaceSessionExercise(session,0,{sets:4},library[1]);
 replaced.exercises[0].sets[0]={weight:'20',reps:'12',done:true};
 assert.equal(replaced.exercises[0].sets.length,4);
 assert.equal(historyFor([replaced],'dumbbell').length,1);
 assert.equal(historyFor([replaced],'smith').length,0);
 assert.equal(startSession(program,library).exercises[0].exerciseId,'smith');
 assert.equal(session.exercises[0].sets.length,3);
});
