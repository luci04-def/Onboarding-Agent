
import Navbar from '../components/Navbar'
import ProgressBar from '../components/ProgressBar'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDistributorTasks, completeDistributorTask } from '../api'
import confetti from 'canvas-confetti'

export default function Distributor(){
  const role = localStorage.getItem('role') || 'distributor'
  const contractSigned = localStorage.getItem('contractSigned') === 'true'
  const token = localStorage.getItem('token')
  const [tasks, setTasks] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    if(!(role==='distributor' && contractSigned) || !token){
      window.location.href = '/invite'
    }else{
      ;(async()=>{
        try{ setTasks(await getDistributorTasks()) }catch{}
      })()
    }
  },[])

  const percent = Math.round((tasks.filter(t=>t.done).length / (tasks.length||1))*100)

  async function markDone(id){
    try{
      const res = await completeDistributorTask(id)
      setTasks(res.tasks)
    }catch{ setTasks(ts=> ts.map(t => t.id===id ? {...t, done:true} : t)) }
    confetti({ particleCount: 100, spread: 60, origin:{y:0.7} })
  }

  const achievements = useMemo(()=>[
    {label:'Contract Signed', done:true},
    {label:'Paperwork Complete', done: tasks.find(t=>t.id==='profile')?.done},
    {label:'Training Started', done: tasks.find(t=>t.id==='call')?.done},
    {label:'First Task Complete', done: tasks.find(t=>t.id==='id')?.done},
  ],[tasks])

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="text-2xl font-bold">Your Onboarding Progress</div>
        <div className="glass p-5">
          <div className="flex items-center justify-between">
            <div className="text-mute text-sm">Overall Progress</div>
            <div className="text-sm">{percent}%</div>
          </div>
          <div className="mt-2"><ProgressBar percent={percent}/></div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Contract','Paperwork','Training','Tasks','Certificate','Achievements'].map((s,i)=> (
              <div key={i} className="pill">{s}</div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="glass p-4">
              <div className="text-lg font-semibold mb-3">Current Tasks</div>
              <ul className="space-y-2">
                {tasks.map(t=> (
                  <li key={t.id} className="bg-panel2 px-3 py-2 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-sm text-mute">{t.subtitle}</div>
                    </div>
                    {!t.done ? <button className="btn" onClick={()=>markDone(t.id)}>Mark done</button> : <span className="pill text-success border-success">completed</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="glass p-4 h-full text-center">
              <div className="text-lg font-semibold mb-3">Training Progress</div>
              <div className="text-mute">Sales Fundamentals</div>
              <button className="btn mt-4" onClick={() => navigate('/distributor/training')}>Start Training</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="glass p-4">
              <div className="text-lg font-semibold mb-3">Achievements</div>
              <ul className="space-y-2">
                {achievements.map((a,i)=> (
                  <li key={i} className={"px-3 py-2 rounded-xl flex items-center justify-between " + (a.done ? "bg-panel2" : "bg-panel")}>
                    <span>{a.label}</span>
                    <span className={a.done ? "text-success" : "text-mute"}>{a.done ? "●" : "○"}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
