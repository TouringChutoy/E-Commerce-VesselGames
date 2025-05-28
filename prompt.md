# Tienda Online (MyShop)
Necesito crear una aplicación web con HTML, CSS y JavaScript Vanilla (sin frameworks, librerías externas ni npm), usando Supabase como backend.

La aplicación debe permitir a los usuarios registrados explorar productos, agregarlos al carrito, gestionar compras y ver su historial de pedidos.

- Requisitos Funcionales:
1. Base de Datos y Autenticación
Modelo relacional de la base de datos (con código SQL para Supabase).

- Registro e inicio de sesión con:

- Correo y contraseña.

- Al registrarse, se debe crear automáticamente un perfil de usuario en la base de datos.

2. Gestión de Productos y Pedidos
Catálogo de productos (listado, búsqueda y filtrado por categoría, precio, etc.).

- Carrito de compras (agregar, eliminar y ajustar cantidades).

- Checkout seguro (simulación de pago).

- Historial de pedidos (visualización de compras anteriores).

3. Interfaz de Usuario (UI/UX)
Diseño estético y minimalista.

- Filtrado de productos (por disponibilidad, ofertas, etc.).

- Multipágina (Home, Login, Registro, Catálogo, Carrito, Perfil).

- Modularización del código (JS y CSS separados por funcionalidad).

4. Seguridad y Configuración
- Reglas de seguridad de Supabase (Row Level Security - RLS).

- Protección de rutas (solo usuarios autenticados pueden comprar).

- Instrucciones detalladas para desplegar en producción.

## Pasos para Implementación:
- Configurar Supabase (crear proyecto, tablas y políticas RLS).

- Desarrollar frontend (HTML, CSS y JS modularizado).

- Integrar autenticación (Email/password).

- Conectar catálogo y carrito con la base de datos.

- Implementar checkout (flujo de compra simulado en Stripe).

- Desplegar (GitHub Pages).
