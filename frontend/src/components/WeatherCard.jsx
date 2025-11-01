import React, { useState } from "react";

export default function WeatherCard({ side = false }) {
  const [city, setCity] = useState("Rajpura"); // default city
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );

      if (!res.ok) throw new Error("City not found or API key invalid");

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch default city for side widget
  if (side && !weather && !loading && !error) {
    fetchWeather(city);
  }

  return (
    <div
      className={`bg-white p-4 rounded-2xl shadow-md ${
        side ? "w-48 text-sm" : "w-56"
      }`}
    >
      {/* Input & Search for full version */}
      {!side && (
        <div className="mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="flex-1 px-2 py-1 border rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <button
              onClick={() => fetchWeather(city)}
              className="bg-indigo-500 text-white px-3 py-1 rounded-r-md hover:bg-indigo-600 text-sm transition"
            >
              Go
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && <p className="text-gray-500 text-sm">Loading...</p>}

      {/* Error */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Weather Info */}
      {weather && (
        <div className="text-center text-gray-700">
          <p className="font-semibold">{weather.name}</p>
          <p className="text-lg font-bold">{weather.main.temp}°C</p>
          <p className="capitalize">{weather.weather[0].description}</p>
          {!side && (
            <p className="text-xs text-gray-500">
              Humidity: {weather.main.humidity}%
            </p>
          )}
        </div>
      )}

      {!weather && !loading && !error && (
        <p className="text-gray-500 text-sm">
          Enter a city to see weather
        </p>
      )}
    </div>
  );
}
