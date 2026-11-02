function dateLabel(value) {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.toLocaleDateString('tr-TR', {day:'numeric',month:'long',year:'numeric'})} ${date.toLocaleDateString('tr-TR', {weekday:'long'})}`;
}
function sessionProgress(session) {
  const sets=session.exercises.flatMap(exercise=>exercise.sets);
  return sets.length?Math.round(sets.filter(set=>set.done).length/sets.length*100):0;
}
module.exports={dateLabel,sessionProgress};
