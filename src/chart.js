const {historyFor}=require('./model');
function exerciseChartData(sessions,exerciseId,metric='weight'){
 return historyFor(sessions,exerciseId).map(entry=>{
  if(metric==='duration'){
   if(entry.exercise.kind!=='cardio')return null;
   const minutes=entry.exercise.sets.filter(set=>set.done).map(set=>Number(String(set.minutes??'').replace(',','.'))).filter(value=>Number.isFinite(value)&&value>0);
   return minutes.length?{exercise:entry.exercise,id:entry.id,date:entry.date,programName:entry.programName,weight:minutes.reduce((sum,value)=>sum+value,0)}:null;
  }
  if(entry.exercise.kind==='cardio'||(entry.exercise.kind==='bodyweight')!==(metric==='reps'))return null;
  const weights=entry.exercise.sets.filter(set=>set.done).map(set=>String(metric==='reps'?set.reps:set.weight).trim()).filter(Boolean).map(value=>Number(value.replace(',','.'))).filter(value=>Number.isFinite(value)&&value>=0);
  return weights.length?{exercise:entry.exercise,id:entry.id,date:entry.date,programName:entry.programName,weight:Math.max(...weights),minWeight:Math.min(...weights)}:null;
 }).filter(Boolean).slice(0,7).reverse();
}
function weightScale(points){
 if(!points.length)return {min:0,max:1,ticks:[0,.25,.5,.75,1]};
 const values=points.flatMap(point=>[point.weight,point.minWeight??point.weight]),low=Math.min(...values),high=Math.max(...values);
 const padding=Math.max((high-low)*.15,high*.05,.5);
 const bottom=Math.max(0,low-padding),top=high+padding;
 const rawStep=(top-bottom)/4,power=10**Math.floor(Math.log10(rawStep));
 const step=([1,2,2.5,5,10].find(n=>n>=rawStep/power)||10)*power;
 const min=Math.floor(bottom/step)*step,max=Math.ceil(top/step)*step;
 const ticks=Array.from({length:Math.round((max-min)/step)+1},(_,i)=>Number((min+i*step).toPrecision(12)));
 return {min,max,ticks};
}
module.exports={exerciseChartData,weightScale};
