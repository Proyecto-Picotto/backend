
# Documentación de endpoints Sprint 1

## Registrar usuario
- **Nombre:** Registrar usuario
- **Ruta:** POST /api/auth/register
- **Entrada (body JSON):**
  - name: string (required)
  - email: string (required)
  - password: string (required)
- **Salida (200):**
  - { user: { id, name, email }, token: <jwt-token> }
- **Errores comunes:**
  - 400 Missing fields
  - 400 Email already registered
  - 500 Server error

## Login
- **Nombre:** Login
- **Ruta:** POST /api/auth/login
- **Entrada (body JSON):**
  - email: string (required)
  - password: string (required)
- **Salida (200):**
  - { user: { id, name, email }, token: <jwt-token> }
- **Errores comunes:**
  - 400 Missing fields
  - 400 Invalid credentials
  - 500 Server error
