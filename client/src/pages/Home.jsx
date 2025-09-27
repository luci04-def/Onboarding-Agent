
import Navbar from '../components/Navbar'
import Chatbot from '../components/Chatbot'
import { Metric } from '../components/Metric'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { getDistributors, getMetrics } from '../api'

export default function Home(){
  const [metrics, setMetrics] = useState({avgProgress:'0%'})
  const [rows, setRows] = useState([])
  useEffect(()=>{
    (async ()=>{
      setMetrics(await getMetrics())
      setRows(await getDistributors())
    })()
  },[])
  const signed = useMemo(()=> rows.filter(r=>r.Contract==='✅'), [rows])
  const pending = useMemo(()=> rows.filter(r=>r.Contract!=='✅'), [rows])
  const activeToday = useMemo(()=> signed.filter(r=> parseInt(r.Progress,10) >= 50), [signed])

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Welcome to Your Onboarding Journey</h1>
        <div className="grid md:grid-cols-4 gap-6">
          <Metric label="Overall Performance (Avg)" value={metrics.avgProgress}/>
          <Metric label="Total Active Today" value={String(activeToday.length)}/>
          <Metric label="Contracts Signed" value={String(signed.length)}/>
          <Metric label="Contracts Pending" value={String(pending.length)}/>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {['Sales','Marketing','Technical'].map(role => (
            <Link key={role} to={`/category/${role}`} className="glass p-6 hover:bg-panel">
              <div className="text-mute text-sm">Category</div>
              <div className="text-2xl font-semibold">{role}</div>
              <div className="text-sm mt-2">{rows.filter(r=>r.Role===role).length} distributors</div>
            </Link>
          ))}
        </div>

        <div className="glass p-6">
          <div className="text-sm text-mute">New Distributor</div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div>Start with secure, legally binding **contract signing**. Only then you can access the site.</div>
            <Link to="/invite" className="btn">Sign Contract & Begin</Link>
          </div>
        </div>
      </div>
      <Chatbot/>
    </div>
  )
}
