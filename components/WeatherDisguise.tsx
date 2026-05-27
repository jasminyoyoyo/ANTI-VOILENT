import React, { useEffect, useMemo, useState } from 'react';
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Eye,
  Gauge,
  List,
  MapPin,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onExitDisguise: () => void;
}

interface HourlyForecast {
  time: string;
  temp: number;
  code: number;
  precipitationProbability: number;
}

interface DailyForecast {
  time: string;
  min: number;
  max: number;
  code: number;
}

interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  minTemp: number;
  maxTemp: number;
  windSpeed: number;
  humidity: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  pressure: number;
  sunrise: string;
  sunset: string;
  isDay: boolean;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

const DEFAULT_LOCATION = {
  city: 'Sydney',
  latitude: -33.8688,
  longitude: 151.2093,
};

const buildFallbackWeather = (): WeatherData => {
  const now = new Date();
  const currentHour = now.getHours();
  const isDay = currentHour >= 6 && currentHour < 18;
  const baseTemp = isDay ? 22 : 16;
  const weatherCode = isDay ? 1 : 2;
  const sunrise = new Date(now);
  sunrise.setHours(6, 18, 0, 0);
  const sunset = new Date(now);
  sunset.setHours(17, 9, 0, 0);

  return {
    temperature: baseTemp,
    apparentTemperature: baseTemp + 1,
    weatherCode,
    minTemp: baseTemp - 4,
    maxTemp: baseTemp + 5,
    windSpeed: 18,
    humidity: 58,
    cloudCover: isDay ? 32 : 48,
    visibility: 10,
    uvIndex: isDay ? 5 : 0,
    pressure: 1014,
    sunrise: sunrise.toISOString(),
    sunset: sunset.toISOString(),
    isDay,
    hourly: Array.from({ length: 24 }, (_, index) => {
      const hour = new Date(now);
      hour.setHours(now.getHours() + index, 0, 0, 0);
      const tempOffset = index < 6 ? -2 : index < 12 ? 0 : index < 18 ? 3 : -1;
      return {
        time: hour.toISOString(),
        temp: baseTemp + tempOffset,
        code: index % 8 === 0 ? 3 : weatherCode,
        precipitationProbability: index % 6 === 0 ? 22 : 8,
      };
    }),
    daily: Array.from({ length: 7 }, (_, index) => {
      const day = new Date(now);
      day.setDate(now.getDate() + index);
      day.setHours(12, 0, 0, 0);
      return {
        time: day.toISOString(),
        min: baseTemp - 4 + (index % 2),
        max: baseTemp + 4 + (index % 3),
        code: index % 3 === 0 ? 3 : weatherCode,
      };
    }),
  };
};

const WeatherDisguise: React.FC<Props> = ({ onExitDisguise }) => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>('Loading...');
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [menuTapCount, setMenuTapCount] = useState(0);
  const [tempTapCount, setTempTapCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const reverseGeocode = async (latitude: number, longitude: number, fallbackCity: string) => {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10`,
          { headers: { Accept: 'application/json' } }
        );

        if (!geoRes.ok) {
          throw new Error(`Geocoding failed with status ${geoRes.status}`);
        }

        const geoData = await geoRes.json();
        const address = geoData.address ?? {};
        return address.city || address.town || address.village || address.county || fallbackCity;
      } catch (error) {
        console.error('Reverse geocoding failed', error);
        return fallbackCity;
      }
    };

    const loadWeather = async (latitude: number, longitude: number, fallbackCity: string) => {
      try {
        setLoading(true);
        setCity(fallbackCity);

        const [weatherRes, resolvedCity] = await Promise.all([
          fetch(
            [
              'https://api.open-meteo.com/v1/forecast',
              `?latitude=${latitude}`,
              `&longitude=${longitude}`,
              '&current=temperature_2m,apparent_temperature,relative_humidity_2m,is_day,weather_code,wind_speed_10m,cloud_cover,surface_pressure',
              '&hourly=temperature_2m,weather_code,precipitation_probability,visibility,uv_index',
              '&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max',
              '&timezone=auto',
            ].join('')
          ),
          reverseGeocode(latitude, longitude, fallbackCity),
        ]);

        if (!weatherRes.ok) {
          throw new Error(`Weather request failed with status ${weatherRes.status}`);
        }

        const wData = await weatherRes.json();
        setCity(resolvedCity);
        setWeather({
          temperature: Math.round(wData.current.temperature_2m),
          apparentTemperature: Math.round(wData.current.apparent_temperature),
          weatherCode: wData.current.weather_code,
          isDay: wData.current.is_day === 1,
          humidity: Math.round(wData.current.relative_humidity_2m),
          windSpeed: Math.round(wData.current.wind_speed_10m),
          cloudCover: Math.round(wData.current.cloud_cover),
          visibility: Math.round((wData.hourly.visibility?.[0] ?? 10000) / 1000),
          uvIndex: Math.round(wData.daily.uv_index_max?.[0] ?? wData.hourly.uv_index?.[0] ?? 0),
          pressure: Math.round(wData.current.surface_pressure),
          sunrise: wData.daily.sunrise?.[0],
          sunset: wData.daily.sunset?.[0],
          minTemp: Math.round(wData.daily.temperature_2m_min[0]),
          maxTemp: Math.round(wData.daily.temperature_2m_max[0]),
          hourly: wData.hourly.time.slice(0, 24).map((t: string, i: number) => ({
            time: t,
            temp: Math.round(wData.hourly.temperature_2m[i]),
            code: wData.hourly.weather_code[i],
            precipitationProbability: Math.round(wData.hourly.precipitation_probability?.[i] ?? 0),
          })),
          daily: wData.daily.time.map((t: string, i: number) => ({
            time: t,
            min: Math.round(wData.daily.temperature_2m_min[i]),
            max: Math.round(wData.daily.temperature_2m_max[i]),
            code: wData.daily.weather_code[i],
          })),
        });
      } catch (error) {
        console.error('Weather fetch failed', error);
        setCity(fallbackCity);
        setWeather(buildFallbackWeather());
      } finally {
        setLoading(false);
      }
    };

    if (!navigator.geolocation) {
      loadWeather(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, DEFAULT_LOCATION.city);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadWeather(position.coords.latitude, position.coords.longitude, 'Current Area');
      },
      (error) => {
        console.error('Location unavailable, falling back to default city', error);
        loadWeather(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, DEFAULT_LOCATION.city);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10 * 60 * 1000,
      }
    );
  }, []);

  const activeWeather = weather ?? buildFallbackWeather();

  const summaryDetails = useMemo(
    () => [
      { label: 'Feels Like', value: `${activeWeather.apparentTemperature}°`, icon: Thermometer },
      { label: 'Humidity', value: `${activeWeather.humidity}%`, icon: Droplets },
      { label: 'Wind', value: `${activeWeather.windSpeed} km/h`, icon: Wind },
      { label: 'Visibility', value: `${activeWeather.visibility} km`, icon: Eye },
      { label: 'UV Index', value: `${activeWeather.uvIndex}`, icon: Sun },
      { label: 'Pressure', value: `${activeWeather.pressure} hPa`, icon: Gauge },
    ],
    [activeWeather]
  );

  const getWeatherIcon = (code: number, size = 24, isDay = true) => {
    if (code === 0) return isDay ? <Sun size={size} className="text-yellow-300" /> : <Moon size={size} className="text-slate-100" />;
    if (code >= 1 && code <= 3) return isDay ? <CloudSun size={size} className="text-white" /> : <Cloud size={size} className="text-slate-200" />;
    if (code >= 45 && code <= 48) return <Cloud size={size} className="text-slate-200 opacity-90" />;
    if (code >= 51 && code <= 67) return <CloudRain size={size} className="text-sky-200" />;
    if (code >= 71 && code <= 77) return <CloudSnow size={size} className="text-white" />;
    if (code >= 80 && code <= 82) return <CloudRain size={size} className="text-sky-100" />;
    if (code >= 95) return <CloudLightning size={size} className="text-yellow-200" />;
    return <Sun size={size} />;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Clear';
    if (code === 1) return 'Mainly Clear';
    if (code === 2) return 'Partly Cloudy';
    if (code === 3) return 'Overcast';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 55) return 'Light Drizzle';
    if (code >= 56 && code <= 67) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Clear';
  };

  const getBackgroundGradient = (code: number, isDay: boolean) => {
    if (!isDay) {
      return 'bg-[radial-gradient(circle_at_top,rgba(102,126,234,0.32),transparent_32%),linear-gradient(180deg,#081329_0%,#102347_48%,#0b1730_100%)]';
    }
    if (code === 0 || code === 1) {
      return 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.32),transparent_34%),linear-gradient(180deg,#5caeff_0%,#73c2ff_40%,#b9e4ff_100%)]';
    }
    if (code >= 2 && code <= 48) {
      return 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_30%),linear-gradient(180deg,#4f84bb_0%,#6aa3cb_44%,#a9c3d8_100%)]';
    }
    return 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_28%),linear-gradient(180deg,#55616f_0%,#667684_46%,#8ba0b0_100%)]';
  };

  const handleMenuTap = () => {
    setMenuTapCount((prev) => prev + 1);
    if (menuTapCount + 1 >= 3) {
      onExitDisguise();
      setMenuTapCount(0);
    }
    setTimeout(() => setMenuTapCount(0), 2000);
  };

  const handleTempTap = () => {
    setTempTapCount((prev) => prev + 1);
    if (tempTapCount + 1 >= 5) {
      onExitDisguise();
      setTimeout(() => {
        navigate('/chat', { state: { autoStartVoice: true } });
      }, 100);
      setTempTapCount(0);
    }
    setTimeout(() => setTempTapCount(0), 2000);
  };

  const formatHour = (isoString: string) => {
    const date = new Date(isoString);
    if (date.getHours() === currentTime.getHours()) return 'Now';
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true }).replace(' ', '');
  };

  const getDayName = (isoString: string) => {
    const date = new Date(isoString);
    if (date.getDate() === currentTime.getDate()) return 'Today';
    return date.toLocaleDateString([], { weekday: 'short' });
  };

  const formatClock = (date: Date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const formatSunTime = (isoString: string) => formatClock(new Date(isoString));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border border-white/20"></div>
            <div className="absolute inset-2 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-base font-medium">Loading Weather</p>
            <p className="text-sm text-white/65">Preparing a neutral screen...</p>
          </div>
        </div>
      </div>
    );
  }

  const bgClass = getBackgroundGradient(activeWeather.weatherCode, activeWeather.isDay);

  return (
    <div className={`min-h-screen ${bgClass} text-white overflow-hidden relative transition-colors duration-1000`}>
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute right-[-7rem] top-52 h-64 w-64 rounded-full bg-sky-200/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen px-5 pt-12 pb-6">
        <div className="mb-6 flex items-center justify-between text-sm font-medium text-white/80">
          <span>{formatClock(currentTime)}</span>
          <span className="rounded-full bg-white/12 px-3 py-1 tracking-[0.2em] uppercase">Weather</span>
          <button onClick={handleMenuTap} className="rounded-full bg-white/10 p-2 active:bg-white/20 transition-colors">
            <List size={20} />
          </button>
        </div>

        <section className="glass-panel rounded-[2rem] border border-white/18 px-6 py-7 shadow-[0_30px_80px_rgba(6,24,44,0.28)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-2 text-white/80">
                <MapPin size={14} />
                <span className="text-sm">{city}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="pt-3">{getWeatherIcon(activeWeather.weatherCode, 42, activeWeather.isDay)}</div>
                <div className="cursor-default select-none" onClick={handleTempTap}>
                  <p className="text-[4.8rem] leading-none font-thin tracking-[-0.08em]">{activeWeather.temperature}°</p>
                  <p className="mt-1 text-xl font-medium text-white/92">{getWeatherDescription(activeWeather.weatherCode)}</p>
                  <p className="mt-2 text-sm text-white/72">
                    H:{activeWeather.maxTemp}°  L:{activeWeather.minTemp}°  Feels like {activeWeather.apparentTemperature}°
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.22em] text-white/65">Updated</p>
              <p className="mt-1 text-lg font-medium">{formatClock(currentTime)}</p>
              <div className="mt-5 space-y-3 text-sm text-white/75">
                <div className="flex items-center justify-end gap-2">
                  <Sunrise size={15} />
                  <span>{formatSunTime(activeWeather.sunrise)}</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Sunset size={15} />
                  <span>{formatSunTime(activeWeather.sunset)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {summaryDetails.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-white/14 bg-white/8 px-3 py-3">
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/60">
                  <Icon size={12} />
                  <span>{label}</span>
                </div>
                <p className="text-base font-semibold text-white/95">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel mt-4 rounded-[1.75rem] border border-white/16 px-5 py-4 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-[0.24em] text-white/62">Hourly Forecast</h3>
            <span className="text-xs text-white/60">{activeWeather.cloudCover}% cloud cover</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {activeWeather.hourly.map((hour) => (
              <div key={hour.time} className="min-w-[4.7rem] rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-center">
                <p className="text-xs font-medium text-white/72">{formatHour(hour.time)}</p>
                <div className="my-2 flex justify-center">{getWeatherIcon(hour.code, 20, activeWeather.isDay)}</div>
                <p className="text-lg font-semibold">{hour.temp}°</p>
                <p className="mt-1 text-[11px] text-sky-100/80">{hour.precipitationProbability}% rain</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel mt-4 rounded-[1.75rem] border border-white/16 px-5 py-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-[0.24em] text-white/62">7-Day Forecast</h3>
            <span className="text-xs text-white/60">Live or demo data</span>
          </div>
          <div className="space-y-1">
            {activeWeather.daily.map((day) => (
              <div key={day.time} className="flex items-center justify-between rounded-2xl px-2 py-2.5">
                <div className="flex w-20 items-center gap-3">
                  <span className="text-base font-medium">{getDayName(day.time)}</span>
                </div>
                <div className="flex flex-1 justify-center">{getWeatherIcon(day.code, 20, true)}</div>
                <div className="flex w-40 items-center justify-end gap-3">
                  <span className="text-sm text-white/65">{day.min}°</span>
                  <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-white/12">
                    <div className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-sky-200 via-lime-200 to-yellow-200"></div>
                  </div>
                  <span className="text-base font-semibold">{day.max}°</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-4 flex items-center justify-between rounded-[1.75rem] border border-white/12 bg-black/12 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-white/78">
            <MapPin size={19} />
            <span className="text-sm">Map</span>
          </div>
          <div className="flex gap-2">
            <span className="h-2 w-2 rounded-full bg-white"></span>
            <span className="h-2 w-2 rounded-full bg-white/35"></span>
          </div>
          <div className="flex items-center gap-2 text-white/78">
            <CloudSun size={19} />
            <span className="text-sm">Forecast</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisguise;
