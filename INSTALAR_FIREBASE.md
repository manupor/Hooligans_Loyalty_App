# 🔥 Instalar Firebase - Pasos Rápidos

## ⚡ Setup en 15 Minutos

### Paso 1: Instalar Firebase (2 min)

```bash
cd /Users/manu/CascadeProjects/hooligans-loyalty-app/app
npm install firebase
```

### Paso 2: Crear Proyecto Firebase (3 min)

1. Ve a https://console.firebase.google.com/
2. Click **"Add project"**
3. Nombre: `hooligans-loyalty-app`
4. Deshabilita Google Analytics (más rápido)
5. Click **"Create project"**
6. Espera 30 segundos... ✅

### Paso 3: Agregar App Web (2 min)

1. En el proyecto, click el ícono **`</>`** (Web)
2. Nickname: `Hooligans Web App`
3. **NO** marques "Firebase Hosting"
4. Click **"Register app"**

5. Aparecerá un código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "hooligans-xxxx.firebaseapp.com",
  projectId: "hooligans-xxxx",
  storageBucket: "hooligans-xxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

6. **COPIA TODO** el config

### Paso 4: Pegar Config en la App (1 min)

Abre el archivo:
```
/app/src/config/firebase.js
```

Reemplaza esta parte:
```javascript
const firebaseConfig = {
  apiKey: "TU-API-KEY-AQUI",  // ← REEMPLAZA CON TU CONFIG
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

Con tu config real.

### Paso 5: Habilitar Autenticación (3 min)

En Firebase Console:

1. Menú lateral → **Authentication**
2. Click **"Get started"**
3. Pestaña **"Sign-in method"**

**Habilita Email/Password:**
- Click en "Email/Password"
- Toggle **ON** (solo el primero)
- Save

**Habilita Google:**
- Click en "Google"
- Toggle **ON**
- Email de soporte del proyecto: `tu@email.com`
- Save

### Paso 6: Crear Base de Datos (2 min)

En Firebase Console:

1. Menú lateral → **Firestore Database**
2. Click **"Create database"**
3. Modo: **"Start in test mode"** (por ahora)
4. Ubicación: `us-central1` (o la más cercana)
5. Click **"Enable"**

### Paso 7: Configurar Reglas de Seguridad (2 min)

En Firestore → Reglas:

Reemplaza las reglas con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Todos pueden leer ubicaciones y menú
    match /locations/{locationId} {
      allow read: if true;
      allow write: if false; // Solo admins
    }
    
    match /menu/{menuId} {
      allow read: if true;
      allow write: if false; // Solo admins
    }
  }
}
```

Click **"Publish"**

---

## ✅ Verificar que Funciona

Recarga tu app en el navegador y:

1. Intenta hacer login
2. Deberías ver en la consola: `✅ Firebase inicializado correctamente`
3. Si ves error, revisa el archivo `firebase.js`

---

## 🎉 ¡Listo!

Ahora tu app tiene autenticación real con:
- ✅ Email y contraseña
- ✅ Google Sign-In
- ✅ Base de datos en tiempo real

---

## 📱 Para Google/Facebook en Móvil

Cuando quieras publicar en App Store/Play Store, necesitarás configurar:

### Google Sign-In Móvil

1. Firebase Console → Authentication → Sign-in method → Google
2. Scroll down → **"Web SDK configuration"**
3. Descarga el archivo `GoogleService-Info.plist` (iOS)
4. Descarga el archivo `google-services.json` (Android)
5. Agrégalos a tu proyecto

### Facebook Login Móvil

1. Crea app en https://developers.facebook.com/
2. Obtén App ID
3. Firebase Console → Authentication → Sign-in method → Facebook
4. Pega App ID y App Secret
5. Copia el OAuth redirect URI
6. Pégalo en Facebook Developers

---

## 🆘 Problemas Comunes

### Error: "Firebase not initialized"
→ Revisa que copiaste bien el config en `firebase.js`

### Error: "auth/popup-blocked"
→ Permite popups en tu navegador

### Error: "auth/unauthorized-domain"
→ Firebase Console → Authentication → Settings → Authorized domains
→ Agrega `localhost` y `127.0.0.1`

---

## 📚 Documentación

- Firebase Auth: https://firebase.google.com/docs/auth
- Firestore: https://firebase.google.com/docs/firestore

---

**¿Necesitas ayuda?** Revisa `CONFIGURAR_AUTH_REAL.md` para más detalles.
