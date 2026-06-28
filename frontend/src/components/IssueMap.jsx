import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { useEffect, useState } from 'react'
import axios from 'axios'

const COLOR = {
  pothole: '#E24B4A', water: '#378ADD',
  electrical: '#EF9F27', waste: '#639922'
}
const STATUS_OPACITY = {
  reported: 0.5, verified: 0.75,
  in_progress: 0.9, resolved: 0.3
}

export default function IssueMap() {
  const [issues, setIssues] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8000/issues/')
      .then(r => setIssues(r.data))
  }, [])

  return (
    <MapContainer center={[20.2961, 85.8245]} zoom={13}
      style={{ height: '500px', borderRadius: '12px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {issues.map(i => (
        <CircleMarker key={i.id}
          center={[i.latitude, i.longitude]}
          radius={6 + i.severity}
          color={COLOR[i.category] || '#888'}
          fillOpacity={STATUS_OPACITY[i.status] || 0.6}>
          <Popup>
            <b>{i.title}</b><br/>
            Ward: {i.ward} | Severity: {i.severity}/5<br/>
            Status: <b>{i.status}</b><br/>
            Upvotes: {i.upvotes}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}