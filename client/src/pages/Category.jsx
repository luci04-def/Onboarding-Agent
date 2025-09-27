
import Navbar from '../components/Navbar'
import { Metric } from '../components/Metric'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDistributors } from '../api'

export default function Category(){
  const { role } = useParams()
  const [rowsRaw, setRowsRaw] = useState([])
  useEffect(()=>{ (async()=> setRowsRaw(await getDistributors()))() },[])
  const rows = useMemo(()=> rowsRaw.filter(r=>r.Role===role), [rowsRaw, role])
  const signed = rows.filter(r=>r.Contract==='✅')
  const pending = rows.filter(r=>r.Contract!=='✅')
  const activeToday = signed.filter(r=> parseInt(r.Progress,10) >= 50)

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">{role} — Category Dashboard</h2>
          <Link to="/vendor" className="pill">← Back</Link>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Metric label="Total Distributors" value={String(rows.length)} />
          <Metric label="Active Today" value={String(activeToday.length)} />
          <Metric label="Contracts Signed" value={String(signed.length)} />
          <Metric label="Contracts Pending" value={String(pending.length)} />
        </div>

        <div className="glass p-4">
          <div className="text-sm text-mute mb-2">Distributors</div>
          <div className="space-y-2">
            {rows.map(r => (
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
                  <Link to={`/vendor/distributor/${encodeURIComponent(r.Name)}`} className="btn">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass p-4">
            <div className="text-sm text-mute mb-2">Leaderboard</div>
            <ol className="space-y-2">
              {[...rows].sort((a,b)=> parseInt(b.Progress,10)-parseInt(a.Progress,10)).slice(0,5).map((r,i)=>(
                <li key={i} className="bg-panel2 px-3 py-2 rounded-xl">{i+1}. {r.Name} — {r.Progress}</li>
              ))}
            </ol>
          </div>
          <div className="glass p-4">
            <div className="text-sm text-mute mb-2">Completion History (sample)</div>
            <ul className="space-y-2">
              <li className="bg-panel2 px-3 py-2 rounded-xl">Contract → Paperwork → Training → Tasks → Certificate</li>
              <li className="bg-panel2 px-3 py-2 rounded-xl">Avg paperwork completion: 2 days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
