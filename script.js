const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const apiKey = '1a01ef801e8e1ddc1a7b737dec9fc148'; // Replace with your OpenWeatherMap API key

$(document).ready(function () {
    const defaultCity = 'Chittoor';
    weatherFn(defaultCity); // Initial city name for current weather
    forecastFn(defaultCity); // Initial city name for forecast weather
});

async function weatherFn(cName) {
    const temp = `${weatherUrl}?q=${cName}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(temp);
        const data = await res.json();
        if (res.ok) {
            weatherShowFn(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#temperature').html(`${data.main.temp}°C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#weather-icon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    $('#weather-info').fadeIn();
}

async function forecastFn(cName) {
    const forecastTemp = `${forecastUrl}?q=${cName}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(forecastTemp);
        const data = await res.json();
        if (res.ok) {
            forecastShowFn(data);
        } else {
            alert('Error fetching forecast data. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

function forecastShowFn(data) {
    $('#city-name2').text($('#city-input2').val() || 'Chittoor');
    $('#date2').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    const forecastContainer = $('#forecast');
    forecastContainer.empty();

    // The forecast API returns data in 3-hour intervals; group them by day
    const dailyForecast = {};
    data.list.forEach(item => {
        const date = moment(item.dt_txt).format('YYYY-MM-DD');
        if (!dailyForecast[date]) {
            dailyForecast[date] = [];
        }
        dailyForecast[date].push(item);
    });

    Object.keys(dailyForecast).slice(0, 5).forEach(date => {
        const dayData = dailyForecast[date];
        const avgTemp = dayData.reduce((acc, cur) => acc + cur.main.temp, 0) / dayData.length;
        const weatherDesc = dayData[0].weather[0].description;
        const weatherIcon = dayData[0].weather[0].icon;

        const forecastDay = $('<div>').addClass('forecast-day');
        const dateElem = $('<p>').text(moment(date).format('ddd, MMM D'));
        const iconElem = $('<img>').attr('src', `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
        const tempElem = $('<p>').html(`${avgTemp.toFixed(2)}°C`);
        const descElem = $('<p>').text(weatherDesc);

        forecastDay.append(dateElem, iconElem, tempElem, descElem);
        forecastContainer.append(forecastDay);
    });

    $('#forecast-info').fadeIn();
}

// Event listeners for the city input buttons
$('#city-input-btn').click(function () {
    const cityName = $('#city-input').val();
    if (cityName !== '') {
        weatherFn(cityName);
    } else {
        alert('Please enter a city name.');
    }
});

$('#city-input-btn2').click(function () {
    const cityName = $('#city-input2').val();
    if (cityName !== '') {
        forecastFn(cityName);
    } else {
        alert('Please enter a city name.');
    }
});
