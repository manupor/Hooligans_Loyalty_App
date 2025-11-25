# 📝 Guía de Uso - Campos del Formulario de Registro

## ✅ Todos los campos están listos y funcionales

### 🔤 **Campos de Texto (TextInput)**

#### 1. **Nombre Completo** *
- ✏️ Campo editable
- 💡 Ejemplo: "Juan Pérez"
- ⚠️ **Campo obligatorio**

#### 2. **Correo Electrónico** *
- ✏️ Campo editable
- 💡 Ejemplo: "tu@email.com"
- ⌨️ Teclado: email
- ⚠️ **Campo obligatorio**

#### 3. **Teléfono (WhatsApp)**
- ✏️ Campo editable
- 💡 Ejemplo: "+506 8888-8888"
- ⌨️ Teclado: numérico

#### 4. **Fecha de Cumpleaños** ✨ NUEVO
- ✏️ Campo editable
- 💡 Formato: "DD/MM/AAAA"
- 💡 Ejemplo: "15/03/1990"
- ⌨️ Teclado: números y puntuación

#### 5. **Cantón donde resides** ✨ NUEVO
- ✏️ Campo editable
- 💡 Ejemplo: "San José", "Escazú", "Heredia"
- ⌨️ Primera letra en mayúscula automática

#### 6. **Contraseña** *
- ✏️ Campo editable
- 💡 Mínimo 8 caracteres
- 🔒 Texto oculto (••••••••)
- ⚠️ **Campo obligatorio**

#### 7. **Confirmar Contraseña** *
- ✏️ Campo editable
- 💡 Debe coincidir con la contraseña
- 🔒 Texto oculto (••••••••)
- ⚠️ **Campo obligatorio**

---

### 🎯 **Campos de Selección (TouchableOpacity)**

#### 8. **¿Cada cuánto nos visitas?** ✨ NUEVO
**Tipo:** Selector de opciones (solo una opción)

📌 **Opciones disponibles:**
- **Primera Vez** → Para clientes nuevos
- **1 vez al mes** → Visitante ocasional
- **1 vez a la semana** → Cliente frecuente

**Cómo usar:**
1. Haz clic en cualquiera de los 3 chips
2. El chip seleccionado se pone **naranja** 🟠
3. Solo puedes seleccionar una opción a la vez
4. Click de nuevo para cambiar de opción

---

#### 9. **¿Deseas recibir información de promociones?** ✨ NUEVO
**Tipo:** Toggle SÍ/NO

**Estado por defecto:** SÍ ✅

**Cómo usar:**
1. Haz clic en el botón SÍ/NO
2. **SÍ** → Botón naranja 🟠 con texto blanco
3. **NO** → Botón blanco con texto gris
4. Alterna entre SÍ y NO con cada click

---

#### 10. **Promos de tu interés** ✨ NUEVO
**Tipo:** Multi-selección (puedes elegir varios)

📌 **Opciones disponibles:**
- 🍔 **Comida** → Promociones de alitas, burgers, etc.
- 🍹 **Cocteles** → Ofertas en bebidas preparadas
- 🍺 **Cervezas** → Descuentos en cervezas

**Cómo usar:**
1. Haz clic en cualquier chip (comida, cocteles, cervezas)
2. Puedes seleccionar **1, 2, 3 o ninguno**
3. Los chips seleccionados se ponen **naranja claro** 🟠
4. Click de nuevo para deseleccionar

---

#### 11. **Acepto los Términos y Condiciones** *
**Tipo:** Checkbox

**Cómo usar:**
1. Haz clic en el cuadrito ☐
2. Cuando está seleccionado muestra: ☑ (naranja con checkmark blanco)
3. ⚠️ **Debes aceptar para crear la cuenta**
4. El botón de registro estará **deshabilitado** hasta que aceptes

---

### 🚀 **Botón de Registro**

**Estado Normal:**
- 🟠 Naranja con gradiente
- ✅ Habilitado cuando aceptas términos

**Estado Deshabilitado:**
- ⚫ Gris
- ❌ No acepta clicks
- 💡 Aparece cuando NO has aceptado términos

**Estado Cargando:**
- 🔄 Muestra: "Creando cuenta..."
- ⏳ Mientras se registra en Firebase

---

## 🎨 Guía Visual de Colores

### Estados de los Campos:

| Estado | Color | Descripción |
|--------|-------|-------------|
| **Normal** | Blanco con borde gris claro | Campo sin seleccionar |
| **Activo/Seleccionado** | Naranja (#f56833) | Opción seleccionada |
| **Hover/Focus** | Borde naranja | Al hacer click en un campo |
| **Deshabilitado** | Gris (#A8A8A8) | No se puede usar |

---

## 📱 Cómo Probar los Campos

### **Paso 1: Ir a Registro**
1. Abre la app en http://localhost:8081
2. En la pantalla de Login, haz click en **"Crear Cuenta"**

### **Paso 2: Llenar Campos de Texto**
- Click en cada campo
- Escribe con el teclado
- El texto debe aparecer inmediatamente

### **Paso 3: Seleccionar Frecuencia**
- Click en "Primera Vez", "1 vez al mes" o "1 vez a la semana"
- El chip debe cambiar a **naranja**

### **Paso 4: Toggle de Promociones**
- Click en el botón SÍ/NO
- Debe alternar entre los dos estados

### **Paso 5: Seleccionar Intereses**
- Click en 🍔 Comida
- Click en 🍹 Cocteles
- Click en 🍺 Cervezas
- Puedes seleccionar todos, algunos o ninguno

### **Paso 6: Aceptar Términos**
- Click en el checkbox
- Debe aparecer una ✓ (checkmark)
- El botón de registro debe habilitarse

### **Paso 7: Crear Cuenta**
- Click en **"Crear Cuenta"**
- Si todo está correcto, se creará la cuenta en Firebase
- Verás un Alert de confirmación

---

## 🔧 Troubleshooting

### ❓ Los campos no responden
**Solución:**
1. Recarga la app (presiona `r` en la terminal)
2. Asegúrate de estar en la pantalla de **Registro**, no Login
3. Limpia el caché: presiona `shift+r`

### ❓ El botón de registro está gris
**Causa:** No has aceptado los términos
**Solución:** Haz click en el checkbox de términos

### ❓ No veo mis selecciones de intereses
**Causa:** Normal, solo se muestran los seleccionados
**Solución:** Haz click en un chip y debe cambiar a naranja

### ❓ El checkbox no muestra el checkmark
**Causa:** Puede ser un problema de fuente
**Solución:** Ya está arreglado con el símbolo ✓

---

## 🎯 Validaciones Implementadas

### ✅ Campos Obligatorios:
- Nombre
- Email
- Contraseña
- Confirmar Contraseña
- Aceptar Términos

### ✅ Validaciones Automáticas:
- ❌ Las contraseñas deben coincidir
- ❌ Email debe ser válido
- ❌ Contraseña mínimo 8 caracteres
- ✅ Todos los campos opcionales pueden quedar vacíos

---

## 📊 Datos que se Guardan

Cuando creas una cuenta, se guardan:

### En Firebase:
```json
{
  "id": "uid_firebase",
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "phone": "+506 8888-8888",
  "points": 0,
  "membershipLevel": "BRONZE",
  "preferences": {
    "birthday": "15/03/1990",
    "canton": "San José",
    "visitFrequency": "UNA_VEZ_AL_MES",
    "receivePromotions": true,
    "interests": {
      "comida": true,
      "cocteles": false,
      "cervezas": true
    }
  }
}
```

### En App Local (AsyncStorage):
- Datos del usuario
- Preferencias
- Token de autenticación

---

## 🎉 ¡Todos los campos funcionan!

La aplicación está lista para capturar todos los datos de la tarjeta física.

**Prueba cada campo y confirma que:**
- ✅ Los TextInput permiten escribir
- ✅ Los chips de frecuencia cambian de color
- ✅ El toggle SÍ/NO alterna
- ✅ Los chips de intereses se pueden seleccionar múltiples
- ✅ El checkbox muestra el checkmark
- ✅ El botón de registro se habilita/deshabilita

---

**¿Algún problema?** Recarga la app con `r` en la terminal 🔄
