import whatsappService from './whatsappService.js';

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    if (message?.type === 'text') {
      const from = message.from;

      // ✅ Validar número mexicano
      if (!this.isMexicanNumber(from)) {
        const warning = "⚠️ Lo sentimos, este servicio solo está disponible para números de México.";
        await whatsappService.sendMessage(from, warning, message.id);
        return;
      }

      const incomingMessage = message.text.body.toLowerCase().trim();

      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(from, message.id, senderInfo);
        await this.sendWelcomeMenu(from);
      } else {
        const response = `Echo: ${message.text.body}`;
        await whatsappService.sendMessage(from, response, message.id);
      }

      await whatsappService.markAsRead(message.id);
    }
  }

  isGreeting(message) {
    const greetings = ["Hola", "hello", "hi", "buenas tardes"];
    return greetings.some(greet => message.includes(greet));
  }

  isMexicanNumber(phoneNumber) {
    // Elimina cualquier espacio o signo "+" y valida si el número comienza con 52
    const cleanedNumber = this.cleanPhoneNumber(phoneNumber);
    return cleanedNumber && cleanedNumber.startsWith("52") && cleanedNumber.length === 12;
  }

  cleanPhoneNumber(phoneNumber) {
    // Elimina todos los caracteres no numéricos (como el "+" o espacios)
    const cleanedNumber = phoneNumber.replace(/[^\d]/g, '');

    // Si el número empieza con '52' y tiene 13 dígitos, quitar el '1' adicional
    if (cleanedNumber.startsWith('52') && cleanedNumber.length === 13) {
      return cleanedNumber.substring(0, 3) + cleanedNumber.substring(4); // Eliminar el primer '1'
    }

    // Si el número ya tiene 12 dígitos y empieza con '52', lo devuelve tal cual
    if (cleanedNumber.startsWith('52') && cleanedNumber.length === 12) {
      return cleanedNumber;
    }

    return null; // Si no es válido, devuelve null
  }

  getSenderName(senderInfo) {
    return senderInfo?.profile?.name || senderInfo?.wa_id || 'usuario';
  }

  async sendWelcomeMessage(to, messageId, senderInfo) {
    const name = this.getSenderName(senderInfo);
    const welcomeMessage = `Hola ${name}, Bienvenido a MEDPET, tu tienda de mascotas en línea. ¿En qué puedo ayudarte hoy?`;
    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }

  async sendWelcomeMenu(to) {
    const menuMessage = "🐾 *Elige una opción:*";
    const buttons = [
      {
        type: 'reply', reply: { id: 'option_1', title: '🗓️ Agendar' }
      },
      {
        type: 'reply', reply: { id: 'option_2', title: '📋 Consultar' }
      },
      {
        type: 'reply', reply: { id: 'option_3', title: '📍 Ubicación' }
      }
    ];

    await whatsappService.sendInteractiveButtons(to, menuMessage, buttons);
  }
}

export default new MessageHandler();
