# Link Start!

Aplicacion FrontEnd de una tienda de juegos de mesa con dos roles de usuario
(cliente y administrador), registro e inicio de sesion, carrito de compras,
pago simulado y mantenedores de productos e inventario. El catalogo de
productos se consume desde una API REST en Firebase (GET, POST, PUT y DELETE)
y las cuentas, el carrito y las ordenes se guardan en el navegador mediante
localStorage.

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

## API REST con Firebase

El catalogo de productos se consume desde una Realtime Database de Firebase
usando los cuatro metodos HTTP:

| Metodo | Uso en la aplicacion |
|--------|----------------------|
| GET    | Cargar el catalogo (home, categorias, detalle, mantenedores) |
| POST   | Crear un producto nuevo desde el mantenedor |
| PUT    | Editar productos, actualizar stock y descontar stock al comprar |
| DELETE | Eliminar un producto desde el mantenedor |

Para conectar tu propia base:

1. En Firebase console crea un proyecto y una **Realtime Database** en modo prueba.
2. Copia la URL de la base (algo como `https://mi-proyecto-default-rtdb.firebaseio.com`).
3. Pegala en `src/app/services/api.config.ts` (constante `FIREBASE_URL`).
4. (Opcional) Importa `firebase-seed.json` desde la consola de Firebase para
   precargar el catalogo. Si la base esta vacia, la propia aplicacion la
   siembra automaticamente la primera vez.

Mientras la URL no este configurada, la aplicacion trabaja en modo local
(localStorage) para poder desarrollarla sin conexion.

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

## Docker

El proyecto incluye un `Dockerfile` (build de Angular + servidor nginx):

```bash
docker build -t mtduoc17/linkstart-angular:1.0 .
docker run -d -p 8080:80 mtduoc17/linkstart-angular:1.0
```

Luego abrir `http://localhost:8080/`. Para publicar la imagen en Docker Hub:

```bash
docker login
docker push mtduoc17/linkstart-angular:1.0
```

## Estructura del proyecto

```
linkstart-angular/
├── angular.json                      # Configuracion de Angular (Bootstrap, build, test)
├── package.json                      # Dependencias y scripts (start, test, compodoc, build)
├── tsconfig.doc.json                 # Configuracion de Compodoc
├── Dockerfile                        # Imagen Docker (build Angular + nginx)
├── nginx.conf                        # Configuracion del servidor dentro del contenedor
├── firebase-seed.json                # Catalogo inicial para importar en Firebase
├── README.md
├── src/
│   ├── index.html                    # Pagina raiz, fuentes y <app-root>
│   ├── main.ts                       # Punto de arranque de la aplicacion
│   ├── styles.css                    # Estilos globales (variables, animaciones, tema neon)
│   └── app/
│       ├── app.ts                    # Componente raiz (nav + router-outlet + footer)
│       ├── app.routes.ts             # Rutas (categoria/:cat, producto/:id, novedades/:id)
│       ├── app.config.ts             # Providers (router, HttpClient)
│       ├── app.spec.ts               # Prueba unitaria del componente raiz
│       ├── guards.ts                 # authGuard y adminGuard para proteger rutas
│       ├── components/
│       │   ├── nav/                  # Menu dinamico segun sesion y rol
│       │   └── game-card/            # Ficha de juego (hijo, recibe datos por @Input)
│       ├── pages/
│       │   ├── home/                 # Pagina principal con las 4 categorias
│       │   ├── categoria/            # Catalogo por categoria (buscador con ngModel)
│       │   ├── producto-detalle/     # Ficha de un producto (ruta producto/:id)
│       │   ├── novedades/            # Noticias y eventos leidos desde JSON
│       │   ├── novedad-detalle/      # Detalle de una novedad (ruta novedades/:id)
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
│       │   ├── api.config.ts         # URL de Firebase (unico punto de configuracion)
│       │   ├── productos-api.ts      # API REST del catalogo (GET, POST, PUT, DELETE)
│       │   ├── productos-api.spec.ts # Pruebas de los 4 metodos HTTP
│       │   ├── data.ts               # Cache local y seed en localStorage
│       │   ├── auth.ts               # Registro, login, sesion, roles y perfil
│       │   ├── auth.spec.ts          # Pruebas unitarias de AuthService
│       │   ├── cart.ts               # Logica del carrito y ordenes
│       │   ├── cart.spec.ts          # Pruebas unitarias de CartService
│       │   └── novedades.ts          # Consume los JSON de novedades y eventos
│       ├── pipes/
│       │   └── clp-pipe.ts           # Formato de precio chileno ($34.990)
│       ├── models/
│       │   └── models.ts             # Interfaces de datos (Producto, Usuario, etc.)
│       └── validators.ts             # Validadores personalizados (contraseña, edad)
└── public/
    ├── data/
    │   ├── novedades.json            # Noticias consumidas por HttpClient
    │   └── eventos.json              # Eventos consumidos por HttpClient
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

## Flujo recomendado para probar la app

1. Iniciar sesion como `admin` / `Admin#2026`.
2. Crear un producto nuevo en el mantenedor (POST a la API) y editarlo (PUT).
3. Cerrar sesion y registrarse como cliente nuevo.
4. Agregar productos al carrito desde una categoria.
5. Finalizar la compra con el pago simulado (descuenta stock via PUT).
6. Revisar la orden en "Mis compras".
7. Volver a entrar como admin y verificar el stock descontado en Inventario.
