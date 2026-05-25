# Testing Manual - Sistema de Autenticación

Esta guía proporciona pasos para probar manualmente el sistema de autenticación completo.

## 🧪 Preparación

### Requisitos Previos
1. Angular CLI instalado: `npm install -g @angular/cli`
2. Node.js instalado (versión 16+)
3. Navegador web actualizado

### Instalación

```bash
# 1. Navega a la carpeta del proyecto
cd c:\xampp\htdocs\NEXOWEB

# 2. Instala dependencias (si es necesario)
npm install

# 3. Inicia el servidor Angular
npm start

# 4. Espera a que compile
# Deberías ver: "✔ Compiled successfully"

# 5. Abre el navegador
# http://localhost:4200
```

## 📋 Casos de Prueba

### Test 1: Redireccionamiento a Login

**Pasos:**
1. Abre `http://localhost:4200`
2. Espera a que cargue

**Resultado Esperado:**
- ✅ Redirecciona automáticamente a `/login`
- ✅ Muestra el formulario de login

---

### Test 2: Formulario de Login - Validaciones

**Pasos:**

#### 2.1 - Email vacío
1. Deja email vacío
2. Ingresa una contraseña
3. Haz click en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Muestra error: "El email es requerido"

#### 2.2 - Email inválido
1. Ingresa: `emailinvalido`
2. Ingresa una contraseña
3. Haz click en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Muestra error: "El email no es válido"

#### 2.3 - Contraseña vacía
1. Ingresa un email válido
2. Deja contraseña vacía
3. Haz click en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Muestra error: "La contraseña es requerida"

#### 2.4 - Contraseña muy corta
1. Ingresa un email válido
2. Ingresa: `12345` (menos de 6 caracteres)
3. Haz click en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Muestra error: "La contraseña debe tener al menos 6 caracteres"

---

### Test 3: Navegación a Registro

**Pasos:**
1. En la página de login
2. Haz click en "Regístrate aquí"

**Resultado Esperado:**
- ✅ Navega a `/login/register`
- ✅ Muestra el formulario de registro

---

### Test 4: Formulario de Registro - Validaciones

**Pasos:**

#### 4.1 - Nombre vacío
1. Deja nombre vacío
2. Completa otros campos
3. Haz click en "Registrarse"

**Resultado Esperado:**
- ✅ Muestra error: "El nombre es requerido"

#### 4.2 - Nombre muy corto
1. Ingresa: `ab` (menos de 3 caracteres)
2. Completa otros campos
3. Haz click en "Registrarse"

**Resultado Esperado:**
- ✅ Muestra error: "El nombre debe tener al menos 3 caracteres"

#### 4.3 - Email inválido
1. Ingresa: `emailinvalido`
2. Completa otros campos
3. Haz click en "Registrarse"

**Resultado Esperado:**
- ✅ Muestra error: "El email no es válido"

#### 4.4 - Contraseña débil
1. Ingresa nombre válido
2. Ingresa email válido
3. Ingresa contraseña: `123456` (sin mayúscula ni minúscula)
4. Haz click en "Registrarse"

**Resultado Esperado:**
- ✅ Muestra error: "Falta: mayúscula, minúscula"
- ✅ El indicador de fortaleza muestra requisitos faltantes

#### 4.5 - Contraseñas no coinciden
1. Ingresa todos los datos válidos
2. Ingresa contraseña: `Test12345`
3. Ingresa confirmación: `Test12346` (diferente)
4. Haz click en "Registrarse"

**Resultado Esperado:**
- ✅ Muestra error: "Las contraseñas no coinciden"

#### 4.6 - Indicador de fortaleza
1. Ingresa contraseña en el campo
2. Observa el indicador en tiempo real

**Resultado Esperado:**
- ✅ Muestra "Falta: mayúscula, minúscula, número"
- ✅ Se actualiza mientras escribes
- ✅ Cuando cumple todos, muestra: "La contraseña es fuerte"

---

### Test 5: Login Exitoso (Simulado)

**Nota:** Estos tests requieren un backend configurado.

**Pasos:**
1. Asegúrate que tu backend está corriendo
2. Ingresa credenciales válidas
3. Haz click en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Muestra indicador de carga
- ✅ Token se almacena en localStorage
- ✅ Redirecciona a `/dashboard`
- ✅ Muestra información del usuario

**Verificar localStorage:**
```javascript
// En la consola del navegador (F12)
localStorage.getItem('auth_token')  // Debe devolver el token
localStorage.getItem('auth_user')   // Debe devolver el usuario
```

---

### Test 6: Dashboard Post-Login

**Pasos:**
1. Después de login exitoso
2. Observa la página del dashboard

**Resultado Esperado:**
- ✅ Se muestra el Navbar
- ✅ Navbar muestra información del usuario
- ✅ Se muestra el saludo "Bienvenido a NEXOWEB"
- ✅ Se muestran 3 tarjetas (Eventos, Comunidades, Perfil)

---

### Test 7: Navbar - Información del Usuario

**Pasos:**
1. En el dashboard
2. Mira el navbar en la esquina superior derecha

**Resultado Esperado:**
- ✅ Se muestra avatar con inicial del nombre
- ✅ Se muestra nombre del usuario
- ✅ Se muestra email del usuario
- ✅ Se muestra opción "Cerrar Sesión"

---

### Test 8: Navbar - Links de Navegación

**Pasos:**
1. En el dashboard
2. Haz click en "Eventos" en el navbar

**Resultado Esperado:**
- ✅ Navega a `/eventos`
- ✅ El link "Eventos" se resalta como activo

**Pasos para Comunidades:**
1. Haz click en "Comunidades" en el navbar

**Resultado Esperado:**
- ✅ Navega a `/comunidades`
- ✅ El link "Comunidades" se resalta como activo

---

### Test 9: Navbar Responsive (Mobile)

**Pasos:**
1. Abre las Developer Tools (F12)
2. Haz click en el icono de dispositivo móvil
3. Selecciona un dispositivo (ej: iPhone X)
4. Recarga la página

**Resultado Esperado:**
- ✅ Aparece un botón de hamburguesa (menú)
- ✅ Haz click en la hamburguesa
- ✅ Se abre un menú vertical
- ✅ Los links son clickeables

---

### Test 10: Logout

**Pasos:**
1. En el dashboard
2. Busca el botón de logout (esquina superior derecha)
3. Haz click en "Cerrar Sesión"

**Resultado Esperado:**
- ✅ Token se elimina de localStorage
- ✅ Usuario se elimina de localStorage
- ✅ Redirecciona a `/login`
- ✅ Formulario está vacío

---

### Test 11: Protección de Rutas

**Pasos:**
1. Cierra sesión (logout)
2. Intenta acceder directamente a: `http://localhost:4200/dashboard`

**Resultado Esperado:**
- ✅ Se redirecciona a `/login`
- ✅ No puedes acceder al dashboard sin autenticar

**Pasos para /eventos:**
1. Cierra sesión
2. Intenta: `http://localhost:4200/eventos`

**Resultado Esperado:**
- ✅ Se redirecciona a `/login`

---

### Test 12: URL de Retorno

**Pasos:**
1. Estás autenticado en `/dashboard`
2. Cierra sesión
3. Accede a: `http://localhost:4200/eventos`
4. Se redirecciona a `/login?returnUrl=/eventos`
5. Inicia sesión nuevamente

**Resultado Esperado:**
- ✅ Después de login, retorna a `/eventos`
- ✅ No va al dashboard

---

### Test 13: Interceptor HTTP

**Pasos:**
1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Asegúrate de estar autenticado
4. Haz click en "Ver Eventos" o cualquier ruta que haga una request

**Resultado Esperado:**
- ✅ En los Headers de la request
- ✅ Debe estar: `Authorization: Bearer eyJhbGc...`

---

### Test 14: Tarjetas del Dashboard

**Pasos:**
1. En el dashboard
2. Haz click en "Ver Eventos →" en la tarjeta de Eventos

**Resultado Esperado:**
- ✅ Navega a `/eventos`

**Pasos para Comunidades:**
1. Haz click en "Ver Comunidades →"

**Resultado Esperado:**
- ✅ Navega a `/comunidades`

---

### Test 15: Responsive Design

**Pasos:**
1. Abre DevTools (F12)
2. Selecciona vista responsive (Ctrl+Shift+M)
3. Prueba diferentes tamaños:
   - Móvil (375px)
   - Tablet (768px)
   - Desktop (1024px)

**Resultado Esperado:**
- ✅ Login se ve bien en todos los tamaños
- ✅ Formulario es usable en móvil
- ✅ Navbar se adapta correctamente
- ✅ Dashboard se reorganiza en mobile

---

## 🔧 Herramientas de Testing

### Verificar localStorage

```javascript
// En la consola del navegador (F12 → Console)

// Ver token
console.log(localStorage.getItem('auth_token'));

// Ver usuario
console.log(JSON.parse(localStorage.getItem('auth_user')));

// Limpiar todo
localStorage.clear();
```

### Verificar Autenticación

```javascript
// En la consola

// Acceder al servicio
const authService = ng.probe(document.querySelector('app-root')).injector.get('AuthService');

// Verificar si está autenticado
console.log(authService.isAuthenticated());

// Obtener usuario
console.log(authService.getCurrentUser());

// Logout manual
authService.logout();
```

### Network Requests

1. F12 → Network tab
2. Realiza una acción (login, request API)
3. Verifica la request:
   - Headers (Authorization)
   - Request body
   - Response status
   - Response body

---

## 🐛 Debugging

### El login no funciona

```javascript
// En consola, verifica el error
// Debería haber un mensaje en la consola
// Comprueba Network → verifica la request al backend
```

### El token no se guarda

```javascript
// Verifica que localStorage no esté lleno
localStorage

// Intenta limpiar
localStorage.clear()
```

### Redirección infinita

```javascript
// El token podría estar expirado
// O el backend no está respondiendo correctamente
// Verifica: Network → /auth/login
```

---

## ✅ Checklist de Pruebas

- [ ] Login muestra validaciones
- [ ] Registro muestra validaciones
- [ ] Login exitoso redirige a dashboard
- [ ] Dashboard muestra información del usuario
- [ ] Navbar es responsive
- [ ] Logout funciona
- [ ] Rutas están protegidas
- [ ] Interceptor agrega token
- [ ] Diseño es responsive
- [ ] Animaciones son suaves
- [ ] Mensajes de error son claros
- [ ] Indicador de carga funciona

---

## 📝 Notas de Testing

- Los tests requieren un backend configurado correctamente
- El CORS debe estar habilitado en el backend
- Los endpoints deben retornar los formatos especificados
- Los tokens JWT deben ser válidos
- Los tiempos de expiración deben estar configurados

---

## 🚀 Próximas Mejoras para Testing

1. Agregar tests unitarios (Jasmine/Karma)
2. Agregar tests e2e (Cypress/Protractor)
3. Agregar mocking del backend
4. Agregar tests de accesibilidad
5. Agregar tests de performance
