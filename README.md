# Travel Explorer (Front-end)

A small front-end project that lets users explore travel destinations, view photos (Unsplash) and check current weather (OpenWeatherMap). This is a purely front-end project — no server required.

## Features
- Search destinations by name
- Shows photos from Unsplash (uses Unsplash Search API)
- Displays current weather using OpenWeatherMap (reverse geocoding + weather API)
- Mobile responsive and lightweight
- Simple photo modal viewer

## Setup / Usage
1. Download and unzip the project files.
2. Open `index.html` in your browser.
3. To enable live photos and weather, sign up for the APIs and add your keys in `script.js`:
   - `UNSPLASH_ACCESS_KEY` — get from https://unsplash.com/developers
   - `OPENWEATHER_KEY` — get from https://openweathermap.org/api
4. The app uses client-side fetch. For local testing you can open `index.html` directly; some browsers may block CORS for local file fetches but this app fetches remote APIs so it should function when served over `http(s)` (or opened directly in many browsers).

## Notes
- The included code gracefully falls back to placeholder images and a friendly message when API keys are not provided.
- For production use, do not expose private API keys in client-side code. Use a server-side proxy if you need to keep keys secret.
