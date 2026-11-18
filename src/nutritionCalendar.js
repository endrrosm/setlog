const {localDateKey}=require('./history');
function shiftDay(key,delta){
 const date=new Date(key+'T12:00:00');
 date.setDate(date.getDate()+delta);
 return localDateKey(date);
}
function selectDay(next,week,today){
 const date=next>today?today:next;
 const end=week>today?today:week;
 return {date,week:date>end?date:date<shiftDay(end,-6)?shiftDay(date,6):end};
}
module.exports={shiftDay,selectDay};
