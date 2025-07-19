# Docker Setup - Wompi Payment Project

Este proyecto está completamente configurado para ejecutarse con Docker y Docker Compose.

## 🚀 Inicio Rápido

### Producción
```bash
# Windows
docker.bat prod

# Linux/Mac
./docker.sh prod
```

### Desarrollo
```bash
# Windows
docker.bat dev

# Linux/Mac
./docker.sh dev
```

## 📋 Servicios Incluidos

- **Frontend**: React + Vite (Puerto 3000)
- **Backend**: NestJS + TypeORM (Puerto 3001)
- **Base de Datos**: PostgreSQL (Puerto 5432)
- **Cache**: Redis (Puerto 6379)

## 🛠️ Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `prod` | Ejecutar en modo producción |
| `dev` | Ejecutar en modo desarrollo |
| `stop` | Detener todos los contenedores |
| `clean` | Limpiar contenedores y volúmenes |
| `logs [servicio]` | Ver logs (opcional: especificar servicio) |
| `restart` | Reiniciar contenedores |
| `build` | Construir contenedores |

## 🔧 Configuración

### Variables de Entorno

Las variables de entorno están configuradas en el `docker-compose.yml`:

**Backend:**
- `NODE_ENV`: production/development
- `DB_HOST`: postgres
- `DB_PORT`: 5432
- `DB_USERNAME`: postgres
- `DB_PASSWORD`: postgres
- `DB_NAME`: wompi_db

**Frontend:**
- `VITE_API_URL`: http://localhost:3001/api

### Volúmenes Persistentes

- `postgres_data`: Datos de PostgreSQL
- `redis_data`: Datos de Redis

## 🏥 Health Checks

Todos los servicios incluyen health checks:

- **PostgreSQL**: `pg_isready`
- **Redis**: `redis-cli ping`
- **Backend**: Endpoint `/api/health`

## 🔄 Modos de Ejecución

### Modo Producción
- Builds optimizados
- Sin hot reload
- Frontend servido por Nginx
- Contenedores optimizados

### Modo Desarrollo
- Hot reload habilitado
- Volúmenes montados para desarrollo
- Dev server de Vite
- Logs detallados

## 📱 Acceso a la Aplicación

Una vez iniciados los contenedores:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🐛 Troubleshooting

### Ver logs específicos
```bash
docker.bat logs backend
docker.bat logs frontend
```

### Reiniciar servicios
```bash
docker.bat restart
```

### Limpiar todo y empezar de nuevo
```bash
docker.bat clean
docker.bat prod
```

### Verificar estado de contenedores
```bash
docker-compose ps
```

## 🔒 Seguridad

- Contenedores ejecutan con usuario no-root
- Variables de entorno para credenciales
- Helmet para seguridad HTTP
- Compresión gzip habilitada

## 📊 Monitoreo

Los health checks están configurados para:
- Verificar cada 30 segundos
- Timeout de 10 segundos
- 3 reintentos antes de marcar como unhealthy

## 🚀 Optimizaciones Implementadas

- **Multi-stage builds** para menor tamaño de imagen
- **Health checks** para todos los servicios
- **Dependencias** adecuadas entre servicios
- **Volúmenes** para persistencia de datos
- **Archivos .dockerignore** para builds más rápidos
- **Configuración de red** optimizada
- **Scripts de gestión** para facilitar el uso
