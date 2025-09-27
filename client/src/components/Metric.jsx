
export function Metric({label, value, hint}){
  return (
    <div className="metric">
      <div className="text-sm text-mute">{label}</div>
      <div className="v mt-1 text-primary">{value}</div>
      {hint ? <div className="text-xs text-mute mt-1">{hint}</div> : null}
    </div>
  )
}
