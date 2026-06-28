import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import API from '../config'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    axios.get(`${API}/issues/stats/summary`)
      .then(r => setStats(r.data))
  }, [])

  if (!stats) return <p>Loading...</p>

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        <div><p>Total issues</p><h2>{stats.total}</h2></div>
        <div><p>Resolved</p><h2>{stats.resolved}</h2></div>
        <div><p>Resolution rate</p><h2>{stats.resolution_rate}%</h2></div>
      </div>

      <h3>Issues by category</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={stats.by_category}>
          <XAxis dataKey="name" /><YAxis /><Tooltip />
          <Bar dataKey="count" fill="#378ADD" />
        </BarChart>
      </ResponsiveContainer>

      <h3>Worst wards by open issues</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={stats.by_ward}>
          <XAxis dataKey="ward" /><YAxis /><Tooltip />
          <Bar dataKey="count" fill="#E24B4A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}