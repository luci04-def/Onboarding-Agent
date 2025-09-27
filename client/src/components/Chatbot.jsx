
import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { aiChat } from '../api-ai'

export default function Chatbot(){
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{role:'bot', content:'Hi! I’m your AI assistant. How can I help with onboarding?'}])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) },[msgs])

  async function send(){
    const text = input.trim()
    if(!text) return
    setMsgs(m => [...m, {role:'user', content:text}])
    setInput("")
    setLoading(true)
    try{
      const res = await aiChat(text)
      const reply = res.reply || "I'm here to help with onboarding."
      setMsgs(m => [...m, {role:'bot', content: reply}])
    }catch(e){
      setMsgs(m => [...m, {role:'bot', content: 'Sorry, I had trouble reaching AI right now.'}])
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
      <button className="fixed right-6 bottom-6 btn rounded-full size-14 grid place-items-center" onClick={()=>setOpen(true)}>
        <MessageCircle className="size-6"/>
      </button>
      {open && (
        <div className="fixed right-6 bottom-24 w-96 max-w-[92vw] glass p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-mute">AI Assistant</div>
            <button className="pill" onClick={()=>setOpen(false)}><X className="size-4"/></button>
          </div>
          <div className="h-64 overflow-auto space-y-2 pr-1">
            {msgs.map((m,i)=> (
              <div key={i} className={"max-w-[80%] rounded-2xl px-3 py-2 " + (m.role==='bot' ? 'bg-panel2' : 'bg-primary/30 ml-auto')}>
                {m.content}
              </div>
            ))}
            {loading ? <div className="text-xs text-mute">Thinking…</div> : null}
            <div ref={endRef} />
          </div>
          <div className="mt-2 flex gap-2">
            <input className="flex-1 rounded-xxl bg-panel2 px-3 py-2 outline-none" placeholder="Ask about onboarding, paperwork, training…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}/>
            <button className="btn" onClick={send}><Send className="size-4"/></button>
          </div>
        </div>
      )}
    </>
  )
}
