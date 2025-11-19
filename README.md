# 🍗 Hooligans Loyalty App

Aplicación móvil de fidelización para Hooligans - Restaurante de Alitas, con sistema de puntos, recompensas y pedidos integrados.

## 📱 Características

### Para Clientes
- ✅ **Tarjeta Digital de Lealtad** con diseño basado en la identidad de marca
- 🎁 **Sistema de Puntos y Recompensas** (Bronce, Plata, Oro)
- 📷 **Escaneo de Códigos QR** para acumular puntos
- 🍔 **Menú Digital** con opción de ordenar y pagar
- 📍 **Localizador de Sedes** (12 ubicaciones)
- 🔔 **Notificaciones Push** para promociones
- 🎂 **Beneficios de Cumpleaños**
- 📊 **Historial de Transacciones**

### Para Administradores
- 📊 **Dashboard de Analytics** (global y por sede)
- 👥 **Tracking de Usuarios** activos y nuevos
- 🎯 **Gestión de Promociones**
- 📈 **Métricas de Rendimiento** por sede
- 📝 **Reportes Exportables** (CSV, PDF)
- 🔐 **Sistema de Códigos QR** único por mesa/sede

## 🎨 Diseño

### Paleta de Colores
- **Naranja Principal**: `#FF8533` (del logo de Hooligans)
- **Negro/Gris Oscuro**: `#1A1A1A`, `#2D2D2D`
- **Grises**: `#4A4A4A`, `#ADADAD`, `#E8E8E8`
- **Blanco**: `#FFFFFF`

### Niveles de Membresía
- 🥉 **Bronce** (0 puntos): 5% descuento
- 🥈 **Plata** (100 puntos): 10% descuento + beneficios
- 🥇 **Oro** (300 puntos): 15% descuento + VIP

## 🏗️ Arquitectura Técnica

### Frontend (Mobile App)
```
React Native (Expo)
├── Navigation: React Navigation (Stack + Bottom Tabs)
├── State Management: Zustand
├── UI Components: Custom components con diseño moderno
├── Maps: React Native Maps + Expo Location
├── QR Scanner: Expo Barcode Scanner
└── Notifications: Expo Notifications
```

### Backend (AWS Serverless)
```
AWS Architecture
├── API Gateway: REST API endpoints
├── Lambda Functions: Lógica de negocio serverless
├── DynamoDB: Base de datos NoSQL
│   ├── Users Table
│   ├── Points Table
│   ├── Transactions Table
│   ├── Locations Table
│   ├── Orders Table
│   └── QR Codes Table
├── S3: Almacenamiento de imágenes
├── Cognito: Autenticación y autorización
├── SES: Emails transaccionales
├── SNS: Notificaciones push
└── CloudWatch: Monitoreo y logs
```

### Dashboard Admin (Web)
```
React (Next.js)
├── Analytics Dashboard
├── User Management
├── Location Management
├── QR Code Generator
└── Reports & Exports
```

## 📦 Instalación

### Prerrequisitos
- Node.js 16+
- npm o yarn
- Expo CLI
- Cuenta de AWS (para backend)
- Cuentas de desarrollador iOS/Android (para publicación)

### Configuración del Proyecto

1. **Clonar el repositorio**
```bash
cd hooligans-loyalty-app/app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales de AWS
```

4. **Iniciar en modo desarrollo**
```bash
# iOS
npm run ios

# Android
npm run android

# Web (para pruebas)
npm run web
```

## 🚀 Deployment

### Aplicación Móvil

#### iOS (App Store)
```bash
# Build de producción
eas build --platform ios

# Submit a App Store
eas submit --platform ios
```

#### Android (Play Store)
```bash
# Build de producción
eas build --platform android

# Submit a Play Store
eas submit --platform android
```

### Backend AWS

1. **Configurar AWS CLI**
```bash
aws configure
```

2. **Desplegar infraestructura**
```bash
cd backend
# Opción 1: AWS SAM
sam build
sam deploy --guided

# Opción 2: Serverless Framework
serverless deploy
```

## 📊 Base de Datos

### Modelo de Datos (DynamoDB)

#### Users Table
```json
{
  "userId": "string (PK)",
  "email": "string (GSI)",
  "name": "string",
  "phone": "string",
  "points": "number",
  "membershipLevel": "BRONZE|SILVER|GOLD",
  "birthday": "date",
  "createdAt": "timestamp",
  "lastVisit": "timestamp"
}
```

#### Transactions Table
```json
{
  "transactionId": "string (PK)",
  "userId": "string (GSI)",
  "locationId": "string (GSI)",
  "type": "EARNED|REDEEMED",
  "points": "number",
  "description": "string",
  "timestamp": "timestamp"
}
```

#### Locations Table
```json
{
  "locationId": "string (PK)",
  "name": "string",
  "address": "string",
  "coordinates": {
    "lat": "number",
    "lng": "number"
  },
  "phone": "string",
  "hours": "object",
  "qrCodes": "array"
}
```

#### Orders Table
```json
{
  "orderId": "string (PK)",
  "userId": "string (GSI)",
  "locationId": "string",
  "items": "array",
  "total": "number",
  "status": "PENDING|CONFIRMED|READY|DELIVERED",
  "paymentMethod": "CARD|CASH|SINPE",
  "createdAt": "timestamp"
}
```

## 🔐 Seguridad

- ✅ Autenticación JWT con AWS Cognito
- ✅ Encriptación SSL/TLS para todas las comunicaciones
- ✅ Códigos QR con validación temporal
- ✅ Rate limiting en API Gateway
- ✅ Validación de datos en frontend y backend
- ✅ Cumplimiento de GDPR para datos de usuarios

## 📱 Funcionalidades Próximas (Roadmap)

- [ ] Integración con pasarelas de pago (Stripe, PayPal)
- [ ] Sistema de referidos (invita amigos)
- [ ] Gamificación (badges, logros)
- [ ] Chat en vivo con soporte
- [ ] Reservas de mesa
- [ ] Pedidos anticipados
- [ ] Programa de cumpleaños automático
- [ ] Integración con redes sociales

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e
```

## 📞 Soporte

- **Email**: dev@hooligans.com
- **Documentación**: [docs.hooligans.com](https://docs.hooligans.com)
- **Issues**: GitHub Issues

## 📄 Licencia

Propiedad de Hooligans Restaurant - Todos los derechos reservados

---

**Desarrollado con ❤️ para Hooligans**
