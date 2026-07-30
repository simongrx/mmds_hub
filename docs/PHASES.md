# 🍯 Miel Mostaza - Fases de Desarrollo v1.0

> Checklist detallado por fase

---

## 📊 Resumen Ejecutivo

| Fase | Tiempo | Deliverables | Sesiones |
|------|--------|--------------|----------|
| **Fase 0** | 1-2h | Setup base, DB, auth | 1 |
| **Fase 1** | 3-4h | Admin panel MVP | 2 |
| **Fase 2** | 2-3h | Cliente portal | 1-2 |
| **Fase 3** | 3-4h | Landing pública | 2 |
| **Fase 4** | 2-3h | Polish & Deploy | 1 |
| **TOTAL** | 11-16h | Plataforma completa | ~7 sesiones |

---

## 🔧 Fase 0: Setup Base

**Objetivo**: Estructura lista para codificar

### Sesión 1: Scaffolding & Auth

**Frontend (Next.js)**
- [ ] Crear proyecto Next.js 14 con TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Importar tipografías: Outfit, Manrope
- [ ] Crear carpeta estructura (`app/`, `components/`, `lib/`, `styles/`)
- [ ] Crear `styles/variables.css` con colores Miel Mostaza
- [ ] Instalar dependencias: `framer-motion`, `next-auth`, axios

**Backend (Express)**
- [ ] Crear proyecto Node.js con TypeScript
- [ ] Estructura carpetas: `routes/`, `middleware/`, `services/`, `utils/`
- [ ] Instalar dependencias: express, prisma, bcryptjs, jsonwebtoken

**Database**
- [ ] Crear schema Prisma:
  - User (admin)
  - Client
  - Project
  - Service
  - Deliverable
  - Document
- [ ] Ejecutar `prisma migrate dev`
- [ ] Generar Prisma Client

**Auth Básico**
- [ ] Endpoint `/api/auth/login` (sin encriptación aún)
- [ ] Endpoint `/api/auth/me`
- [ ] Middleware JWT basic
- [ ] Frontend: página de login UI (no funcional aún)

**Monorepo Setup**
- [ ] `pnpm init` en root
- [ ] Configurar workspaces en `package.json`
- [ ] Crear `pnpm-workspace.yaml`
- [ ] Setup `.env.local` en ambas apps

**Testing Conexiones**
- [ ] Verificar Frontend ↔ Backend API communication
- [ ] Probar endpoints con Postman/Insomnia

---

## 👥 Fase 1: Admin Panel MVP

**Objetivo**: Panel funcional para gestionar proyectos y clientes

### Sesión 1: CRUD Clientes & Proyectos

**Backend**
- [ ] Encriptación de passwords (bcrypt)
- [ ] Endpoint `POST /api/clients` (crear cliente)
- [ ] Endpoint `GET /api/clients` (listar)
- [ ] Endpoint `GET /api/clients/:id` (detalle)
- [ ] Endpoint `PUT /api/clients/:id` (editar)
- [ ] Endpoint `DELETE /api/clients/:id` (eliminar)
- [ ] Endpoint `POST /api/projects` (crear proyecto)
- [ ] Endpoint `GET /api/projects` (listar con filtros)
- [ ] Endpoint `GET /api/projects/:id`
- [ ] Endpoint `PUT /api/projects/:id`
- [ ] Endpoint `DELETE /api/projects/:id`
- [ ] Validación de datos en todos los endpoints

**Frontend**
- [ ] Componente `Sidebar` navegación
- [ ] Página `/dashboard` (overview)
- [ ] Página `/dashboard/clientes` (tabla)
- [ ] Componente `Table` genérico con sort/filter
- [ ] Modal crear/editar cliente
- [ ] Página `/dashboard/proyectos` (tabla)
- [ ] Modal crear/editar proyecto
- [ ] Validación en formularios
- [ ] Manejo de errores (toast notifications)

### Sesión 2: Upload & Detalle Proyecto

**Backend**
- [ ] Configurar Cloudinary (o local storage fallback)
- [ ] Endpoint `POST /api/deliverables` (upload archivo)
- [ ] Endpoint `DELETE /api/deliverables/:id`
- [ ] Endpoint `POST /api/documents` (crear documentación)
- [ ] Endpoint `DELETE /api/documents/:id`
- [ ] Endpoint `GET /api/projects/:id/deliverables`
- [ ] Endpoint `GET /api/projects/:id/documents`

**Frontend**
- [ ] Página `/dashboard/proyectos/[id]` (detalle)
- [ ] Componente upload dropzone (deliverables)
- [ ] Tabla deliverables (nombre, tipo, acciones)
- [ ] Tabla documentación (título, categoría)
- [ ] Generador de access token (para cliente)
- [ ] Copiar URL de acceso cliente
- [ ] Link regenerar token

**Testing**
- [ ] CRUD completo en admin panel
- [ ] Upload y descarga archivos
- [ ] Validaciones funcionando
- [ ] Estados de proyectos

---

## 🎁 Fase 2: Cliente Portal

**Objetivo**: Experiencia premium de entrega

### Sesión 1: Landing Cliente

**Frontend**
- [ ] Página `/proyecto/[accessToken]` (sin protección aún)
- [ ] Componente `ProjectHeader` (resumen ejecutivo)
- [ ] Componente `DeliverableSection` (videos, web, docs)
- [ ] Componente `ProjectInfo` (timeline, equipo, tech stack)
- [ ] Componente `CredentialsSection` (accesos de forma segura)
- [ ] Componente `NextStepsSection` (contacto, opciones)
- [ ] Footer minimalista

**Backend**
- [ ] Endpoint `GET /api/public/proyecto/:accessToken` (public, sin auth)
- [ ] Validar token válido y no expirado
- [ ] Response: proyecto + deliverables + documentación

**Design**
- [ ] Aplicar identidad Miel Mostaza
- [ ] Animaciones sutiles (fade-in)
- [ ] Responsive mobile
- [ ] Test en diferentes dispositivos

### Sesión 2: Seguridad & Pulido

**Backend**
- [ ] Proteger endpoint con validación token estricta
- [ ] Expiración de tokens (30 días por defecto)
- [ ] Rate limiting en acceso a proyectos
- [ ] Logging de accesos cliente

**Frontend**
- [ ] Manejo de errores (token expirado, no encontrado)
- [ ] Página error amigable si token inválido
- [ ] Download masivo de deliverables
- [ ] Compartir link (copy to clipboard)

**Testing**
- [ ] Acceso con token válido
- [ ] Rechazo token inválido/expirado
- [ ] Descargas de archivos
- [ ] Responsive design

---

## 🎨 Fase 3: Landing Pública

**Objetivo**: Showcase atractivo, convertidor

### Sesión 1: Estructura & Contenido

**Frontend**
- [ ] Página `/` (home)
- [ ] Componente `HeroSection` con Framer Motion
- [ ] Componente `ServicesSection` (grid 7 servicios/ingredientes)
- [ ] Componente `PortfolioSection` (casos destacados)
- [ ] Componente `TestimonialsSection` (carousel)
- [ ] Componente `ContactFormSection` (formulario)
- [ ] Página `/servicios/[slug]` (detalle servicio)
- [ ] Página `/contacto` (página completa contacto)

**Contenido**
- [ ] Redacción home (copy con tono Miel Mostaza)
- [ ] Redacción servicios
- [ ] Redacción quiénes somos (filosofía marca)
- [ ] Casos/portfolio para mostrar
- [ ] Testimonios reales o de prueba

**Backend**
- [ ] Endpoint `GET /api/public/servicios`
- [ ] Endpoint `GET /api/public/portfolio` (solo proyectos "visible")
- [ ] Endpoint `POST /api/public/contact` (formulario contacto)
- [ ] Envío email o webhook contacto

### Sesión 2: Animaciones & Refinamiento

**Frontend**
- [ ] Hero: fade-in, text reveal, parallax
- [ ] Servicios: stagger animation on scroll
- [ ] Portfolio: hover effects, image scale
- [ ] Testimonios: carousel smooth scroll
- [ ] CTAs: pulse animation
- [ ] Smooth scroll behavior global
- [ ] SEO: meta tags, canonical, og:image
- [ ] Performance: lazy loading images, code splitting

**Design**
- [ ] Aplicar paleta Miel Mostaza en todos lados
- [ ] Mantener consistencia tipografía
- [ ] Responsive mobile-first
- [ ] Animaciones en máximo 500ms
- [ ] Testing velocidad (Lighthouse)

**Testing**
- [ ] Animaciones suaves en todos navegadores
- [ ] Responsive en mobile/tablet/desktop
- [ ] Enlaces funcionan
- [ ] Formulario contacto envía
- [ ] Performance OK (Lighthouse 80+)

---

## 🚀 Fase 4: Polish & Deploy

**Objetivo**: Listo para producción

### Sesión 1: Testing & Optimización

**Testing**
- [ ] Flujo admin completo (login, crear, editar, entregar)
- [ ] Flujo cliente (acceso, descargas)
- [ ] Flujo visitante (landing, contacto)
- [ ] Errores manejan gracefully
- [ ] Validaciones en frontend y backend

**Performance**
- [ ] Lighthouse scores 80+ en landing
- [ ] Admin panel responsivo
- [ ] Zero layout shifts
- [ ] Images optimizadas (next/image)
- [ ] Bundle size OK

**SEO**
- [ ] Meta tags en todas las páginas
- [ ] Open Graph tags
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Structured data (JSON-LD) si aplica

**Security**
- [ ] CORS configurado correctamente
- [ ] HTTPS verificado
- [ ] Passwords encriptados
- [ ] Tokens no exponen info
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevented (escaping)

**Documentation**
- [ ] README.md en root
- [ ] README en `/apps/web` y `/apps/api`
- [ ] ENV variables documentadas
- [ ] Setup instructions
- [ ] Deployment guide

### Sesión 2: Deployment

**Frontend (Vercel)**
- [ ] Conectar repo a Vercel
- [ ] Set ENV variables
- [ ] Preview deployment OK
- [ ] Production deployment OK
- [ ] Custom domain: mielmostaza.com
- [ ] SSL/HTTPS automático

**Backend (Railway)**
- [ ] Conectar repo a Railway
- [ ] Set ENV variables (DB, JWT_SECRET, CLOUDINARY, etc)
- [ ] Database hosting (Railway PostgreSQL)
- [ ] Backups configurados
- [ ] Deployment OK
- [ ] Custom domain: api.mielmostaza.com (CNAME)

**Monitoreo**
- [ ] Setup error tracking (Sentry?)
- [ ] Analytics en landing (Vercel Analytics)
- [ ] Health checks en API
- [ ] Alertas críticas

**Post-Launch**
- [ ] Test full flow en producción
- [ ] Verificar emails llegan
- [ ] Descargas funcionan
- [ ] Admin panel accesible
- [ ] Landing responsive en todos devices

---

## ✅ Checklist Final

### Antes de Fase 1
- [ ] CLAUDE.md guardado
- [ ] SPEC.md guardado
- [ ] PHASES.md guardado
- [ ] Identidad marca definida (ya hecho ✓)
- [ ] Stack decidido (ya hecho ✓)

### Antes de Deploy
- [ ] Todos los tests OK
- [ ] Performance OK (Lighthouse 80+)
- [ ] Security audit pasado
- [ ] No console errors/warnings
- [ ] Testimonios reales o datos dummy final
- [ ] Imágenes optimizadas
- [ ] Contenido final (no Lorem ipsum)

### Después de Deploy
- [ ] Test real en producción
- [ ] Dominio configurado
- [ ] Email verificado
- [ ] Backups activos
- [ ] Monitoreo activo
- [ ] Documentación finalizada

---

## 🎯 KPIs a Rastrear

1. **Landing**: Visitantes únicos, CTR contacto, conversion rate
2. **Admin**: Tiempo crear proyecto, errores, uptime
3. **Cliente Portal**: Downloads, accesos, feedback
4. **General**: Uptime API, error rate, response time

---

## 📞 Próximos Pasos

1. ✅ Guardar los 3 docs (CLAUDE.md, SPEC.md, PHASES.md)
2. ✅ Crear repo
3. ✅ Iniciar Sesión 1 Claude Code (Fase 0)
4. ✅ Iteraciones rápidas

¡Listo para cocinar! 🍯

---

**Creado**: Julio 2026
**Versión**: 1.0
**Estado**: Listo para Claude Code