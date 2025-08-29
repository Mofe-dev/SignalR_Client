# SignalR Client (React + Vite + Azure Entra ID)

Este proyecto es un cliente web construido con React y Vite que utiliza autenticación de Azure Entra ID (MSAL) y se conecta a un hub SignalR para recibir notificaciones en tiempo real.

## Características

- Autenticación con Azure Entra ID usando MSAL.
- Conexión a SignalR protegida con access token.
- Recepción y visualización de notificaciones en tiempo real.
- Rutas protegidas y manejo de sesión.
- Código moderno con React Hooks y Context API.

## Requisitos

- Node.js 18+
- Una aplicación registrada en Azure Entra ID (antes Azure AD)
- Un backend SignalR configurado para autenticación con JWT

## Instalación

1. Clona el repositorio y entra a la carpeta:

   ```bash
   git clone <url-del-repo>
   cd SignalR_Client
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` con tus variables de entorno:

   ```
   VITE_ENTRA_CLIENT_ID=<tu-client-id>
   VITE_ENTRA_TENANT_ID=<tu-tenant-id>
   VITE_ENTRA_REDIRECT_URI=http://localhost:5173
   VITE_ENTRA_API_SCOPE=<scope-de-tu-api>
   VITE_SIGNALR_URL=http://localhost:5274/notificationHub
   ```

## Scripts

- `npm run dev` — Inicia el servidor de desarrollo con Vite.
- `npm run build` — Genera la build de producción.
- `npm run preview` — Previsualiza la build de producción.
- `npm run lint` — Ejecuta ESLint.

## Estructura principal

```
src/
	context/
		AuthContext.js         # Contexto de autenticación
		AuthProvider.jsx       # Provider del contexto
		useAuthContext.js      # Hook para acceder al contexto
	services/
		useMsalAuth.js         # Hook para autenticación MSAL y manejo de token
	pages/
		Login.jsx              # Pantalla de login
		Home.jsx               # Pantalla principal, conecta a SignalR
	App.jsx                  # Rutas y layout principal
	main.jsx                 # Punto de entrada de la app
```

## Autenticación

- El login se realiza con MSAL (`loginPopup`).
- El access token se almacena en un contexto React y se recupera automáticamente tras un refresh.
- El token se envía en la conexión a SignalR usando `accessTokenFactory`.

## Notificaciones

- Las notificaciones recibidas del hub SignalR se muestran en tiempo real en la pantalla principal.
- El loader se muestra hasta que el token está listo y la conexión se establece.

## Personalización

Puedes modificar los estilos, endpoints y scopes según tus necesidades.
