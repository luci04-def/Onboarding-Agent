
import Navbar from '../components/Navbar'
import { Metric } from '../components/Metric'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDistributors, getMetrics, getScopedAnnouncements, addScopedAnnouncement, getScopedTasks, addScopedTask, createInvite } from '../api'

export default function Vendor(){
  const nav = useNavigate()
  const [rows, setRows] = useState([])
  const [metrics, setMetrics] = useState({})
  const [role, setRole] = useState('All')
  const [category, setCategory] = useState('All')
  const [invite, setInvite] = useState(null)

  const [ann, setAnn] = useState([])
  const [newAnn, setNewAnn] = useState('')
  const [annRole, setAnnRole] = useState('All')
  const [annRegion, setAnnRegion] = useState('All')

  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [taskRole, setTaskRole] = useState('All')
  const [taskRegion, setTaskRegion] = useState('All')

  useEffect(()=>{
    (async ()=>{
      setRows(await getDistributors())
      setMetrics(await getMetrics())
      setAnn(await getScopedAnnouncements())
      setTasks(await getScopedTasks())
    })()
  },[])

  const filtered = useMemo(()=> rows.filter(r =>
    (role==='All' || r.Role===role) && (category==='All' || r.Region===category)
  ),[rows, role, category])

  const signed = rows.filter(r=>r.Contract==='✅')
  const pending = rows.filter(r=>r.Contract!=='✅')
  const activeToday = signed.filter(r=> parseInt(r.Progress,10) >= 50)

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="text-3xl font-bold">Distributor Management</div>

        {/* Alerts (sample) */}
        <div className="glass p-4">
          <div className="text-warning">12 distributors have contracts pending over 7 days</div>
          <div className="text-primary mt-1">5 new distributors completed training this week</div>
        </div>

        {/* Quick invite generator (demo) */}
        <div className="glass p-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-mute">Generate a distributor invite (demo)</div>
            {invite ? (
              <div className="text-xs mt-1">
                Invite Link: <a className="text-primary underline" href={invite.inviteLink} target="_blank" rel="noreferrer">{invite.inviteLink}</a>
              </div>
            ) : null}
          </div>
          <button className="btn" onClick={async ()=>{ const r = await createInvite(); setInvite(r); }}>
            Create Invite
          </button>
        </div>

        {/* Metric row like screenshot */}
        <div className="grid md:grid-cols-6 gap-4">
          <Metric label="Total Distributors" value={String(rows.length)}/>
          <Metric label="Active Today" value={String(activeToday.length)}/>
          <Metric label="Contracts Signed" value={String(signed.length)}/>
          <Metric label="Contracts Pending" value={String(pending.length)}/>
          <Metric label="Avg Onboarding" value={`${metrics.avgOnboardingDays||12.5} days`}/>
          <Metric label="Completion Rate" value={metrics.completionRate||'78%'}/>
        </div>

        {/* Filter strip */}
        <div className="glass p-4 flex flex-wrap gap-3 items-center">
          <div className="text-sm text-mute">Filter Distributors</div>
          <select className="pill bg-transparent" value={role} onChange={e=>setRole(e.target.value)}>
            {['All','Sales','Marketing','Technical'].map(o=> <option key={o}>{o}</option>)}
          </select>
          <select className="pill bg-transparent" value={category} onChange={e=>setCategory(e.target.value)}>
            {['All','NY','Berlin','Tokyo'].map(o=> <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Distributor status list */}
        <div className="glass p-4">
          <div className="text-sm text-mute mb-2">Distributor Status ({filtered.length})</div>
          <div className="space-y-2">
            {filtered.map(r => (
              <div key={r.id} className="bg-panel2 px-3 py-3 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.Name}</div>
                  <div className="text-sm text-mute">{r.Role} • {r.Region}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="pill">{r.Progress}</div>
                  <div className={"pill " + (r.Contract==='✅' ? 'text-success border-success' : '')}>
                    {r.Contract==='✅' ? 'Signed' : 'Pending'}
                  </div>
                  <button className="btn" onClick={()=>nav(`/vendor/distributor/${encodeURIComponent(r.Name)}`)}>Open</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scoped announcement & tasks */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-mute">Announcement</div>
            </div>
            <ul className="space-y-2">
              {ann.map((a,i)=> <li key={i} className="bg-panel2 px-3 py-2 rounded-xl">{a.text} <span className="text-xs text-mute">({a.role}/{a.region})</span></li>)}
            </ul>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-2">
              <input className="md:col-span-2 rounded-xxl bg-panel2 px-3 py-2 outline-none" placeholder="Add announcement" value={newAnn} onChange={e=>setNewAnn(e.target.value)}/>
              <select className="pill bg-transparent" value={annRole} onChange={e=>setAnnRole(e.target.value)}>{['All','Sales','Marketing','Technical'].map(o=>(<option key={o}>{o}</option>))}</select>
              <select className="pill bg-transparent" value={annRegion} onChange={e=>setAnnRegion(e.target.value)}>{['All','NY','Berlin','Tokyo'].map(o=>(<option key={o}>{o}</option>))}</select>
            </div>
            <div className="mt-2">
              <button className="btn" onClick={async ()=>{ if(!newAnn) return; const r = await addScopedAnnouncement({text:newAnn, role:annRole, region:annRegion}); setAnn(r.announcements); setNewAnn('') }}>Add</button>
            </div>
          </div>

          <div className="glass p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-mute">Task</div>
            </div>
            <ul className="space-y-2">
              {tasks.map((t,i)=> <li key={i} className="bg-panel2 px-3 py-2 rounded-xl">{t.text} <span className="text-xs text-mute">({t.role}/{t.region})</span></li>)}
            </ul>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-2">
              <input className="md:col-span-2 rounded-xxl bg-panel2 px-3 py-2 outline-none" placeholder="Add task" value={newTask} onChange={e=>setNewTask(e.target.value)}/>
              <select className="pill bg-transparent" value={taskRole} onChange={e=>setTaskRole(e.target.value)}>{['All','Sales','Marketing','Technical'].map(o=>(<option key={o}>{o}</option>))}</select>
              <select className="pill bg-transparent" value={taskRegion} onChange={e=>setTaskRegion(e.target.value)}>{['All','NY','Berlin','Tokyo'].map(o=>(<option key={o}>{o}</option>))}</select>
            </div>
            <div className="mt-2">
              <button className="btn" onClick={async ()=>{ if(!newTask) return; const r = await addScopedTask({text:newTask, role:taskRole, region:taskRegion}); setTasks(r.tasks); setNewTask('') }}>Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
