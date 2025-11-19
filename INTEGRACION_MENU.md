# 📄 Integración del Menú PDF - Hooligans

## 📋 Cómo Agregar el Menú desde tu PDF

Tienes un PDF con el menú completo de Hooligans. Aquí te explicamos cómo integrarlo en la aplicación.

## Opción 1: Convertir PDF a Datos Estructurados (Recomendado)

### Paso 1: Extraer Información del PDF

Lee tu PDF y extrae la información de cada producto. Necesitas:
- Nombre del producto
- Descripción
- Precio (en colones CRC)
- Categoría
- Si tiene opciones (variantes, tamaños, etc.)
- Alergenos o notas especiales

### Paso 2: Crear Estructura de Datos

Edita el archivo `/app/src/config/menu.js` (créalo si no existe):

```javascript
export const MENU_DATA = [
  // ALITAS
  {
    id: 1,
    name: 'Alitas BBQ',
    description: '10 alitas con salsa BBQ casera, acompañadas de papas fritas y aderezo ranch',
    price: 8500,
    category: 'Alitas',
    image: 'https://tu-servidor.com/images/alitas-bbq.jpg', // o emoji: '🍗'
    available: true,
    popular: true,
    spicy: false,
    options: [
      {
        id: 'size',
        name: 'Tamaño',
        required: true,
        choices: [
          { id: '10', name: '10 Alitas', price: 8500 },
          { id: '15', name: '15 Alitas', price: 12000 },
          { id: '20', name: '20 Alitas', price: 15000 }
        ]
      },
      {
        id: 'sauce',
        name: 'Salsa Extra',
        required: false,
        multiple: true,
        choices: [
          { id: 'bbq', name: 'BBQ', price: 500 },
          { id: 'buffalo', name: 'Buffalo', price: 500 },
          { id: 'ranch', name: 'Ranch', price: 500 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Alitas Buffalo',
    description: '10 alitas picantes con salsa buffalo tradicional',
    price: 8500,
    category: 'Alitas',
    image: '🔥',
    available: true,
    popular: true,
    spicy: true,
    spicyLevel: 3, // 1-5
  },
  
  // HAMBURGUESAS
  {
    id: 10,
    name: 'Cheese Burger',
    description: 'Hamburguesa de carne 100% res con queso cheddar, lechuga, tomate, cebolla y salsa especial',
    price: 6500,
    category: 'Hamburguesas',
    image: '🍔',
    available: true,
    popular: true,
    options: [
      {
        id: 'protein',
        name: 'Proteína',
        required: true,
        choices: [
          { id: 'beef', name: 'Res', price: 0 },
          { id: 'chicken', name: 'Pollo', price: 0 },
          { id: 'veggie', name: 'Vegetariana', price: 500 }
        ]
      },
      {
        id: 'extras',
        name: 'Extras',
        required: false,
        multiple: true,
        choices: [
          { id: 'bacon', name: 'Tocino', price: 1000 },
          { id: 'cheese', name: 'Queso Extra', price: 500 },
          { id: 'egg', name: 'Huevo', price: 500 }
        ]
      }
    ]
  },
  
  // BEBIDAS
  {
    id: 20,
    name: 'Cerveza Imperial',
    description: 'Cerveza nacional 355ml',
    price: 2500,
    category: 'Bebidas',
    image: '🍺',
    available: true,
    alcoholic: true,
  },
  
  // ENTRADAS
  {
    id: 30,
    name: 'Papas con Queso',
    description: 'Papas fritas crujientes cubiertas con queso cheddar fundido',
    price: 4500,
    category: 'Entradas',
    image: '🍟',
    available: true,
  },
  
  // ENSALADAS
  {
    id: 40,
    name: 'Ensalada César',
    description: 'Lechuga romana, crutones, queso parmesano y aderezo césar',
    price: 5500,
    category: 'Ensaladas',
    image: '🥗',
    available: true,
    vegetarian: true,
  },
];

export const MENU_CATEGORIES = [
  { id: 1, name: 'Alitas', icon: '🍗', order: 1 },
  { id: 2, name: 'Hamburguesas', icon: '🍔', order: 2 },
  { id: 3, name: 'Entradas', icon: '🍟', order: 3 },
  { id: 4, name: 'Ensaladas', icon: '🥗', order: 4 },
  { id: 5, name: 'Bebidas', icon: '🍺', order: 5 },
  { id: 6, name: 'Postres', icon: '🍰', order: 6 },
];
```

### Paso 3: Actualizar MenuScreen

Edita `/app/src/screens/MenuScreen.js` para importar los datos:

```javascript
import { MENU_DATA, MENU_CATEGORIES } from '../config/menu';

// En lugar de usar MENU_ITEMS hardcodeado, usa MENU_DATA
const MenuScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  const filteredItems = MENU_DATA.filter(item => {
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesCategory && item.available;
  });
  
  // ... resto del código
};
```

## Opción 2: Mostrar PDF Directamente (Más Simple)

Si prefieres mostrar el PDF tal cual está:

### Paso 1: Agregar el PDF al Proyecto

Copia tu PDF a `/app/assets/menu.pdf`

### Paso 2: Instalar Visor de PDF

```bash
cd /app
npm install react-native-pdf
```

### Paso 3: Crear Pantalla de Menú PDF

Crea `/app/src/screens/MenuPDFScreen.js`:

```javascript
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';

const MenuPDFScreen = () => {
  const source = require('../assets/menu.pdf');

  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Menú cargado: ${numberOfPages} páginas`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Página actual: ${page}/${numberOfPages}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MenuPDFScreen;
```

## Opción 3: Menú desde Backend (Más Escalable)

### Beneficios
- ✅ Actualizar menú sin actualizar la app
- ✅ Menú diferente por sede
- ✅ Control de inventario en tiempo real
- ✅ Promociones dinámicas

### Implementación

1. **Backend (AWS Lambda)**

Crea una función Lambda que retorne el menú:

```javascript
// backend/functions/menu/getMenu.js
exports.handler = async (event) => {
  const locationId = event.queryStringParameters?.locationId;
  
  // Obtener menú de DynamoDB
  const menu = await getMenuFromDB(locationId);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      menu: menu,
      lastUpdated: new Date().toISOString()
    })
  };
};
```

2. **Frontend (App)**

Actualiza el MenuScreen para cargar desde API:

```javascript
import { menuAPI } from '../services/api';

const MenuScreen = ({ navigation }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedLocation = useStore(state => state.selectedLocation);

  useEffect(() => {
    loadMenu();
  }, [selectedLocation]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await menuAPI.getMenu(selectedLocation?.id);
      setMenu(data.menu);
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... resto del código
};
```

## 📸 Agregar Fotos de Productos

### Opción A: URLs Externas

```javascript
{
  id: 1,
  name: 'Alitas BBQ',
  image: 'https://tu-servidor.com/images/alitas-bbq.jpg',
}
```

### Opción B: Imágenes Locales

1. Copia las imágenes a `/app/assets/menu/`
2. Usa en tu código:

```javascript
{
  id: 1,
  name: 'Alitas BBQ',
  image: require('../assets/menu/alitas-bbq.jpg'),
}
```

### Opción C: S3 de AWS

1. Sube imágenes a S3 bucket
2. Usa URLs de CloudFront para mejor performance

```javascript
{
  id: 1,
  name: 'Alitas BBQ',
  image: 'https://d123abc.cloudfront.net/menu/alitas-bbq.jpg',
}
```

## 🏷️ Sistema de Precios

### Estructura Recomendada

```javascript
{
  id: 1,
  name: 'Producto',
  basePrice: 5000,        // Precio base
  
  // Precios por variante
  variants: [
    { id: 'small', name: 'Pequeño', price: 5000 },
    { id: 'medium', name: 'Mediano', price: 7000 },
    { id: 'large', name: 'Grande', price: 9000 }
  ],
  
  // Precio con descuento
  originalPrice: 5000,
  discountedPrice: 4000,
  discountPercentage: 20,
  
  // Precio especial para miembros
  memberPrices: {
    'BRONZE': 4750,  // 5% off
    'SILVER': 4500,  // 10% off
    'GOLD': 4250     // 15% off
  }
}
```

## 📱 Features Adicionales del Menú

### Búsqueda

```javascript
const [searchQuery, setSearchQuery] = useState('');

const filteredItems = MENU_DATA.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.description.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesSearch;
});
```

### Favoritos

```javascript
const { favorites, toggleFavorite } = useStore();

const handleToggleFavorite = (itemId) => {
  toggleFavorite(itemId);
};

// En el componente
{favorites.includes(item.id) && <Text>❤️</Text>}
```

### Ordenar por

```javascript
const sortOptions = {
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  'name-desc': (a, b) => b.name.localeCompare(a.name),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'popular': (a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0),
};

const sortedItems = [...filteredItems].sort(sortOptions[sortBy]);
```

## 🎯 Recomendaciones

1. **Empieza simple**: Usa la Opción 1 con emojis temporalmente
2. **Agrega fotos**: Una vez que tengas fotos profesionales, úsalas
3. **Migra a backend**: Cuando necesites actualizar frecuentemente
4. **Mantén consistencia**: Usa la misma estructura de datos siempre

## 📤 Enviar tu PDF para Integración

Si necesitas ayuda, envía tu PDF y te ayudamos a convertirlo en datos estructurados.

**Contacto**: dev@hooligans.com

---

**¡Listo para agregar tu menú completo a la app! 🍔🍗**
