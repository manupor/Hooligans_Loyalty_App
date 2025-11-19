# 🔐 Configurar Autenticación Real - Hooligans App

## 🎯 Opciones de Autenticación

Tienes 2 opciones para implementar autenticación real:

### Opción 1: Firebase Authentication (Recomendado - Más Rápido) ⚡
- Setup en 30 minutos
- Gratis hasta 10K usuarios/mes
- Google, Facebook, Email integrados
- No necesitas programar backend

### Opción 2: Backend Propio AWS (Más Control) 🔧
- Setup en 2-3 días
- Control total
- Requiere configuración de AWS Cognito
- Más complejo pero más personalizable

---

## 🚀 OPCIÓN 1: Firebase (Recomendado)

### Paso 1: Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Add project"
3. Nombre: `hooligans-loyalty-app`
4. Acepta términos
5. Deshabilita Google Analytics (o déjalo si quieres)
6. Click "Create project"

### Paso 2: Agregar App Web

1. En el proyecto, click en el ícono `</>`  (Web)
2. Nickname: `Hooligans Web App`
3. Click "Register app"
4. **COPIA** el config que aparece:

```javascript
const firebaseConfig = {
  apiKey: "TU-API-KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Paso 3: Habilitar Métodos de Autenticación

En Firebase Console:

1. Ve a **Authentication** → **Sign-in method**
2. **Habilita Email/Password:**
   - Click en "Email/Password"
   - Toggle ON
   - Save

3. **Habilita Google:**
   - Click en "Google"
   - Toggle ON
   - Email de soporte: tu@email.com
   - Save

4. **Habilita Facebook:**
   - Click en "Facebook"
   - Necesitas crear una app en Facebook Developers primero
   - Te explico abajo ⬇️

### Paso 4: Instalar Firebase en la App

```bash
cd /Users/manu/CascadeProjects/hooligans-loyalty-app/app
npm install firebase
```

### Paso 5: Configurar Firebase en la App

Crea el archivo `/app/src/config/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "TU-API-KEY-AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
```

### Paso 6: Actualizar Servicios de Auth

Crea `/app/src/services/authService.js`:

```javascript
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Login con Email
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Registro con Email
export const registerWithEmail = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Actualizar perfil con nombre
    await userCredential.user.updateProfile({ displayName: name });
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Login con Google
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Login con Facebook
export const loginWithFacebook = async () => {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Observador de estado de autenticación
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
```

---

## 📘 Configurar Facebook Login

### Paso 1: Crear App en Facebook Developers

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Tipo: **Consumer**
4. Nombre: `Hooligans Loyalty`
5. Email de contacto: tu email
6. Create App

### Paso 2: Configurar Facebook Login

1. En el dashboard de tu app
2. Add Product → **Facebook Login**
3. Platform: **Web**
4. Site URL: `https://tu-proyecto.firebaseapp.com`
5. Save

### Paso 3: Obtener App ID y Secret

1. Settings → Basic
2. **Copia App ID**
3. **Copia App Secret** (click Show)

### Paso 4: Agregar a Firebase

En Firebase Console:
1. Authentication → Sign-in method
2. Facebook
3. Pega App ID y App Secret
4. Copia el OAuth redirect URI
5. Ve a Facebook App → Facebook Login → Settings
6. Pega el redirect URI en "Valid OAuth Redirect URIs"
7. Save

---

## 🔍 Configurar Google Login

### Paso 1: Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea nuevo proyecto: "Hooligans Loyalty"
3. Habilita "Google+ API"

### Paso 2: Crear OAuth Credentials

1. APIs & Services → Credentials
2. Create Credentials → OAuth client ID
3. Application type: **Web application**
4. Name: "Hooligans Web Client"
5. Authorized redirect URIs:
   - `https://tu-proyecto.firebaseapp.com/__/auth/handler`
6. Create

### Paso 3: Copiar Credenciales

1. **Copia Client ID**
2. **Copia Client Secret**

### Paso 4: Agregar a Firebase

En Firebase Console:
1. Authentication → Sign-in method → Google
2. Web SDK configuration
3. Web client ID: pega tu Client ID
4. Web client secret: pega tu Client Secret
5. Save

---

## 📱 Para React Native (iOS/Android)

### Google Sign-In

```bash
npm install @react-native-google-signin/google-signin
npx pod-install  # Solo iOS
```

Configura en `app.json`:
```json
{
  "expo": {
    "plugins": [
      "@react-native-google-signin/google-signin",
      {
        "iosUrlScheme": "com.googleusercontent.apps.TU-CLIENT-ID"
      }
    ]
  }
}
```

### Facebook Login

```bash
npm install react-native-fbsdk-next
```

Configura en `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-fbsdk-next",
        {
          "appID": "TU-FACEBOOK-APP-ID",
          "clientToken": "TU-CLIENT-TOKEN",
          "displayName": "Hooligans Loyalty"
        }
      ]
    ]
  }
}
```

---

## 🔧 OPCIÓN 2: Backend Propio AWS

### Arquitectura:

```
App Móvil
    ↓
API Gateway
    ↓
Lambda (Node.js)
    ↓
Cognito User Pool
    ↓
DynamoDB
```

### Paso 1: Crear User Pool en Cognito

1. Ve a AWS Console → Cognito
2. Create user pool
3. Nombre: `hooligans-users`
4. Sign-in: Email
5. Password policy: Default
6. MFA: Optional
7. Email verification: Required
8. App client: `hooligans-web-client`

### Paso 2: Configurar OAuth Providers

**Google:**
1. Cognito → Identity providers
2. Add Google
3. Client ID y Secret de Google Cloud

**Facebook:**
1. Add Facebook
2. App ID y Secret de Facebook

### Paso 3: Configurar Hosted UI

1. App integration → Domain
2. Prefix: `hooligans-auth`
3. Callback URLs: `http://localhost:8082/auth/callback`
4. Sign out URLs: `http://localhost:8082`

### Paso 4: Instalar AWS Amplify

```bash
npm install aws-amplify @aws-amplify/ui-react
```

### Paso 5: Configurar Amplify

```javascript
// src/config/aws-config.js
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_XXXXXXXXX',
    userPoolWebClientId: 'XXXXXXXXXXXXXXXXXX',
    oauth: {
      domain: 'hooligans-auth.auth.us-east-1.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'http://localhost:8082/',
      redirectSignOut: 'http://localhost:8082/',
      responseType: 'code'
    }
  }
});
```

---

## ✅ Checklist de Configuración

### Firebase (Opción 1)
- [ ] Crear proyecto en Firebase
- [ ] Habilitar Email/Password auth
- [ ] Configurar Google OAuth
- [ ] Configurar Facebook OAuth
- [ ] Instalar firebase en la app
- [ ] Copiar firebaseConfig
- [ ] Actualizar código de auth

### AWS Cognito (Opción 2)
- [ ] Crear User Pool
- [ ] Configurar Google provider
- [ ] Configurar Facebook provider
- [ ] Crear App Client
- [ ] Configurar Hosted UI
- [ ] Instalar Amplify
- [ ] Configurar Amplify en app

---

## 🚀 Siguiente Paso

**¿Cuál opción prefieres?**

1. **Firebase** (más rápido, recomendado)
   - Dime y te ayudo a configurarlo paso a paso
   
2. **AWS Cognito** (más control)
   - Necesitas cuenta AWS configurada

---

## 📞 Necesitas Ayuda?

Dime qué opción quieres y te guío paso a paso en la configuración.

**Recomendación:** Empieza con Firebase, es más rápido y gratis.
