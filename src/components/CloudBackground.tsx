"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import CLOUDS from "vanta/dist/vanta.clouds.min";

export default function VantaClouds() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<ReturnType<typeof CLOUDS> | null>(null);

  // Example: weather state (you’ll later pass this from props)
  const [weather, setWeather] = useState<string>("Clear");

  // Map weather → Vanta theme
  const getWeatherTheme = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return {
          skyColor: 0x708090, // grayish-blue
          cloudColor: 0xb0b0b0, // medium gray clouds
          cloudShadowColor: 0x505050,
          sunColor: 0xb0a583,
          sunGlareColor: 0xcfc2a0,
          sunlightColor: 0xe1dcc5,
        };
      case "clouds":
        return {
          skyColor: 0x708090,
          cloudColor: 0xb0b0b0,
          cloudShadowColor: 0x505050,
          sunColor: 0xb0a583,
          sunGlareColor: 0xcfc2a0,
          sunlightColor: 0xe1dcc5,
        };
      case "rain":
        return {
          skyColor: 0x2c3e50,
          cloudColor: 0x444444,
          cloudShadowColor: 0x222222,
          sunColor: 0x888888,
          sunGlareColor: 0x666666,
          sunlightColor: 0x777777,
        };
      case "thunderstorm":
        return {
          skyColor: 0x1a1a1a,
          cloudColor: 0x333333,
          cloudShadowColor: 0x111111,
          sunColor: 0xffd700,
          sunGlareColor: 0xffa500,
          sunlightColor: 0xfff5cc,
        };
      default:
        return {
          skyColor: 0x1b2a38,
          cloudColor: 0xdadada,
          cloudShadowColor: 0x505050,
          sunColor: 0xb0a583,
          sunGlareColor: 0xcfc2a0,
          sunlightColor: 0xe1dcc5,
        };
    }
  };

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const effect = CLOUDS({
        el: vantaRef.current,
        THREE,
        ...getWeatherTheme(weather),
        speed: 0.8,
        cloudCount: 50,
      });
      setVantaEffect(effect);
    }
    return () => {
      vantaEffect?.destroy();
    };
  }, [vantaEffect, weather]);

  return <div ref={vantaRef} className="absolute inset-0 -z-10" />;
}
