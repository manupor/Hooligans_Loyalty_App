# 📱 Instrucciones para Demo Móvil - Hooligans Loyalty App

## ✅ Cambios Realizados

He creado **DOS versiones** de tu demo:

### 1. **Versión con Mockup de Teléfono** (Recomendada para presentaciones)
- Archivo: `demo.html`
- Muestra la app dentro de un iPhone mockup realista
- Incluye notch, cámara, y home indicator
- Fondo con gradiente profesional
- Panel de información lateral

### 2. **Versión Móvil Directa**
- Archivo: `index.html` (actualizado)
- Forzado a 375px de ancho (tamaño iPhone)
- Vista móvil siempre, incluso en desktop
- Sin mockup, solo la app

---

## 🚀 Cómo Actualizar en Netlify

### Opción A: Netlify Drop (Más Fácil)

1. **Elimina el sitio anterior** (opcional):
   - Ve a tu sitio en Netlify
   - Settings → Delete site

2. **Sube la nueva versión**:
   - Ve a https://app.netlify.com/drop
   - Arrastra la carpeta `dist` actualizada
   - ¡Listo!

### Opción B: Actualizar el sitio existente

1. Ve a tu sitio en Netlify
2. Deploys → Drag and drop
3. Arrastra la carpeta `dist` actualizada

---

## 🎯 URLs que tendrás

Después de subir, tendrás:

### URL Principal (con mockup):
```
https://tu-sitio.netlify.app/demo.html
```
👆 **Usa esta para presentaciones** - Se ve como un teléfono real

### URL Alternativa (solo app):
```
https://tu-sitio.netlify.app/
```
👆 Usa esta si prefieres ver solo la app sin mockup

---

## 📱 Características del Mockup

### Vista Desktop:
- ✅ iPhone mockup realista con notch
- ✅ Fondo con gradiente profesional
- ✅ Panel de características a la derecha
- ✅ Animaciones suaves
- ✅ Sombras y efectos 3D

### Vista Móvil:
- ✅ Se adapta automáticamente
- ✅ Ocupa toda la pantalla
- ✅ Sin mockup (para mejor UX en móvil real)

---

## 🎨 Personalización

Si quieres cambiar colores o textos del mockup, edita:
```
/Users/manu/CascadeProjects/hooligans-loyalty-app/app/mobile-wrapper.html
```

Luego copia a dist:
```bash
cp mobile-wrapper.html dist/demo.html
```

---

## 💡 Tips para la Presentación

### En Desktop:
1. Abre: `https://tu-sitio.netlify.app/demo.html`
2. Pantalla completa (F11)
3. ¡Presenta!

### En Móvil:
1. Abre: `https://tu-sitio.netlify.app/`
2. Comparte la pantalla
3. ¡Presenta!

### En Proyector:
1. Usa la versión con mockup (`/demo.html`)
2. Se verá como un teléfono real gigante
3. Muy impactante visualmente

---

## 🔧 Solución de Problemas

### La app se ve muy grande en desktop
✅ **Solución:** Usa `/demo.html` en lugar de `/index.html`

### El mockup no se ve en móvil
✅ **Normal:** El mockup se oculta automáticamente en pantallas pequeñas

### Quiero cambiar el tamaño del teléfono
Edita `mobile-wrapper.html`, línea ~50:
```css
.phone-mockup {
    width: 375px;  /* Cambia este valor */
    height: 812px; /* Y este también */
}
```

---

## 📊 Comparación de Versiones

| Característica | demo.html | index.html |
|----------------|-----------|------------|
| **Mockup de iPhone** | ✅ Sí | ❌ No |
| **Vista móvil forzada** | ✅ Sí | ✅ Sí |
| **Mejor para presentaciones** | ✅ Sí | ⚠️ Depende |
| **Mejor para móvil real** | ❌ No | ✅ Sí |
| **Panel de info** | ✅ Sí | ❌ No |

---

## 🎉 Siguiente Paso

1. **Sube la carpeta `dist` actualizada a Netlify**
2. **Prueba ambas URLs:**
   - `/demo.html` (con mockup)
   - `/` (sin mockup)
3. **Elige cuál compartir con el cliente**

---

## 📧 Mensaje para el Cliente

```
Hola [Cliente],

Te comparto el demo de la app Hooligans Loyalty:

🔗 Demo con mockup (recomendado para desktop):
https://tu-sitio.netlify.app/demo.html

🔗 Demo directo (recomendado para móvil):
https://tu-sitio.netlify.app/

La app incluye:
✅ Tour guiado interactivo
✅ Sistema de puntos y recompensas
✅ Escaneo QR
✅ Menú digital
✅ Localizador de sedes
✅ Niveles VIP

¡Cualquier duda, avísame!
```

---

## ✨ Resultado Final

Tu demo ahora se verá:
- 📱 Como un iPhone real en desktop
- 🎨 Profesional y moderno
- 📏 Siempre en vista móvil (375px)
- 🚀 Listo para impresionar al cliente

**¡Sube la carpeta `dist` a Netlify y tendrás un demo increíble!** 🎉
