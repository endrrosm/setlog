const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
const {sessionExercise}=require('./training');
const groups = ['Göğüs', 'Omuz', 'Triceps', 'Sırt', 'Biceps', 'Bacak', 'Karın', 'Kardiyo'];
function initialState() {
  return { version: 1, exercises: [], programs: [], sessions: [], active: null };
}
function startSession(program, exercises, now = new Date().toISOString()) {
  return { id: uid(), programId: program.id, programName: program.name, date: now,
    exercises: program.exercises.map(item => sessionExercise(item,exercises.find(e=>e.id===item.exerciseId))) };
}
function validSet(set,kind='strength') {
  const weight = String(set.weight).trim().replace(',', '.');
  const reps = String(set.reps).trim();
  return (kind==='bodyweight' || (weight !== '' && Number.isFinite(Number(weight)) && Number(weight) >= 0)) && /^\d+$/.test(reps) && Number(reps) > 0;
}
function historyFor(sessions, exerciseId) {
  return sessions.filter(s => s.exercises.some(e => e.exerciseId === exerciseId && e.sets.some(t => t.done)))
    .map(s => ({ ...s, exercise: s.exercises.find(e => e.exerciseId === exerciseId) }))
    .sort((a,b) => new Date(b.date) - new Date(a.date));
}
function completedCount(session) { return session?.exercises.reduce((n,e) => n + e.sets.filter(s => s.done).length, 0) || 0; }
function deleteProgram(state, id) {
  return { ...state, programs: state.programs.filter(p => p.id !== id) };
}
function deleteExercise(state, id) {
  return { ...state, exercises: state.exercises.filter(e => e.id !== id),
    programs: state.programs.map(p => ({ ...p, exercises: p.exercises.filter(e => e.exerciseId !== id) })) };
}
function recentHistory(sessions, exerciseId) { return historyFor(sessions, exerciseId).slice(0, 3); }
module.exports = { uid, groups, initialState, startSession, validSet, historyFor, completedCount, deleteProgram, deleteExercise, recentHistory };
