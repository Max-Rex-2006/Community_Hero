import { useState } from 'react'
import axios from 'axios'
import API from '../config'

export default function ReportForm({ onSuccess }) {
  const [form, setForm] = useState({ title:'', description:'', ward:'', reporter_name:'' })
  const [image, setImage] = useState(null)
  const [aiResult, setAiResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loc, setLoc] = useState(null)

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
    const res = await axios.post(`${API}/ai/classify`, fd)
    setAiResult(res.data)
    setForm(f => ({ ...f, title: res.data.description, description: res.data.description }))
    setLoading(false)
  }

  const handleSubmit = async () => {
    const fd = new FormData()
    fd.append('title', form.title || 'Civic issue')
    fd.append('description', form.description || 'Reported by citizen')
    fd.append('ward', form.ward || 'Unknown')
    fd.append('reporter_name', form.reporter_name || 'Anonymous')
    fd.append('latitude', loc?.lat || 20.2961)
    fd.append('longitude', loc?.lng || 85.8245)
    if (image) fd.append('image', image)
    await axios.post(`${API}/issues/`, fd)
    onSuccess()
  }

  return (
    <div className="report-form">
      <h2>Report a civic issue</h2>
      <div className="upload-area">
        <input type="file" accept="image/*" onChange={handleImage} />
        <div className="upload-icon">📷</div>
        <p><strong>Click to upload</strong> a photo of the issue</p>
        <p>Gemini AI will auto-classify it</p>
      </div>
      {loading && (
        <div className="analyzing">
          <div className="spinner"></div>
          AI analysing image...
        </div>
      )}
      {aiResult && (
        <div className="ai-result">
          <div className="ai-dot"></div>
          {aiResult.category} · Severity {aiResult.severity}/5 · {aiResult.department}
        </div>
      )}
      <input className="form-input" placeholder="Ward name" value={form.ward}
        onChange={e => setForm({ ...form, ward: e.target.value })} />
      <input className="form-input" placeholder="Your name (optional)" value={form.reporter_name}
        onChange={e => setForm({ ...form, reporter_name: e.target.value })} />
      <button className="submit-btn" onClick={handleSubmit}>Submit report</button>
    </div>
  )
}