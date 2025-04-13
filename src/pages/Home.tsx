import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonText } from '@ionic/react';
import './Home.css';
import { Geolocation, Position } from '@capacitor/geolocation';
import { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [position, setPosition] = useState<Position | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [watchId, setWatchId] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const formatSpeed = (s: number | null) => {
    if (s === null || s < 0) return 'Waiting for signal...';
    return `${(s * 3.6).toFixed(2)} km/h`;
  };

  const ensureLocationPermission = async () => {
    const { location } = await Geolocation.checkPermissions();
    console.log('Initial permission status:', location);
  
    if (location === 'granted') {
      setHasPermission(true);
      return;
    }
  
    const { location: newPermission } = await Geolocation.requestPermissions();
  
    if (newPermission === 'granted') {
      setHasPermission(true);
    } else {
      setHasPermission(false);
      alert('Location permission is required to use this app.');
    }
  };

  useEffect(() => {
    ensureLocationPermission();
  }, []);

  const startTracking = async () => {
    if (!hasPermission) {
      alert('Location permission is not granted.');
      return;
    }
  
    const id = Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
      (pos, err) => {
        if (err) {
          console.error('Watch error:', err);
          return;
        }
  
        if (pos) {
          console.log('Tracking position:', pos);
          setPosition(pos);
          setSpeed(pos.coords.speed ?? null);
        }
      }
    );
  
    setWatchId(id);
  };
  
  
  const stopTracking = async () => {
    if (watchId) {
      await Geolocation.clearWatch({ id: watchId });
      setWatchId(null);
      setSpeed(null);
      setPosition(null);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Live Speed Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={startTracking} disabled={!!watchId}>
          Start Tracking
        </IonButton>
        <IonButton expand="block" color="danger" onClick={stopTracking} disabled={!watchId}>
          Stop Tracking
        </IonButton>

        <IonText>
          <h2>Current Speed:</h2>
          <h1>{formatSpeed(speed)}</h1>
          {position && (
            <>
              <p>Latitude: {position.coords.latitude}</p>
              <p>Longitude: {position.coords.longitude}</p>
            </>
          )}
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Home;
