import "./App.css";
import { useState } from "react";

function App() {
  const api = "https://api.weatherapi.com/v1/current.json";
  const key = "ce32436cbfda49d989a171617252210"; // use env in production

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    current: {
      temp_c: null,
      humidity: null,
      wind_kph: null,
      condition: { text: null },
    },
  });

  const showOrDash = (val, suffix = "") => (val == null ? "-" : `${val}${suffix}`);

  const handleSearch = async () => {
    const q = city.trim();
    if (!q) return;

    try {
      // set loading synchronously so the <p> appears immediately after click
      setLoading(true);

      const res = await fetch(
        `${api}?key=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}`
      );
      if (!res.ok) throw new Error("bad response");
      const weatherData = await res.json();

      if (!weatherData || !weatherData.current) throw new Error("invalid data");
      setData(weatherData);
    } catch (err) {
      // exact alert text required by tests
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
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* EXACT text expected by Cypress test: three ASCII dots */}
      <p style={{ marginTop: 8, display: loading ? "block" : "none" }}>
        Loading data...
      </p>

      <div className="weather-cards" style={{ display: loading ? "none" : "grid" }}>
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
          <p>{showOrDash(data.current.condition?.text ?? null)}</p>
        </div>

        <div id="wind-speed" className="weather-card">
          <h3>Wind Speed</h3>
          <p>{showOrDash(data.current.wind_kph, " kph")}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
