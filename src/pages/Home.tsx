import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import { useSpeed } from "../hooks/useSpeed";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css'; // ✅ Required Leaflet styles
import { useState, useEffect } from "react";

// Fix Leaflet's default icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});
const Home: React.FC = () => {
  const { speed, accuracy, error } = useSpeed();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("Error getting position", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 500,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watch);
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Speed Measure App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Current Information</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <h2>
              Speed: {speed !== null ? `${speed.toFixed(2)} m/s` : "Calculating..."}
            </h2>
            <h3>
              Accuracy: {accuracy !== null ? `${accuracy.toFixed(2)} m` : "Calculating..."}
            </h3>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
          </IonCardContent>
        </IonCard>

        {position && (
          <div style={{ height: "300px", margin: "20px" }}>
            <MapContainer
              center={position}
              zoom={16}
              zoomControl={true}            // 👈 shows the + / - buttons
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={position}>
                <Popup>You are here</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
