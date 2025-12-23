import React, { useState, useEffect, useRef } from 'react';
import { Cloud, CloudRain, CloudSun, Sun, Wind, Droplets, Menu, MapPin, List, Moon, CloudLightning, CloudSnow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onExitDisguise: () => void;
}

interface WeatherData {
  temperature: number;
  weatherCode: number;
  minTemp: number;
  maxTemp: number;
  windSpeed: number;
  humidity: number;
  isDay: boolean;
  hourly: { time: string; temp: number; code: number }[];
  daily: { time: string; min: number; max: number; code: number }[];
}

const WeatherDisguise: React.FC<Props> = ({ onExitDisguise }) => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Stealth Interaction State
  const [menuTapCount, setMenuTapCount] = useState(0);
  const [tempTapCount, setTempTapCount] = useState(0);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Location and Real Weather Data
  useEffect(() => {
    if (!navigator.geolocation) {
      setCity("Location Unavailable");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // 1. Fetch City Name (Reverse Geocoding)
          // Using a free reliable geocoding service tailored for Open Street Map data
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const geoData = await geoRes.json();
          // Try to find the most relevant city name
          const address = geoData.address;
          const detectedCity = address.city || address.town || address.village || address.county || "Local Area";
          setCity(detectedCity);

          // 2. Fetch Weather Data (Open-Meteo - Free, No Key)
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
          );
          const wData = await weatherRes.json();

          // Process Data
          setWeather({
            temperature: Math.round(wData.current.temperature_2m),
            weatherCode: wData.current.weather_code,
            isDay: wData.current.is_day === 1,
            humidity: wData.current.relative_humidity_2m,
            windSpeed: wData.current.wind_speed_10m,
            minTemp: Math.round(wData.daily.temperature_2m_min[0]),
            maxTemp: Math.round(wData.daily.temperature_2m_max[0]),
            hourly: wData.hourly.time.slice(0, 24).map((t: string, i: number) => ({
              time: t,
              temp: Math.round(wData.hourly.temperature_2m[i]),
              code: wData.hourly.weather_code[i]
            })),
            daily: wData.daily.time.map((t: string, i: number) => ({
              time: t,
              min: Math.round(wData.daily.temperature_2m_min[i]),
              max: Math.round(wData.daily.temperature_2m_max[i]),
              code: wData.daily.weather_code[i]
            }))
          });
        } catch (error) {
          console.error("Weather fetch failed", error);
          setCity("Network Error");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Location denied", error);
        setCity("Location Denied");
        setLoading(false);
      }
    );
  }, []);

  // --- Helpers for Weather Codes & Icons ---
  const getWeatherIcon = (code: number, size = 24, isDay = true) => {
    // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
    if (code === 0) return isDay ? <Sun size={size} className="text-yellow-400" /> : <Moon size={size} className="text-slate-200" />;
    if (code >= 1 && code <= 3) return isDay ? <CloudSun size={size} className="text-white" /> : <Cloud size={size} className="text-slate-300" />;
    if (code >= 45 && code <= 48) return <Cloud size={size} className="text-slate-200 opacity-80" />; // Fog
    if (code >= 51 && code <= 67) return <CloudRain size={size} className="text-blue-200" />; // Drizzle/Rain
    if (code >= 71 && code <= 77) return <CloudSnow size={size} className="text-white" />; // Snow
    if (code >= 80 && code <= 82) return <CloudRain size={size} className="text-blue-300" />; // Showers
    if (code >= 95) return <CloudLightning size={size} className="text-yellow-200" />; // Thunderstorm
    return <Sun size={size} />;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear";
    if (code === 1) return "Mainly Clear";
    if (code === 2) return "Partly Cloudy";
    if (code === 3) return "Overcast";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 55) return "Drizzle";
    if (code >= 61 && code <= 65) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 95) return "Thunderstorm";
    return "Clear";
  };

  const getBackgroundGradient = (code: number, isDay: boolean) => {
    if (!isDay) return "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"; // Night
    if (code === 0 || code === 1) return "bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200"; // Sunny
    if (code >= 2 && code <= 3) return "bg-gradient-to-b from-sky-500 via-sky-400 to-sky-300"; // Cloudy
    if (code >= 51 || code >= 95) return "bg-gradient-to-b from-slate-700 via-slate-600 to-slate-500"; // Rain/Storm
    return "bg-gradient-to-b from-blue-500 to-blue-300"; // Default
  };

  // --- Secret Triggers ---

  // 1. Exit Disguise: Triple tap the Menu icon (top right)
  const handleMenuTap = () => {
    setMenuTapCount(prev => prev + 1);
    if (menuTapCount + 1 >= 3) {
      onExitDisguise();
      setMenuTapCount(0);
    }
    setTimeout(() => setMenuTapCount(0), 2000);
  };

  // 2. SOS Trigger: 5 taps on the big Temperature number
  const handleTempTap = () => {
    setTempTapCount(prev => prev + 1);
    if (tempTapCount + 1 >= 5) {
      onExitDisguise();
      setTimeout(() => {
        navigate('/chat', { state: { autoStartVoice: true } });
      }, 100);
      setTempTapCount(0);
    }
    setTimeout(() => setTempTapCount(0), 2000);
  };

  // Format hour for hourly forecast
  const formatHour = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    if (date.getHours() === now.getHours()) return "Now";
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true }).replace(' ', '');
  };

  const getDayName = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    if (date.getDate() === today.getDate()) return "Today";
    return date.toLocaleDateString([], { weekday: 'short' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
         <div className="animate-pulse flex flex-col items-center">
            <Sun className="animate-spin mb-4" size={40}/>
            <p>Loading Weather Data...</p>
         </div>
      </div>
    );
  }

  const bgClass = weather ? getBackgroundGradient(weather.weatherCode, weather.isDay) : "bg-blue-500";

  return (
    <div className={`min-h-screen ${bgClass} text-white font-sans select-none overflow-hidden relative transition-colors duration-1000`}>
      
      {/* iOS Header Bar */}
      <div className="pt-12 px-6 flex justify-between items-center z-20 relative">
         <div className="w-8"></div> {/* Spacer for centering */}
         <div className="flex flex-col items-center">
            <h2 className="text-2xl font-medium drop-shadow-md tracking-wide">{city}</h2>
            <div className="flex items-center gap-1 text-xs font-medium opacity-80 bg-black/10 px-2 py-0.5 rounded-full mt-1">
               <MapPin size={10} />
               <span>Current Location</span>
            </div>
         </div>
         <button 
           onClick={handleMenuTap}
           className="w-8 h-8 flex items-center justify-center rounded-full active:bg-white/20 transition-colors"
         >
            <List size={24} className="drop-shadow-md" />
         </button>
      </div>

      {/* Main Weather Display (SOS Trigger) */}
      <div className="flex flex-col items-center mt-6 z-10 relative">
         <div 
            className="flex flex-col items-center active:opacity-80 transition-opacity cursor-default"
            onClick={handleTempTap}
         >
             <span className="text-8xl font-thin tracking-tighter drop-shadow-lg relative left-2">
                {weather?.temperature}°
             </span>
             <span className="text-xl font-medium opacity-90 capitalize drop-shadow-md mt-1">
                {weather ? getWeatherDescription(weather.weatherCode) : "--"}
             </span>
             <div className="flex gap-2 text-lg font-medium opacity-80 mt-1 drop-shadow-md">
                <span>H:{weather?.maxTemp}°</span>
                <span>L:{weather?.minTemp}°</span>
             </div>
         </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="mt-12 h-[calc(100vh-350px)] overflow-y-auto pb-20 scrollbar-hide px-5 space-y-4">
         
         {/* Hourly Forecast */}
         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm">
            <div className="text-xs font-medium opacity-70 mb-3 uppercase border-b border-white/10 pb-2 flex items-center gap-1">
               <Sun size={12} /> Hourly Forecast
            </div>
            <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide">
               {weather?.hourly.map((hour, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 min-w-[3rem]">
                     <span className="text-sm font-medium">{formatHour(hour.time)}</span>
                     <div className="my-1">
                        {getWeatherIcon(hour.code, 20, weather.isDay)}
                     </div>
                     <span className="text-lg font-medium">{hour.temp}°</span>
                  </div>
               ))}
            </div>
         </div>

         {/* 7-Day Forecast */}
         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm">
            <div className="text-xs font-medium opacity-70 mb-3 uppercase border-b border-white/10 pb-2 flex items-center gap-1">
               <List size={12} /> 7-Day Forecast
            </div>
            <div className="flex flex-col gap-1">
               {weather?.daily.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                     <span className="w-16 font-medium text-lg">{getDayName(day.time)}</span>
                     <div className="flex-1 flex justify-center">
                        {getWeatherIcon(day.code, 20, true)}
                     </div>
                     <div className="w-32 flex items-center justify-end gap-4">
                        <span className="opacity-60 text-lg">{day.min}°</span>
                        <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 bottom-0 bg-gradient-to-r from-green-300 to-yellow-300 opacity-80 w-full"></div>
                        </div>
                        <span className="font-medium text-lg">{day.max}°</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Details Grid */}
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm flex flex-col justify-between h-32">
               <div className="text-xs opacity-70 uppercase flex items-center gap-1"><Wind size={12}/> Wind</div>
               <div className="text-3xl font-medium">{weather?.windSpeed} <span className="text-sm">km/h</span></div>
               <div className="text-xs opacity-80">Moderate Breeze</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm flex flex-col justify-between h-32">
               <div className="text-xs opacity-70 uppercase flex items-center gap-1"><Droplets size={12}/> Humidity</div>
               <div className="text-3xl font-medium">{weather?.humidity}%</div>
               <div className="text-xs opacity-80">Dew point is 14°</div>
            </div>
         </div>
      </div>

      {/* Fake Tab Bar at Bottom */}
      <div className="absolute bottom-0 w-full bg-white/10 backdrop-blur-lg border-t border-white/10 p-4 flex justify-between px-8 pb-6">
         <MapPin size={24} className="opacity-80" />
         <div className="flex gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
         </div>
         <List size={24} className="opacity-80" />
      </div>

    </div>
  );
};

export default WeatherDisguise;