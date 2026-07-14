import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth';

/**
 * Protege las rutas que requieren sesion iniciada (perfil, pago, mis compras).
 * Guarda la ruta original en volverA para retomarla despues del login.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.estaLogueado()) return true;
  return router.createUrlTree(['/login'], { queryParams: { volverA: state.url } });
};

/**
 * Protege las rutas exclusivas del administrador (mantenedores).
 * Un cliente con sesion vuelve al inicio; un visitante va al login.
 */
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.esAdmin()) return true;
  if (auth.estaLogueado()) return router.createUrlTree(['/']);
  return router.createUrlTree(['/login'], { queryParams: { volverA: state.url } });
};
