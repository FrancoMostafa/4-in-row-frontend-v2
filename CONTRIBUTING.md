# Contribuir al Proyecto 4-in-Row Frontend V2

¡Gracias por tu interés en contribuir! Este documento proporciona pautas para contribuir al proyecto.

## 🚀 Cómo empezar

1. **Fork el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/4-in-row-frontend-v2.git
   cd 4-in-row-frontend-v2
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm start
   ```

## 📋 Guías de contribución

### Estructura del proyecto
```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── hooks/         # Custom hooks
├── services/      # Servicios de API y WebSocket
├── utils/         # Funciones utilitarias
├── constants/     # Constantes de la aplicación
└── styles/        # Estilos globales
```

### Estilo de código

- **ESLint**: Seguimos las reglas configuradas en `.eslintrc.json`
- **Naming**: 
  - Componentes en PascalCase
  - Funciones y variables en camelCase
  - Constantes en UPPER_SNAKE_CASE
- **Imports**: Agrupa imports por tipo (React, libraries, relative)

### Commits

Usamos el formato de commits convencionales:

```
type(scope): descripción

[cuerpo opcional]

[pie opcional]
```

Tipos:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato/estilo
- `refactor`: Refactoring de código
- `test`: Agregar o modificar tests
- `chore`: Cambios de configuración

Ejemplos:
- `feat(game): add pause functionality`
- `fix(websocket): handle connection errors`
- `docs(readme): update installation steps`

### Pull Requests

1. **Crea una rama para tu feature**
   ```bash
   git checkout -b feat/nueva-funcionalidad
   ```

2. **Realiza tus cambios y commits**
   ```bash
   git add .
   git commit -m "feat(scope): descripción del cambio"
   ```

3. **Push y crea PR**
   ```bash
   git push origin feat/nueva-funcionalidad
   ```

4. **Descripción del PR**
   - Describe claramente qué cambios realizaste
   - Incluye screenshots si hay cambios visuales
   - Menciona si hay breaking changes
   - Referencia issues relacionados

### Testing

- Escribe tests para nuevas funcionalidades
- Asegúrate de que todos los tests pasen:
  ```bash
  npm test
  ```

### Reportar bugs

Cuando reportes un bug, incluye:

- **Descripción** clara del problema
- **Pasos para reproducir** el bug
- **Comportamiento esperado** vs actual
- **Capturas de pantalla** si aplica
- **Entorno**: navegador, OS, versión
- **Logs de consola** si hay errores

### Sugerir mejoras

Para sugerir nuevas funcionalidades:

1. Revisa que no existe un issue similar
2. Crea un nuevo issue con:
   - Descripción detallada de la funcionalidad
   - Casos de uso
   - Mockups/wireframes si aplica
   - Prioridad estimada

## 🎯 Áreas donde puedes contribuir

- **UI/UX**: Mejoras en diseño y experiencia de usuario
- **Performance**: Optimizaciones de rendimiento
- **Testing**: Agregar tests unitarios e integración
- **Accesibilidad**: Mejoras para usuarios con discapacidades
- **Documentación**: Mejorar docs y comentarios
- **Internacionalización**: Soporte para múltiples idiomas
- **Nuevas funcionalidades**: Chat, torneos, rankings, etc.

## 📞 Contacto

- **GitHub Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas generales
- **Email**: [tu-email@ejemplo.com]

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la MIT License.

¡Gracias por contribuir! 🙏