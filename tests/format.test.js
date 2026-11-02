const {test}=require('node:test');
const assert=require('node:assert/strict');
const {dateLabel,sessionProgress}=require('../src/format');
test('full dates include Turkish weekday after the year',()=>{
 assert.equal(dateLabel(new Date(2026,10,2,12)),'2 Kasım 2026 Pazartesi');
 assert.equal(dateLabel(new Date(2026,10,1,12)),'1 Kasım 2026 Pazar');
});
test('history progress counts completed sets across all exercise snapshots',()=>{
 const session={exercises:[{sets:[{done:true},{done:false}]},{sets:[{done:true},{done:false}]}]};
 assert.equal(sessionProgress(session),50);
 assert.equal(sessionProgress({exercises:[{sets:[{done:true}]}]}),100);
 assert.equal(sessionProgress({exercises:[]}),0);
 assert.equal(sessionProgress({exercises:[{sets:[{done:true},{done:false},{done:false}]}]}),33);
});
