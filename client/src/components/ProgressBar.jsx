
export default function ProgressBar({percent=0}){
  return (
    <div className="progress-rail">
      <div className="progress-bar" style={{width: `${percent}%`}} />
    </div>
  )
}
