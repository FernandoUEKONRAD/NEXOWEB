# Configuración del Backend - Ejemplos

Esta guía muestra ejemplos de cómo implementar los endpoints de autenticación en tu backend.

## 🔗 Endpoints Requeridos

Tu backend debe exponer dos endpoints principales:

### 1. POST /auth/login

**URL:** `http://localhost:3000/api/auth/login`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "miContraseña"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidXN1YXJpb0Blams...",
  "user": {
    "id": "123",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez",
    "role": "user"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Credenciales inválidas"
}
```

---

### 2. POST /auth/register

**URL:** `http://localhost:3000/api/auth/register`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "nuevo@ejemplo.com",
  "password": "MiContraseña123",
  "name": "Juan Pérez"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidXN1YXJpb0Blams...",
  "user": {
    "id": "124",
    "email": "nuevo@ejemplo.com",
    "name": "Juan Pérez",
    "role": "user"
  }
}
```

**Response (409 Conflict):**
```json
{
  "message": "El email ya está registrado"
}
```

---

## 🔐 JWT Token

El token debe ser un JWT válido con la siguiente estructura:

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "id": "123",
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "role": "user",
  "exp": 1704067200,    // Timestamp de expiración (Unix)
  "iat": 1704063600     // Timestamp de emisión (Unix)
}
```

**Ejemplo de expiración:**
- `exp: 1704067200` = Expira en 1 hora

---

## 📝 Ejemplos de Implementación

### Node.js + Express

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const JWT_SECRET = 'tu-clave-secreta-aqui';
const TOKEN_EXPIRY = '1h';

// Base de datos simulada
const users = [];

// Registro
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Validar que no exista el email
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'El email ya está registrado' });
  }

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear usuario
  const user = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    role: 'user'
  };

  users.push(user);

  // Generar token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // Validar contraseña
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // Generar token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// Middleware para verificar token (para rutas protegidas)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = decoded;
    next();
  });
};

// Ruta protegida de ejemplo
app.get('/api/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000, () => {
  console.log('Servidor escuchando en puerto 3000');
});
```

---

### Python + Flask

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import jwt
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

JWT_SECRET = 'tu-clave-secreta-aqui'
TOKEN_EXPIRY_HOURS = 1

# Base de datos simulada
users = []

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    # Validar que no exista el email
    if any(u['email'] == email for u in users):
        return jsonify({'message': 'El email ya está registrado'}), 409

    # Crear usuario
    user = {
        'id': str(len(users) + 1),
        'email': email,
        'password': generate_password_hash(password),
        'name': name,
        'role': 'user'
    }

    users.append(user)

    # Generar token
    token = jwt.encode(
        {
            'id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(hours=TOKEN_EXPIRY_HOURS)
        },
        JWT_SECRET,
        algorithm='HS256'
    )

    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'role': user['role']
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Buscar usuario
    user = next((u for u in users if u['email'] == email), None)
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Credenciales inválidas'}), 401

    # Generar token
    token = jwt.encode(
        {
            'id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(hours=TOKEN_EXPIRY_HOURS)
        },
        JWT_SECRET,
        algorithm='HS256'
    )

    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'role': user['role']
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

---

### PHP + Laravel

```php
<?php

Route::post('/auth/register', function (Request $request) {
    $validated = $request->validate([
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8',
        'name' => 'required|min:3'
    ]);

    $user = User::create([
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'name' => $validated['name']
    ]);

    $token = JWTAuth::fromUser($user);

    return response()->json([
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'role' => 'user'
        ]
    ], 201);
});

Route::post('/auth/login', function (Request $request) {
    $credentials = $request->only('email', 'password');

    if (!$token = JWTAuth::attempt($credentials)) {
        return response()->json(['message' => 'Credenciales inválidas'], 401);
    }

    $user = auth()->user();

    return response()->json([
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'role' => 'user'
        ]
    ]);
});

// Ruta protegida (ejemplo)
Route::middleware('auth:api')->get('/me', function (Request $request) {
    return response()->json(['user' => $user = auth()->user()]);
});
```

---

## 🔄 Flujo Completo

### 1. Usuario se registra
```
Cliente: POST /auth/register
{
  "email": "nuevo@ejemplo.com",
  "password": "MiContraseña123",
  "name": "Juan Pérez"
}

Backend: Valida datos
Backend: Hashea contraseña
Backend: Crea usuario en BD
Backend: Genera JWT
Backend: Responde con token

Cliente: Almacena token en localStorage
Cliente: Redirige a /dashboard
```

### 2. Usuario inicia sesión
```
Cliente: POST /auth/login
{
  "email": "usuario@ejemplo.com",
  "password": "miContraseña"
}

Backend: Valida credenciales
Backend: Genera JWT
Backend: Responde con token

Cliente: Almacena token en localStorage
Cliente: Redirige a /dashboard
Interceptor: Agrega token a requests
```

### 3. Cliente accede a ruta protegida
```
Cliente: GET /eventos
Header: Authorization: Bearer eyJhbGc...

Backend: Verifica token
Backend: Si es válido, retorna datos
Backend: Si es inválido (401), cliente logout

Cliente: Recibe respuesta
```

---

## ✅ Checklist de Implementación

- [ ] Backend genera JWT válidos
- [ ] Endpoint `/auth/login` funciona
- [ ] Endpoint `/auth/register` funciona
- [ ] CORS está habilitado para frontend
- [ ] Tokens incluyen campos: id, email, role, exp
- [ ] Backend valida token en rutas protegidas
- [ ] Retorna 401 para tokens inválidos
- [ ] Retorna 403 para acceso prohibido
- [ ] Contraseñas están hasheadas en BD
- [ ] Emails son únicos en BD

---

## 🧪 Testear Endpoints

### Con cURL

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "Test1234",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "Test1234"
  }'
```

### Con Postman

1. Abre Postman
2. Crea nueva request POST
3. URL: `http://localhost:3000/api/auth/login`
4. Headers: `Content-Type: application/json`
5. Body:
```json
{
  "email": "test@ejemplo.com",
  "password": "Test1234"
}
```
6. Click "Send"

---

## 🚀 Próximos Pasos

1. Implementar refresh tokens
2. Agregar 2FA (Two Factor Authentication)
3. Agregar recuperación de contraseña
4. Implementar roles y permisos
5. Agregar logs de auditoría
6. Implementar rate limiting
7. Agregar verificación de email
