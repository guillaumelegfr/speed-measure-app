import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonText 
} from '@ionic/react';
import { useSpeed } from '../hooks/useSpeed'; // Adjust the path if necessary

const Home: React.FC = () => {
  const { speed, accuracy, error } = useSpeed();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Speedometer</IonTitle>
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
                ? `Speed: ${speed.toFixed(1)} km/h`
                : 'Calculating speed...'}
            </p>
            <p>
              {accuracy !== null
                ? `Accuracy: ${accuracy.toFixed(1)} m`
                : 'Calculating accuracy...'}
            </p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
