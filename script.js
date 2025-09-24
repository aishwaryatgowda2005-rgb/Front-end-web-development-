// Travel Explorer - front-end only
// NOTE: to use the live APIs you must create keys and paste them below
// UNSPLASH: https://unsplash.com/documentation
// OPENWEATHERMAP: https://openweathermap.org/api

const UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY";
const OPENWEATHER_KEY = "YOUR_OPENWEATHERMAP_KEY";

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const destName = document.getElementById('destName');
const destSummary = document.getElementById('destSummary');
const photosEl = document.getElementById('photos');
const weatherCard = document.getElementById('weatherCard');
const weatherInfo = document.getElementById('weatherInfo');
const popularList = document.getElementById('popularList');

// Helpers
function el(tag, txt){ const e = document.createElement(tag); if(txt) e.textContent = txt; return e; }

async function fetchPhotos(query) {
  // Unsplash Search Photos endpoint
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === "YOUR_UNSPLASH_ACCESS_KEY") {
    // Fallback: placeholder images
    return Array.from({length:6}).map((_,i)=> ({
      id: 'ph'+i,
      alt_description: query+' image',
      urls: { small: 'https://via.placeholder.com/400x300?text='+encodeURIComponent(query) }
    }));
  }
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=9&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: 'Client-ID '+UNSPLASH_ACCESS_KEY } });
  const data = await res.json();
  return data.results || [];
}

async function fetchWeatherByCity(city) {
  if (!OPENWEATHER_KEY || OPENWEATHER_KEY === "YOUR_OPENWEATHERMAP_KEY") {
    return null; // No key - caller will handle fallback message
  }
  // Use OpenWeatherMap Geocoding to get lat/lon
  const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_KEY}`);
  const geo = await geoRes.json();
  if (!geo || !geo[0]) return null;
  const { lat, lon } = geo[0];
  const wRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_KEY}`);
  return await wRes.json();
}

function renderPhotos(photos) {
  photosEl.innerHTML = '';
  photos.forEach(p => {
    const img = document.createElement('img');
    img.src = p.urls?.small || p.small;
    img.alt = p.alt_description || 'photo';
    img.addEventListener('click', ()=> openPhotoModal(p));
    photosEl.appendChild(img);
  });
}

function renderWeather(data, city) {
  if (!data) {
    weatherCard.hidden = false;
    weatherInfo.innerHTML = '<p>Weather data unavailable. Add your OpenWeatherMap API key in <code>script.js</code>.</p>';
    return;
  }
  weatherCard.hidden = false;
  weatherInfo.innerHTML = '';
  const main = el('div');
  main.appendChild(el('p', `${city}`));
  main.appendChild(el('p', `Temperature: ${Math.round(data.main.temp)}°C`));
  main.appendChild(el('p', `Conditions: ${data.weather[0].description}`));
  main.appendChild(el('p', `Humidity: ${data.main.humidity}%`));
  weatherInfo.appendChild(main);
}

// Simple modal for photo
function openPhotoModal(photo) {
  const modal = document.createElement('div');
  modal.style.position='fixed'; modal.style.inset='0'; modal.style.background='rgba(0,0,0,0.7)';
  modal.style.display='flex'; modal.style.alignItems='center'; modal.style.justifyContent='center';
  modal.style.zIndex=9999;
  const card = document.createElement('div');
  card.style.maxWidth='90%'; card.style.maxHeight='90%'; card.style.background='#fff'; card.style.padding='10px'; card.style.borderRadius='8px';
  const img = document.createElement('img');
  img.src = photo.urls?.regular || photo.urls?.small || photo.small;
  img.style.maxWidth='100%'; img.style.maxHeight='80vh'; img.alt = photo.alt_description || 'photo';
  const close = el('button','Close');
  close.style.marginTop='8px';
  close.onclick = ()=> document.body.removeChild(modal);
  card.appendChild(img); card.appendChild(close); modal.appendChild(card); document.body.appendChild(modal);
}

// Main explore function
async function explore(query) {
  if (!query) return;
  destName.textContent = query;
  destSummary.textContent = `Loading photos and weather for ${query}...`;
  weatherCard.hidden = true;
  photosEl.innerHTML = '';

  try {
    const [photos, weather] = await Promise.all([fetchPhotos(query), fetchWeatherByCity(query)]);
    destSummary.textContent = `Showing results for ${query}`;
    renderPhotos(photos.slice(0,9));
    if (weather) renderWeather(weather, query);
    else renderWeather(null, query);
  } catch (err) {
    destSummary.textContent = 'Error loading data. Check console for details.';
    console.error(err);
  }
}

// Wire up UI
searchBtn.addEventListener('click', ()=> explore(searchInput.value.trim()));
searchInput.addEventListener('keypress', (e)=> { if(e.key==='Enter') explore(searchInput.value.trim()); });

// Popular list clicks
popularList.addEventListener('click', (e)=> {
  if (e.target.matches('li')) {
    const place = e.target.dataset.place;
    searchInput.value = place;
    explore(place);
  }
});

// Initial sample explore
explore('Paris');
