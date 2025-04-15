import { useEffect, useState } from 'react';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';

/**
 * Custom hook to watch the user's speed (in km/h) and accuracy (in meters).
 * Automatically requests permission if not granted.
 */
export const useSpeed = () => {
  const [speed, setSpeed] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let watchId: string;

    const setupLocation = async () => {
      try {
        // Check for existing permission status
        const permissionStatus: PermissionStatus = await Geolocation.checkPermissions();

        // Request permission if not granted already
        if (permissionStatus.location !== 'granted') {
          const newPermission = await Geolocation.requestPermissions();
          if (newPermission.location !== 'granted') {
            setError('Location permission denied');
            return;
          }
        }

        // Start watching the location with improved precision options
        watchId = await Geolocation.watchPosition(
          {
            enableHighAccuracy: true
          },
          (pos, err) => {
            if (err) {
              setError(err.message || 'Location error');
            } else if (pos) {
              // Extract the speed (m/s) and convert it to km/h
              const currentSpeed = pos.coords.speed;
              setSpeed(currentSpeed !== null ? currentSpeed * 3.6 : null);
              // Extract accuracy (in meters)
              setAccuracy(pos.coords.accuracy);
            }
          }
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unexpected error during location setup');
        }
      }
    };

    setupLocation();

    // Cleanup the position watcher on unmount
    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, []);

  return { speed, accuracy, error };
};
