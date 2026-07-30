# 🍯 Miel Mostaza - Plataforma Digital Completa
## Project Overview & Technical Architecture v1.0

> **La receta para crecer digitalmente.**

---

## 🎯 Objetivo del Proyecto

Construir una plataforma SaaS completa para Miel Mostaza Digital Solutions que funcione en 3 niveles:

1. **Landing Pública** - Showcase de la agencia (convertir visitantes en clientes)
2. **Panel Admin** - Gestión interna de proyectos y clientes (para Sagru y socio)
3. **Portal Cliente** - Entrega personalizada de proyectos (experiencia post-venta premium)

---

## 🏗️ Arquitectura General

LANDING PÚBLICA (Public)
│
├── ADMIN PANEL (Protected - JWT Auth)
│ ├── Dashboard: tabla proyectos + estados
│ ├── CRUD Clientes
│ ├── CRUD Proyectos
│ ├── Upload deliverables
│ └── Gestión archivos
│
├── CLIENT PORTAL (Protected - Token único)
│ ├── Landing privada por proyecto
│ ├── Descargas deliverables
│ ├── Documentación
│ ├── Info proyecto
│ └── Contacto/soporte
│
└── BACKEND API (Node.js + Express)
├── Auth (JWT)
├── Projects CRUD
├── Clients CRUD
├── Deliverables
├── Files (Cloudinary)
└── PostgreSQL + Prisma


---

## 🛠️ Stack Tecnológico Decidido

| Componente | Tecnología | Razón |
|-----------|-----------|-------|
| **Frontend** | Next.js 14 + React 18 + TypeScript | SSR, SEO, isomorphic |
| **Styling** | Tailwind CSS | Utility-first, temas |
| **Animaciones** | Framer Motion | Suave, performante |
| **Backend** | Node.js + Express + TypeScript | Escalable, type-safe |
| **ORM** | Prisma | Migraciones automáticas |
| **Database** | PostgreSQL (Railway) | Relacional, escalable |
| **Auth** | NextAuth.js + JWT | Seguro, stateless |
| **File Storage** | Cloudinary | CDN, optimización |
| **Deploy** | Vercel + Railway | CI/CD automático |

---

## 🎨 Identidad Miel Mostaza

### Colores
- **Primario**: Honey Gold `#F4C430`
- **Secundario**: Golden Mustard `#FFD54A`
- **Oscuro**: Dark Mustard `#D99B11`
- **Neutro Base**: Negro `#1F1F1F`
- **Neutro Light**: Gris `#EFEFEF`
- **Éxito**: Verde `#6CE56C`
- **Error**: Coral `#FF6A5A`

### Tipografía
- **Heading**: Outfit
- **Body**: Manrope

### Concepto
- Universo de cocina digital
- Mascota: Frasco de miel mostaza (cartoon + tech)
- Movimiento constante (animaciones suaves)
- Lenguaje gastronómico en toda la UI

### Tono
- Cercano y amigable
- Creativo y divertido
- Técnico pero accesible
- ✅ "Vamos a cocinar algo grande"
- ❌ "Somos líderes en soluciones digitales"

---

## 📊 Modelos de Datos (Prisma)

### User (Admin)
- id, email (unique), password (hashed), name, role (owner|admin)

### Client
- id, name, email, phone, company, logoUrl, notes
- relationships: projects[]

### Project
- id, clientId, name, description, status (pending|in-development|delivered)
- startDate, endDate, deliveryDate
- relationships: services[], deliverables[], documentation[]
- accessToken (para cliente)

### Deliverable
- id, projectId, name, description, type (video|link|document|image|other)
- fileUrl, fileSize, downloadCount

### Document
- id, projectId, title, content (markdown), category (guide|contract|specs)
- order

### Service
- id, name, slug, description, icon, order
- (Desarrollo Web, Apps, IA, Meta Ads, Automatizaciones, Branding, Contenido)

---

## 🔐 Seguridad

- **Autenticación**: NextAuth.js con email/password + JWT
- **Autorización**: 
  - Admin: acceso a todos los proyectos
  - Cliente: acceso solo a su proyecto con token único
- **Contraseñas**: Bcrypt con salt rounds 12
- **Tokens**: 7 días (admin), 30 días (cliente)
- **Rate limiting**: Login attempts limitados
- **File validation**: Solo tipos permitidos, max size

---

## 🚀 Fases de Desarrollo

### Fase 0: Setup Base (1 sesión)
- Monorepo pnpm
- Next.js + TypeScript
- Express + TypeScript
- PostgreSQL + Prisma schema
- Auth básica
- Conexión front-back

### Fase 1: Admin Panel MVP (2 sesiones)
- Dashboard con tabla de proyectos
- CRUD Clientes
- CRUD Proyectos
- Upload deliverables
- Visualización detalles

### Fase 2: Cliente Portal (1-2 sesiones)
- Landing privada por token
- Descargas y documentación
- Diseño limpio y profesional

### Fase 3: Landing Pública (2 sesiones)
- Hero con animaciones
- Servicios (ingredientes)
- Portfolio (casos)
- Testimonios
- CTA contacto

### Fase 4: Polish & Deploy (1 sesión)
- Testing
- Performance
- SEO
- Deploy a producción

---

## 📁 Estructura de Carpetas

miel-mostaza-platform/
├── apps/
│ ├── web/ # Frontend Next.js
│ │ ├── public/
│ │ ├── src/
│ │ │ ├── app/
│ │ │ │ ├── (landing)/ # Rutas públicas
│ │ │ │ ├── (auth)/ # Login
│ │ │ │ ├── dashboard/ # Admin (protected)
│ │ │ │ ├── proyecto/[token]/# Client portal
│ │ │ │ └── api/ # Next.js API routes
│ │ │ ├── components/ # Componentes
│ │ │ ├── lib/ # Helpers
│ │ │ └── styles/ # CSS global
│ │
│ └── api/ # Backend Express
│ ├── src/
│ │ ├── routes/ # Auth, projects, clients, files
│ │ ├── middleware/ # JWT, errors
│ │ ├── services/ # Lógica
│ │ ├── utils/ # Helpers
│ │ └── types/ # TypeScript
│ └── prisma/
│ └── schema.prisma
│
└── docs/
├── CLAUDE.md
├── SPEC.md
└── PHASES.md


---

## ✅ Checklist Pre-Claude Code

- [x] Identidad de marca definida
- [x] Stack tecnológico decidido
- [x] Modelos de datos esquematizados
- [x] Fases mapeadas
- [x] Estructura de carpetas definida
- [ ] Variables CSS de marca creadas
- [ ] Tipografía importada
- [ ] Componentes base diseñados
- [ ] DB schema en Prisma listo
- [ ] API endpoints documentados

---

**Próximo paso**: Crear `SPEC.md` con especificación detallada.

Listo para Claude Code 🍯