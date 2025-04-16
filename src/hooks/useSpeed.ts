import { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

export function useSpeed() {
  const [speed, setSpeed] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function requestPermissions() {
      if (Capacitor.isNativePlatform()) {
        const perm = await Geolocation.requestPermissions();
        if (perm.location !== 'granted') {
          setError('Location permission denied.');
          return;
        }
      }

      const watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true, maximumAge: 0 },
        (position, err) => {
          if (err) {
            setError(err.message);
            return;
          }
          if (position) {
            setSpeed(position.coords.speed);
            setAccuracy(position.coords.accuracy);
          }
        }
      );

      return () => {
        if (watchId) Geolocation.clearWatch({ id: watchId });
      };
    }

    requestPermissions();
  }, []);

  return { speed, accuracy, error };
}
