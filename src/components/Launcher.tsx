import type { Screen } from '../App'
import '../styles/launcher.css'

export default function Launcher({ onSelect }: { onSelect: (s: Screen) => void }) {
  return (
    <div className="launcher">
      <div className="deco deco-asterisk">終</div>
      <div className="deco deco-tape" />
      <div className="deco deco-heart">💌</div>
      <div className="deco deco-star">✨</div>

      <div className="launcher-title-wrap">
        <h1 className="launcher-title">
          my <span className="highlight">planner</span>
        </h1>
        <div className="launcher-subtitle">a lil desktop scrapbook</div>
      </div>

      <div className="launcher-options">
        <button className="sticker launcher-card calendar" onClick={() => onSelect('calendar')}>
          <span className="emoji">📅</span>
          <span className="label">calendar</span>
          <span className="sub">plan out any day</span>
        </button>
        <button className="sticker launcher-card planner" onClick={() => onSelect('planner')}>
          <span className="emoji">🗒️</span>
          <span className="label">planner</span>
          <span className="sub">today + task banks</span>
        </button>
      </div>
    </div>
  )
}
