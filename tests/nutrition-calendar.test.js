const {test}=require('node:test');
const assert=require('node:assert/strict');
const {shiftDay,selectDay}=require('../src/nutritionCalendar');
test('day arrows cross month and year boundaries one day at a time',()=>{
 assert.equal(shiftDay('2026-01-01',-1),'2025-12-31');
 assert.equal(shiftDay('2024-02-28',1),'2024-02-29');
 assert.equal(shiftDay('2024-02-29',1),'2024-03-01');
});
test('selection stays visible in seven days and cannot pass today',()=>{
 const today='2026-11-18';
 assert.deepEqual(selectDay('2026-11-17',today,today),{date:'2026-11-17',week:today});
 assert.deepEqual(selectDay('2026-11-11',today,today),{date:'2026-11-11',week:'2026-11-17'});
 assert.deepEqual(selectDay(today,'2026-11-17',today),{date:today,week:today});
 assert.deepEqual(selectDay('2026-11-19',today,today),{date:today,week:today});
});
