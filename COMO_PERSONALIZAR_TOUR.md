# 🎨 Cómo Personalizar el Tour Guiado

## 📍 Ubicación de Archivos

### Archivos Principales del Tour:
```
app/
├── src/
│   ├── components/
│   │   ├── TourGuide.js          # Componente visual del tour
│   │   └── TourButton.js         # Botón flotante para iniciar tour
│   ├── config/
│   │   └── tourSteps.js          # Contenido de todos los pasos
│   ├── screens/
│   │   └── TourWelcomeScreen.js  # Pantalla de bienvenida
│   ├── store/
│   │   └── useStore.js           # Estado del tour (líneas 195-222)
│   └── navigation/
│       └── AppNavigator.js       # Configuración de navegación
```

---

## 🔧 Personalizaciones Comunes

### 1. Cambiar el Texto de los Pasos del Tour

**Archivo:** `app/src/config/tourSteps.js`

```javascript
export const tourSteps = {
  home: [
    {
      title: 'Tu Título Aquí',                    // ← Cambia esto
      description: 'Tu descripción aquí',         // ← Cambia esto
      icon: <Home size={40} color="#FF8533" />,   // ← Cambia el icono
      highlights: [                               // ← Cambia los puntos
        'Punto 1',
        'Punto 2',
        'Punto 3'
      ],
      position: { top: height * 0.15, left: 20 }, // ← Ajusta posición
    },
    // ... más pasos
  ],
};
```

**Ejemplo de Cambio:**
```javascript
{
  title: '¡Bienvenido a Hooligans!',  // Antes: '¡Bienvenido a tu Inicio!'
  description: 'Aquí comienza tu experiencia de lealtad.',
  highlights: [
    'Gana puntos con cada visita',
    'Canjea recompensas exclusivas',
    'Accede a promociones especiales'
  ],
}
```

---

### 2. Agregar Más Pasos al Tour

**Archivo:** `app/src/config/tourSteps.js`

```javascript
home: [
  // ... pasos existentes
  {
    title: 'Nuevo Paso',
    description: 'Descripción del nuevo paso',
    icon: <Star size={40} color="#FF8533" />,
    highlights: ['Punto 1', 'Punto 2'],
    position: { top: height * 0.7, left: 20 },
  },
],
```

---

### 3. Cambiar la Posición de los Tooltips

**Archivo:** `app/src/config/tourSteps.js`

La posición se define con coordenadas `top` y `left`:

```javascript
position: { 
  top: height * 0.15,  // 15% desde arriba
  left: 20             // 20 píxeles desde la izquierda
}
```

**Posiciones Comunes:**
```javascript
// Arriba
{ top: height * 0.1, left: 20 }

// Centro
{ top: height * 0.5, left: 20 }

// Abajo
{ top: height * 0.8, left: 20 }

// Centrado horizontalmente
{ top: height * 0.3, left: (width - 300) / 2 }
```

---

### 4. Cambiar Colores del Tour

**Archivo:** `app/src/components/TourGuide.js`

```javascript
// Color del botón "Siguiente"
nextButton: {
  backgroundColor: '#FF8533',  // ← Cambia este color
  borderColor: '#FF8533',
}

// Color del indicador de paso
stepIndicator: {
  backgroundColor: '#FFF5F0',  // ← Fondo del indicador
}

// Color del punto activo
activeDot: {
  backgroundColor: '#FF8533',  // ← Color del punto activo
}
```

---

### 5. Deshabilitar el Tour Automático

**Archivo:** `app/src/navigation/AppNavigator.js`

```javascript
// Cambiar de:
initialRouteName="TourWelcome"

// A:
initialRouteName="MainTabs"
```

Esto hará que la app inicie directamente en la pantalla principal, sin mostrar el tour.

---

### 6. Cambiar el Texto de la Pantalla de Bienvenida

**Archivo:** `app/src/screens/TourWelcomeScreen.js`

```javascript
<Text style={styles.welcomeTitle}>
  ¡Bienvenido a Hooligans!  {/* ← Cambia esto */}
</Text>

<Text style={styles.welcomeSubtitle}>
  Tu programa de lealtad favorito  {/* ← Cambia esto */}
</Text>
```

**Lista de Características:**
```javascript
const features = [
  {
    icon: <Gift size={32} color="#FF8533" />,
    title: 'Sistema de Puntos',           // ← Cambia
    description: 'Acumula puntos...'      // ← Cambia
  },
  // ... más características
];
```

---

### 7. Cambiar el Logo en la Bienvenida

**Archivo:** `app/src/screens/TourWelcomeScreen.js`

```javascript
<Image
  source={require('../../assets/logo-hooligans.png')}  // ← Cambia la ruta
  style={styles.logo}
  resizeMode="contain"
/>
```

Reemplaza `logo-hooligans.png` con tu propio logo en la carpeta `assets/`.

---

### 8. Agregar Tour a Nuevas Pantallas

**Paso 1:** Agrega los pasos en `tourSteps.js`
```javascript
export const tourSteps = {
  // ... otros tours
  miNuevaPantalla: [
    {
      title: 'Paso 1',
      description: 'Descripción',
      icon: <Star size={40} color="#FF8533" />,
      highlights: ['Punto 1'],
      position: { top: height * 0.2, left: 20 },
    },
  ],
};
```

**Paso 2:** Importa y usa en tu pantalla
```javascript
import TourGuide from '../components/TourGuide';
import TourButton from '../components/TourButton';
import { getTourSteps } from '../config/tourSteps';
import useStore from '../store/useStore';

const MiNuevaPantalla = () => {
  const { 
    isTourActive,
    tourCurrentStep,
    tourScreen,
    nextTourStep,
    previousTourStep,
    endTour
  } = useStore();
  
  const tourSteps = getTourSteps('miNuevaPantalla');
  const showTour = isTourActive && tourScreen === 'miNuevaPantalla';
  
  const handleTourNext = () => {
    if (tourCurrentStep < tourSteps.length - 1) {
      nextTourStep();
    } else {
      endTour();
    }
  };

  return (
    <View>
      <TourGuide
        visible={showTour}
        onClose={endTour}
        steps={tourSteps}
        currentStep={tourCurrentStep}
        onNext={handleTourNext}
        onPrevious={previousTourStep}
        onFinish={endTour}
      />
      
      {/* Tu contenido aquí */}
      
      <TourButton screenName="miNuevaPantalla" />
    </View>
  );
};
```

---

### 9. Cambiar Iconos del Tour

**Iconos Disponibles de Lucide:**
```javascript
import { 
  Home, Gift, QrCode, MapPin, User,
  ShoppingBag, Star, CreditCard, Bell,
  TrendingUp, Heart, Award, Zap,
  Target, Trophy, Sparkles
} from 'lucide-react-native';
```

**Uso:**
```javascript
icon: <Trophy size={40} color="#FF8533" />
```

---

### 10. Personalizar Duración y Animaciones

**Archivo:** `app/src/components/TourGuide.js`

```javascript
// Cambiar velocidad de animación
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,  // ← Cambia esto (milisegundos)
  useNativeDriver: true,
}).start();
```

---

### 11. Ocultar el Botón Flotante

**En cualquier pantalla:**
```javascript
// Simplemente no incluyas:
<TourButton screenName="home" />
```

O personaliza su posición en `TourButton.js`:
```javascript
button: {
  position: 'absolute',
  bottom: 100,  // ← Cambia la posición vertical
  right: 20,    // ← Cambia la posición horizontal
  // ...
}
```

---

### 12. Cambiar Textos de Botones

**Archivo:** `app/src/components/TourGuide.js`

```javascript
<Text style={styles.skipButtonText}>
  Saltar Tour  {/* ← Cambia esto */}
</Text>

<Text style={styles.navButtonText}>
  Anterior  {/* ← Cambia esto */}
</Text>

<Text style={styles.nextButtonText}>
  {isLastStep ? 'Finalizar' : 'Siguiente'}  {/* ← Cambia esto */}
</Text>
```

---

## 🎯 Casos de Uso Comunes

### Caso 1: Tour Solo en Primer Lanzamiento

**Archivo:** `App.js`

```javascript
useEffect(() => {
  const checkFirstLaunch = async () => {
    const hasSeenTour = await AsyncStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      // Mostrar tour
      navigation.navigate('TourWelcome');
      await AsyncStorage.setItem('hasSeenTour', 'true');
    }
  };
  checkFirstLaunch();
}, []);
```

---

### Caso 2: Tour Diferente por Tipo de Usuario

**Archivo:** `tourSteps.js`

```javascript
export const getTourSteps = (screenName, userType = 'customer') => {
  if (userType === 'admin') {
    return adminTourSteps[screenName] || [];
  }
  return tourSteps[screenName] || [];
};
```

---

### Caso 3: Tour con Video o GIF

**Archivo:** `TourGuide.js`

```javascript
{step.video && (
  <Video
    source={{ uri: step.video }}
    style={styles.video}
    shouldPlay
    isLooping
  />
)}
```

---

## 📱 Testing del Tour

### En Desarrollo:
```bash
# Reiniciar la app
Presiona 'R' en la terminal

# Limpiar caché
Presiona 'Shift + R' en la terminal
```

### Probar en Diferentes Dispositivos:
- iPhone SE (pantalla pequeña)
- iPhone 14 Pro (pantalla grande)
- iPad (tablet)
- Android (diferentes tamaños)

---

## 🐛 Debugging

### Ver logs del tour:
```javascript
// En cualquier función del tour
console.log('Tour step:', tourCurrentStep);
console.log('Tour screen:', tourScreen);
console.log('Tour active:', isTourActive);
```

### Resetear el tour:
```javascript
// En la consola del navegador
localStorage.clear();
```

---

## 📚 Recursos Adicionales

### Documentación de Componentes:
- **Lucide Icons**: https://lucide.dev/icons/
- **React Native Animated**: https://reactnative.dev/docs/animated
- **Zustand**: https://github.com/pmndrs/zustand

### Inspiración de Tours:
- Duolingo
- Airbnb
- Uber
- Instagram

---

## ✅ Checklist de Personalización

- [ ] Textos de pasos actualizados
- [ ] Posiciones de tooltips ajustadas
- [ ] Colores personalizados
- [ ] Logo cambiado (si aplica)
- [ ] Iconos seleccionados
- [ ] Tour probado en diferentes pantallas
- [ ] Botón flotante posicionado
- [ ] Animaciones ajustadas
- [ ] Textos de botones actualizados
- [ ] Tour probado en dispositivos reales

---

**¡Listo para personalizar! 🎨**
