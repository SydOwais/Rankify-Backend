# Valorant Rank Tracker - Setup Guide

A full-stack web app to check Valorant player ranks by username and tag.

## Features
- ✅ Search by username + tag
- ✅ Real-time rank data (Tier, RR, Account Level)
- ✅ Progress to next rank visualization
- ✅ Responsive design (mobile & desktop)
- ✅ 5-minute caching to avoid API rate limits
- ✅ Valorant-inspired UI with gradient effects

## Prerequisites
- Node.js 16+
- npm or yarn
- Basic React knowledge

## Backend Setup

### 1. Initialize Backend
```bash
mkdir valorant-tracker-backend
cd valorant-tracker-backend
npm init -y
npm install express cors axios dotenv
```

### 2. Environment Variables
Create a `.env` file:
```env
PORT=5000
REGION=na
```

**Available regions:** `na`, `eu`, `br`, `kr`, `ap`

### 3. Run Server
```bash
node valorant-server.js
```

Server runs on `http://localhost:5000`

## Frontend Setup

### 1. Create React App
```bash
npx create-react-app valorant-tracker-frontend
cd valorant-tracker-frontend
```

### 2. Replace Files
- Replace `src/App.jsx` with `valorant-tracker.jsx`
- Add `src/valorant-tracker.css` (create the CSS file)
- Delete `src/App.css`

### 3. Update App.jsx
```jsx
import './valorant-tracker.css';
import ValorantTracker from './valorant-tracker';

function App() {
  return <ValorantTracker />;
}

export default App;
```

### 4. Environment Variables
Create `.env` in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api/rank
```

### 5. Run Frontend
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## API Reference

### Search Rank
**POST** `/api/rank`

**Request Body:**
```json
{
  "username": "Player123",
  "tag": "1234"
}
```

**Response:**
```json
{
  "cached": false,
  "data": {
    "name": "Player123",
    "tag": "1234",
    "currentTierPatched": "Platinum",
    "ranking_in_tier": 78,
    "mmr_change_to_tier_up": 100,
    "mmr_change_to_tier_down": -20,
    "region": "na",
    "account_level": 45,
    "updated_at": "2026-09-03T12:30:00Z"
  }
}
```

## Deployment Options

### Deploy Backend (Render, Railway, Heroku)
1. Push code to GitHub
2. Connect to hosting platform
3. Add environment variables
4. Deploy

### Deploy Frontend (Vercel, Netlify)
1. Update `REACT_APP_API_URL` to your backend URL
2. Push to GitHub
3. Connect to Vercel/Netlify
4. Deploy automatically

## How to Use

1. Enter a Valorant player's username
2. Enter their tag (the 4-digit number after their username)
3. Click "Search"
4. View their current rank, RR, and progression

### Finding Tag
In Valorant, your full identifier is `Username#Tag`. For example:
- `Player#1234` → Username: "Player", Tag: "1234"

## API Used
- [HenrikDev Valorant API](https://docs.henrikdev.gg/) - Free, no auth key required

## Troubleshooting

**"Player not found"**
- Check username and tag spelling
- Tag must be exactly 4 digits

**"Connection error"**
- Ensure backend is running on `localhost:5000`
- Check CORS is enabled
- Verify firewall settings

**Rate Limit Issues**
- The app caches results for 5 minutes
- Each request resets the 5-minute timer
- API allows ~60 requests per minute

## Future Enhancements
- [ ] Player stats history/graph
- [ ] Compare multiple accounts
- [ ] Discord bot integration
- [ ] Leaderboards
- [ ] Match history display
- [ ] Weapon statistics

## License
MIT - Use freely for personal or commercial projects

---

**Need help?** Check the API docs or create an issue on GitHub.
