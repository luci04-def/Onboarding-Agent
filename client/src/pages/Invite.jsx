
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { contractWebhook } from '../api'
import { useSearchParams, Link } from 'react-router-dom'

export default function Invite(){
  const [sp] = useSearchParams()
  const token = sp.get('token') || 'demo-token'
  const [done, setDone] = useState(null)
  const [err, setErr] = useState('')

  async function signNow(){
    try{
      const res = await contractWebhook(token)
      setDone(res)
      localStorage.setItem('contractSigned','true')
      localStorage.setItem('role','distributor')
      localStorage.setItem('username', res.username)
    }catch(e){ setErr(String(e)) }
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar/>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center">
          <div className="pill inline-block mb-3">Secure Invitation</div>
          <h1 className="text-4xl font-bold">Welcome to Your Onboarding Journey</h1>
          <p className="text-mute mt-2">You've been invited to join our distributor network. Start with secure contract signing.</p>
        </div>

        <div className="glass p-6 mt-8">
          <div className="text-center text-lg font-semibold">Contract Signing Required</div>
          <div className="grid md:grid-cols-3 gap-6 mt-6 text-center">
            <div><div className="text-success text-2xl">✔</div><div className="font-medium mt-1">Secure Process</div><div className="text-sm text-mute">Powered by Dropbox Sign</div></div>
            <div><div className="text-primary text-2xl">★</div><div className="font-medium mt-1">Personalized</div><div className="text-sm text-mute">AI-driven onboarding plan</div></div>
            <div><div className="text-primary text-2xl">⚡</div><div className="font-medium mt-1">Automated</div><div className="text-sm text-mute">Instant account creation</div></div>
          </div>
          {!done ? (
            <div className="mt-8 text-center">
              <button className="btn" onClick={signNow}>Sign Contract & Begin</button>
              {err ? <div className="text-danger text-sm mt-2">{err}</div> : null}
              <div className="text-xs text-mute mt-2">This will open Dropbox Sign in a new window (simulated).</div>
              <div className="text-xs text-mute mt-4">Invitation Token: {token.slice(0,8)}...</div>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <div className="text-success">Contract Signed!</div>
              <div className="text-sm mt-2">User created: <b>{done.username}</b> (password: <b>{done.password}</b>)</div>
              <Link to="/login" className="btn mt-4 inline-block">Go to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
