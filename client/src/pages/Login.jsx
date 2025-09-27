
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { login } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [username, setUsername] = useState('vendor_admin')
  const [password, setPassword] = useState('vendor')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function onLogin(e){
    e.preventDefault()
    setErr('')
    try{
      const res = await login(username, password)
      localStorage.setItem('token', res.token)
      localStorage.setItem('role', res.role)
      localStorage.setItem('contractSigned', String(!!res.user?.contractSigned))
      localStorage.setItem('username', username)
      nav(res.role==='vendor' ? '/vendor' : '/distributor')
    }catch(e){ setErr('Login failed. Use vendor_admin/vendor or your distributor creds after invite.') }
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar/>
      <div className="max-w-md mx-auto px-6 py-10">
        <div className="glass p-6">
          <div className="text-lg font-semibold mb-3">Login</div>
          <form onSubmit={onLogin} className="space-y-3">
            <input className="w-full rounded-xxl bg-panel2 px-3 py-2 outline-none" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
            <input className="w-full rounded-xxl bg-panel2 px-3 py-2 outline-none" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button className="btn w-full">Login</button>
          </form>
          {err ? <div className="text-danger text-sm mt-2">{err}</div> : null}
        </div>
      </div>
    </div>
  )
}
