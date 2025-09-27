
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { login } from '../api'
import { useNavigate } from 'react-router-dom'

export default function VendorLogin(){
  const [username, setUsername] = useState('vendor_admin')
  const [password, setPassword] = useState('vendor')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function onLogin(e){
    e.preventDefault()
    setErr('')
    try{
      const res = await login(username, password)
      if(res.role !== 'vendor') { setErr('This account is not a vendor.'); return }
      localStorage.setItem('token', res.token)
      localStorage.setItem('role', res.role)
      localStorage.setItem('contractSigned', String(!!res.user?.contractSigned))
      localStorage.setItem('username', username)
      nav('/vendor')
    }catch(e){ setErr('Vendor login failed.') }
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar/>
      <div className="max-w-md mx-auto px-6 py-10">
        <div className="glass p-6">
          <div className="text-lg font-semibold mb-3">Vendor Login</div>
          <form onSubmit={onLogin} className="space-y-3">
            <input className="w-full rounded-xxl bg-panel2 px-3 py-2 outline-none" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Vendor username"/>
            <input className="w-full rounded-xxl bg-panel2 px-3 py-2 outline-none" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/>
            <button className="btn w-full">Login</button>
          </form>
          {err ? <div className="text-danger text-sm mt-2">{err}</div> : null}
        </div>
      </div>
    </div>
  )
}
