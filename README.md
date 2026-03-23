# TikTok Data Analysis App – User Behavior Insights

A web application that analyzes TikTok user data to identify behavioral patterns, measure usage through KPIs, and generate actionable recommendations.

## 📊 What this app does

- Defines and visualizes key KPIs (total usage time, average per day, peak activity, consistency score)
- Segments user behavior (time of day, weekdays vs weekends, content categories)
- Identifies trends and anomalies in usage patterns
- Generates prioritized recommendations based on insights

## 💡 Example insights

- Peak usage between 21:00–23:00
- 70%+ of consumption concentrated in top 3 content categories
- Increased activity during weekends compared to weekdays
- Irregular usage patterns detected through consistency scoring

## 🧠 Why this matters

This project demonstrates how raw data can be transformed into actionable insights.

The same principles are used in:
- energy consumption analysis
- transport optimization
- user behavior analytics

## 🔒 Privacy-first architecture

All data is processed locally in the browser.
No backend, no database, no tracking.
User data never leaves the device.

## ⚙️ Tech stack

- React (Vite)
- Tailwind CSS
- Recharts (data visualization)
- Framer Motion (UI animations)
- JSZip (data parsing)
- date-fns (date analysis)

## 🚀 Live demo

Try it here:
👉 https://tiktok-wrapped-gold.vercel.app/

## 🛠️ Run locally

```bash
git clone https://github.com/KamalPixel/TiktokWrapped.git
cd TiktokWrapped
npm install
npm run dev
```

## 📲 How to get your TikTok data

1. Open TikTok → Profile → Settings
2. Go to "Download your data"
3. Select JSON format
4. Download the ZIP file
5. Upload it in the app

## 📁 Project structure

```
src/
├── components/
├── hooks/
├── utils/
│   ├── parser.js
│   ├── analytics.js
└── constants.js
```

## 🎯 Key takeaway

Built as a data-driven application that turns user activity into structured insights and recommendations, similar to decision-support tools used in real-world analytics.
