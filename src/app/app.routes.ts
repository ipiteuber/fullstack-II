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

export const routes: Routes = [
  { path: '', component: Home, title: 'Link Start!' },
  { path: 'categoria/:cat', component: Categoria, title: 'Categoría - Link Start!' },
  { path: 'producto/:id', component: ProductoDetalle, title: 'Producto - Link Start!' },
  { path: 'login', component: Login, title: 'Ingresar - Link Start!' },
  { path: 'registro', component: Registro, title: 'Registro - Link Start!' },
  { path: 'recuperar', component: Recuperar, title: 'Recuperar contraseña - Link Start!' },
  { path: 'perfil', component: Perfil, title: 'Mi perfil - Link Start!' },
  { path: 'carrito', component: Carrito, title: 'Carrito - Link Start!' },
  { path: 'pago', component: Pago, title: 'Pago - Link Start!' },
  { path: 'mis-compras', component: MisCompras, title: 'Mis compras - Link Start!' },
  { path: 'admin/productos', component: AdminProductos, title: 'Productos - Link Start!' },
  { path: 'admin/inventario', component: AdminInventario, title: 'Inventario - Link Start!' },
  { path: '**', redirectTo: '' },
];
