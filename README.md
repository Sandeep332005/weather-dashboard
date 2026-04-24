# weather-dashboard
Weather dashboard using OpenWeatherMap API
# Weather Dashboard 🌤️

A responsive weather dashboard application that fetches real-time weather data from a public weather API and displays it in an intuitive, modern interface.

## Features

✨ **Core Features**
- 🔍 Search weather by city name with auto-suggestions
- 📊 Display current weather conditions with detailed metrics
- 📅 5-day weather forecast
- 💾 Save favorite cities locally
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Beautiful gradient UI with smooth animations

## Current Weather Information

- Temperature (in Celsius)
- Weather description and conditions
- Humidity percentage
- Wind speed (km/h)
- Atmospheric pressure (hPa)
- Visibility (km)
- Weather icons from OpenWeather API

## 5-Day Forecast

- Daily maximum and minimum temperatures
- Weather conditions and descriptions
- Weather icons for visual representation
- One forecast per day at noon

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: OpenWeatherMap API
- **Storage**: Browser LocalStorage
- **Icons**: Font Awesome 6

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Free API key from OpenWeatherMap

### Installation

1. **Clone this repository**
   ```bash
   git clone https://github.com/Sandeep332005/weather-dashboard.git
   cd weather-dashboard

   Get a free API key

Visit OpenWeatherMap
Sign up for a free account
Generate a free API key
Add your API key

Open script.js
Replace 'YOUR_OPENWEATHER_API_KEY' with your actual API key:
JavaScript
const API_KEY = 'your_actual_api_key_here';
Open the application

Double-click index.html or
Serve using a local server:
bash
python -m http.server 8000
# or
npx http-server
Open http://localhost:8000 in your browser
Usage
Search for Weather
Type a city name in the search box
Select from the auto-suggestions (optional)
Press Enter or click the search button
View current weather and 5-day forecast
Save Favorite Cities
When you search for a city, it's automatically saved to your favorites
Click on any saved city to quickly view its weather
Click the ✕ button on a city card to remove it
Up to 10 cities are stored locally
API Integration
Endpoints Used
Geocoding API - Convert city names to coordinates

Code
https://api.openweathermap.org/geo/1.0/direct?q={city}&appid={API_KEY}
Current Weather API - Get current weather data

Code
https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric
Forecast API - Get 5-day forecast

Code
https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric
Features Explained
Search with Auto-Suggestions
As you type, the app suggests matching cities
Debounced API calls for better performance
Select a suggestion to load weather immediately
Weather Metrics
Metric	Unit	Description
Temperature	°C	Current air temperature
Humidity	%	Percentage of moisture in air
Wind Speed	km/h	Speed of wind
Pressure	hPa	Atmospheric pressure
Visibility	km	Distance of visibility
Responsive Design
Desktop: Full grid layout with side-by-side elements
Tablet: Adjusted grid for medium screens
Mobile: Single column layout for optimal viewing
File Structure
Code
weather-dashboard/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # JavaScript functionality and API calls
└── README.md           # Documentation
Customization
Change Temperature Unit
To display Fahrenheit instead of Celsius:

In script.js, change API parameter:

JavaScript
// Change from units=metric to units=imperial
`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
Update the unit display in HTML from °C to °F

Change Color Scheme
Edit the gradient in styles.css (line 17):

CSS
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
Some beautiful gradient options:

Sunset: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)
Ocean: linear-gradient(135deg, #2e2e78 0%, #00d4ff 100%)
Forest: linear-gradient(135deg, #0a3d0a 0%, #2ecc71 100%)
Add More Details
You can add more weather information from the API response like:

Sunrise/Sunset times
UV Index
Cloud coverage
Feels like temperature
Weather alerts
Browser Compatibility
Chrome 90+
Firefox 88+
Safari 14+
Edge 90+
API Rate Limits
Free tier OpenWeatherMap API limits:

60 calls/minute
1,000,000 calls/month
Troubleshooting
"City not found" error
Ensure you're typing a valid city name
Try the full city name with country code (e.g., "London, GB")
No weather data appears
Check if your API key is correct
Verify you have an active internet connection
Check browser console (F12) for error messages
Suggestions not appearing
Ensure you've typed at least 2 characters
Check that the API key has Geocoding API enabled
Future Enhancements
 Hourly weather forecast
 Weather alerts and warnings
 Air quality index (AQI)
 Multiple language support
 Dark/Light theme toggle
 Weather history graph
 Geolocation-based weather
 Weather comparison between cities
 Wind direction indicator
 UV index display
License
This project is open source and available under the MIT License.

Credits
Weather data: OpenWeatherMap
Icons: Font Awesome
Support
For issues or questions, please create an issue in the repository.
