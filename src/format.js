function dateLabel(value) {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.toLocaleDateString('tr-TR', {day:'numeric',month:'long',year:'numeric'})} ${date.toLocaleDateString('tr-TR', {weekday:'long'})}`;
}
function sessionDateLabel(session) {
  const date=dateLabel(session.date);
  if(session.historical)return date;
  const start=new Date(session.startedAt || session.date);
  if(!Number.isFinite(start.getTime()))return date;
  const time=start.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit',hour12:false});
  const label=date+' · Başlangıç '+time;
  if(!session.finishedAt)return label;
  const minutes=Math.floor((new Date(session.finishedAt)-start)/60000);
  if(!Number.isFinite(minutes)||minutes<0)return label;
  if(minutes<60)return label+' · '+minutes+' dk';
  return label+' · '+Math.floor(minutes/60)+' saat '+(minutes%60)+' dakika';
}
function sessionProgress(session) {
  const sets=session.exercises.flatMap(exercise=>exercise.sets);
  return sets.length?Math.round(sets.filter(set=>set.done).length/sets.length*100):0;
}
module.exports={dateLabel,sessionDateLabel,sessionProgress};
