# Community Hero

**A WhatsApp-simple civic reporting platform** where citizens report broken infrastructure, AI auto-routes complaints, predicts recurrence, and resolution is publicly tracked so issues cannot be ignored.

> Built for hackathon impact: fast reporting, transparent tracking, accountable governance.

---

## 🚩 Problem

Citizens often struggle to report issues like potholes, broken streetlights, garbage overflow, water leakage, etc.  
Traditional complaint systems are slow, opaque, and easy to ignore.

## 💡 Solution

Community Hero enables residents to:

- Report civic issues in seconds
- Track status publicly (visibility creates pressure for action)
- Let AI classify and route complaints to relevant departments
- Predict recurring issues to help municipalities act proactively

---

## 🧠 Core Features

- 📸 **Quick Complaint Reporting** (location, category, description, optional image)
- 🧭 **AI Auto-Routing** to appropriate authority/department
- 🔁 **Recurrence Prediction** for repeated infrastructure failures
- 📊 **Public Tracking Dashboard** for transparency and trust
- 🏘️ **Colony/Community Visibility** so unresolved issues are visible to all

---

## 🏗️ Project Structure

```txt
Community_Hero/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── seed.py
│   ├── routes/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── README.md
├── LICENSE
└── .gitignore
```

---

## ⚙️ Tech Stack

- **Backend:** Python (API + data layer)
- **Frontend:** JavaScript, HTML, CSS (Vite + React setup)
- **Database:** SQLite (currently local)
- **AI Layer (planned/in-progress):** complaint classification + recurrence prediction

---

## 🚀 Quick Start

## 1) Clone

```bash
git clone https://github.com/Max-Rex-2006/Community_Hero.git
cd Community_Hero
```

## 2) Backend setup

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python seed.py   # optional, if seeding data is supported
python main.py   # or your API start command
```

## 3) Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend should run on Vite default port (typically `5173`), backend on your configured API port.

---

## 🔐 Environment Variables

Create a local env file for backend secrets:

```env
# backend/.env
API_KEY=your_key_here
MODEL_KEY=your_model_key_here
```

> Do **not** commit secrets.  
> Existing committed secret files should be rotated and removed from history if they contain real keys.

---

## 📡 API (initial)

> Update this section as routes stabilize.

- `GET /health` – health check
- `POST /complaints` – create complaint
- `GET /complaints` – list complaints
- `PATCH /complaints/:id/status` – update status

---

## 🧪 Hackathon Judging Notes

### Innovation
- AI-assisted civic complaint triage + recurrence forecasting

### Impact
- Improves citizen-government feedback loop
- Drives accountability through public progress visibility

### Feasibility
- Modular full-stack architecture
- Can scale from colony-level pilot to city-wide deployment

---

## 🛣️ Roadmap

- [ ] WhatsApp bot integration
- [ ] Geotag-based heatmaps
- [ ] Department SLA timers + escalation
- [ ] Multilingual complaint support
- [ ] Admin analytics dashboard
- [ ] Mobile app

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE).

---

## 👤 Author

**Max Rex**  
GitHub: [@Max-Rex-2006](https://github.com/Max-Rex-2006)
