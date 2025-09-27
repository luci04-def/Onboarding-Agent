
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDistributors } from '../api'

export default function DistributorDetail(){
  const { id } = useParams()
  const [u, setU] = useState(null)

  useEffect(()=>{
    (async ()=>{
      const rows = await getDistributors()
      setU(rows.find(r=> r.Name === decodeURIComponent(id)))
    })()
  },[id])

  if(!u) return <div className="min-h-screen bg-bg text-ink"><Navbar/><div className="max-w-4xl mx-auto px-6 py-10 text-mute">Loading...</div></div>

  const pct = parseInt(u.Progress,10) || 0
  const steps = [
    ['Contract', u.Contract==='✅'],
    ['Paperwork', pct>=20],
    ['Training', pct>=40],
    ['Tasks', pct>=60],
    ['Certificate', pct>=80],
    ['AI Engagement', pct>=90],
  ]

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar/>
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">{u.Name}</h2>
          <Link to={`/category/${u.Role}`} className="pill">← Back to {u.Role}</Link>
        </div>

        <div className="glass p-4">
          <div className="text-sm text-mute">Profile</div>
          <div className="mt-2 text-sm">Role: <b>{u.Role}</b> — Region: <b>{u.Region}</b></div>
          <div className="mt-1 text-sm">Contract: <b>{u.Contract==='✅'?'Signed':'Pending'}</b> — Progress: <b>{u.Progress}</b></div>
        </div>

        <div className="glass p-4">
          <div className="text-sm text-mute mb-2">Timeline</div>
          <div className="flex flex-wrap gap-2">
            {steps.map(([label,done],i)=> (
              <div key={i} className={"pill " + (done ? "text-success border-success" : "")}>{label} {done?'✔':'○'}</div>
            ))}
          </div>
        </div>

        <div className="glass p-4">
          <div className="text-sm text-mute mb-2">Recent Activity (sample)</div>
          <ul className="space-y-2">
            <li className="bg-panel2 px-3 py-2 rounded-xl">Last active {u.lastActiveHours} hours ago</li>
            <li className="bg-panel2 px-3 py-2 rounded-xl">Updated profile</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
