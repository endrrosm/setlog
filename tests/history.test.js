const {test}=require('node:test');
const assert=require('node:assert/strict');
const {localDateKey,historicalDate,deleteHistorySession,sortedSessions}=require('../src/history');
const {historyProgramOptions}=require('../src/filters');
const {initialState,startSession}=require('../src/model');
test('historical dates reject future and impossible dates and preserve the local day',()=>{
 const now=new Date(2026,10,2,18);
 for(const key of ['2026-11-03','2026-02-30','2026-13-01','2026-00-00','invalid','2025-02-29'])assert.equal(historicalDate(key,now),null);
 for(const key of ['2026-11-02','2026-10-31','2024-02-29'])assert.equal(localDateKey(new Date(historicalDate(key,now))),key);
});
test('deleting one session preserves same-program records and removes filter only after the last record',()=>{
 const state={...initialState(),programs:[{id:'a',name:'A'},{id:'b',name:'B'},{id:'empty',name:'No records'}],exercises:[{id:'e'}],sessions:[{id:'1',programId:'a',programName:'Old A'},{id:'2',programId:'b',programName:'B'},{id:'3',programId:'a',programName:'A'}],active:{programId:'a'}};
 const next=deleteHistorySession(state,'1');
 assert.deepEqual(next.sessions.map(s=>s.id),['2','3']);
 assert.equal(next.programs,state.programs);assert.equal(next.exercises,state.exercises);assert.equal(next.active,state.active);
 assert.deepEqual(historyProgramOptions(next.sessions,next.programs),[{id:'b',label:'B'},{id:'a',label:'A'}]);
 assert.equal(state.sessions.length,3);
 const lastRemoved=deleteHistorySession(next,'3');
 assert.deepEqual(historyProgramOptions(lastRemoved.sessions,lastRemoved.programs),[{id:'b',label:'B'}]);
 assert.deepEqual(historyProgramOptions(deleteHistorySession(lastRemoved,'2').sessions,next.programs),[]);
 assert.deepEqual(deleteHistorySession(state,'missing').sessions,state.sessions);
});
test('backdated workout uses selected date and sorts behind more recent sessions',()=>{
 const date=historicalDate('2026-10-01',new Date(2026,10,2));
 const session=startSession({id:'p',name:'Push',exercises:[{exerciseId:'e',sets:3}]},[{id:'e',name:'Press'}],date);
 assert.equal(session.date,date);assert.equal(session.exercises[0].sets.length,3);
 const records=[session,{id:'recent',date:'2026-11-01T12:00:00.000Z'},{id:'old',date:'2026-09-01T12:00:00.000Z'}];
 assert.deepEqual(sortedSessions(records).map(s=>s.id),['recent',session.id,'old']);
 assert.equal(records[0],session);
});
