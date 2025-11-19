# 🔧 Hooligans Backend - AWS Serverless

Backend serverless para la aplicación de lealtad de Hooligans usando AWS.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Cliente (App Móvil)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (REST API)                    │
│  - Autenticación JWT                                        │
│  - Rate Limiting                                            │
│  - CORS configurado                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │Lambda  │  │Lambda  │  │Lambda  │
    │ Auth   │  │ Points │  │ Orders │
    └────┬───┘  └────┬───┘  └────┬───┘
         │           │           │
         └───────────┼───────────┘
                     ▼
         ┌──────────────────────┐
         │      DynamoDB        │
         │  - Users             │
         │  - Points            │
         │  - Transactions      │
         │  - Orders            │
         │  - Locations         │
         └──────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │Cognito │  │   S3   │  │  SES   │
    │        │  │        │  │        │
    └────────┘  └────────┘  └────────┘
```

## 📁 Estructura del Proyecto

```
backend/
├── functions/
│   ├── auth/
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── verify.js
│   │   └── social-auth.js
│   ├── users/
│   │   ├── getProfile.js
│   │   ├── updateProfile.js
│   │   └── getMembership.js
│   ├── points/
│   │   ├── scanQR.js
│   │   ├── earnPoints.js
│   │   ├── redeemPoints.js
│   │   └── getHistory.js
│   ├── orders/
│   │   ├── createOrder.js
│   │   ├── getOrders.js
│   │   ├── updateStatus.js
│   │   └── processPayment.js
│   ├── locations/
│   │   ├── getAll.js
│   │   ├── getNearby.js
│   │   └── getById.js
│   └── admin/
│       ├── getDashboard.js
│       ├── generateQR.js
│       └── getReports.js
├── layers/
│   └── common/
│       ├── utils/
│       ├── database/
│       └── validators/
├── template.yaml          # AWS SAM template
├── serverless.yml         # Serverless Framework config
└── package.json
```

## 🔧 Configuración

### 1. Instalación de AWS CLI

```bash
# macOS
brew install awscli

# Configurar credenciales
aws configure
```

### 2. Instalación de SAM CLI

```bash
brew tap aws/tap
brew install aws-sam-cli
```

### 3. Variables de Entorno

Crear archivo `.env`:

```env
# AWS
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

# DynamoDB
USERS_TABLE=hooligans-users
POINTS_TABLE=hooligans-points
TRANSACTIONS_TABLE=hooligans-transactions
ORDERS_TABLE=hooligans-orders
LOCATIONS_TABLE=hooligans-locations

# Cognito
USER_POOL_ID=us-east-1_XXXXXXXXX
CLIENT_ID=your-client-id

# S3
IMAGES_BUCKET=hooligans-images

# API
JWT_SECRET=your-super-secret-key
API_STAGE=prod
```

## 🚀 Deployment

### Opción 1: AWS SAM

```bash
# Build
sam build

# Deploy a desarrollo
sam deploy --config-env dev

# Deploy a producción
sam deploy --config-env prod
```

### Opción 2: Serverless Framework

```bash
# Deploy a desarrollo
serverless deploy --stage dev

# Deploy a producción
serverless deploy --stage prod
```

## 📊 Endpoints API

### Autenticación

```
POST /auth/register          - Registrar nuevo usuario
POST /auth/login             - Login con email/password
POST /auth/social            - Login con redes sociales
POST /auth/verify-email      - Verificar email
POST /auth/reset-password    - Resetear contraseña
```

### Usuarios

```
GET    /user/profile         - Obtener perfil
PUT    /user/profile         - Actualizar perfil
GET    /user/points          - Obtener puntos
GET    /user/transactions    - Historial de transacciones
GET    /user/membership      - Nivel de membresía
```

### Puntos y Recompensas

```
POST   /points/scan-qr       - Escanear QR y ganar puntos
POST   /points/redeem        - Canjear recompensa
GET    /points/rewards       - Recompensas disponibles
GET    /points/history       - Historial de puntos
```

### Pedidos

```
POST   /orders/create        - Crear nuevo pedido
GET    /orders/:id           - Obtener pedido
GET    /orders/history       - Historial de pedidos
POST   /orders/payment       - Procesar pago
GET    /orders/:id/track     - Tracking de pedido
```

### Ubicaciones

```
GET    /locations            - Todas las ubicaciones
GET    /locations/nearby     - Ubicaciones cercanas
GET    /locations/:id        - Ubicación específica
```

### Admin (Protegido)

```
GET    /admin/dashboard      - Dashboard con métricas
GET    /admin/users          - Lista de usuarios
GET    /admin/analytics      - Analytics detallados
POST   /admin/qr/generate    - Generar código QR
GET    /admin/reports        - Reportes exportables
```

## 🔐 Seguridad

### Autenticación

```javascript
// Middleware de autenticación
const authenticate = async (event) => {
  const token = event.headers.Authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
```

### Validación de QR Codes

```javascript
// Los QR codes tienen estructura específica y expiración
{
  "restaurantId": "sede-01",
  "tableId": "mesa-12",
  "timestamp": 1698765432,
  "signature": "hash-unico"
}
```

## 💾 Schemas de DynamoDB

### Users Table

```javascript
// Partition Key: userId
// GSI: email-index
{
  userId: 'user_123456',
  email: 'user@example.com',
  name: 'Juan Pérez',
  phone: '+506-8888-8888',
  points: 125,
  membershipLevel: 'SILVER',
  birthday: '1990-01-15',
  preferences: {
    notifications: true,
    promotions: ['alitas', 'bebidas']
  },
  createdAt: '2024-01-01T00:00:00Z',
  lastVisit: '2024-10-28T18:00:00Z'
}
```

### Transactions Table

```javascript
// Partition Key: transactionId
// GSI: userId-timestamp-index
// GSI: locationId-timestamp-index
{
  transactionId: 'txn_789012',
  userId: 'user_123456',
  locationId: 'loc_01',
  type: 'EARNED', // or 'REDEEMED'
  points: 5,
  description: 'Visita a Hooligans Escazú',
  metadata: {
    orderId: 'order_456',
    amount: 15000
  },
  timestamp: '2024-10-28T18:30:00Z'
}
```

### Orders Table

```javascript
// Partition Key: orderId
// GSI: userId-createdAt-index
{
  orderId: 'order_456',
  userId: 'user_123456',
  locationId: 'loc_01',
  items: [
    {
      id: 'item_1',
      name: 'Alitas BBQ',
      quantity: 1,
      price: 8500
    }
  ],
  subtotal: 8500,
  tax: 1105,
  total: 9605,
  pointsEarned: 5,
  status: 'CONFIRMED',
  paymentMethod: 'CARD',
  deliveryAddress: null,
  createdAt: '2024-10-28T18:00:00Z',
  updatedAt: '2024-10-28T18:05:00Z'
}
```

## 📈 Monitoring y Logs

### CloudWatch Metrics

- Número de requests por endpoint
- Latencia de las funciones Lambda
- Errores y excepciones
- Uso de DynamoDB (lectura/escritura)

### CloudWatch Logs

```javascript
// Logger helper
const logger = {
  info: (message, data) => {
    console.log(JSON.stringify({
      level: 'INFO',
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  },
  error: (message, error) => {
    console.error(JSON.stringify({
      level: 'ERROR',
      message,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));
  }
};
```

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Load testing (con Artillery)
artillery run load-test.yml
```

## 💰 Estimación de Costos AWS

Para **10,000 usuarios activos mensuales**:

- API Gateway: ~$35/mes
- Lambda: ~$20/mes
- DynamoDB: ~$25/mes
- S3: ~$5/mes
- Cognito: Gratis (hasta 50k MAU)
- CloudWatch: ~$10/mes

**Total estimado: $95-120 USD/mes**

## 🔄 CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Backend
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: sam build
      - run: sam deploy --no-confirm-changeset
```

## 📚 Recursos Adicionales

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [API Gateway Security](https://docs.aws.amazon.com/apigateway/latest/developerguide/security.html)

---

**Backend desarrollado para Hooligans Loyalty App**
