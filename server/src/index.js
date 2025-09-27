
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

// ---- In-memory DB ----
const ROLES = ['Sales','Marketing','Technical']
const REGIONS = ['NY','Berlin','Tokyo']

const users = {
  'vendor_admin': {
    username: 'vendor_admin',
    password: 'vendor',
    role: 'vendor',
    region: 'Global',
    contractSigned: true
  }
}
const distributors = [
  { id:'u1', Name:'Sarah Johnson', Role:'Sales', Region:'NY', Contract:'✅', Progress:'85%', lastActiveHours:2 },
  { id:'u2', Name:'Liu Wei', Role:'Marketing', Region:'Tokyo', Contract:'✅', Progress:'60%', lastActiveHours:5 },
  { id:'u3', Name:'Bob Martin', Role:'Technical', Region:'Berlin', Contract:'❌', Progress:'10%', lastActiveHours:999 },
]

// Scoped announcements/tasks
const scopedAnnouncements = [] // {text, role, region, createdAt}
const scopedTasks = [] // {text, role, region, createdAt}

const history = [] // {ts, actor, event}

function tokenFor(username){
  const u = users[username]
  return jwt.sign({ sub: username, role: u.role, contractSigned: !!u.contractSigned }, JWT_SECRET, { expiresIn: '12h' })
}

function auth(req,res,next){
  const h = req.headers.authorization || ''
  const t = h.startsWith('Bearer ') ? h.slice(7) : null
  if(!t) return res.status(401).json({error:'missing token'})
  try{
    req.user = jwt.verify(t, JWT_SECRET)
    next()
  }catch(e){
    res.status(401).json({error:'invalid token'})
  }
}

// -------- Vendor: create invite token (demo) --------
const invites = {} // token -> { used, createdAt }
app.post('/api/vendor/invites', (req,res)=>{
  const token = uuid()
  invites[token] = { used:false, createdAt: Date.now() }
  res.json({ token, inviteLink:`/invite?token=${token}` })
})

// -------- Dropbox Sign webhook (simulated) --------
app.post('/api/contract/webhook', (req,res)=>{
  const { token } = req.body || {}
  if(!token || !invites[token]) return res.status(400).json({error:'invalid invite token'})
  if(invites[token].used) return res.status(400).json({error:'token already used'})
  invites[token].used = true

  // Create new distributor
  const username = `dist_${token.slice(0,6)}`
  const password = 'pass123'
  const role = ROLES[Math.floor(Math.random()*ROLES.length)]
  const region = REGIONS[Math.floor(Math.random()*REGIONS.length)]
  users[username] = { username, password, role:'distributor', category:role, region, contractSigned:true }

  distributors.push({
    id: username,
    Name: username.replace(/^./, c=>c.toUpperCase()),
    Role: role, Region: region, Contract:'✅', Progress:'0%', lastActiveHours: 0
  })

  history.push({ ts: Date.now(), actor: username, event:'Contract signed' })

  res.json({ ok:true, username, password, role:'distributor', region })
})

// -------- Auth --------
app.post('/api/auth/login', (req,res)=>{
  const { username, password } = req.body||{}
  const u = users[username]
  if(!u || (u.password && u.password !== password)) return res.status(401).json({error:'bad credentials'})
  const token = tokenFor(username)
  res.json({ token, role: u.role, user: { username, role: u.role, region: u.region, contractSigned: !!u.contractSigned } })
})

// -------- Distributor APIs --------
const defaultTasks = [
  {id:'id', title:'Upload first customer pitch deck', subtitle:'Due: 2025-01-05', icon:'upload', cta:'Upload', done:false},
  {id:'profile', title:'Complete profile setup', subtitle:'Due: 2024-12-28', icon:'form', cta:'Start', done:true},
  {id:'call', title:'Schedule introductory call', subtitle:'Due: 2025-01-03', icon:'training', cta:'Schedule', done:false},
]
const perUserTasks = {}

app.get('/api/distributor/tasks', auth, (req,res)=>{
  if(req.user.role!=='distributor') return res.status(403).json({error:'forbidden'})
  if(!req.user.contractSigned) return res.status(403).json({error:'contract not signed'})
  const username = req.user.sub
  perUserTasks[username] ||= JSON.parse(JSON.stringify(defaultTasks))
  res.json(perUserTasks[username])
})

app.post('/api/distributor/tasks/:id/complete', auth, (req,res)=>{
  if(req.user.role!=='distributor') return res.status(403).json({error:'forbidden'})
  const username = req.user.sub
  perUserTasks[username] ||= JSON.parse(JSON.stringify(defaultTasks))
  perUserTasks[username] = perUserTasks[username].map(t => t.id===req.params.id ? { ...t, done:true } : t)
  history.push({ ts: Date.now(), actor: username, event:`Task ${req.params.id} completed` })
  res.json({ ok:true, tasks: perUserTasks[username] })
})

// -------- Vendor APIs --------
app.get('/api/vendor/metrics', (_req,res)=>{
  const total = distributors.length
  const signed = distributors.filter(d=>d.Contract==='✅').length
  const pending = total - signed
  const activeToday = distributors.filter(d=> d.Contract==='✅' && parseInt(d.Progress,10) >= 50).length
  const avgProgress = Math.round(distributors.reduce((s,d)=> s + parseInt(d.Progress,10), 0) / total || 0)
  res.json({
    totalDistributors: total,
    contractsSigned: signed,
    contractsPending: pending,
    activeToday,
    avgProgress: `${avgProgress}%`,
    completionRate: `${Math.round(avgProgress)}%`,
    avgOnboardingDays: 12.5
  })
})

app.get('/api/vendor/distributors', (_req,res)=> res.json(distributors))

app.get('/api/vendor/announcements', (_req,res)=> res.json(scopedAnnouncements))
app.post('/api/vendor/announcements', (req,res)=>{
  const { text, role='All', region='All' } = req.body||{}
  if(!text) return res.status(400).json({error:'text required'})
  const rec = { text, role, region, createdAt: Date.now() }
  scopedAnnouncements.push(rec)
  res.json({ ok:true, announcements: scopedAnnouncements })
})

app.get('/api/vendor/tasks', (_req,res)=> res.json(scopedTasks))
app.post('/api/vendor/tasks', (req,res)=>{
  const { text, role='All', region='All' } = req.body||{}
  if(!text) return res.status(400).json({error:'text required'})
  const rec = { text, role, region, createdAt: Date.now() }
  scopedTasks.push(rec)
  res.json({ ok:true, tasks: scopedTasks })
})

app.get('/api/history', (_req,res)=> res.json(history))

app.listen(PORT, ()=> console.log(`> Server listening on http://localhost:${PORT}`))

  // -------- AI Chat (OpenAI proxy) --------
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message } = req.body || {}
      if (!message) return res.status(400).json({ error: 'message is required' })
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY missing in server .env' })

      // Use OpenAI responses API (chat-style)
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are an onboarding assistant. Be concise and helpful. If asked how to upload, direct them to Paperwork section." },
            { role: "user", content: String(message) }
          ],
          temperature: 0.2
        })
      })
      if (!r.ok) {
        const txt = await r.text()
        return res.status(500).json({ error: 'OpenAI error', detail: txt })
      }
      const data = await r.json()
      const text = data.choices?.[0]?.message?.content || ""
      res.json({ reply: text })
    } catch (e) {
      res.status(500).json({ error: 'server_error', detail: String(e) })
    }
  })
