import { InjectionToken } from '@angular/core';

// URL de la Realtime Database de Firebase
export const FIREBASE_URL = 'https://linkstart-16abd-default-rtdb.firebaseio.com/';

// Token de inyeccion para poder cambiar la URL en las pruebas unitarias
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => FIREBASE_URL,
});

// Indica si la URL ya fue configurada con un proyecto real
export function apiConfigurada(url: string): boolean {
  return !url.includes('linkstart-16abd');
}
