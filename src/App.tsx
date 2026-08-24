import { useEffect, useState } from 'react'
import { useStore } from './store/useStore'
import Launcher from './components/Launcher'
import CalendarView from './components/CalendarView'
import PlannerView from './components/PlannerView'

export type Screen = 'launcher' | 'calendar' | 'planner'

export default function App() {
  const [screen, setScreen] = useState<Screen>('launcher')
  const generateDueRecurringTasks = useStore((s) => s.generateDueRecurringTasks)

  useEffect(() => {
    generateDueRecurringTasks()
    const interval = setInterval(generateDueRecurringTasks, 60_000)
    return () => clearInterval(interval)
  }, [generateDueRecurringTasks])

  return (
    <div className="app-shell">
      {screen === 'launcher' && <Launcher onSelect={setScreen} />}
      {screen === 'calendar' && <CalendarView onBack={() => setScreen('launcher')} />}
      {screen === 'planner' && <PlannerView onBack={() => setScreen('launcher')} />}
    </div>
  )
}
