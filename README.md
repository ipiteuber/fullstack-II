# Link Start!

Aplicacion FrontEnd de una tienda de juegos de mesa con dos roles de usuario
(cliente y administrador), registro e inicio de sesion, carrito de compras,
pago simulado y mantenedores de productos e inventario. Los datos se guardan
en el navegador mediante localStorage.

## Requisitos

- Node.js 22 o 24 LTS (funciona tambien en versiones mas nuevas).
- npm 10 o superior.

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm start
```

Luego abrir `http://localhost:4200/` en el navegador.

Cuenta de administrador precargada:

- Usuario: `admin`
- Contrasena: `Admin#2026`

## Pruebas unitarias

Se ejecutan con Jasmine y Karma:

```bash
npm test
```


## Documentacion del codigo

La documentacion se genera con Compodoc:

```bash
npm run compodoc          # Genera la documentacion en /documentation
npm run compodoc:serve    # La genera y la abre en navegador
```

## Build de produccion

```bash
npm run build
```

Los archivos quedan en la carpeta `dist/`.



## Estructura del proyecto

```
src/app/
  components/      Componentes reutilizables (nav, game-card)
  pages/           Una carpeta por pantalla (home, login, registro, etc.)
  services/        DataService, AuthService y CartService
  pipes/           ClpPipe (formato de precio chileno)
  models/          Interfaces de datos
  validators.ts    Validadores personalizados de los formularios reactivos
  app.routes.ts    Rutas (incluye categoria/:cat y producto/:id)
```

## Roles y cuenta de prueba

La aplicacion maneja dos roles con privilegios distintos:

- **Cliente:** navega el catalogo, agrega al carrito, paga y revisa sus compras.
- **Administrador:** ademas accede a los mantenedores de productos e inventario.

Cuenta de administrador precargada:

- Usuario: `admin`
- Contraseña: `Admin#2026`

Los usuarios que se registran desde el formulario quedan con rol cliente.
---