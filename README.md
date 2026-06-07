# Link Start!

Aplicacion FrontEnd de una tienda de juegos de mesa con dos roles de usuario
(cliente y administrador), registro e inicio de sesion, carrito de compras,
pago simulado y mantenedores de productos e inventario. Los datos se guardan
en el navegador mediante localStorage.

## Estructura del proyecto

```
LinkStart/
├── index.html                  # Pagina principal con las 4 categorias
├── login.html                  # Inicio de sesion
├── registro.html               # Registro de usuarios
├── recuperar.html              # Recuperar contraseña
├── perfil.html                 # Modificacion de perfil (requiere sesion)
├── carrito.html                # Carrito de compras
├── pago.html                   # Pago simulado (requiere sesion)
├── mis-compras.html            # Historial de compras del usuario
├── categorias/
│   ├── estrategia.html
│   ├── cooperativos.html
│   ├── cartas.html
│   └── party.html
├── admin/
│   ├── productos.html          # Mantenedor de productos (solo admin)
│   └── inventario.html         # Control de stock (solo admin)
├── css/
│   └── styles.css              # Variables CSS, animaciones y estilos del sitio
├── js/
│   ├── data.js                 # Capa de datos y seed en localStorage
│   ├── auth.js                 # Registro, login, sesion, roles y validaciones
│   ├── carrito.js              # Logica del carrito y ordenes
│   ├── nav.js                  # Menu dinamico segun sesion y rol
│   ├── catalogo.js             # Boton "agregar al carrito" en las fichas
│   ├── validacion.js           # Validacion del registro
│   ├── login.js                # Validacion del inicio de sesion
│   ├── recuperar.js            # Validacion de recuperar contraseña
│   ├── perfil.js               # Modificacion de perfil
│   ├── carrito-page.js         # Render de la pagina de carrito
│   ├── pago.js                 # Validacion y confirmacion del pago
│   ├── mis-compras.js          # Render del historial de compras
│   ├── admin-productos.js      # CRUD de productos
│   └── admin-inventario.js     # Ajuste de stock
├── img/
│   ├── categorias/             # 4 imagenes (una por categoria)
│   └── juegos/                 # 12 imagenes (una por juego)
└── README.md
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