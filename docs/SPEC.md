# 🍯 Miel Mostaza - Especificación Detallada v1.0

> Componentes, funcionalidades, endpoints y diseño UI/UX

---

## 📋 Tabla de Contenidos

1. [Landing Pública](#landing-pública)
2. [Admin Panel](#admin-panel)
3. [Cliente Portal](#cliente-portal)
4. [API Endpoints](#api-endpoints)
5. [Componentes Reutilizables](#componentes-reutilizables)
6. [Flujos de Autenticación](#flujos-de-autenticación)
7. [Diseño & Animaciones](#diseño--animaciones)

---

## 🌐 Landing Pública

### Páginas

#### 1. **Home / Index** (`/`)

**Hero Section**
- Título: "Vamos a cocinar algo grande para tu negocio"
- Subtítulo: "Soluciones digitales hechas a tu medida"
- CTA principal: "Ver nuestros casos" → scroll a portfolio
- CTA secundario: "Contacta con nosotros" → formulario
- Background: Framer Motion con gotas cayendo (mascota de fondo)
- Animaciones: Fade-in, text reveal

**Servicios Section**
- Grid 3 columnas (responsive)
- Cada servicio es un "ingrediente":
  - 🌐 Desarrollo Web (Pan)
  - 📱 Apps (Papas)
  - 🤖 IA (Ají)
  - 📈 Meta Ads (Pimienta)
  - ⚡ Automatizaciones (Limón)
  - 🎨 Branding (Miel)
  - 🎥 Contenido (Especias)
- Card con: nombre, ícono, descripción, enlace "Más info"

**Portfolio Section**
- "Casos que hemos cocinado"
- Grid 2-3 columnas
- Cada proyecto: imagen, nombre cliente, descripción breve, tecnologías usadas
- Hover: overlay con CTA "Ver caso completo"

**Testimonios Section**
- Carousel o grid 3 testimonios
- Card: foto cliente, nombre, empresa, quote, rating (⭐)

**CTA Final Section**
- "Listo para transformar tu negocio?"
- Botón grande: "Empecemos" → contacto

#### 2. **Página de Servicio** (`/servicios/[slug]`)
- Detalle de cada ingrediente
- Qué hacemos, por qué, ejemplos, precios orientativos
- CTA: "Solicitar presupuesto"

#### 3. **Contacto** (`/contacto`)
- Formulario:
  - Nombre, email, teléfono, empresa
  - Servicio de interés (multi-select)
  - Mensaje
  - Validación y envío (email o webhook)
- Info de contacto: email, WhatsApp, ubicación Cali
- Mapa (si aplica)

---

## 🎛️ Admin Panel

### Acceso
- **Ruta**: `/dashboard`
- **Auth**: NextAuth.js - email/password
- **Protección**: Middleware JWT en todas las rutas

### Páginas

#### 1. **Dashboard Principal** (`/dashboard`)

**Header**
- Logo Miel Mostaza
- Usuario conectado + logout
- Notificaciones (si hay entregas pendientes)

**Sidebar**
- Proyectos
- Clientes
- Entregas
- Configuración

**Main Content: Overview**
- Estadísticas:
  - Total de proyectos
  - Proyectos activos (en desarrollo)
  - Proyectos completados este mes
  - Clientes totales
- Tabla: Últimos 5 proyectos (nombre, cliente, estado, fecha entrega)
- Gráfico: Estado de proyectos (pie chart o barras)

#### 2. **Gestión de Proyectos** (`/dashboard/proyectos`)

**Tabla Proyectos**
- Columnas: Nombre, Cliente, Estado, Fecha inicio, Fecha entrega, Acciones
- Estados visualizados con badges:
  - 🟡 Pendiente (amarillo)
  - 🔵 En desarrollo (azul)
  - 🟢 Entregado (verde)
- Búsqueda y filtros por estado
- Botón: "+ Nuevo Proyecto"

**Modal: Crear/Editar Proyecto**
- Campos:
  - Nombre del proyecto
  - Cliente (dropdown)
  - Descripción
  - Servicios (checkboxes: Web, Apps, IA, Meta Ads, etc.)
  - Estado (dropdown)
  - Fecha de inicio
  - Fecha estimada de entrega
  - Notas internas
- Botones: Guardar, Cancelar

**Detalle Proyecto** (`/dashboard/proyectos/[id]`)
- Información general (nombre, cliente, estado)
- Timeline: inicio, hitos, entrega
- Sección Deliverables:
  - Tabla: nombre, tipo, tamaño, fecha, acciones (descargar, eliminar)
  - Botón: "+ Agregar deliverable" (upload archivo)
- Sección Documentación:
  - Tabla: título, categoría, acciones (editar, eliminar)
  - Botón: "+ Agregar documento"
- Sección Acceso Cliente:
  - URL de acceso único: `https://mielmostaza.com/proyecto/[accessToken]`
  - Botón copiar link
  - Opción regenerar token

#### 3. **Gestión de Clientes** (`/dashboard/clientes`)

**Tabla Clientes**
- Columnas: Nombre, Email, Teléfono, Empresa, Proyectos, Acciones
- Búsqueda
- Botón: "+ Nuevo Cliente"

**Modal: Crear/Editar Cliente**
- Campos:
  - Nombre
  - Email
  - Teléfono
  - Empresa
  - Logo (upload)
  - Notas

**Detalle Cliente** (`/dashboard/clientes/[id]`)
- Información general
- Lista de proyectos asociados (tabla)
- Historial de entregas

#### 4. **Entregas** (`/dashboard/entregas`)
- Vista consolidada de todos los deliverables
- Filtros: por proyecto, por estado, por fecha
- Permite download masivo o individual

#### 5. **Configuración** (`/dashboard/settings`)
- Datos de la empresa (Miel Mostaza)
- Variables de marca (colores, tipografía)
- Integraciones (Cloudinary, etc.)
- Usuarios (crear nuevos admins si aplica)

---

## 👤 Cliente Portal

### Acceso
- **Ruta**: `/proyecto/[accessToken]`
- **Auth**: Token único (sin contraseña)
- **Protección**: Validar token en backend

### Página Única

**Header Minimalista**
- Logo Miel Mostaza
- Texto: "Proyecto finalizado: [Nombre Proyecto]"
- Botón de contacto (WhatsApp)

**Contenido Principal (scroll vertical)**

#### 1. **Resumen Ejecutivo**
- Box destacado:
  - "Tu proyecto está listo ✓"
  - Nombre cliente
  - Servicios entregados
  - Fecha de entrega
  - Descripción breve

#### 2. **Entregables**
- Sección por cada tipo:
  - 🌐 **Página Web**
    - URL viva (clickeable)
    - Credenciales de acceso (si aplica)
    - Screenshots/preview
  
  - 🎬 **Videos Meta Ads**
    - Thumbnail
    - Botón descargar (MP4)
    - Especificaciones (duración, resolución)
  
  - 📄 **Documentación**
    - Contrato firmado (PDF)
    - Manual de uso
    - Guía Meta Ads
    - Especificaciones técnicas

#### 3. **Información del Proyecto**
- Timeline: fechas importantes
- Equipo: quiénes trabajaron en esto
- Tecnologías utilizadas

#### 4. **Accesos & Credenciales**
- Panel: usuarios/contraseñas
- Hosting/dominio info
- Paneles administrativos
- (Mostrado de forma segura, no en plain text)

#### 5. **Próximos Pasos**
- Cómo solicitar cambios
- Período de revisiones (si aplica)
- Contacto de soporte
- Link a portfolio

**Footer**
- Logo Miel Mostaza
- Contacto: email, WhatsApp
- Redes sociales

---

## 🔌 API Endpoints

### Base URL: `https://api.mielmostaza.com`

### Auth Endpoints
POST /api/auth/login
Body: { email, password }
Response: { token, user, expiresIn }

POST /api/auth/logout
Headers: { Authorization: Bearer token }

GET /api/auth/me
Headers: { Authorization: Bearer token }
Response: { user }


### Projects Endpoints

GET /api/projects
Headers: { Authorization: Bearer token }
Response: { projects[] }

POST /api/projects
Headers: { Authorization: Bearer token }
Body: { name, description, clientId, status, services[], etc }

GET /api/projects/:id
Headers: { Authorization: Bearer token }

PUT /api/projects/:id
Headers: { Authorization: Bearer token }
Body: { ...update }

DELETE /api/projects/:id
Headers: { Authorization: Bearer token }


### Clients Endpoints

GET /api/clients
GET /api/clients/:id
POST /api/clients
PUT /api/clients/:id
DELETE /api/clients/:id
Headers: { Authorization: Bearer token }


### Deliverables Endpoints

POST /api/deliverables
Headers: { Authorization: Bearer token }
Body: FormData { file, projectId, name, type, description }
Response: { deliverable }

GET /api/deliverables/:id/download
Response: File stream

DELETE /api/deliverables/:id
Headers: { Authorization: Bearer token }


### Public Endpoints

GET /api/public/servicios
Response: { services[] }

GET /api/public/portfolio
Response: { projects[] } (solo los de showcase)

GET /api/public/proyecto/:accessToken
Response: { project, deliverables[], documentation[] }


---

## 🧩 Componentes Reutilizables

### Landing Components
- `HeroSection` - Hero con animaciones
- `ServiceCard` - Card servicio/ingrediente
- `PortfolioCard` - Card proyecto
- `TestimonialCard` - Testimonial
- `CTASection` - Sección CTA
- `ContactForm` - Formulario contacto

### Admin Components
- `Table` - Tabla genérica
- `Modal` - Modal genérico
- `Form` - Formulario genérico
- `Badge` - Badge estado
- `Sidebar` - Navegación
- `DashboardMetric` - Métrica/stat

### Shared Components
- `Header` - Header
- `Footer` - Footer
- `Button` - Botón (variants: primary, secondary, ghost)
- `Input` - Input text
- `Select` - Select dropdown
- `Textarea` - Textarea
- `Card` - Card genérica
- `Loading` - Spinner

---

## 🔐 Flujos de Autenticación

### Admin Login
1. Usuario accede `/dashboard/login`
2. Ingresa email + password
3. Backend valida contra DB
4. Si OK: genera JWT + refresh token
5. Frontend guarda en httpOnly cookie
6. Redirecciona a `/dashboard`

### Cliente Portal Access
1. Admin genera URL: `/proyecto/[accessToken]`
2. Cliente recibe link por email
3. Accede a URL sin login
4. Backend valida token en `projects` table
5. Si válido: muestra contenido
6. Si expirado: mostrar error amigable

---

## 🎨 Diseño & Animaciones

### Colores por Sección
- **Landing**: Domina Honey Gold (#F4C430) + toques Dark Mustard
- **Admin**: Minimalista, Gris + Negro + accent verde
- **Cliente Portal**: Limpio, blanco + dorado

### Animaciones Framer Motion (Landing)
- Hero: fade-in + scale de titulo
- Servicios: stagger children, bounce on scroll
- Portfolio: hover scale + overlay slide
- Testimonios: carousel smooth scroll
- CTA: pulse animation en botones

### Animaciones Admin Panel
- Loading: spinner simple
- Table: fade-in rows
- Modal: scale + fade
- Transitions: página a página (fade + slide)

### Motion Design General
- Duración: 300-500ms (rápido, no lento)
- Easing: ease-out preferido
- No abuse animaciones en admin (professional)
- Landing puede ser más lúdico

---

**Próximo paso**: Crear `PHASES.md` con checklist de desarrollo.

Listo para Claude Code 🍯