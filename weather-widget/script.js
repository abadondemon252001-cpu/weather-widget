const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');

searchBtn.addEventListener('click', getWeather);

cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

function getWeatherDetails(code) {
    if (code === 0) return { icon: '☀️', text: 'Ясно' };
    if (code >= 1 && code <= 3) return { icon: '⛅', text: 'Облачно' };
    if (code === 45 || code === 48) return { icon: '🌫️', text: 'Туман' };
    if (code >= 51 && code <= 67) return { icon: '🌧️', text: 'Дождь' };
    if (code >= 71 && code <= 77) return { icon: '❄️', text: 'Снег' };
    if (code >= 80 && code <= 82) return { icon: '🌦️', text: 'Ливень' };
    if (code >= 95) return { icon: '⛈️', text: 'Гроза' };
    return { icon: '🌡️', text: 'Неизвестно' };
}

async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    weatherInfo.innerHTML = '<p class="hint">Ищем город и загружаем прогноз...</p>';

    try {
        const domain = ['open', 'meteo', 'com'].join('-').replace('-com', '.com');
        const geoUrl = 'https://' + 'geocoding-api.' + domain + '/v1/search?name=' + encodeURIComponent(city) + '&count=1&language=ru';
        
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            weatherInfo.innerHTML = '<p class="error">Город не найден. Проверьте, правильно ли написано название.</p>';
            return;
        }

        const firstCity = geoData.results.at(0);
        const { latitude, longitude, name, country } = firstCity;

        const weatherUrl = 'https://' + 'api.' + domain + '/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&current_weather=true';
        
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const temp = Math.round(weatherData.current_weather.temperature);
        const wind = weatherData.current_weather.windspeed;
        const weatherCode = weatherData.current_weather.weathercode;
        
        const details = getWeatherDetails(weatherCode);

        weatherInfo.innerHTML = `
            <h3>${name}, ${country}</h3>
            <div class="weather-icon">${details.icon}</div>
            <div class="temp">${temp > 0 ? '+' + temp : temp}°C</div>
            <p class="details">${details.text} • Ветер: ${wind} км/ч</p>
        `;
    } catch (error) {
        weatherInfo.innerHTML = '<p class="error">Ошибка: ' + error.message + '</p>';
    }
}
// Автоматическая загрузка погоды при открытии страницы
cityInput.value = 'Николаев';
getWeather();
