
import { Link, useLocation } from 'react-router-dom'
import { Cog, User, Home, Building2 } from 'lucide-react'

const Tab = ({to,label}) => {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link to={to} className={"px-3 py-1 rounded-full text-sm " + (active ? "bg-panel2 text-ink" : "text-mute hover:bg-panel hover:text-ink")}>
      {label}
    </Link>
  )
}

export default function Navbar(){
  return (
    <div className="sticky top-0 z-40 border-b border-white/5 bg-bg/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary" />
          <div className="font-semibold">Onboarding</div>
        </div>
        <div className="flex items-center gap-2">
          <Tab to="/invite" label="Invitation" />
          <Tab to="/distributor" label="Distributor" />
          <Tab to="/vendor" label="Vendor" />
          <Tab to="/" label="Home" />
        </div>
        <div className="flex items-center gap-2 text-mute">
          <span className="pill">Demo Mode</span>
          <Cog className="size-4"/>
        </div>
      </div>
    </div>
  )
}
