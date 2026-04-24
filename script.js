// API Configuration
const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Get free key from https://openweathermap.org/api
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_API_BASE = 'https://api.openweathermap.org/geo/1.0';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentWeatherDiv = document.getElementById('currentWeather');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const suggestions = document.getElementById('suggestions');
const forecastSection = document.getElementById('forecastSection');
const forecastContainer = document.getElementById('forecastContainer');
const savedCitiesList = document.getElementById('savedCitiesList');

let currentCity = null;
let debounceTimer = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderSavedCities();
    
    // Search on Enter key
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWeather();
    });
    
    // Search button click
    searchBtn.addEventListener('click', searchWeather);
    
    // City input for suggestions
    cityInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const value = e.target.value.trim();
        
        if (value.length < 2) {
            suggestions.classList.remove('show');
            return;
        }
        
        debounceTimer = setTimeout(() => fetchSuggestions(value), 300);
    });
    
    // Close suggestions on click outside
    document.addEventListener('click', (e) => {
        if (e.target !== cityInput && e.target !== suggestions) {
            suggestions.classList.remove('show');
        }
    });
});

// Fetch city suggestions
async function fetchSuggestions(cityName) {
    try {
        const response = await fetch(
            `${GEO_API_BASE}/direct?q=${cityName}&limit=5&appid=${API_KEY}`
        );
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        displaySuggestions(data);
    } catch (error) {
        console.error('Suggestion error:', error);
    }
}

// Display city suggestions
function displaySuggestions(cities) {
    if (cities.length === 0) {
        suggestions.classList.remove('show');
        return;
    }
    
    suggestions.innerHTML = cities.map(city => `
        <div class="suggestion-item" onclick="selectCity('${city.name}', ${city.lat}, ${city.lon})">
            ${city.name}, ${city.country}
        </div>
    `).join('');
    
    suggestions.classList.add('show');
}

// Select city from suggestions
function selectCity(name, lat, lon) {
    cityInput.value = name;
    suggestions.classList.remove('show');
    fetchWeatherByCoords(lat, lon);
}

// Search weather by city name
async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    try {
        showLoading(true);
        hideError();
        suggestions.classList.remove('show');
        
        // Get coordinates from city name
        const geoResponse = await fetch(
            `${GEO_API_BASE}/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        
        if (!geoResponse.ok) throw new Error('City not found');
        
        const geoData = await geoResponse.json();
        if (geoData.length === 0) {
            throw new Error('City not found');
        }
        
        const { lat, lon, name } = geoData[0];
        await fetchWeatherByCoords(lat, lon, name);
    } catch (error) {
        showError(error.message || 'Unable to fetch weather data');
        showLoading(false);
    }
}

// Fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon, cityName = '') {
    try {
        showLoading(true);
        hideError();
        
        // Current weather
        const weatherResponse = await fetch(
            `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        
        // Forecast (5 days, 3-hour intervals)
        const forecastResponse = await fetch(
            `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        
        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        
        currentCity = {
            name: weatherData.name,
            lat: lat,
            lon: lon,
            temp: Math.round(weatherData.main.temp)
        };
        
        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
        saveCityToLocalStorage(currentCity);
        renderSavedCities();
        
        showLoading(false);
    } catch (error) {
        showError(error.message);
        showLoading(false);
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = (data.wind.speed * 3.6).toFixed(1); // Convert m/s to km/h
    const pressure = data.main.pressure;
    const visibility = (data.visibility / 1000).toFixed(1); // Convert m to km
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('description').textContent = description;
    document.getElementById('temp').textContent = temp;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('windSpeed').textContent = `${windSpeed} km/h`;
    document.getElementById('pressure').textContent = `${pressure} hPa`;
    document.getElementById('visibility').textContent = `${visibility} km`;
    
    // Weather icon from OpenWeather
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    document.getElementById('weatherIcon').src = iconUrl;
    
    currentWeatherDiv.classList.remove('hidden');
}

// Display 5-day forecast
function displayForecast(data) {
    // Group forecast by day
    const forecastByDay = {};
    
    data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        if (!forecastByDay[day]) {
            forecastByDay[day] = [];
        }
        forecastByDay[day].push(forecast);
    });
    
    // Get one forecast per day (at noon)
    forecastContainer.innerHTML = '';
    let dayCount = 0;
    
    Object.entries(forecastByDay).forEach(([day, forecasts]) => {
        if (dayCount >= 5) return;
        
        // Get midday forecast
        const noonForecast = forecasts.find(f => {
            const hour = new Date(f.dt * 1000).getHours();
            return hour >= 11 && hour <= 13;
        }) || forecasts[Math.floor(forecasts.length / 2)];
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="date">${day}</div>
            <div class="weather-icon-small">
                <img src="https://openweathermap.org/img/wn/${noonForecast.weather[0].icon}@2x.png" alt="weather">
            </div>
            <div class="temp-range">
                <span class="high">${Math.round(noonForecast.main.temp_max)}°</span>
                <span> / </span>
                <span class="low">${Math.round(noonForecast.main.temp_min)}°</span>
            </div>
            <div class="description">${noonForecast.weather[0].description}</div>
        `;
        
        forecastContainer.appendChild(card);
        dayCount++;
    });
    
    forecastSection.classList.remove('hidden');
}

// Local Storage Functions
function saveCityToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem('savedCities')) || [];
    
    // Remove if already exists
    cities = cities.filter(c => c.name.toLowerCase() !== city.name.toLowerCase());
    
    // Add to beginning
    cities.unshift(city);
    
    // Keep only 10 cities
    cities = cities.slice(0, 10);
    
    localStorage.setItem('savedCities', JSON.stringify(cities));
}

function renderSavedCities() {
    const cities = JSON.parse(localStorage.getItem('savedCities')) || [];
    
    if (cities.length === 0) {
        savedCitiesList.innerHTML = '<p style="color: white; text-align: center;">No saved cities yet. Search for a city to save it.</p>';
        return;
    }
    
    savedCitiesList.innerHTML = cities.map(city => `
        <button class="city-button" onclick="selectCity('${city.name}', ${city.lat}, ${city.lon})">
            <span class="city-name">${city.name}</span>
            <span class="temp">${city.temp}°C</span>
            <button class="delete" onclick="event.stopPropagation(); deleteCity('${city.name}')">
                <i class="fas fa-times"></i>
            </button>
        </button>
    `).join('');
}

function deleteCity(cityName) {
    let cities = JSON.parse(localStorage.getItem('savedCities')) || [];
    cities = cities.filter(c => c.name !== cityName);
    localStorage.setItem('savedCities', JSON.stringify(cities));
    renderSavedCities();
}

// Helper Functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
}

function showLoading(show) {
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}
