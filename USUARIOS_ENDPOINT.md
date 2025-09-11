# Endpoint para Crear Usuario

## POST /usuarios

Crea un nuevo usuario en el sistema con todas las relaciones iniciales configuradas.

### Request Body

```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "contraseña": "MiContraseña123!",
  "fotoPerfil": "https://example.com/foto.jpg",
  "biografia": "Desarrollador fullstack apasionado por la tecnología",
  "rol": "usuario"
}
```

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| nombre | string | ✓ | Nombre del usuario (3-100 caracteres) |
| correo | string | ✓ | Email único del usuario |
| contraseña | string | ✓ | Contraseña (mínimo 8 caracteres) |
| fotoPerfil | string | ✗ | URL de la foto de perfil |
| biografia | string | ✗ | Biografía del usuario (máx 500 caracteres) |
| rol | string | ✗ | Rol del usuario (default: 'usuario') |

### Response Success (201 Created)

```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "idUsuario": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "fotoPerfil": "https://example.com/foto.jpg",
    "biografia": "Desarrollador fullstack apasionado por la tecnología",
    "nivelActual": 1,
    "xpTotal": 0,
    "fechaRegistro": "2025-12-15T10:30:00.000Z",
    "rol": "usuario",
    "estado": true
  }
}
```

### Error Responses

#### 409 Conflict - Email ya registrado

```json
{
  "statusCode": 409,
  "message": "El correo ya está registrado",
  "error": "Conflict"
}
```

#### 400 Bad Request - Nivel inicial no existe

```json
{
  "statusCode": 400,
  "message": "No existe un nivel inicial en la base de datos",
  "error": "Bad Request"
}
```

#### 400 Bad Request - Validación fallida

```json
{
  "statusCode": 400,
  "message": [
    "nombre must be shorter than or equal to 100 characters",
    "correo must be an email"
  ],
  "error": "Bad Request"
}
```

---

## Endpoints Adicionales Disponibles

### GET /usuarios
Obtiene todos los usuarios con sus relaciones completas.

### GET /usuarios/:id
Obtiene un usuario específico por ID con todas sus relaciones.

### GET /usuarios/email/:correo
Obtiene un usuario por su correo electrónico.

---

## Características del Endpoint

✅ **Hash seguro de contraseña** - Usa bcrypt con salt de 10 rondas
✅ **Validación de datos** - Valida tipos y longitudes de campos
✅ **Evita duplicados** - Verifica que el correo sea único
✅ **Inicialización automática** - Asigna nivel inicial y XP
✅ **Relaciones preparadas** - Configura todas las relaciones de la entidad Usuarios
✅ **Entidades relacionadas soportadas**:
  - Admin
  - Certificaciones
  - Educación
  - Experiencia Laboral
  - Logros de Usuario
  - Notificaciones
  - Personajes
  - Proyectos
  - Seguidores
  - Redes Sociales del Usuario
  - Niveles
