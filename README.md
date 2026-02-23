# Geniepot – Creator Portfolio Page

Public portfolio page for a creator showcasing profile, performance stats, past campaigns, and top submissions (with embedded videos).

## 🚀 Features

- Route: `/creators/:id`
- Profile Header (name, username, city, bio, platforms)
- Performance Stats (computed from submissions)
  - Total submissions
  - Total views
  - Total earnings (MAD)
  - Average views
  - Best platform
- Past Campaigns
- Top Submissions (sorted by views or earnings)
- Loading, error, and empty states

## 🛠 Tech Stack

- React + Vite
- React Router
- Tailwind CSS
- Mock API (local JSON files)

## ▶ Run
```bash
npm install
npm run dev
npm install react-router-dom


🧠 Architecture

API logic separated in mockApi.js
Derived stats computed using useMemo
Clean component structure

👩‍💻 Author
Samira El Bachra
