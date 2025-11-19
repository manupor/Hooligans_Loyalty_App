const AWS = require('aws-sdk');
const crypto = require('crypto');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE;
const TRANSACTIONS_TABLE = process.env.TRANSACTIONS_TABLE;

/**
 * Procesa el escaneo de un código QR y asigna puntos al usuario
 * 
 * @param {Object} event - Evento de API Gateway
 * @returns {Object} Respuesta con los puntos ganados
 */
exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { qrData, locationId } = body;
    const userId = event.requestContext.authorizer.userId;

    // Validar el código QR
    const qrValidation = validateQRCode(qrData);
    if (!qrValidation.valid) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({
          error: 'Código QR inválido o expirado',
          message: qrValidation.message,
        }),
      };
    }

    // Verificar que no se haya escaneado recientemente (evitar duplicados)
    const recentScan = await checkRecentScan(userId, locationId);
    if (recentScan) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({
          error: 'Ya has escaneado un código QR en esta ubicación recientemente',
          message: 'Debes esperar al menos 4 horas entre escaneos en la misma sede',
        }),
      };
    }

    // Calcular puntos a otorgar (5 puntos base + bonificaciones)
    const pointsToAward = calculatePoints(userId, locationId);

    // Actualizar puntos del usuario
    await updateUserPoints(userId, pointsToAward);

    // Registrar la transacción
    const transaction = await createTransaction({
      userId,
      locationId,
      points: pointsToAward,
      type: 'EARNED',
      description: `Visita a ${qrValidation.locationName}`,
      metadata: {
        qrCode: qrData,
        scanTime: new Date().toISOString(),
      },
    });

    // Verificar si el usuario subió de nivel
    const membershipUpdate = await checkMembershipLevel(userId);

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: true,
        pointsEarned: pointsToAward,
        transaction: transaction,
        membershipUpdate: membershipUpdate,
        message: `¡Has ganado ${pointsToAward} puntos! 🎉`,
      }),
    };

  } catch (error) {
    console.error('Error processing QR scan:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: 'Error al procesar el código QR',
        message: error.message,
      }),
    };
  }
};

/**
 * Valida el código QR
 */
function validateQRCode(qrData) {
  try {
    const data = JSON.parse(qrData);
    
    // Verificar campos requeridos
    if (!data.restaurantId || !data.tableId || !data.timestamp || !data.signature) {
      return {
        valid: false,
        message: 'Código QR con formato inválido',
      };
    }

    // Verificar expiración (QR válido por 24 horas)
    const qrTimestamp = new Date(data.timestamp).getTime();
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas en millisegundos

    if (now - qrTimestamp > maxAge) {
      return {
        valid: false,
        message: 'Código QR expirado',
      };
    }

    // Verificar firma (seguridad adicional)
    const expectedSignature = crypto
      .createHmac('sha256', process.env.QR_SECRET || 'default-secret')
      .update(`${data.restaurantId}-${data.tableId}-${data.timestamp}`)
      .digest('hex');

    if (data.signature !== expectedSignature) {
      return {
        valid: false,
        message: 'Código QR con firma inválida',
      };
    }

    return {
      valid: true,
      locationName: data.locationName || 'Hooligans',
      restaurantId: data.restaurantId,
    };

  } catch (error) {
    return {
      valid: false,
      message: 'Error al validar código QR',
    };
  }
}

/**
 * Verifica si el usuario ha escaneado recientemente en esta ubicación
 */
async function checkRecentScan(userId, locationId) {
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();

  const params = {
    TableName: TRANSACTIONS_TABLE,
    IndexName: 'userId-timestamp-index',
    KeyConditionExpression: 'userId = :userId AND #timestamp > :minTime',
    FilterExpression: 'locationId = :locationId AND #type = :type',
    ExpressionAttributeNames: {
      '#timestamp': 'timestamp',
      '#type': 'type',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':minTime': fourHoursAgo,
      ':locationId': locationId,
      ':type': 'EARNED',
    },
  };

  const result = await dynamodb.query(params).promise();
  return result.Items && result.Items.length > 0;
}

/**
 * Calcula los puntos a otorgar
 */
function calculatePoints(userId, locationId) {
  let basePoints = 5;
  
  // Aquí se pueden agregar bonificaciones:
  // - Visitas frecuentes
  // - Horarios específicos (happy hour)
  // - Días especiales
  // - Cumpleaños del usuario
  
  return basePoints;
}

/**
 * Actualiza los puntos del usuario
 */
async function updateUserPoints(userId, points) {
  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression: 'ADD points :points SET lastVisit = :now',
    ExpressionAttributeValues: {
      ':points': points,
      ':now': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamodb.update(params).promise();
  return result.Attributes;
}

/**
 * Crea un registro de transacción
 */
async function createTransaction(data) {
  const transaction = {
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: data.userId,
    locationId: data.locationId,
    type: data.type,
    points: data.points,
    description: data.description,
    metadata: data.metadata,
    timestamp: new Date().toISOString(),
  };

  const params = {
    TableName: TRANSACTIONS_TABLE,
    Item: transaction,
  };

  await dynamodb.put(params).promise();
  return transaction;
}

/**
 * Verifica y actualiza el nivel de membresía del usuario
 */
async function checkMembershipLevel(userId) {
  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
  };

  const result = await dynamodb.get(params).promise();
  const user = result.Item;

  if (!user) return null;

  const currentLevel = user.membershipLevel || 'BRONZE';
  let newLevel = currentLevel;

  // Determinar nuevo nivel basado en puntos
  if (user.points >= 300) {
    newLevel = 'GOLD';
  } else if (user.points >= 100) {
    newLevel = 'SILVER';
  } else {
    newLevel = 'BRONZE';
  }

  // Si cambió el nivel, actualizar
  if (newLevel !== currentLevel) {
    await dynamodb.update({
      TableName: USERS_TABLE,
      Key: { userId },
      UpdateExpression: 'SET membershipLevel = :level',
      ExpressionAttributeValues: {
        ':level': newLevel,
      },
    }).promise();

    return {
      leveledUp: true,
      oldLevel: currentLevel,
      newLevel: newLevel,
      message: `¡Felicidades! Has ascendido a ${newLevel}`,
    };
  }

  return { leveledUp: false };
}

/**
 * Headers CORS
 */
function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  };
}
