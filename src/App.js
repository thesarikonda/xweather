import './App.css';
import { useState } from "react";

function App() {
  const api = "https://api.weatherapi.com/v1/current.json";
  const key = "ce32436cbfda49d989a171617252210";

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    current: {
      temp_c: null,
      humidity: null,
      wind_kph: null,
      condition: {
        text: null,
      },
    },
  });

  const handleSearch = async () => {
    if (!city.trim()) return; // avoid empty search
    try {
      setLoading(true);
      const response = await fetch(`${api}?key=${key}&q=${city}`);
      
      if (!response.ok) {
        throw new Error("Failed response");
      }

      const weatherData = await response.json();
      console.log(weatherData);
      setData(weatherData);
    } catch (e) {
      alert("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="city-input">
        <input
          type="text"
          placeholder="Enter name of city"
          onChange={(e) => setCity(e.target.value)}
          value={city}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="weather-cards">
          <div className="weather-card" id="temperature">
            <h3>Temperature</h3>
            <p>
              {!data.current.temp_c ? "-" : `${data.current.temp_c}°C`}
            </p>
          </div>

          <div id="humidity" className="weather-card">
            <h3>Humidity</h3>
            <p>
              {!data.current.humidity ? "-" : `${data.current.humidity}%`}
            </p>
          </div>

          <div id="condition" className="weather-card">
            <h3>Condition</h3>
            <p>
              {!data.current.condition.text
                ? "-"
                : data.current.condition.text}
            </p>
          </div>

          <div id="wind-speed" className="weather-card">
            <h3>Wind Speed</h3>
            <p>
              {!data.current.wind_kph ? "-" : `${data.current.wind_kph} kph`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
