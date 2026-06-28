import { useState } from 'react'
import IssueMap from './components/IssueMap'
import ReportForm from './components/ReportForm'
import Dashboard from './components/Dashboard'

const TABS = ['Map', 'Report an issue', 'Dashboard']

export default function App() {
  const [tab, setTab] = useState(0)

  return (
    <div style={{maxWidth:900, margin:'0 auto', padding:24}}>
      <h1>Community Hero</h1>
      <p>Hyperlocal civic issue reporting for Bhubaneswar</p>
      <div style={{display:'flex',gap:8,margin:'16px 0'}}>
        {TABS.map((t,i) => (
          <button key={t} onClick={() => setTab(i)}
            style={{fontWeight: tab===i ? 500 : 400}}>{t}</button>
        ))}
      </div>
      {tab===0 && <IssueMap />}
      {tab===1 && <ReportForm onSuccess={() => setTab(0)} />}
      {tab===2 && <Dashboard />}
    </div>
  )
}