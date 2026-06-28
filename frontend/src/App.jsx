import { useState } from 'react'
import IssueMap from './components/IssueMap'
import ReportForm from './components/ReportForm'
import Dashboard from './components/Dashboard'
import './App.css'

const TABS = ['Map', 'Report an issue', 'Dashboard']

export default function App() {
  const [tab, setTab] = useState(0)

  return (
    <div className="app">
      <div className="app-header">
        <h1><span className="dot"></span> Local Hero</h1>
        <p>Hyperlocal civic issue reporting · Bhubaneswar</p>
      </div>
      <div className="tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`tab-btn ${tab === i ? 'active' : ''}`}
            onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>
      {tab === 0 && <div className="map-wrap"><IssueMap /></div>}
      {tab === 1 && <ReportForm onSuccess={() => setTab(0)} />}
      {tab === 2 && <Dashboard />}
    </div>
  )
}