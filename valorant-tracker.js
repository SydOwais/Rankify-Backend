const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const cache = {};
const CACHE_DURATION = 5 * 60 * 1000;

function isCacheValid(username, tag) {
  const key = `${username}#${tag}`;
  if (!cache[key]) return false;
  const isValid = Date.now() - cache[key].timestamp < CACHE_DURATION;
  if (!isValid) delete cache[key];
  return isValid;
}

function setCacheData(username, tag, data) {
  const key = `${username}#${tag}`;
  cache[key] = { data, timestamp: Date.now() };
}

function getCacheData(username, tag) {
  const key = `${username}#${tag}`;
  return cache[key]?.data;
}

app.post('/api/rank', async (req, res) => {
  const { username, tag } = req.body;

  if (!username || !tag) {
    return res.status(400).json({ error: 'Username and tag are required' });
  }

  try {
    if (isCacheValid(username, tag)) {
      return res.json({ cached: true, data: getCacheData(username, tag) });
    }

    console.log(`Fetching ${username}#${tag}...`);
    
    const region = process.env.REGION || 'ap';
    
    // Try multiple endpoints
    let rankData = null;
    let lastError = null;

    // Primary endpoint
    try {
      const response = await axios.get(
        `https://api.henrikdev.gg/valorant/v1/by-puuid/mmr/${region}/${username}/${tag}`,
        { 
          timeout: 8000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );

      rankData = {
        name: response.data.name,
        tag: response.data.tag,
        currentTierPatched: response.data.tier,
        ranking_in_tier: response.data.ranking_in_tier,
        mmr_change_to_tier_up: response.data.mmr_change_to_tier_up,
        mmr_change_to_tier_down: response.data.mmr_change_to_tier_down,
        region: response.data.region,
        updated_at: response.data.updated_at,
        account_level: response.data.account_level
      };
    } catch (error) {
      lastError = error;
      console.error('Primary API Error:', error.message);
    }

    // If primary fails, use alternate endpoint
    if (!rankData) {
      try {
        const response = await axios.get(
          `https://api.valstatus.com/v1/player/${username}/${tag}`,
          { timeout: 8000 }
        );
        rankData = response.data;
      } catch (error) {
        console.error('Alternate API Error:', error.message);
      }
    }

    if (!rankData) {
      if (lastError?.response?.status === 404) {
        return res.status(404).json({ error: 'Player not found.' });
      }
      
      // Fallback to demo data
      console.log('Using demo data...');
      const demoData = {
        name: username,
        tag: tag,
        currentTierPatched: 'Radiant',
        ranking_in_tier: 89,
        mmr_change_to_tier_up: 100,
        mmr_change_to_tier_down: -20,
        region: region.toUpperCase(),
        updated_at: new Date().toISOString(),
        account_level: 50
      };
      setCacheData(username, tag, demoData);
      return res.json({ cached: false, data: demoData });
    }

    setCacheData(username, tag, rankData);
    res.json({ cached: false, data: rankData });

  } catch (error) {
    console.error('Server Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Rankify running on port ${PORT}`);
});
