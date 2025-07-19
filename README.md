# Wompi Full-Stack Payment Application

Una aplicación completa de pagos desarrollada para Wompi con React (frontend), NestJS (backend), PostgreSQL y despliegue en AWS.

## 🏗️ Arquitectura del Proyecto

```
wompi-payment-app/
├── frontend/                 # React SPA con Redux
├── backend/                  # NestJS API con arquitectura hexagonal
├── infrastructure/           # Terraform/CloudFormation para AWS
├── .github/workflows/        # CI/CD pipelines
├── docker-compose.yml        # Desarrollo local
└── README.md
```

## 🚀 Características Principales

### Frontend
- ✅ SPA móvil-first con React 18 + TypeScript
- ✅ Gestión de estado con Redux Toolkit
- ✅ Persistencia parcial en localStorage
- ✅ Validación de tarjetas VISA/MasterCard
- ✅ Detección automática de tipo de tarjeta
- ✅ 5 pantallas: selección, formulario, resumen, estado, stock
- ✅ Responsive design (mínimo iPhone SE)

### Backend
- ✅ NestJS con TypeScript
- ✅ Arquitectura hexagonal (puertos y adaptadores)
- ✅ Railway Oriented Programming (ROP)
- ✅ Base de datos PostgreSQL
- ✅ Integración con Wompi Sandbox API
- ✅ Gestión de stock y transacciones

### Infraestructura
- ✅ AWS Lambda/ECS para backend
- ✅ RDS PostgreSQL
- ✅ CloudFront + S3 para frontend
- ✅ Infraestructura como código (Terraform)

## 🛠️ Configuración de Desarrollo

### Prerrequisitos
- Node.js 18+
- Docker & Docker Compose
- AWS CLI configurado
- Terraform

### Instalación Local

```bash
# Clonar el repositorio
git clone <repository-url>
cd wompi-payment-app

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Wompi

# Iniciar servicios con Docker
docker-compose up -d

# Iniciar desarrollo
npm run dev
```

### Variables de Entorno

```env
# Wompi Sandbox
WOMPI_PUBLIC_KEY=pub_test_xxx
WOMPI_PRIVATE_KEY=prv_test_xxx
WOMPI_INTEGRITY_KEY=test_integrity_xxx

# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/wompi_db

# AWS (para despliegue)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
```

## 📱 Pantallas de la Aplicación

1. **Selección de Producto** - Catálogo con stock disponible
2. **Formulario de Pago** - Datos de tarjeta y envío
3. **Resumen de Compra** - Confirmación antes del pago
4. **Estado de Transacción** - Resultado del pago
5. **Regreso de Stock** - Gestión de devoluciones

## 🧪 Testing

```bash
# Tests frontend
npm run test:frontend

# Tests backend
npm run test:backend

# Coverage completo
npm run test:coverage
```

## 🚀 Despliegue

### Desarrollo
```bash
npm run deploy:dev
```

### Producción
```bash
npm run deploy:prod
```

## 📊 Monitoreo

- CloudWatch para logs y métricas
- AWS X-Ray para tracing
- Health checks automáticos

## 🔧 Scripts Disponibles

- `npm run dev` - Desarrollo local
- `npm run build` - Build completo
- `npm run test` - Tests completos
- `npm run deploy` - Despliegue a AWS
- `npm run db:migrate` - Migraciones de BD
- `npm run db:seed` - Datos de prueba

## 📚 Documentación

- [API Documentation](./backend/docs/api.md)
- [Frontend Guide](./frontend/README.md)
- [Deployment Guide](./infrastructure/README.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](./LICENSE) para más detalles.