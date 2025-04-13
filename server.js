import express from "express";
import axios from "axios";
import 'dotenv/config';

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, API_TOKEN, BUSINESS_PHONE, API_VERSION, PORT } = process.env;

if (!WEBHOOK_VERIFY_TOKEN || !API_TOKEN || !BUSINESS_PHONE || !API_VERSION || !PORT) {
    console.error("❌ Faltan variables de entorno. Verifica tu archivo .env");
    process.exit(1);
}

const cleanPhoneNumber = (number) => {
    return number.startsWith('521') ? number.replace("521", "52") : number;
};

app.post("/webhook", async (req, res) => {
    console.log("📨 Mensaje entrante:", JSON.stringify(req.body, null, 2));

    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

    if (message?.type === "text") {
        const userMessage = message.text.body.toLowerCase();
        let response = "";

        // Respuestas personalizadas
        if (userMessage.includes("hola")) {
            response = "¡Hola! Soy VetGuardian 🐾, ¿en qué puedo ayudarte hoy?";
        } else if (userMessage.includes("ayuda")) {
            response = "Claro, estoy aquí para ayudarte. Puedes preguntarme sobre tus citas, vacunas o cualquier duda veterinaria.";
        } else if (userMessage.includes("gracias")) {
            response = "¡De nada! Si necesitas algo más, aquí estaré. 🐶🐱";
        } else if (userMessage.includes("cita")) {
            response = "¿Quieres agendar una cita? Por favor indícame el día y la hora que prefieras.";
        } else {
            response = "Lo siento, no entendí tu mensaje 😅. ¿Puedes reformularlo o decir 'ayuda'?";
        }

        try {
            // Enviar mensaje personalizado
            await axios({
                method: "POST",
                url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                },
                data: {
                    messaging_product: "whatsapp",
                    to: cleanPhoneNumber(message.from),
                    text: { body: response },
                    context: {
                        message_id: message.id,
                    },
                },
            });

            // Marcar como leído
            await axios({
                method: "POST",
                url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                },
                data: {
                    messaging_product: "whatsapp",
                    status: "read",
                    message_id: message.id,
                },
            });

        } catch (error) {
            console.error("❌ Error al enviar mensaje:", error.message);
            return res.sendStatus(500);
        }
    }

    res.sendStatus(200);
});

app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
        console.log("✅ Webhook verificado correctamente.");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

app.get("/", (req, res) => {
    res.send(`<pre>VetGuardian Bot 🐾
Nada que ver aquí.
Consulta el archivo README.md para comenzar.</pre>`);
});

app.listen(PORT, () => {
    console.log(`🚀 VetGuardian está escuchando en el puerto: ${PORT}`);
});
