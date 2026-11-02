const {test}=require('node:test');
const assert=require('node:assert/strict');
const {workoutCounts,weekDays,currentStreak,moveCalendar,swipeDays}=require('../src/activity');
const {localDateKey}=require('../src/history');
test('visible week includes today and crosses month and year boundaries',()=>{
 assert.deepEqual(weekDays(new Date(2026,0,3,12)).map(localDateKey),['2025-12-28','2025-12-29','2025-12-30','2025-12-31','2026-01-01','2026-01-02','2026-01-03']);
 assert.equal(localDateKey(weekDays(new Date(2026,10,2,12),-7)[6]),'2026-10-26');
 assert.deepEqual(weekDays(new Date(2026,10,2,12),-2).map(localDateKey),['2026-10-25','2026-10-26','2026-10-27','2026-10-28','2026-10-29','2026-10-30','2026-10-31']);
});
test('weekly total counts multiple workouts but excludes incomplete sessions',()=>{
 const session=(date,done)=>({date:new Date(date+'T12:00:00').toISOString(),exercises:[{sets:[{done}]}]});
 const counts=workoutCounts([session('2026-11-02',true),session('2026-11-02',true),session('2026-11-01',true),session('2026-10-31',false)]);
 assert.deepEqual(counts,{'2026-11-02':2,'2026-11-01':1});
 assert.equal(weekDays(new Date(2026,10,2,12)).reduce((sum,date)=>sum+(counts[localDateKey(date)]||0),0),3);
 assert.equal(currentStreak(counts,new Date(2026,10,2,12)),2);
});
test('streak allows today to remain unfinished but breaks after a missed day',()=>{
 const counts={'2026-10-30':1,'2026-10-31':2,'2026-11-01':1};
 assert.equal(currentStreak(counts,new Date(2026,10,2,12)),3);
 assert.equal(currentStreak(counts,new Date(2026,10,3,12)),0);
 assert.equal(currentStreak({},new Date(2026,10,2,12)),0);
});
test('arrow actions commit a single offset with matching range and count, never an old scroll offset',()=>{
 const today=new Date(2026,10,2,12),counts={'2026-11-02':3,'2026-11-01':1};
 let offset=0;
 const states=[];
 for(const delta of [-1,-1,1]){
  offset=moveCalendar(offset,delta);
  const days=weekDays(today,offset);
  states.push({offset,last:localDateKey(days[6]),total:days.reduce((sum,date)=>sum+(counts[localDateKey(date)]||0),0)});
 }
 assert.deepEqual(states,[{offset:-1,last:'2026-11-01',total:1},{offset:-2,last:'2026-10-31',total:0},{offset:-1,last:'2026-11-01',total:1}]);
 assert.equal(moveCalendar(0,1),0);
});
test('swipes change days once on release and respect the visible day width',()=>{
 assert.equal(swipeDays(100,350),-2);
 assert.equal(swipeDays(-100,350),2);
 assert.equal(moveCalendar(-2,swipeDays(-200,350)),0);
 assert.equal(swipeDays(100,0),0);
});
