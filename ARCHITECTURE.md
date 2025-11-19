# 🏗️ Arquitectura Técnica - Hooligans Loyalty App

## 📱 Stack Tecnológico

### Frontend (Aplicación Móvil)
- **Framework**: React Native con Expo
- **Navegación**: React Navigation (Stack + Bottom Tabs)
- **State Management**: Zustand (ligero y performante)
- **UI/UX**: Componentes personalizados con diseño moderno
- **Maps**: React Native Maps + Expo Location
- **QR Scanner**: Expo Barcode Scanner
- **Notificaciones**: Expo Notifications
- **HTTP Client**: Axios
- **Almacenamiento Local**: AsyncStorage

### Backend (Serverless)
- **Cloud Provider**: AWS
- **Compute**: AWS Lambda (Node.js 18.x)
- **API**: API Gateway (REST)
- **Database**: DynamoDB (NoSQL)
- **Storage**: S3
- **Authentication**: AWS Cognito + JWT
- **Notifications**: AWS SNS
- **Email**: AWS SES
- **Monitoring**: CloudWatch

### Dashboard Administrativo
- **Framework**: Next.js (React)
- **UI Library**: shadcn/ui + TailwindCSS
- **Charts**: Recharts
- **Tables**: TanStack Table

## 🔄 Flujo de Datos

### 1. Autenticación de Usuario

```
┌─────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│  App    │────────>│   API    │────────>│ Cognito │────────>│ DynamoDB │
│ Mobile  │ Login   │ Gateway  │  Auth   │         │  User   │  Users   │
└─────────┘         └──────────┘         └─────────┘         └──────────┘
     │                    │                     │                  │
     │<───────────────────┼─────────────────────┼──────────────────┘
     │    JWT Token       │                     │
```

**Flujo:**
1. Usuario ingresa credenciales (email/password o social login)
2. App envía request a `/auth/login`
3. Lambda valida credenciales con Cognito
4. Si es válido, genera JWT y retorna token
5. App guarda token en AsyncStorage
6. Token se envía en header `Authorization` en cada request

### 2. Escaneo de QR y Acumulación de Puntos

```
┌─────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│  App    │────────>│   API    │────────>│ Lambda  │────────>│ DynamoDB │
│ Mobile  │  Scan   │ Gateway  │ Process │ scanQR  │  Write  │ Users +  │
│ (QR)    │         │          │         │         │         │  Trans   │
└─────────┘         └──────────┘         └─────────┘         └──────────┘
     │                    │                     │                  │
     │<───────────────────┼─────────────────────┼──────────────────┘
     │   Points Earned    │                     │
```

**Flujo:**
1. Usuario escanea código QR en el restaurante
2. App decodifica QR y extrae datos (restaurantId, tableId, timestamp, signature)
3. App envía POST a `/points/scan-qr` con datos del QR
4. Lambda valida:
   - Firma del QR (seguridad)
   - Expiración (24 horas)
   - No duplicados recientes (4 horas)
5. Lambda otorga puntos (5 base + bonificaciones)
6. Actualiza DynamoDB (Users + Transactions)
7. Verifica cambio de nivel de membresía
8. Retorna puntos ganados y estado actualizado

### 3. Pedido y Pago

```
┌─────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│  App    │────────>│   API    │────────>│ Lambda  │────────>│ DynamoDB │
│ Mobile  │ Order   │ Gateway  │ Process │ Order   │  Save   │  Orders  │
└─────────┘         └──────────┘         └─────────┘         └──────────┘
     │                    │                     │                  │
     │                    │                     │                  │
     │                    │                     v                  │
     │                    │              ┌──────────┐             │
     │                    │              │ Payment  │             │
     │                    │              │ Gateway  │             │
     │                    │              │ (Stripe) │             │
     │                    │              └──────────┘             │
     │                    │                     │                  │
     │<───────────────────┼─────────────────────┼──────────────────┘
     │  Order Confirmed   │                     │
```

**Flujo:**
1. Usuario navega menú y agrega items al carrito
2. Revisa orden y procede a checkout
3. Selecciona método de pago
4. App envía POST a `/orders/create`
5. Lambda crea orden en DynamoDB
6. Si pago con tarjeta, procesa con Stripe
7. Al confirmar pago, actualiza estado de orden
8. Otorga puntos por la compra
9. Envía notificación al restaurante
10. Usuario recibe confirmación

### 4. Dashboard Administrativo

```
┌─────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│Dashboard│────────>│   API    │────────>│ Lambda  │────────>│ DynamoDB │
│  Web    │ Request │ Gateway  │ Query   │ Admin   │  Scan   │ Multiple │
│         │         │          │         │         │         │  Tables  │
└─────────┘         └──────────┘         └─────────┘         └──────────┘
     │                    │                     │                  │
     │<───────────────────┼─────────────────────┼──────────────────┘
     │   Aggregated Data  │                     │
```

**Métricas disponibles:**
- Usuarios totales y activos por período
- Puntos acumulados y redimidos
- Órdenes por sede y global
- Revenue por sede y global
- Tasa de retención
- Distribución de membresías
- Top productos
- Horarios pico

## 💾 Modelo de Datos (DynamoDB)

### Users Table

```javascript
{
  PK: "userId",
  GSI: ["email-index"]
}

Ejemplo:
{
  "userId": "user_abc123",
  "email": "juan@example.com",
  "name": "Juan Pérez",
  "phone": "+506-8888-8888",
  "points": 125,
  "membershipLevel": "SILVER",
  "birthday": "1990-01-15",
  "preferences": {
    "notifications": true,
    "promotions": ["alitas", "bebidas"]
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "lastVisit": "2024-10-28T18:00:00Z",
  "totalVisits": 25,
  "totalSpent": 125000
}
```

### Transactions Table

```javascript
{
  PK: "transactionId",
  GSI: ["userId-timestamp-index", "locationId-timestamp-index"]
}

Ejemplo:
{
  "transactionId": "txn_xyz789",
  "userId": "user_abc123",
  "locationId": "loc_01",
  "type": "EARNED", // or "REDEEMED"
  "points": 5,
  "description": "Visita a Hooligans Escazú",
  "metadata": {
    "qrCode": {...},
    "orderId": "order_456"
  },
  "timestamp": "2024-10-28T18:30:00Z"
}
```

### Orders Table

```javascript
{
  PK: "orderId",
  GSI: ["userId-createdAt-index", "locationId-createdAt-index"]
}

Ejemplo:
{
  "orderId": "order_456",
  "userId": "user_abc123",
  "locationId": "loc_01",
  "items": [
    {
      "id": "item_1",
      "name": "Alitas BBQ",
      "quantity": 2,
      "price": 8500,
      "subtotal": 17000
    }
  ],
  "subtotal": 17000,
  "tax": 2210,
  "total": 19210,
  "pointsEarned": 10,
  "status": "CONFIRMED",
  "paymentMethod": "CARD",
  "paymentId": "stripe_abc123",
  "deliveryAddress": null,
  "notes": "Sin cebolla",
  "createdAt": "2024-10-28T18:00:00Z",
  "updatedAt": "2024-10-28T18:05:00Z",
  "completedAt": null
}
```

## 🔐 Seguridad

### Autenticación y Autorización

1. **JWT Tokens**
   - Emitidos por Cognito
   - Expiración: 24 horas
   - Refresh tokens: 30 días
   - Almacenados en AsyncStorage (móvil)

2. **API Gateway**
   - Lambda Authorizer valida JWT
   - Rate limiting: 1000 requests/hora por usuario
   - Throttling: 10 requests/segundo

3. **Códigos QR**
   - Firmados con HMAC-SHA256
   - Expiración: 24 horas
   - Validación anti-replay (4 horas entre escaneos)

### Encriptación

- **En tránsito**: TLS 1.3 (HTTPS)
- **En reposo**: 
  - DynamoDB: Encriptación por defecto
  - S3: AES-256
  - Logs: CloudWatch Logs cifrados

### Validación

```javascript
// Ejemplo de validación de input
const validateOrderInput = (order) => {
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    throw new Error('Order must contain at least one item');
  }
  
  if (!order.locationId || typeof order.locationId !== 'string') {
    throw new Error('Invalid location ID');
  }
  
  // Validar totales
  const calculatedTotal = order.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  if (Math.abs(calculatedTotal - order.subtotal) > 0.01) {
    throw new Error('Order total mismatch');
  }
  
  return true;
};
```

## 📊 Escalabilidad

### DynamoDB

- **On-Demand Pricing**: Escala automáticamente
- **GSI**: Índices para queries eficientes
- **TTL**: Limpieza automática de datos antiguos

### Lambda

- **Concurrencia**: 1000 ejecuciones concurrentes por defecto
- **Reserved Concurrency**: Configurado para endpoints críticos
- **Timeout**: 30 segundos (aumentable si necesario)

### API Gateway

- **Cache**: Habilitado para endpoints de lectura (TTL: 5 minutos)
- **Compression**: Gzip para responses >1KB

## 🔄 CI/CD Pipeline

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   Git    │────>│  GitHub  │────>│   AWS    │────>│   Prod   │
│  Commit  │Push │ Actions  │Build│CodeBuild │Deploy│ Lambda   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                       │
                       ├──> Run Tests
                       ├──> Security Scan
                       ├──> Build
                       └──> Deploy
```

### Stages

1. **Development**: Auto-deploy en cada commit a `develop`
2. **Staging**: Auto-deploy en cada commit a `staging`
3. **Production**: Manual approval requerido

## 📈 Monitoreo y Observabilidad

### CloudWatch Metrics

- **API Gateway**: Latencia, 4xx, 5xx errors
- **Lambda**: Duración, errores, throttles
- **DynamoDB**: Capacidad consumida, throttles

### Alarmas

- Error rate > 5%
- Latencia p99 > 3 segundos
- DynamoDB throttles
- Lambda timeouts

### Logs

```javascript
// Structured logging
const logger = {
  info: (msg, data) => console.log(JSON.stringify({
    level: 'INFO',
    message: msg,
    ...data,
    timestamp: new Date().toISOString()
  })),
  error: (msg, error) => console.error(JSON.stringify({
    level: 'ERROR',
    message: msg,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  }))
};
```

## 💰 Estimación de Costos (10,000 usuarios activos/mes)

| Servicio | Uso Mensual | Costo Estimado |
|----------|-------------|----------------|
| API Gateway | 500K requests | $35 |
| Lambda | 300K invocations, 512MB | $20 |
| DynamoDB | 2M reads, 500K writes | $25 |
| S3 | 10GB storage, 100K requests | $5 |
| Cognito | 10K MAU | $0 (free tier) |
| CloudWatch | Logs + Metrics | $10 |
| **Total** | | **~$95/mes** |

## 🚀 Optimizaciones de Performance

1. **Caching**
   - API Gateway cache para menú y ubicaciones
   - AsyncStorage en app para datos frecuentes
   - Redis/ElastiCache para sessions (futuro)

2. **Lazy Loading**
   - Imágenes cargadas on-demand
   - Infinite scroll en listas largas
   - Code splitting en web dashboard

3. **Database**
   - Índices optimizados en DynamoDB
   - Batch operations cuando sea posible
   - Connection pooling

---

**Arquitectura diseñada para escalar de 1K a 100K+ usuarios**
