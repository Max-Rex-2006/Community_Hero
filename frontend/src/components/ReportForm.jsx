import { useState } from 'react'
import axios from 'axios'

export default function ReportForm({ onSuccess }) {
  const [form, setForm] = useState({
    title:'', description:'', ward:'', reporter_name:''
  })
  const [image, setImage] = useState(null)
  const [aiResult, setAiResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loc, setLoc] = useState(null)

  // Auto-get location on mount
  useState(() => {
    navigator.geolocation.getCurrentPosition(p =>
      setLoc({ lat: p.coords.latitude, lng: p.coords.longitude })
    )
  }, [])

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setLoading(true)
    const fd = new FormData()
    fd.append('image', file)
    const res = await axios.post('http://localhost:8000/ai/classify', fd)
    setAiResult(res.data)        // { category, severity, description }
    setForm(f => ({...f,
      title: res.data.description,
      description: res.data.description
    }))
    setLoading(false)
  }

  const handleSubmit = async () => {
    const fd = new FormData()
    Object.entries(form).forEach(([k,v]) => fd.append(k,v))
    fd.append('latitude', loc?.lat || 20.2961)
    fd.append('longitude', loc?.lng || 85.8245)
    if (image) fd.append('image', image)
    await axios.post('http://localhost:8000/issues/', fd)
    onSuccess()
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImage} />
      {loading && <p>AI analysing image...</p>}
      {aiResult && (
        <div>
          <p>Category: {aiResult.category} | Severity: {aiResult.severity}/5</p>
        </div>
      )}
      <input placeholder="Ward name" value={form.ward}
        onChange={e => setForm({...form, ward:e.target.value})} />
      <input placeholder="Your name (optional)" value={form.reporter_name}
        onChange={e => setForm({...form, reporter_name:e.target.value})} />
      <button onClick={handleSubmit}>Submit report</button>
    </div>
  )
}