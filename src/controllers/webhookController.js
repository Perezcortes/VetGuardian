import config from '../config/env.js';
import messageHandler from '../services/messageHandler.js';

class WebhookController {
  async handleIncoming(req, res) {
    // 📩 Mostrar todo lo que llega desde WhatsApp
    console.log("📩 Webhook recibió mensaje:");
    console.dir(req.body, { depth: null });

    // Extraer mensaje y datos del remitente
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const senderInfo = req.body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

    if (!message || !senderInfo) {
      console.warn("⚠️ No se encontró el mensaje o el contacto.");
      return res.sendStatus(400); // Si no se encuentra el mensaje o los datos del contacto, responder con error 400
    }

    // Procesar el mensaje
    await messageHandler.handleIncomingMessage(message, senderInfo);

    // Responder al webhook
    res.sendStatus(200);
  }

  verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === config.WEBHOOK_VERIFY_TOKEN) {
      console.log('✅ Webhook verificado correctamente');
      res.status(200).send(challenge);
    } else {
      console.warn("❌ Verificación del webhook fallida.");
      res.sendStatus(403);
    }
  }
}

export default new WebhookController();
