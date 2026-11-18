const number=value=>Number(String(value??'').trim().replace(',','.'));
const bounded=(value,fallback,min,max)=>Number.isInteger(Number(value))?Math.max(min,Math.min(max,Number(value))):fallback;
const isCardio=exercise=>exercise?.group==='Kardiyo';
function planConfig(item,exercise){
 const cardio=isCardio(exercise);
 return {cardio,sets:bounded(item.sets,3,1,30),minutes:bounded(item.minutes,10,1,300),dropCount:!cardio&&exercise?.dropset?bounded(exercise.dropCount,2,2,30):0};
}
function sessionExercise(item,exercise){
 const config=planConfig(item,exercise);
 const base={exerciseId:item.exerciseId,name:exercise?.name||'Hareket',kind:config.cardio?'cardio':exercise?.bodyweight?'bodyweight':'strength'};
 if(config.cardio)return {...base,targetMinutes:config.minutes,sets:[{minutes:'',done:false}]};
 return {...base,dropCount:config.dropCount,workSets:config.sets,sets:Array.from({length:config.sets},(_,work)=>Array.from({length:config.dropCount||1},(_,drop)=>{return {...(exercise?.bodyweight?{}:{weight:''}),reps:'',done:false,...(config.dropCount?{workSet:work+1,dropSet:drop+1}:{})};})).flat()};
}
function extraSetStatus(exercise){
 const count=exercise.dropCount?exercise.workSets:exercise.sets.length;
 const base=exercise.baseSetCount??count;
 return {base,added:count-base,available:exercise.kind!=='cardio'&&count<base*2};
}
function addExtraSet(exercise){
 const status=extraSetStatus(exercise);
 if(!status.available)return exercise;
 const workSet=(exercise.workSets||exercise.sets.length)+1;
 const sets=Array.from({length:exercise.dropCount||1},(_,index)=>({
  ...(exercise.kind==='bodyweight'?{}:{weight:''}),reps:'',done:false,
  ...(exercise.dropCount?{workSet,dropSet:index+1}:{})
 }));
 return {...exercise,baseSetCount:status.base,workSets:workSet,sets:[...exercise.sets,...sets]};
}
function replaceSessionExercise(session,index,item,definition){
 if(!session||!session.exercises[index]||!definition||session.exercises.some((e,i)=>i!==index&&e.exerciseId===definition.id))return session;
 const replacement=sessionExercise({...item,exerciseId:definition.id},definition);
 return {...session,exercises:session.exercises.map((e,i)=>i===index?replacement:e)};
}
function validMinutes(value){return String(value??'').trim()!==''&&Number.isFinite(number(value))&&number(value)>0;}
function setLabel(set,index){return set.workSet?`${set.workSet}. work-set / ${set.dropSet}. drop-set`:`${index+1}. set`;}
function resultText(exercise,set){
 if(exercise.kind==='cardio')return set.minutes+' dk';
 if(exercise.kind==='bodyweight')return set.reps+' tekrar';
 return set.weight+' kg × '+set.reps+' tekrar';
}
function recordText(exercise,set,index){
 const result=resultText(exercise,set);
 return exercise.kind==='cardio'?result:setLabel(set,index)+': '+result;
}
function recordLines(exercise){
 const rows=new Map();
 exercise.sets.forEach((set,index)=>{
  if(!set.done)return;
  if(!set.workSet){rows.set('set'+index,recordText(exercise,set,index));return;}
  const prefix=rows.has(set.workSet)?rows.get(set.workSet)+' + ':set.workSet+'. work-set / ';
  rows.set(set.workSet,prefix+resultText(exercise,set));
 });
 return [...rows.values()];
}
function itemLabel(item,exercise){const c=planConfig(item,exercise);return c.cardio?`${c.minutes} dk`:c.dropCount?`${c.sets} work-set × ${c.dropCount} drop-set`:`${c.sets} set`;}
function programSummary(program,exercises){let sets=0,minutes=0;for(const item of program.exercises){const c=planConfig(item,exercises.find(e=>e.id===item.exerciseId));if(c.cardio)minutes+=c.minutes;else sets+=c.sets*(c.dropCount||1);}return [sets?`${sets} set`:null,minutes?`${minutes} dk kardiyo`:null].filter(Boolean).join(' · ')||'Henüz hareket yok';}
function sessionSummary(session){let sets=0,minutes=0;for(const e of session.exercises){for(const set of e.sets){if(!set.done)continue;if(e.kind==='cardio')minutes+=number(set.minutes)||0;else sets++;}}return [sets?`${sets} set`:null,minutes?`${minutes.toLocaleString('tr-TR')} dk kardiyo`:null].filter(Boolean).join(' · ')||'Henüz tamamlanmadı';}
module.exports={extraSetStatus,addExtraSet,replaceSessionExercise,number,isCardio,planConfig,sessionExercise,validMinutes,setLabel,recordText,recordLines,itemLabel,programSummary,sessionSummary};
