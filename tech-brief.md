
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Weather Widget</title>
  <style>
    #weather {
      padding: 1rem;
      background: #f0f4ff;
      border-radius: 8px;
      display: inline-block;
      font-family: sans-serif;
    }
  </style>
</head>
<body>
  <div id="weather">Loading weather...</div>

  <script>
    async function loadWeather() {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=temperature_2m,weather_code');
      const data = await res.json();
      const temp = data.current.temperature_2m;
      document.getElementById('weather').textContent = `Seattle: ${temp}°C`;
    }

    loadWeather().catch(err => {
      document.getElementById('weather').textContent = 'Failed to load weather';
      console.error(err);
    });
  </script>
</body>
</html>
```

This works well with Open‑Meteo (no key). For APIs with keys, this exposes the key in the browser, which is not ideal.

---

### Option B: Use a Vercel serverless function to hide your API key

If you want to use OpenWeatherMap/WeatherAPI/etc. *without* exposing your key:

1. Create a serverless function in `/api/weather.js` (or `/api/weather.ts`).
2. Store your API key as a Vercel Environment Variable.
3. Call `/api/weather` from your front‑end.

Example `api/weather.js`:

```js
export default async function handler(req, res) {
  const city = req.query.city || 'Seattle';
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream error' });
    }
    const data = await response.json();
    res.status(200).json({
      city: data.name,
      temp: data.main.temp,
      description: data.weather[0].description,
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}
```

Front‑end:

```html
<div id="weather">Loading weather...</div>
<script>
  async function loadWeather() {
    const res = await fetch('/api/weather?city=Seattle');
    const data = await res.json();
    document.getElementById('weather').textContent =
      `${data.city}: ${data.temp}°C, ${data.description}`;
  }
  loadWeather().catch(console.error);
</script>
```

