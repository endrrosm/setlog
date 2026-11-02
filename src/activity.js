const {localDateKey}=require('./history');
function shiftDay(date,offset){return new Date(date.getFullYear(),date.getMonth(),date.getDate()+offset,12);}
function workoutCounts(sessions){
 const counts={};
 for(const session of sessions){
  if(!session.exercises.some(e=>e.sets.some(s=>s.done)))continue;
  const key=localDateKey(new Date(session.date));counts[key]=(counts[key]||0)+1;
 }
 return counts;
}
function weekDays(today,offset=0){return Array.from({length:7},(_,i)=>shiftDay(today,offset-6+i));}
function currentStreak(counts,today=new Date()){
 let cursor=shiftDay(today,counts[localDateKey(today)]?0:-1),streak=0;
 while(counts[localDateKey(cursor)]){streak++;cursor=shiftDay(cursor,-1);}
 return streak;
}
function moveCalendar(offset,delta){return Math.min(0,offset+delta);}
function swipeDays(distance,width){return width>0?-Math.round(distance/(width/7)):0;}
module.exports={shiftDay,workoutCounts,weekDays,currentStreak,moveCalendar,swipeDays};
