#!/bin/bash

# Docker Management Scripts for Wompi Project

case $1 in
  "dev")
    echo "🚀 Starting development environment..."
    docker-compose -f docker-compose.dev.yml up --build
    ;;
  "prod")
    echo "🚀 Starting production environment..."
    docker-compose up --build
    ;;
  "stop")
    echo "🛑 Stopping all containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    ;;
  "clean")
    echo "🧹 Cleaning up containers and volumes..."
    docker-compose down -v
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
    ;;
  "logs")
    if [ -z "$2" ]; then
      echo "📋 Showing all logs..."
      docker-compose logs -f
    else
      echo "📋 Showing logs for $2..."
      docker-compose logs -f $2
    fi
    ;;
  "restart")
    echo "🔄 Restarting containers..."
    docker-compose restart
    ;;
  "build")
    echo "🔨 Building containers..."
    docker-compose build --no-cache
    ;;
  *)
    echo "📖 Available commands:"
    echo "  dev     - Start development environment"
    echo "  prod    - Start production environment"
    echo "  stop    - Stop all containers"
    echo "  clean   - Clean up containers and volumes"
    echo "  logs    - Show logs (optional: service name)"
    echo "  restart - Restart containers"
    echo "  build   - Build containers"
    echo ""
    echo "Examples:"
    echo "  ./docker.sh dev"
    echo "  ./docker.sh logs backend"
    echo "  ./docker.sh clean"
    ;;
esac
