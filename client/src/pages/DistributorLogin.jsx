
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { login } from '../api'
import { useNavigate } from 'react-router-dom'

export default function DistributorLogin(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('pass123')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function onLogin(e){
    e.preventDefault()
    setErr('')
    try{
      const res = await login(username, password)
      if(res.role !== 'distributor') { setErr('This account is not a distributor.'); return }
      if(!res.user?.contractSigned){ setErr('Contract not signed. Use your invite link first.'); return }
      localStorage.setItem('token', res.token)
      localStorage.setItem('role', res.role)
      localStorage.setItem('contractSigned', String(!!res.user?.contractSigned))
      localStorage.setItem('username', username)
      nav('/distributor')
    }catch(e){ setErr('Distributor login failed. Ensure you completed the invite contract flow.') }
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar/>
      <div className="max-w-md mx-auto px-6 py-10">
        <div className="glass p-6">
          <div className="text-lg font-semibold mb-3">Distributor Login</div>
          <form onSubmit={onLogin} className="space-y-3">
            <input className="w-full rounded-xxl bg-panel2 px-3 py-2 outline-none" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Distributor username (from invite)"/>
            <input className="w-full rounded-xxl bg-panel2 px-3 py-2 outline-none" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/>
            <button className="btn w-full">Login</button>
          </form>
          {err ? <div className="text-danger text-sm mt-2">{err}</div> : null}
        </div>
      </div>
    </div>
  )
}
