import { useEffect, useState } from 'react';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';

/**
 * Custom hook to watch the user's speed in km/h.
 * Automatically requests permission if not granted.
 */
export const useSpeed = () => {
  const [speed, setSpeed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let watchId: string;

    const setupLocation = async () => {
      try {
        // Step 1: Check existing permission status
        const permissionStatus: PermissionStatus = await Geolocation.checkPermissions();

        // Step 2: Request permissions if not already granted
        if (permissionStatus.location !== 'granted') {
          const newPermission = await Geolocation.requestPermissions();
          if (newPermission.location !== 'granted') {
            setError('Location permission denied');
            return;
          }
        }

        // Step 3: Start watching location if permission is granted
        watchId = await Geolocation.watchPosition({}, (pos, err) => {
          if (err) {
            setError(err.message || 'Location error');
          } else if (pos) {
            // Get speed in m/s from pos.coords.speed, and convert it to km/h.
            // Note: pos.coords.speed might be null if unavailable.
            const currentSpeed = pos.coords.speed;
            setSpeed(currentSpeed !== null ? currentSpeed * 3.6 : null);
          }
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unexpected error during location setup');
        }
      }
    };

    setupLocation();

    // Cleanup: stop watching location on unmount
    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, []);

  return { speed, error };
};
