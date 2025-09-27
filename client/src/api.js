
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function authHeaders(){
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

export async function login(username, password){
  const r = await fetch(`${API}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password}) })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function createInvite(){
  const r = await fetch(`${API}/api/vendor/invites`, { method:'POST' })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function contractWebhook(token){
  const r = await fetch(`${API}/api/contract/webhook`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token}) })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function getDistributorTasks(){
  const r = await fetch(`${API}/api/distributor/tasks`, { headers: authHeaders() })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}
export async function completeDistributorTask(id){
  const r = await fetch(`${API}/api/distributor/tasks/${id}/complete`, { method:'POST', headers:{...authHeaders(), 'Content-Type':'application/json'} })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function getMetrics(){
  const r = await fetch(`${API}/api/vendor/metrics`)
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}
export async function getDistributors(){
  const r = await fetch(`${API}/api/vendor/distributors`)
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function getScopedAnnouncements(){ const r = await fetch(`${API}/api/vendor/announcements`); if(!r.ok) throw new Error(await r.text()); return r.json() }
export async function addScopedAnnouncement(payload){ const r = await fetch(`${API}/api/vendor/announcements`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)}); if(!r.ok) throw new Error(await r.text()); return r.json() }

export async function getScopedTasks(){ const r = await fetch(`${API}/api/vendor/tasks`); if(!r.ok) throw new Error(await r.text()); return r.json() }
export async function addScopedTask(payload){ const r = await fetch(`${API}/api/vendor/tasks`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)}); if(!r.ok) throw new Error(await r.text()); return r.json() }
