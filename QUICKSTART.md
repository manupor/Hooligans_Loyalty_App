# 🚀 Guía de Inicio Rápido - Hooligans Loyalty App

## ⚡ Iniciar en 5 Minutos

### 1. Requisitos Previos

```bash
# Verificar Node.js (versión 16 o superior)
node --version

# Verificar npm
npm --version

# Instalar Expo CLI globalmente (si no lo tienes)
npm install -g expo-cli
```

### 2. Iniciar la Aplicación Móvil

```bash
# Navegar al directorio de la app
cd hooligans-loyalty-app/app

# Instalar dependencias (si no se ha hecho)
npm install

# Iniciar en modo desarrollo
npm start
```

### 3. Ver la App

Una vez que Expo se inicie, verás un código QR. Tienes 3 opciones:

#### Opción A: Escanear QR con tu Teléfono
1. Descarga la app **Expo Go** desde:
   - iOS: App Store
   - Android: Play Store
2. Abre Expo Go
3. Escanea el código QR que aparece en la terminal

#### Opción B: Usar el Simulador de iOS (Solo Mac)
```bash
npm run ios
```

#### Opción C: Usar el Emulador de Android
```bash
npm run android
```

#### Opción D: Ver en el Navegador Web (Para Desarrollo)
```bash
npm run web
```

## 📱 Navegación de la App

### Pantallas Principales

1. **Inicio (Home)**
   - Tarjeta de lealtad digital con puntos actuales
   - Botón de escanear QR
   - Recompensas disponibles
   - Promociones activas
   - Accesos rápidos

2. **Menú**
   - Catálogo de productos
   - Filtros por categoría
   - Carrito de compras
   - Opción de ordenar

3. **Recompensas**
   - Lista de recompensas canjeables
   - Progreso hacia cada recompensa
   - Historial de canjes
   - Cómo ganar más puntos

4. **Sedes**
   - Mapa de 12 ubicaciones
   - Distancia desde tu ubicación
   - Información de contacto
   - Cómo llegar (integración con Maps)

5. **Perfil**
   - Información del usuario
   - Estadísticas de puntos
   - Nivel de membresía
   - Configuración

## 🎨 Personalización

### Cambiar Colores

Edita `/src/config/theme.js`:

```javascript
export const COLORS = {
  primary: '#FF8533',      // Color principal (naranja)
  primaryDark: '#E67420',  // Naranja oscuro
  // ...modifica según necesites
};
```

### Agregar/Modificar Ubicaciones

Edita `/src/config/constants.js`:

```javascript
export const LOCATIONS = [
  { 
    id: 1, 
    name: 'San José - Escazú', 
    lat: 9.9281, 
    lng: -84.0907 
  },
  // Agrega más ubicaciones aquí
];
```

### Modificar Recompensas

Edita `/src/config/constants.js`:

```javascript
export const REWARDS = [
  {
    id: 1,
    name: 'Bebida Gratis',
    description: 'Una bebida de tu elección',
    pointsRequired: 5,
    icon: '🥤',
  },
  // Agrega más recompensas aquí
];
```

## 🔧 Configuración del Backend

### Conectar con AWS (Producción)

1. Edita `/src/services/api.js`:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Desarrollo
  : 'https://tu-api-gateway.amazonaws.com/prod'; // Producción
```

2. Despliega el backend siguiendo `/backend/README.md`

### Modo de Desarrollo (Sin Backend)

La app incluye datos de ejemplo y funciona completamente offline para desarrollo:

- Usuario demo pre-cargado
- 25 puntos iniciales
- Nivel Bronce
- Datos de ejemplo en todas las pantallas

## 🐛 Solución de Problemas Comunes

### Error: "Metro Bundler no inicia"

```bash
# Limpiar cache
expo start -c
```

### Error: "Módulo no encontrado"

```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Error en iOS: "Unable to resolve module"

```bash
# Limpiar cache de Watchman (si está instalado)
watchman watch-del-all

# Reiniciar Metro
npm start -- --reset-cache
```

### Error en Android: "SDK no encontrado"

1. Instala Android Studio
2. Abre Android Studio > Preferences > Appearance & Behavior > System Settings > Android SDK
3. Instala las herramientas necesarias
4. Configura la variable ANDROID_HOME

## 📦 Build de Producción

### Configurar EAS (Expo Application Services)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login a tu cuenta de Expo
eas login

# Configurar el proyecto
eas build:configure
```

### Build para iOS

```bash
# Build de desarrollo
eas build --platform ios --profile development

# Build de producción
eas build --platform ios --profile production
```

### Build para Android

```bash
# Build de desarrollo
eas build --platform android --profile development

# Build de producción
eas build --platform android --profile production
```

### Submit a las Tiendas

```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

## 🎯 Próximos Pasos

1. **Personalizar Branding**
   - Reemplaza el logo en `/assets`
   - Ajusta colores en `/src/config/theme.js`
   - Actualiza información en `app.json`

2. **Configurar Backend**
   - Sigue la guía en `/backend/README.md`
   - Despliega a AWS
   - Actualiza la URL del API

3. **Agregar Contenido Real**
   - Menú completo del restaurante
   - Fotos reales de los productos
   - Ubicaciones exactas de las sedes

4. **Configurar Notificaciones**
   - Obtén credenciales de Firebase
   - Configura en Expo
   - Implementa lógica de notificaciones

5. **Testing**
   - Prueba en dispositivos reales
   - Revisa todos los flujos
   - Fix bugs antes de producción

## 📞 Ayuda

Si tienes problemas:

1. Revisa la consola de Expo para errores
2. Consulta la documentación de Expo: https://docs.expo.dev
3. Revisa los logs de la terminal
4. Contacta al equipo de desarrollo

## 🎉 ¡Listo!

Tu aplicación de lealtad está corriendo. Ahora puedes:
- Navegar por las pantallas
- Escanear QR (simulado)
- Ver recompensas
- Explorar el menú
- Revisar sedes

**¡Disfruta desarrollando! 🚀**
