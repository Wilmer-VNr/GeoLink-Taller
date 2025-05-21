import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { map } from 'ionicons/icons';

import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel
  ],
})
export class HomePage {
  nombre: string = '';
  latitude: number | null = null;
  longitude: number | null = null;
  linkMaps: string = '';

  constructor(private firestore: Firestore) {
    addIcons({ map });
  }

  getCurrentLocation() {
  if (!this.nombre || this.nombre.trim() === '') {
    alert('Por favor ingresa tu nombre antes de obtener la ubicación.');
    return;
  }

  if (!navigator.geolocation) {
    console.error('Geolocalización no está soportada en este navegador.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.linkMaps = `https://www.google.com/maps?q=${this.latitude},${this.longitude}`;
      console.log('Ubicación obtenida: ', this.linkMaps);
    },
    (error) => {
      console.error('Error obteniendo ubicación:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}


  openGoogleMaps() {
    if (this.linkMaps) {
      window.open(this.linkMaps, '_blank');
    }
  }

  async guardarEnFirebase() {
    if (!this.nombre || !this.linkMaps) {
      alert('Debe ingresar su nombre y obtener la ubicación.');
      return;
    }

    try {
      const ubicacionesRef = collection(this.firestore, 'ubicacion');
      await addDoc(ubicacionesRef, {
        nombre: this.nombre,
        link: this.linkMaps,
        timestamp: new Date()
      });

      alert('Ubicación guardada con éxito en Firebase.');
    } catch (error) {
      console.error('Error al guardar en Firebase:', error);
      alert('Error al guardar en Firebase');
    }
  }
}
