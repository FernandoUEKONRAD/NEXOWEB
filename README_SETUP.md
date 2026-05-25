# NEXO Web Frontend

Frontend de la aplicación NEXO construido con Angular 16.

## Instalación

```bash
npm install
```

## Desarrollo

Para ejecutar el servidor de desarrollo:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

## Build

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos compilados se ubicarán en `dist/nexo-web`.

## Estructura del Proyecto

```
src/
├── app/
│   ├── modules/
│   │   ├── eventos/          # Módulo de eventos
│   │   ├── login/            # Módulo de autenticación
│   │   └── comunidades/      # Módulo de comunidades
│   ├── services/             # Servicios (EventosService, HttpInterceptorService)
│   ├── shared/               # Componentes compartidos (Button, Modal, Loader)
│   ├── app.module.ts         # Módulo principal
│   └── app-routing.module.ts # Configuración de rutas
├── environments/             # Configuración de ambientes
└── index.html               # HTML principal
```

## Características

- ✅ Gestión de eventos (crear, editar, eliminar, listar)
- ✅ Inscripción a eventos
- ✅ Autenticación con JWT
- ✅ HTTP Interceptor para manejo de tokens
- ✅ Componentes reutilizables

## API

La aplicación se conecta a la API de NEXO en `http://localhost:3000`.

Configura la URL de la API en `src/environments/environment.ts`.

## Tecnologías

- Angular 16
- TypeScript 5.0
- RxJS 7.8
- Reactive Forms

## Licencia

ISC
