
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function aiChat(message){
  const r = await fetch(`${API}/api/ai/chat`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ message })
  })
  if(!r.ok){
    const t = await r.text()
    throw new Error(t || 'AI error')
  }
  return r.json()
}
