# Novapay Admin - API Backend para Administradores

Microservicio backend que expone la API REST para el **panel de administracion** de NovaPay. Gestionar cuentas, tarjetas, transferencias, depositos, productos, roles y dashboard administrativo.

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Node.js | Runtime de JavaScript |
| Express 5 | Framework web |
| Sequelize 6 | ORM para PostgreSQL |
| PostgreSQL | Base de datos |
| JWT | Validacion de tokens (middleware) |
| BCrypt / BCryptJS | Hash de contraseñas |
| Helmet | Seguridad HTTP headers |
| Morgan | Logging de requests |
| Winston | Logging estructurado |
| Cloudinary | Subida de archivos/imagenes |
| Multer | Manejo de uploads multipart |
| Express Validator | Validacion de inputs |
| Express Rate Limit | Proteccion contra abuso |
| Axios | Comunicacion entre microservicios |

---

## Estructura

```
Novapay-admin/
├── configs/
│   ├── app-admin.js            # Inicializacion del servidor, rutas y middlewares
│   ├── cors-configuration.js   # Configuracion CORS
│   ├── db.js                   # Conexion y sincronizacion con PostgreSQL
│   └── logger.js               # Configuracion de Winston
├── middlewares/
│   ├── accounts-validator.js   # Validaciones para cuentas
│   ├── check-validators.js     # Validador generico
│   ├── currencies-validator.js # Validaciones para monedas
│   ├── dashboard-validator.js  # Validaciones para dashboard
│   ├── depostis-validator.js   # Validaciones para depositos
│   ├── file-uploader.js        # Configuracion de Cloudinary/Multer
│   ├── handle-errors.js        # Manejo centralizado de errores
│   ├── products-validator.js   # Validaciones para productos
│   ├── request-limit.js        # Rate limiting
│   ├── roles-validator.js      # Validaciones para roles
│   ├── shopping-validator.js   # Validaciones para compras
│   ├── transactoins-validator.js # Validaciones para transacciones
│   ├── transfres-validator.js  # Validaciones para transferencias
│   └── users-validator.js      # Validaciones para usuarios
├── scr/
│   ├── accounts/               # Cuentas bancarias
│   ├── cards/                  # Tarjetas (debito/credito)
│   ├── currencies/             # Monedas y divisas
│   ├── dashboard/              # Metricas administrativas
│   ├── deposits/               # Depositos
│   ├── passbooks/              # Libretas de ahorro
│   ├── products/               # Catalogo de productos
│   ├── roles/                  # Roles del sistema
│   ├── shoppings/              # Historial de compras
│   ├── transactions/           # Transacciones
│   ├── transfers/              # Transferencias
│   └── users/                  # Usuarios
├── Dockerfile
├── package.json
└── index.js                    # Punto de entrada
```

---

## Puerto

El servicio escucha en el puerto **3001** por defecto.

---

## Base URL de la API

Todas las rutas estan bajo el prefijo:

```
/NovaPay/admin/v1
```

Ejemplo: `http://localhost:3001/NovaPay/admin/v1/roles`

---

## Endpoints disponibles

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | `/roles/` | Listar roles | Admin |
| POST | `/roles/` | Crear rol | Admin |
| PUT | `/roles/:id` | Actualizar rol | Admin |
| DELETE | `/roles/:id` | Eliminar rol | Admin |
| GET | `/users/` | Listar usuarios | Admin |
| POST | `/users/` | Crear usuario | Admin |
| PUT | `/users/:id` | Actualizar usuario | Admin |
| DELETE | `/users/:id` | Eliminar usuario | Admin |
| GET | `/accounts/` | Listar cuentas | Admin |
| POST | `/accounts/` | Crear cuenta | Admin |
| PUT | `/accounts/:id` | Actualizar cuenta | Admin |
| DELETE | `/accounts/:id` | Eliminar cuenta | Admin |
| GET | `/cards/` | Listar tarjetas | Admin |
| POST | `/cards/` | Crear tarjeta | Admin |
| PUT | `/cards/:id` | Actualizar tarjeta | Admin |
| DELETE | `/cards/:id` | Eliminar tarjeta | Admin |
| GET | `/transfers/` | Listar transferencias | Admin |
| POST | `/transfers/` | Crear transferencia | Admin |
| GET | `/deposits/` | Listar depositos | Admin |
| POST | `/deposits/` | Crear deposito | Admin |
| GET | `/transactions/` | Listar transacciones | Admin |
| POST | `/transactions/` | Crear transaccion | Admin |
| GET | `/currencies/` | Listar monedas | Admin |
| POST | `/currencies/` | Crear moneda | Admin |
| GET | `/products/` | Listar productos | Admin |
| POST | `/products/` | Crear producto | Admin |
| GET | `/shoppings/` | Listar compras | Admin |
| POST | `/shoppings/` | Crear compra | Admin |
| GET | `/passbooks/` | Listar libretas | Admin |
| GET | `/dashboard/` | Metricas del dashboard | Admin |
| GET | `/check` | Health check | No |

---

## Datos iniciales (Seed)

Al iniciar, el servicio crea automaticamente:

- **Roles:** `Administrador` y `Cliente`
- **Usuario admin:** `ADMINB` / `ADMINB` (email: admin@novapay.com)

---

## Ejecucion local (sin Docker)

```bash
npm install
npm run dev
```

Asegurate de que PostgreSQL este corriendo en `localhost:5432` con la base de datos `novapay_db`.

---

## Ejecucion con Docker

Desde la carpeta raiz de NovaPay:

```bash
docker-compose up --build app-admin
```

---

## Variables de entorno (.env)

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=novapay_db
DB_USER=postgres
DB_PASSWORD=admin
DB_DIALECT=postgres
```

En Docker, `DB_HOST` se sobreescribe con `db` (el nombre del servicio de PostgreSQL en docker-compose).
