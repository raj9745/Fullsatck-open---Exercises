import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (searchItem.trim() === '') {
      setCountries([]);
      return;
    }

    const fetchCountry = async () => {
      try {
        const url = `https://restcountries.com/v3.1/name/${searchItem}`;
        const response = await axios.get(url);
        console.log(response.data);
        setCountries(response.data);
        setSelectedCountry(null);
        setWeather(null);
        setApiError(null);

        if (response.data.length === 1) {
          const capital = response.data[0].capital?.[0];
          if (capital) {
            fetchWeatherData(capital);
          }
        }

      } catch (error) {
        console.log('Error Fetching data:', error.message);
      }
    };

    fetchCountry();
  }, [searchItem]);

  const fetchWeatherData = async (capital) => {
    try {
      const apiKey = import.meta.env.VITE_SOME_KEY;
      const v2_5 = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;
      const weatherResponse = await axios.get(v2_5);
      console.log(weatherResponse.data);
      setWeather(weatherResponse.data);
      setApiError(null);
    } catch (error) {
      console.log('Error fetching the weather data');
      setWeather(null);
      setApiError('Failed to fetch weather data');
    }
  };

  const renderLanguage = (languages) => {
    if (Array.isArray(languages)) {
      return languages.join(', ');
    } else if (typeof languages === 'object') {
      return Object.values(languages).join(', ');
    } else {
      return "Unknown";
    }
  };

  const handleCountryButton = (country) => {
    setSelectedCountry(country);
    setWeather(null);
    setApiError(null);
    const capital = country.capital?.[0];
    if (capital) {
      fetchWeatherData(capital);
    }
  };

  return (
    <div>
      <h1>Country Information App</h1>
      <label>
        Search for country:{' '}
        <input
          type="text"
          value={searchItem}
          onChange={e => setSearchItem(e.target.value)}
        />
      </label>

      {countries.length > 10 && (
        <p>Too many countries, please make your entry more specific.</p>
      )}

      {searchItem && countries.length <= 10 && countries.length > 1 && (
        <div>
          <h3>Matching countries:</h3>
          <ul>
            {countries.map(country => (
              <li key={country.cca3}>
                {country.name.common}{' '}
                <button onClick={() => handleCountryButton(country)}>
                  Show country data
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedCountry && (
        <div>
          <h3>{selectedCountry.name.common}</h3>
          <p>Capital: {selectedCountry.capital?.join(', ')}</p>
          <p>Area: {selectedCountry.area}</p>
          <p>
            Language(s):{' '}
            {selectedCountry.languages && renderLanguage(selectedCountry.languages)}
          </p>
          <p>Flag:</p>
          <img
            src={selectedCountry.flags.png}
            alt={`${selectedCountry.name.common}'s flag`}
            width="200px"
          />
          <p>Coat of Arms:</p>
          <img
            src={selectedCountry.coatOfArms?.svg}
            alt={`${selectedCountry.name.common}'s Coat of Arms`}
            width="300px"
            height="125px"
          />
          <p> Weather Map Data</p>
          
          {weather && (
            <div>
            <h4>Weather in {selectedCountry.capital?.[0]}</h4>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Feels Like: {weather.main.feels_like} °C</p>
              <p>Condition: {weather.weather[0].description}</p>
               <p>Wind Speed: {weather.wind.speed}</p>
               <p> Weather Icon :</p>
               {
  weather?.weather?.[0]?.icon && (
    <img
      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      alt="Weather Icon"
      title={weather.weather[0].description}
    />
  )
}
            </div>
          )}
          {apiError && <p>{apiError}</p>}
        </div>
      )}

      
    </div>
  );
};

export default App;
