import './App.css';
import { useState } from "react";

function App() {
  const api = "https://api.weatherapi.com/v1/current.json";
  const key = "ce32436cbfda49d989a171617252210"; // keep private in env when deploying

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
    if (!city.trim()) return; // avoid empty searches
    try {
      setLoading(true);
      // use lowercase 'key' param
      const res = await fetch(`${api}?key=${encodeURIComponent(key)}&q=${encodeURIComponent(city.trim())}`);
      if (!res.ok) throw new Error("bad response");
      const weatherData = await res.json();

      // defensive check to ensure structure
      if (!weatherData || !weatherData.current) {
        throw new Error("invalid data");
      }

      setData(weatherData);
    } catch (e) {
      // required exact alert text
      alert("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  // helper to show hyphen only when the value is null or undefined
  const showOrDash = (val, suffix = "") => (val == null ? "-" : `${val}${suffix}`);

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

      {/* Loading p element uses exact text with ellipsis char */}
      {loading ? (
        <p>Loading data…</p>
      ) : (
        <div className="weather-cards">
          <div className="weather-card" id="temperature">
            <h3>Temperature</h3>
            <p>{showOrDash(data.current.temp_c, "°C")}</p>
          </div>

          <div id="humidity" className="weather-card">
            <h3>Humidity</h3>
            <p>{showOrDash(data.current.humidity, "%")}</p>
          </div>

          <div id="condition" className="weather-card">
            <h3>Condition</h3>
            <p>{showOrDash(data.current.condition?.text || null)}</p>
          </div>

          <div id="wind-speed" className="weather-card">
            <h3>Wind Speed</h3>
            <p>{showOrDash(data.current.wind_kph, " kph")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
