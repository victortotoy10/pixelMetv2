# 🎓 Prototipo Preliminar: Plataforma PixelMet (Control por Joystick)

## ✨ Visión General del Proyecto

Este documento describe el prototipo de una interfaz de usuario (`FrontEnd`) para la plataforma educativa **PixelMet**. Su principal característica es que está diseñado para ser **controlado completamente mediante un joystick virtual** (utilizando teclas específicas de un teclado físico como interfaz). Este enfoque emula la interacción con un sistema embebido, donde el uso de un ratón o un teclado tradicional es limitado.

Este prototipo es una versión **preliminar** y **no está conectado a un BackEnd (servidor) real**. Sin embargo, cumple con el requisito de demostrar cómo funcionaría la interfaz al interactuar con un servidor una vez que este sea desarrollado.

## 🚀 Contexto de la Actividad y Simulación del BackEnd

Para cumplir con el requerimiento de trabajar "sin conexión a BackEnd", hemos implementado una **simulación de llamadas a la API** directamente en el código del FrontEnd:

* Al realizar acciones como **registrar una cuenta** o **iniciar sesión**, la aplicación simula el envío de datos a un servidor.
* Esta simulación incluye una breve **pausa (latencia)** para imitar el tiempo que tardaría una red real en responder.
* Después de la pausa, el FrontEnd genera una **respuesta predefinida** (éxito o error) basada en condiciones internas (ej., credenciales de prueba).
* Esto demuestra que la interfaz de usuario está **lista para interactuar con un BackEnd real** y procesar sus respuestas.
* **Nota sobre Insomnia/Postman:** Herramientas como Insomnia o Postman se utilizarían, en un entorno de desarrollo completo, para probar directamente los servicios (`endpoints`) del BackEnd. Este prototipo FrontEnd está preparado para recibir y manejar los datos que esas APIs proporcionarían.

## 🔑 Características Clave del Prototipo

* **Registro de Cuentas:** Un formulario estructurado en secciones para la creación de nuevas cuentas de usuario.
* **Inicio de Sesión:** Una página dedicada para que los usuarios registrados puedan acceder.
* **Control Exclusivo por Joystick:** Toda la navegación e interacción se realiza con teclas específicas del teclado. El ratón y el teclado físico del ordenador están deshabilitados para la interacción principal.
* **Teclado Virtual en Pantalla:** Para una entrada de texto fácil y controlada en los campos de formulario.
* **Indicadores de Estado:** Feedback visual sobre el progreso en cada sección del formulario.
* **Mensajes Flotantes:** Notificaciones claras sobre el estado de las acciones (éxito, error, cargando) que aparecen en pantalla.

## 📁 Estructura del Proyecto
tu_proyecto/
├── index.html                  # Página de Registro de Cuenta (Principal)
├── login.html                  # Página de Inicio de Sesión
├── styles.css                  # Estilos CSS compartidos para ambas páginas
├── script.js                   # Lógica JavaScript para la página de Registro
├── login.js                    # Lógica JavaScript para la página de Inicio de Sesión
├── joystick.js                 # Control universal del Joystick (navegación)
├── teclado.js                  # Lógica del Teclado Virtual en pantalla
├── global-input-blocker.js     # Script para bloquear interacciones de mouse/teclado físico
└── utils.js                    # Funciones de utilidad comunes (ej., showValidationMessage)
---

## 🎮 Controles del Joystick (Teclas del Teclado)

La interacción con este prototipo se realiza **únicamente** con las siguientes teclas de su teclado. Es fundamental entender cómo cada tecla funciona en diferentes contextos:

### 1. **Navegación Principal (Entre secciones o botones):**
* **`Flecha Abajo` (↓):** Mueve el resaltado al siguiente elemento (sección del formulario o botón).
* **`Flecha Arriba` (↑):** Mueve el resaltado al elemento anterior.
* **`Flecha Derecha` (→):** Si el resaltado está en un botón principal (como "Iniciar Sesión" o "Acceder"), lo mueve al botón de la derecha.
* **`Flecha Izquierda` (←):** Si el resaltado está en un botón principal, lo mueve al botón de la izquierda.

### 2. **Interacción y Navegación Interna (Dentro de una Sección Abierta):**
* **`K` (Botón de Acción / Seleccionar):**
    * Si una **sección cerrada** está resaltada: Presione `K` para **abrirla**.
    * Si está dentro de una **sección abierta** y un campo de texto o una opción está resaltada:
        * `K` en una **opción** (ej. Estudiante/Profesor): **Selecciona** esa opción.
        * `K` en un **cuadro de texto** (ej. Nombre, Email): **Activa el campo** y muestra el **Teclado Virtual** en pantalla para que pueda escribir.
    * Si un **botón principal** (ej. "Registrar", "Acceder") está resaltado: `K` lo **presiona** para activar su función.

* **`Flecha Abajo` (↓):** Mueve el resaltado al siguiente campo o opción dentro de la sección actual.
* **`Flecha Arriba` (↑):** Mueve el resaltado al campo o opción anterior dentro de la sección actual.

### 3. **Uso del Teclado Virtual en Pantalla:**
* **`Flechas` (↑↓←→):** Para moverse entre las teclas del teclado virtual.
* **`K`:** **Presiona la tecla** que esté actualmente resaltada en el teclado virtual (inserta el carácter en el campo, activa borrar, cambia el modo numérico/alfabético, etc.).
* **`Ñ`:** Actúa como la tecla **"Enter"**. Presiónela para **confirmar** lo que ha escrito en el campo de texto y **cerrar** el teclado virtual.
* **`Escape (Esc)`:** Cierra el teclado virtual sin confirmar la entrada.

### 4. **Cerrar una Sección Abierta (Volver a la Vista General):**
* **`Ñ` (presionar dos veces rápidamente):** Si está dentro de una sección abierta y el teclado virtual **NO** está activo, este comando cerrará la sección y volverá a resaltar su encabezado.

---

## 📊 Indicadores de Estado de las Secciones

Cada sección del formulario tiene un pequeño círculo al lado de su título que indica su estado actual:

* **Vacío (Sin Etiqueta):** La sección aún no ha sido tocada ni abierta. (Estado inicial).
* **En progreso (Amarillo):** La sección está actualmente abierta, o un campo de texto en ella tiene el foco, indicando que usted está interactuando con ella.
* **Pendiente (Rojo Suave):** La sección ha sido abierta o se ha interactuado con ella (ej. ingresó datos o seleccionó algo y luego los borró), pero no ha sido completada y ahora está cerrada. Indica que hay información por completar.
* **Completado (Verde):** Todos los campos o las opciones requeridas de la sección han sido llenadas o seleccionadas correctamente.

---

## 🧪 Credenciales de Prueba y Simulación de Errores

Dado que este es un prototipo sin BackEnd, los datos no son persistentes. Utilice las siguientes credenciales y condiciones para probar los flujos de éxito y error:

### 1. **Para Probar el Registro (`index.html`):**

* **Flujo de Éxito:** Complete **todas las secciones** del formulario (Tu Rol, Credenciales de Acceso, Grado Escolar) con **cualquier dato** (excepto el email de error).
    * Al presionar `K` en "Registrar": Verá un mensaje "⏳ Registrando cuenta..." y luego "✅ ¡Registro exitoso!". Después será redirigido a la página de login.
* **Simular Errores Locales (Campos Vacíos):**
    * Deje cualquier sección incompleta o vacía y presione `K` en "Registrar".
    * Verá un mensaje "⚠️ Aún hay secciones incompletas." y la **primera sección pendiente se abrirá automáticamente**, resaltando el campo o la opción por completar.
* **Simular Error de "API" (Ej. Email ya registrado):**
    * Complete todas las secciones. En el campo **Email**, ingrese: `error@test.com`
    * Al presionar `K` en "Registrar": Verá un mensaje "⏳ Registrando cuenta..." y luego "❌ Error en registro: Este email ya está registrado."

### 2. **Para Probar el Inicio de Sesión (`login.html`):**

* **Para ir a la página de Login:** Desde `index.html`, navegue al botón "Iniciar sesión" y presione `K`.
* **Para volver a la página de Registro:** Desde `login.html`, navegue al botón "Registrar" y presione `K`.

* **Inicio de Sesión Exitoso:**
    * **Email:** `test@pixelmet.com`
    * **Contraseña:** `password123`
    * Al presionar `K` en "Acceder": Verá "⏳ Iniciando sesión..." y luego "✅ ¡Inicio de sesión exitoso!".

* **Simular Errores de Inicio de Sesión:**
    * **Campos Vacíos:** Deje los campos Email o Contraseña vacíos y presione `K` en "Acceder". Verá "⚠️ Por favor, ingresa tu email y contraseña."
    * **Usuario no Encontrado:** En el campo Email, ingrese: `usuarioinexistente@pixelmet.com` (o cualquier email que NO sea `test@pixelmet.com`).
    * **Contraseña Incorrecta:** Ingrese Email: `test@pixelmet.com` y una contraseña DIFERENTE a `password123` (ej. `wrongpass`).
    * En ambos casos, verá "⏳ Iniciando sesión..." y luego un mensaje de error como "❌ Usuario no encontrado." o "❌ Contraseña incorrecta.".

---

## 🛠️ Cómo Iniciar el Prototipo

1.  Asegúrese de tener todos los archivos (`index.html`, `login.html`, `styles.css`, `script.js`, `login.js`, `joystick.js`, `teclado.js`, `global-input-blocker.js`, `utils.js`) en la misma carpeta.
2.  Abra el archivo `index.html` en su navegador web. Desde allí podrá probar el registro y navegar a la página de login.