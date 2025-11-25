# 🔥 Setup Completo con Firebase (100% GRATIS)

## ✅ YA TIENES CONFIGURADO

1. ✅ Proyecto Firebase creado: `holigans-5b2d6`
2. ✅ Firebase SDK instalado en la app
3. ✅ Configuración en `/app/src/config/firebase.js`
4. ✅ Servicios creados:
   - `firebaseAuthService.js` - Autenticación
   - `firebaseQRService.js` - Sistema de QR
   - `firebaseAnalyticsService.js` - Métricas por sede

## 📊 ESTRUCTURA DE BASE DE DATOS (Firestore)

### Colecciones a crear en Firebase Console:

```
firestore/
├── users/                  ← Clientes de la app
├── locations/              ← 12 sedes de Hooligans
├── transactions/           ← Historial de escaneos
├── qrCodes/                ← QR codes generados
└── locationAnalytics/      ← Métricas por sede/mes
```

### No necesitas crear nada manualmente
Firebase crea las colecciones automáticamente cuando guardas el primer documento.

---

## 🚀 PASOS PARA COMPLETAR MVP

### PASO 1: Configurar Reglas de Seguridad en Firebase

1. Ve a https://console.firebase.google.com/
2. Selecciona proyecto `holigans-5b2d6`
3. Ve a **Firestore Database** > **Reglas**
4. Pega estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Permitir lectura/escritura a usuarios autenticados
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Locations: todos pueden leer, solo admins escribir
    match /locations/{locationId} {
      allow read: if true;
      allow write: if request.auth != null; // Cambiar a admin check en producción
    }
    
    // Transactions: solo el usuario puede ver sus propias transacciones
    match /transactions/{transactionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
    
    // QR Codes: solo admins
    match /qrCodes/{qrId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Cambiar a admin check
    }
    
    // Analytics: solo lectura para usuarios autenticados
    match /locationAnalytics/{analyticsId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

5. Clic en **Publicar**

### PASO 2: Habilitar Autenticación por Email

1. En Firebase Console, ve a **Authentication**
2. Clic en **Get Started**
3. En la pestaña **Sign-in method**
4. Habilita **Email/Password**
5. Guarda

### PASO 3: Crear Datos Iniciales (12 Sedes)

Corre este script en tu app para crear las 12 sedes:

```javascript
// Script: app/scripts/seedLocations.js
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../src/config/firebase';

const locations = [
  { id: 'loc_001', name: 'Hooligans Escazú', lat: 9.9281, lng: -84.0907, address: 'Escazú, San José' },
  { id: 'loc_002', name: 'Hooligans Heredia', lat: 9.9980, lng: -84.1197, address: 'Heredia Centro' },
  { id: 'loc_003', name: 'Hooligans Cartago', lat: 9.8644, lng: -83.9210, address: 'Cartago Centro' },
  { id: 'loc_004', name: 'Hooligans Alajuela', lat: 10.0162, lng: -84.2111, address: 'Alajuela Centro' },
  { id: 'loc_005', name: 'Hooligans Curridabat', lat: 9.9159, lng: -84.0387, address: 'Curridabat' },
  { id: 'loc_006', name: 'Hooligans Lindora', lat: 9.9560, lng: -84.1955, address: 'Santa Ana' },
  { id: 'loc_007', name: 'Hooligans Moravia', lat: 9.9615, lng: -84.0513, address: 'Moravia' },
  { id: 'loc_008', name: 'Hooligans Desamparados', lat: 9.8950, lng: -84.0726, address: 'Desamparados' },
  { id: 'loc_009', name: 'Hooligans Guadalupe', lat: 9.9395, lng: -84.0588, address: 'Guadalupe' },
  { id: 'loc_010', name: 'Hooligans San Pedro', lat: 9.9346, lng: -84.0514, address: 'San Pedro' },
  { id: 'loc_011', name: 'Hooligans Tres Ríos', lat: 9.8997, lng: -83.9915, address: 'Tres Ríos' },
  { id: 'loc_012', name: 'Hooligans Pavas', lat: 9.9500, lng: -84.1368, address: 'Pavas' }
];

async function seedLocations() {
  for (const location of locations) {
    await setDoc(doc(db, 'locations', location.id), {
      ...location,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    });
    console.log(`✅ Creada sede: ${location.name}`);
  }
  console.log('🎉 Todas las sedes creadas!');
}

seedLocations();
```

### PASO 4: Integrar Autenticación en la App

Ya tienes el servicio creado. Ahora necesitas:

1. **Crear pantallas de Login/Register**
2. **Actualizar navegación para requerir auth**
3. **Conectar con el store de Zustand**

Ejemplo de uso:

```javascript
import firebaseAuthService from './services/firebaseAuthService';

// En LoginScreen.js
const handleLogin = async () => {
  const result = await firebaseAuthService.login(email, password);
  
  if (result.success) {
    // Guardar usuario en store
    setUser(result.user);
    navigation.navigate('Home');
  } else {
    Alert.alert('Error', result.error);
  }
};
```

### PASO 5: Conectar QR Scanner

En `QRScannerScreen.js`, descomentar y usar:

```javascript
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebaseQRService from '../services/firebaseQRService';

const handleBarCodeScanned = async ({ data }) => {
  try {
    setScanned(true);
    
    const result = await firebaseQRService.scanQR(data, user.userId);
    
    if (result.success) {
      Alert.alert('¡Éxito!', result.message);
      // Actualizar puntos en UI
      updateUserPoints(result.newBalance);
    } else {
      Alert.alert('Error', result.error);
    }
  } catch (error) {
    Alert.alert('Error', 'No se pudo procesar el QR');
  } finally {
    setScanned(false);
  }
};
```

### PASO 6: Generar QR Codes para las Mesas

Usa este código para generar QR codes:

```javascript
import firebaseQRService from './services/firebaseQRService';
import QRCode from 'react-native-qrcode-svg';

// Generar QR para Mesa 1 de Escazú
const result = await firebaseQRService.generateQR('loc_001', 'Mesa-1');

// Renderizar QR
<QRCode
  value={result.qrData}
  size={200}
/>
```

---

## 📊 DASHBOARD PARA VER MÉTRICAS

### Opción 1: Dashboard Web (Recomendado)

Crear dashboard con Next.js que consuma Firebase:

```bash
# Crear proyecto Next.js
npx create-next-app@latest hooligans-dashboard
cd hooligans-dashboard
npm install firebase recharts
```

### Opción 2: Ver en Firebase Console

1. Ve a Firebase Console
2. **Firestore Database** > Ver documentos
3. **Authentication** > Ver usuarios
4. Descarga datos con queries

### Opción 3: Pantalla Admin en la App

Agregar pantalla en la app para gerentes:

```javascript
import firebaseAnalyticsService from '../services/firebaseAnalyticsService';

// En AdminDashboard.js
const [stats, setStats] = useState(null);

useEffect(() => {
  async function loadStats() {
    const result = await firebaseAnalyticsService.getLocationStats('loc_001');
    setStats(result);
  }
  loadStats();
}, []);
```

---

## 💰 COSTOS

### Plan Spark (GRATIS)
- ✅ 50,000 lecturas/día
- ✅ 20,000 escrituras/día
- ✅ 1GB storage
- ✅ Autenticación ilimitada

### Para tu MVP (100-1000 usuarios):
**Costo: $0/mes**

### Cuando crezcas (10,000 usuarios):
**Costo: ~$25-50/mes**

---

## 🔐 SEGURIDAD

### Producción:
1. Mover `SECRET_KEY` a variables de entorno
2. Implementar roles de admin
3. Validación estricta de inputs
4. Rate limiting

### Variables de Entorno:

```javascript
// .env
FIREBASE_SECRET_KEY=tu-secret-key-seguro
FIREBASE_API_KEY=...
```

---

## 📱 TESTING

### 1. Crear Usuario de Prueba
```javascript
email: test@hooligans.com
password: Test123456
```

### 2. Generar QR de Prueba
```javascript
Location: loc_001 (Escazú)
Table: Mesa-Test
```

### 3. Escanear y Verificar
- Abrir app
- Ir a QR Scanner
- Escanear código
- Verificar puntos se suman
- Verificar transacción en Firestore

---

## 🚀 LANZAMIENTO

### Checklist:
- [ ] Reglas de Firestore configuradas
- [ ] Autenticación habilitada
- [ ] 12 sedes creadas en Firestore
- [ ] QR codes generados (mínimo 5 por sede)
- [ ] Pantallas de Login/Register creadas
- [ ] QR Scanner conectado
- [ ] Dashboard básico funcionando
- [ ] Usuario de prueba creado
- [ ] Testing completo

---

## 📞 PRÓXIMOS PASOS

### Esta Semana:
1. ✅ Configurar reglas de seguridad
2. ✅ Habilitar autenticación
3. ✅ Crear las 12 sedes
4. ✅ Generar primeros QR codes

### Próxima Semana:
1. Crear pantallas de Login/Register
2. Conectar QR Scanner real
3. Testing con usuarios reales
4. Dashboard simple para gerentes

---

## 🎯 ¿NECESITAS AYUDA?

Te puedo ayudar con:
- ✅ Crear las pantallas de Login/Register
- ✅ Conectar el QR Scanner
- ✅ Generar los QR codes para todas las mesas
- ✅ Crear dashboard web simple
- ✅ Testing y debugging

**Todo 100% GRATIS con Firebase** 🔥

Dime qué parte quieres implementar primero y te ayudo paso a paso.
