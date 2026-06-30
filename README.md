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
linkstart-angular/
├── angular.json                      # Configuracion de Angular (Bootstrap, build, test)
├── package.json                      # Dependencias y scripts (start, test, compodoc, build)
├── tsconfig.doc.json                 # Configuracion de Compodoc
├── README.md
├── src/
│   ├── index.html                    # Pagina raiz, fuentes y <app-root>
│   ├── main.ts                       # Punto de arranque de la aplicacion
│   ├── styles.css                    # Estilos globales (variables, animaciones, tema neon)
│   └── app/
│       ├── app.ts                    # Componente raiz (nav + router-outlet + footer)
│       ├── app.routes.ts             # Rutas (incluye categoria/:cat y producto/:id)
│       ├── app.config.ts             # Providers (router, deteccion de cambios)
│       ├── app.spec.ts               # Prueba unitaria del componente raiz
│       ├── components/
│       │   ├── nav/                  # Menu dinamico segun sesion y rol
│       │   └── game-card/            # Ficha de juego (hijo, recibe datos por @Input)
│       ├── pages/
│       │   ├── home/                 # Pagina principal con las 4 categorias
│       │   ├── categoria/            # Catalogo por categoria (buscador con ngModel)
│       │   ├── producto-detalle/     # Ficha de un producto (ruta producto/:id)
│       │   ├── login/                # Inicio de sesion
│       │   ├── registro/             # Registro de usuarios (+ registro.spec.ts)
│       │   ├── recuperar/            # Recuperar contraseña
│       │   ├── perfil/               # Modificacion de perfil (requiere sesion)
│       │   ├── carrito/              # Carrito de compras
│       │   ├── pago/                 # Pago simulado (requiere sesion)
│       │   ├── mis-compras/          # Historial de compras del usuario
│       │   ├── admin-productos/      # Mantenedor de productos (solo admin)
│       │   └── admin-inventario/     # Control de stock (solo admin)
│       ├── services/
│       │   ├── data.ts               # Capa de datos y seed en localStorage
│       │   ├── auth.ts               # Registro, login, sesion, roles y perfil
│       │   ├── auth.spec.ts          # Pruebas unitarias de AuthService
│       │   ├── cart.ts               # Logica del carrito y ordenes
│       │   └── cart.spec.ts          # Pruebas unitarias de CartService
│       ├── pipes/
│       │   └── clp-pipe.ts           # Formato de precio chileno ($34.990)
│       ├── models/
│       │   └── models.ts             # Interfaces de datos (Producto, Usuario, etc.)
│       └── validators.ts             # Validadores personalizados (contraseña, edad)
└── public/
    └── img/
        ├── categorias/               # 4 imagenes (una por categoria)
        └── juegos/                   # 12 imagenes (una por juego)
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