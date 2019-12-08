const API_KEY = '1f6687dfd7a2fa477c3a4c2859df0a4e';
//const CURRENT_WEATHER = `https://api.openweathermap.org/data/2.5/weather?q=${PLACE},cl&?units=metric&appid=${API_KEY}`;
const CURRENT_WEATHER_BASE_URL = `https://api.openweathermap.org/data/2.5/weather?q=`;
const CURRENT_WEATHER_LAST_URL = `,cl&units=metric&appid=${API_KEY}`;

const CURRENT_FORECAST_BASE_URL = `https://api.openweathermap.org/data/2.5/forecast?q=`;

export { API_KEY, CURRENT_WEATHER_BASE_URL, CURRENT_WEATHER_LAST_URL, CURRENT_FORECAST_BASE_URL }; 