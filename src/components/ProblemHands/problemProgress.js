// Tracks which Problem Hands the member has played, so the list can show a tick.
// Stored in localStorage (per device), mirroring the trainers' completed-problem
// convention (`bridgechamps_trainer_completed_<cat>`): a { [id]: true } map.
const KEY = "bridgechamps_ph_played";

export function getPlayedMap() {
  try {
    if (typeof localStorage === "undefined") return {};
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function markPlayed(id) {
  try {
    if (typeof localStorage === "undefined" || !id) return;
    const map = getPlayedMap();
    if (map[id]) return;
    map[id] = true;
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch (e) {
    // ignore
  }
}
