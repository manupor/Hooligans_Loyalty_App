# 📋 Plan de Implementación Completo - Hooligans Loyalty App

## 🎯 OBJETIVO
Implementar sistema completo con:
1. ✅ Autenticación real de usuarios
2. ✅ Escaneo QR funcional con validación backend
3. ✅ Sistema multi-sede con analytics por sede
4. ✅ Dashboard global y por sede
5. ✅ Base de datos centralizada

---

## 📊 FASE 1: CONFIGURACIÓN DE INFRAESTRUCTURA AWS (2 semanas)

### Día 1-2: Setup Inicial AWS

**Tareas:**
```bash
# 1. Instalar herramientas
brew install awscli
brew install aws-sam-cli

# 2. Crear cuenta AWS (si no tienes)
https://aws.amazon.com/

# 3. Configurar credenciales
aws configure
  AWS Access Key ID: [OBTENER DE AWS CONSOLE]
  Secret Access Key: [OBTENER DE AWS CONSOLE]
  Region: us-east-1
  Output: json

# 4. Verificar conexión
aws sts get-caller-identity
```

### Día 3-5: Crear Tablas DynamoDB

**Script de creación:**

```bash
# Navegar a backend
cd backend

# Crear tablas con AWS CLI
aws dynamodb create-table \
  --table-name HooligansUsers \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --global-secondary-indexes \
    "[{
      \"IndexName\": \"email-index\",
      \"KeySchema\": [{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}],
      \"Projection\":{\"ProjectionType\":\"ALL\"},
      \"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
    }]" \
  --billing-mode PAY_PER_REQUEST

# Repetir para las otras 4 tablas (script completo en backend/setup-db.sh)
```

**Tablas a crear:**
- ✅ HooligansUsers
- ✅ HooligansLocations  
- ✅ HooligansTransactions
- ✅ HooligansQRCodes
- ✅ HooligansLocationAnalytics

### Día 6-10: Desarrollar Backend API

**Estructura de archivos a crear:**

```
backend/functions/
├── auth/
│   ├── register.js          ← POST /auth/register
│   ├── login.js             ← POST /auth/login  
│   └── verify-token.js      ← Middleware JWT
├── qr/
│   ├── scan-qr.js           ← POST /qr/scan (CRÍTICO)
│   ├── generate-qr.js       ← POST /qr/generate
│   └── validate-qr.js       ← Helper para validar firma
├── users/
│   ├── get-profile.js       ← GET /users/:id
│   └── get-points.js        ← GET /users/:id/points
├── analytics/
│   ├── location-stats.js    ← GET /analytics/location/:id
│   └── global-stats.js      ← GET /analytics/global
└── locations/
    └── list.js              ← GET /locations
```

---

## 🔐 FASE 2: IMPLEMENTAR AUTENTICACIÓN (1 semana)

### Paso 1: Crear Servicio de Auth en la App

**Archivo: `/app/src/services/authService.js`**

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://[TU-API-GATEWAY-URL]/prod';

export const authService = {
  // Registro de usuario
  async register(email, password, name, phone) {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      name,
      phone
    });
    return response.data;
  },

  // Login
  async login(email, password) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    const { token, user } = response.data;
    
    // Guardar token
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  },

  // Logout
  async logout() {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  // Obtener token guardado
  async getToken() {
    return await AsyncStorage.getItem('authToken');
  }
};
```

### Paso 2: Crear Pantallas de Auth

**Archivos a crear:**
- `/app/src/screens/LoginScreen.js`
- `/app/src/screens/RegisterScreen.js`
- `/app/src/screens/WelcomeScreen.js`

### Paso 3: Actualizar Navegación

Modificar `/app/src/navigation/AppNavigator.js` para incluir stack de autenticación.

---

## 📱 FASE 3: IMPLEMENTAR QR SCANNER REAL (1 semana)

### Paso 1: Actualizar QRScannerScreen

**Archivo: `/app/src/screens/QRScannerScreen.js`**

Descomentar `expo-barcode-scanner` y conectar con backend:

```javascript
import { BarCodeScanner } from 'expo-barcode-scanner';
import { scanQRService } from '../services/qrService';

const handleBarCodeScanned = async ({ data }) => {
  try {
    setScanned(true);
    
    // Parsear datos del QR
    const qrData = JSON.parse(data);
    
    // Enviar al backend para validar
    const result = await scanQRService.scanQR({
      qrCodeData: qrData,
      userId: user.userId,
      timestamp: new Date().toISOString()
    });
    
    if (result.success) {
      Alert.alert(
        '¡Puntos Ganados!',
        `Has ganado ${result.pointsEarned} puntos`,
        [{
          text: 'OK',
          onPress: () => {
            updatePoints(result.newBalance);
            navigation.goBack();
          }
        }]
      );
    }
  } catch (error) {
    Alert.alert('Error', error.message);
    setScanned(false);
  }
};
```

### Paso 2: Crear Servicio de QR

**Archivo: `/app/src/services/qrService.js`**

```javascript
import axios from 'axios';
import { authService } from './authService';

const API_URL = 'https://[TU-API-GATEWAY-URL]/prod';

export const scanQRService = {
  async scanQR(scanData) {
    const token = await authService.getToken();
    
    const response = await axios.post(
      `${API_URL}/qr/scan`,
      scanData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  }
};
```

---

## 📊 FASE 4: CREAR DASHBOARD ADMINISTRATIVO (2 semanas)

### Estructura del Dashboard

```
dashboard/
├── src/
│   ├── pages/
│   │   ├── index.js               ← Vista global
│   │   ├── locations/
│   │   │   └── [id].js            ← Vista por sede
│   │   ├── analytics/
│   │   │   └── index.js           ← Analytics detallados
│   │   └── qr-generator/
│   │       └── index.js           ← Generar QR codes
│   ├── components/
│   │   ├── LocationCard.js
│   │   ├── StatsCard.js
│   │   ├── Chart.js
│   │   └── QRCodeDisplay.js
│   └── services/
│       └── api.js
├── package.json
└── next.config.js
```

### Tecnologías del Dashboard:
- **Framework**: Next.js 14
- **UI**: shadcn/ui + TailwindCSS
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Auth**: NextAuth.js

### Vistas Principales:

#### 1. Dashboard Global
```
📊 Métricas Globales
├── Total de Usuarios: 5,234
├── Escaneos Totales: 12,456
├── Revenue Total: $125,340
└── Crecimiento Mensual: +15%

📍 Comparación por Sede (Top 5)
└── Gráfico de barras comparativo

📈 Tendencias
└── Gráfico de línea temporal
```

#### 2. Vista por Sede
```
📍 Hooligans Escazú
├── Escaneos hoy: 45
├── Usuarios únicos: 234
├── Revenue mensual: $12,500
└── QR Codes activos: 12

📊 Métricas del Mes
├── Gráfico de escaneos por día
├── Distribución por horario
└── Top usuarios

🎫 Gestión de QR Codes
└── Lista + Generar nuevos
```

---

## 🔧 FASE 5: INTEGRACIÓN Y TESTING (1 semana)

### Checklist de Integración:

**Backend:**
- [ ] Todas las Lambda functions desplegadas
- [ ] API Gateway configurado
- [ ] Tablas DynamoDB creadas con GSI
- [ ] Cognito user pool configurado
- [ ] Variables de entorno configuradas

**App Móvil:**
- [ ] Login/Register funcional
- [ ] QR Scanner conectado a backend
- [ ] Puntos se actualizan en tiempo real
- [ ] Navegación con autenticación
- [ ] Manejo de errores

**Dashboard:**
- [ ] Muestra datos reales de DynamoDB
- [ ] Filtros por fecha funcionan
- [ ] Exportación de reportes
- [ ] Generación de QR codes
- [ ] Responsive design

### Testing Manual:

```
ESCENARIO 1: Registro de Usuario
1. Abrir app
2. Ir a "Crear Cuenta"
3. Ingresar datos
4. Verificar que se crea en DynamoDB
5. Verificar que login funciona

ESCENARIO 2: Escaneo de QR
1. Login como usuario
2. Ir a escanear QR
3. Escanear QR code de prueba
4. Verificar puntos se suman
5. Verificar registro en Transactions table
6. Verificar analytics se actualizan

ESCENARIO 3: Dashboard
1. Login como admin
2. Ver dashboard global
3. Ver sede específica
4. Generar nuevo QR code
5. Exportar reporte
```

---

## 💾 SCRIPTS ÚTILES

### Generar QR Codes para todas las sedes

```bash
# Script: backend/scripts/generate-qr-codes.js
node backend/scripts/generate-qr-codes.js \
  --location loc_001 \
  --tables 10
```

### Poblar datos de prueba

```bash
# Script: backend/scripts/seed-data.js
node backend/scripts/seed-data.js
```

### Backup de base de datos

```bash
# Backup automático de DynamoDB
aws dynamodb create-backup \
  --table-name HooligansUsers \
  --backup-name users-backup-$(date +%Y%m%d)
```

---

## 📦 COSTOS ESTIMADOS

### AWS (10,000 usuarios activos/mes)

| Servicio | Costo Mensual |
|----------|---------------|
| API Gateway | $35 |
| Lambda | $20 |
| DynamoDB | $25 |
| S3 | $5 |
| CloudWatch | $10 |
| **Total** | **~$95/mes** |

### Otros Servicios

| Servicio | Costo Mensual |
|----------|---------------|
| Vercel (Dashboard) | $20 |
| Expo EAS (Builds) | $29 |
| **Total** | **~$49/mes** |

**COSTO TOTAL: ~$144/mes**

---

## 🚀 CRONOGRAMA COMPLETO

| Fase | Duración | Tareas Clave |
|------|----------|--------------|
| **Fase 1** | 2 semanas | Setup AWS, DynamoDB, Backend API |
| **Fase 2** | 1 semana | Autenticación en app |
| **Fase 3** | 1 semana | QR Scanner real |
| **Fase 4** | 2 semanas | Dashboard admin |
| **Fase 5** | 1 semana | Testing e integración |
| **TOTAL** | **7 semanas** | **~2 meses** |

---

## 📞 PRÓXIMOS PASOS INMEDIATOS

### Esta Semana:

1. **Crear cuenta AWS**
2. **Configurar AWS CLI en tu Mac**
3. **Crear las 5 tablas de DynamoDB**
4. **Escribir primera Lambda function (register)**
5. **Desplegar con SAM**

### Te ayudo con:
- ✅ Scripts de setup automatizados
- ✅ Código de Lambda functions
- ✅ Configuración de API Gateway
- ✅ Integración con la app

---

## 🎯 ¿EMPEZAMOS?

**¿Por dónde quieres empezar?**
1. Crear cuenta AWS y configurar CLI
2. Escribir código de backend (Lambda functions)
3. Crear pantallas de login en la app
4. Ver ejemplo de dashboard

Dime qué prefieres y empezamos paso a paso.
