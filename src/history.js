function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function historicalDate(value, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month-1, day, 12);
  if (localDateKey(date) !== value || value > localDateKey(now)) return null;
  return date.toISOString();
}
function deleteHistorySession(state, sessionId) {
  return {...state, sessions: state.sessions.filter(session => session.id !== sessionId)};
}
function sortedSessions(sessions) { return [...sessions].sort((a,b)=>new Date(b.date)-new Date(a.date)); }
module.exports = {localDateKey, historicalDate, deleteHistorySession, sortedSessions};
