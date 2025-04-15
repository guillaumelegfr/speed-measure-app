import React from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
} from '@ionic/react';
import './Home.css'; // We'll define dark theme in CSS
import { useSpeed } from '../hooks/useSpeed';  // Adjust the import path as needed

const Home: React.FC = () => {
  // Call the custom hook to get speed and error values
  const { speed, error } = useSpeed();
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>descent app</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error ? (
          <IonText color="danger">
            <p>Error: {error}</p>
          </IonText>
        ) : (
          <IonText>
            <p>
              {speed !== null
                ? `Speed: ${speed.toFixed(2)} km/h`
                : 'calculating speed...'}
            </p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
