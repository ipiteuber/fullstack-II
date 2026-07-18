import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Categoria } from './pages/categoria/categoria';
import { ProductoDetalle } from './pages/producto-detalle/producto-detalle';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Recuperar } from './pages/recuperar/recuperar';
import { Perfil } from './pages/perfil/perfil';
import { Carrito } from './pages/carrito/carrito';
import { Pago } from './pages/pago/pago';
import { MisCompras } from './pages/mis-compras/mis-compras';
import { AdminProductos } from './pages/admin-productos/admin-productos';
import { AdminInventario } from './pages/admin-inventario/admin-inventario';
import { Novedades } from './pages/novedades/novedades';
import { NovedadDetalle } from './pages/novedad-detalle/novedad-detalle';
import { authGuard, adminGuard } from './guards';

export const routes: Routes = [
  { path: '', component: Home, title: 'Link Start!' },
  { path: 'categoria/:cat', component: Categoria, title: 'Categoría - Link Start!' },
  { path: 'producto/:id', component: ProductoDetalle, title: 'Producto - Link Start!' },
  { path: 'novedades', component: Novedades, title: 'Novedades - Link Start!' },
  { path: 'novedades/:id', component: NovedadDetalle, title: 'Novedad - Link Start!' },
  { path: 'login', component: Login, title: 'Ingresar - Link Start!' },
  { path: 'registro', component: Registro, title: 'Registro - Link Start!' },
  { path: 'recuperar', component: Recuperar, title: 'Recuperar contraseña - Link Start!' },
  { path: 'perfil', component: Perfil, canActivate: [authGuard], title: 'Mi perfil - Link Start!' },
  { path: 'carrito', component: Carrito, title: 'Carrito - Link Start!' },
  { path: 'pago', component: Pago, canActivate: [authGuard], title: 'Pago - Link Start!' },
  { path: 'mis-compras', component: MisCompras, canActivate: [authGuard], title: 'Mis compras - Link Start!' },
  { path: 'admin/productos', component: AdminProductos, canActivate: [adminGuard], title: 'Productos - Link Start!' },
  { path: 'admin/inventario', component: AdminInventario, canActivate: [adminGuard], title: 'Inventario - Link Start!' },
  { path: '**', redirectTo: '' },
];
