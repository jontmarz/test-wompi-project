@echo off

REM Docker Management Scripts for Wompi Project

if "%1"=="dev" (
    echo 🚀 Starting development environment...
    docker-compose -f docker-compose.dev.yml up --build
) else if "%1"=="prod" (
    echo 🚀 Starting production environment...
    docker-compose up --build
) else if "%1"=="stop" (
    echo 🛑 Stopping all containers...
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
) else if "%1"=="clean" (
    echo 🧹 Cleaning up containers and volumes...
    docker-compose down -v
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
) else if "%1"=="logs" (
    if "%2"=="" (
        echo 📋 Showing all logs...
        docker-compose logs -f
    ) else (
        echo 📋 Showing logs for %2...
        docker-compose logs -f %2
    )
) else if "%1"=="restart" (
    echo 🔄 Restarting containers...
    docker-compose restart
) else if "%1"=="build" (
    echo 🔨 Building containers...
    docker-compose build --no-cache
) else (
    echo 📖 Available commands:
    echo   dev     - Start development environment
    echo   prod    - Start production environment
    echo   stop    - Stop all containers
    echo   clean   - Clean up containers and volumes
    echo   logs    - Show logs ^(optional: service name^)
    echo   restart - Restart containers
    echo   build   - Build containers
    echo.
    echo Examples:
    echo   docker.bat dev
    echo   docker.bat logs backend
    echo   docker.bat clean
)
