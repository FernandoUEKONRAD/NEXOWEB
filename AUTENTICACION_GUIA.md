# Sistema de Autenticación - NEXOWEB

## Descripción General

Este documento describe el sistema completo de autenticación implementado en la aplicación NEXOWEB.

## Características Implementadas

### 1. **Servicio de Autenticación** (`auth.service.ts`)

Gestiona todas las operaciones de autenticación:

- **`login(credentials)`** - Inicia sesión con email y contraseña
- **`register(data)`** - Registra un nuevo usuario
- **`logout()`** - Cierra la sesión
- **`getToken()`** - Obtiene el token actual
- **`isAuthenticated()`** - Verifica si el usuario está autenticado
- **`getCurrentUser()`** - Obtiene información del usuario actual
- **`hasRole(role)`** - Verifica si el usuario tiene un rol específico

**Características principales:**
- Gestión de tokens (localStorage)
- Decodificación y validación de JWT
- Observables para estado reactivo
- Manejo completo de errores
- Almacenamiento de información del usuario

### 2. **Componente Login** (`login.component.ts`)

Formulario de inicio de sesión con:
- Validación de email (formato correcto)
- Validación de contraseña (mínimo 6 caracteres)
- Manejo de errores
- Redirección post-login
- Enlace a registro
- Indicador de carga

### 3. **Componente Registro** (`register.component.ts`)

Formulario de registro con:
- Validación de nombre (mínimo 3 caracteres)
- Validación de email
- Validación de fortaleza de contraseña (mayúscula, minúscula, número)
- Validación de coincidencia de contraseñas
- Indicadores visuales de requisitos
- Manejo de errores (email duplicado, etc.)

### 4. **AuthGuard** (`auth.guard.ts`)

Protege las rutas autenticadas:
- Verifica si el usuario está autenticado
- Redirige a login si no está autenticado
- Soporta protección por rol
- Mantiene URL de retorno para redirección post-login

### 5. **Interceptor de Autenticación** (`http-interceptor.service.ts`)

Intercepta todas las solicitudes HTTP:
- Agrega automáticamente el token Bearer a cada request
- Maneja respuestas 401 (token expirado)
- Maneja respuestas 403 (acceso prohibido)
- Logout automático en caso de sesión expirada

### 6. **Dashboard/Home** (`dashboard.component.ts`)

Página principal post-login con:
- Navbar con información del usuario
- Menú de navegación
- Tarjetas de acceso rápido (Eventos, Comunidades, Perfil)
- Botón de logout

### 7. **Navbar** (`navbar.component.ts`)

Componente de navegación con:
- Logo y branding
- Menú responsivo (hamburguesa en mobile)
- Información del usuario
- Botón de logout
- Links de navegación activos

## Configuración

### environment.ts

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'  // Cambia según tu backend
};
```

### Endpoints Esperados

El backend debe proporcionar los siguientes endpoints:

1. **POST /auth/login**
   ```json
   Request:
   {
     "email": "usuario@ejemplo.com",
     "password": "contraseña123"
   }
   
   Response:
   {
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "user": {
       "id": "123",
       "email": "usuario@ejemplo.com",
       "name": "Juan Pérez",
       "role": "user"
     }
   }
   ```

2. **POST /auth/register**
   ```json
   Request:
   {
     "email": "usuario@ejemplo.com",
     "password": "MiContraseña123",
     "confirmPassword": "MiContraseña123",
     "name": "Juan Pérez"
   }
   
   Response:
   {
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "user": {
       "id": "123",
       "email": "usuario@ejemplo.com",
       "name": "Juan Pérez",
       "role": "user"
     }
   }
   ```

## Flujo de Autenticación

```
1. Usuario accede a /login
2. Ingresa credenciales en el formulario
3. AuthService.login() envía POST a /auth/login
4. Backend valida y retorna token + usuario
5. AuthService almacena token en localStorage
6. AuthGuard permite acceso a rutas protegidas
7. Interceptor agrega token a todas las requests
8. Si token expira (401), usuario es redirigido a login
```

## Protección de Rutas

Las siguientes rutas están protegidas con AuthGuard:

```typescript
/dashboard       // Principal post-login
/eventos         // Gestión de eventos
/comunidades     // Gestión de comunidades
```

Solo accesibles si `AuthService.isAuthenticated()` retorna `true`.

## Almacenamiento de Datos

### localStorage

- **auth_token** - Token JWT del usuario
- **auth_user** - Información del usuario (JSON)

### Notas de Seguridad

- El token se almacena en localStorage (accesible desde JS)
- Para mayor seguridad, considera usar httpOnly cookies
- Los tokens JWT contienen la fecha de expiración (exp)
- El servicio verifica automáticamente la expiración

## Validaciones de Contraseña

### Login
- Mínimo 6 caracteres

### Registro
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número
- Debe coincidir con la confirmación

## Mensajes de Error Comunes

| Status | Mensaje |
|--------|---------|
| 401 | Credenciales inválidas. Intenta de nuevo. |
| 409 | El email ya está registrado. |
| 400 | Datos inválidos. |
| 500 | Error del servidor. Intenta más tarde. |

## Estructura de Carpetas

```
src/app/
├── services/
│   ├── auth.service.ts              ← Servicio principal
│   └── http-interceptor.service.ts  ← Interceptor
├── guards/
│   └── auth.guard.ts                ← Protección de rutas
├── modules/
│   ├── login/
│   │   ├── components/
│   │   │   ├── login/
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   └── login.component.css
│   │   │   └── register/
│   │   │       ├── register.component.ts
│   │   │       ├── register.component.html
│   │   │       └── register.component.css
│   │   ├── login.module.ts
│   │   └── login-routing.module.ts
│   └── dashboard/
│       ├── components/
│       │   ├── dashboard/
│       │   │   ├── dashboard.component.ts
│       │   │   ├── dashboard.component.html
│       │   │   └── dashboard.component.css
│       │   └── navbar/
│       │       ├── navbar.component.ts
│       │       ├── navbar.component.html
│       │       └── navbar.component.css
│       ├── dashboard.module.ts
│       └── dashboard-routing.module.ts
```

## Cómo Usar

### 1. Iniciar Sesión Programáticamente

```typescript
import { AuthService } from './services/auth.service';

constructor(private authService: AuthService) {}

login() {
  this.authService.login({
    email: 'usuario@ejemplo.com',
    password: 'contraseña'
  }).subscribe({
    next: () => console.log('Login exitoso'),
    error: (error) => console.error(error.message)
  });
}
```

### 2. Verificar Autenticación

```typescript
if (this.authService.isAuthenticated()) {
  console.log('Usuario autenticado');
}
```

### 3. Acceder al Usuario Actual

```typescript
const user = this.authService.getCurrentUser();
console.log(user.email, user.name);

// O usar el Observable
this.authService.currentUser$.subscribe(user => {
  console.log(user);
});
```

### 4. Cerrar Sesión

```typescript
this.authService.logout();
```

### 5. Verificar Rol

```typescript
if (this.authService.hasRole('admin')) {
  // Mostrar opciones de administrador
}
```

### 6. Proteger una Ruta por Rol

```typescript
const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: 'admin' },
    component: AdminComponent
  }
];
```

## Customización

### Cambiar la Duración del Token

En el backend, ajusta la fecha de expiración del JWT.

### Cambiar el Almacenamiento

Reemplaza `localStorage` por `sessionStorage` en `auth.service.ts`:

```typescript
private storeToken(token: string): void {
  sessionStorage.setItem(this.tokenKey, token);
}
```

### Agregar Más Campos al Usuario

En `RegisterRequest` y `AuthResponse`, agrega los campos necesarios.

## Testing

Credenciales de prueba (configura en tu backend):

```
Email: test@ejemplo.com
Password: Test1234
```

## Troubleshooting

**Problema:** El usuario es redirigido a login continuamente

**Solución:** Verifica que:
1. El token se almacena correctamente en localStorage
2. El endpoint `/auth/login` retorna un token válido
3. El token no está expirado

**Problema:** El interceptor no agrega el token

**Solución:** Asegúrate que:
1. El `HTTP_INTERCEPTORS` está configurado en `app.module.ts`
2. `AuthService.isAuthenticated()` retorna `true`
3. El token existe en localStorage

## Próximos Pasos

1. Implementar refresh tokens
2. Agregar autenticación de dos factores (2FA)
3. Agregar recuperación de contraseña
4. Implementar logout global en múltiples pestañas
5. Agregar verificación de email
