"use client";

import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import Navbar from "@/components/Navbar";
import VantaClouds from "@/components/CloudBackground";
import Image from "next/image";

type Weather = {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    wind_kph: number;
    wind_dir: string;
    condition: {
      text: string;
      icon: string;
    };
  };
};

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiData, setAiData] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Open sidebar on page load
  useEffect(() => {
    const timer = setTimeout(() => setIsSidebarOpen(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_KEY}&q=${city.trim()}&days=7`
      );
      const data: Weather & { error?: { message: string } } = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error?.message || "City not found");
      }

      setWeather(data);

      // AI message
      const aiResponse = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weather: data }),
      });
      const aiJson = await aiResponse.json();
      const fullText: string = aiJson.data;

      // typing effect
      let i = 0;
      setAiData(""); // reset
      const interval = setInterval(() => {
        setAiData((prev) => prev + fullText[i]);
        i++;
        if (i >= fullText.length) clearInterval(interval);
      }, 30);

      // clear input
      setCity("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen text-white p-20">
      {/* Background */}
      <VantaClouds />

      <div className="absolute inset-0 flex z-10 p-7">
        {/* Left Sidebar */}
        <div className="w-80 bg-black/30 backdrop-blur-md p-6 flex flex-col gap-6 rounded-2xl">
          <Navbar />

          {/* Search */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-2 w-[20] rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none flex-1"
            />
            <button
              onClick={getWeather}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 font-medium hover:opacity-90 transition"
            >
              Search
            </button>
          </div>

          {loading && <Loader className="animate-spin" />}
          {error && <p className="text-red-300">{error}</p>}

          {/* Weather card */}
          {weather && (
            <div className="mt-4 p-4 bg-white/20 rounded-[30px] shadow-lg text-center">
              <h2 className="text-2xl font-semibold">{weather.location.name}</h2>
              <p className="text-sm">
                {weather.location.region}, {weather.location.country}
              </p>
              <p className="text-4xl font-bold mt-2">{weather.current.temp_c}°C</p>
              <p className="italic">{weather.current.condition.text}</p>
              <Image
                src={`https:${weather.current.condition.icon}`}
                alt="weather icon"
                width={100}
                height={100}
                className="mx-auto mt-2"
              />
              <div className="mt-4 space-y-1 text-sm">
                <p>🌡️ Feels like: {weather.current.feelslike_c}°C</p>
                <p>💧 Humidity: {weather.current.humidity}%</p>
                <p>
                  💨 Wind: {weather.current.wind_kph} km/h {weather.current.wind_dir}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-6xl font-bold ml-6">
          Stormy <br /> With <br /> Partly Cloudy
        </h2>

        {/* Right Sidebar */}
        <div
          className={`fixed top-0 right-0 rounded-[30px] h-full w-fit bg-black/30 backdrop-blur-md p-6 flex flex-col gap-6
                    transform transition-transform duration-700 overflow-y-scroll
                    ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <h1 className="text-2xl font-bold text-white">WeatherWise</h1>
          <div className="bg-gray-800 text-white p-4 rounded w-72">
            <h2 className="text-xl font-bold mb-2">AI Weather Advice</h2>
            <p className="whitespace-pre-line">
              {loading ? <Loader className="animate-spin" /> : aiData}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
