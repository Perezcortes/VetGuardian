
# 🤖 Chatbot de WhatsApp para VetGuardian

Este proyecto es un chatbot desarrollado para **VetGuardian**, una plataforma de asistencia veterinaria. El bot se conecta con la **API de WhatsApp Business Cloud** de Meta y ofrece funcionalidades básicas como bienvenida, validación de número mexicano, y un menú interactivo con botones.

---

## 🚀 Características

- ✅ Verificación de número mexicano (sólo números que comienzan con `52`)
- 👋 Respuestas automáticas a saludos como “hola”, “hi”, “hello”
- 📋 Mensaje de bienvenida personalizado con el nombre del remitente
- 🐾 Menú interactivo con opciones:
  - 🗓️ Agendar
  - 📋 Consultar
  - 📍 Ubicación
- 🔁 Marcado automático de mensajes como leídos

---

## 📁 Estructura del proyecto

```
.
├── src/
│   ├── app.js                # Configuración del servidor Express y webhook
│   ├── messageHandler.js     # Lógica de procesamiento de mensajes
│   ├── services/
│   │   └── whatsappService.js  # Servicio para enviar mensajes, botones, etc.
│   └── config/
│       └── env.js            # Variables de entorno (token, número, puerto)
└── README.md
```

---

## 🛠️ Tecnologías

- Node.js
- Express
- Axios
- WhatsApp Cloud API (Meta)
- nodemon

---

## 🔧 Requisitos

1. Node.js v18 o superior
2. Cuenta de desarrollador en [Meta for Developers](https://developers.facebook.com/)
3. Acceso a la API de WhatsApp Business Cloud
4. Token de acceso (`API_TOKEN`)
5. ID del número de teléfono (`BUSINESS_PHONE`)
6. Número de prueba registrado en la lista de destinatarios permitidos

---

## ⚙️ Configuración

1. Clona este repositorio:

```bash
git clone https://github.com/Perezcortes/VetGuardian.git
cd vetguardian-chatbot
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` con el siguiente contenido (ya gestionado en `env.js`):

```env
WEBHOOK_VERIFY_TOKEN=Chatbotvet
API_TOKEN=TU_TOKEN
BUSINESS_PHONE=ID_NUMERO
API_VERSION=v22.0
PORT=3000
```

4. Inicia el servidor:

```bash
npm run dev
```

---

## 🌐 Webhook

Usa ngrok para exponer tu servidor local:

```bash
npx ngrok http 3000
```

Luego copia el dominio generado y configúralo como tu Webhook Callback URL en Meta Developers Console.

---

## 🐞 Errores comunes

- `(#131030) Recipient phone number not in allowed list`: Agrega el número de prueba en la sección de sandbox de WhatsApp.
- `Invalid OAuth access token`: Asegúrate de que el token esté vigente.

---

## ✍️ Autor

**Jose Alberto Perez Cortes**  
Desarrollador Web.

---

## 📜 Licencia

MIT License
