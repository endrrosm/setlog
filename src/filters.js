function programGroups(program, exercises) {
  return [...new Set(program.exercises.map(item => exercises.find(e => e.id === item.exerciseId)?.group).filter(Boolean))];
}
function filterPrograms(programs, exercises, selected) {
  return programs.filter(p => !selected.length || programGroups(p, exercises).some(group => selected.includes(group)));
}
function filterExercises(exercises, selected, query) {
  const search = query.trim().toLocaleLowerCase('tr');
  return exercises.filter(e => search ? e.name.toLocaleLowerCase('tr').includes(search) : !selected.length || selected.includes(e.group));
}
function historyProgramOptions(sessions, programs) {
  const options = new Map();
  for (const session of sessions) {
    if (!options.has(session.programId)) options.set(session.programId, {
      id: session.programId,
      label: programs.find(p => p.id === session.programId)?.name || session.programName,
    });
  }
  return [...options.values()];
}
function filterSessions(sessions, selected) {
  return sessions.filter(session => !selected.length || selected.includes(session.programId));
}
module.exports = { programGroups, filterPrograms, filterExercises, historyProgramOptions, filterSessions };
