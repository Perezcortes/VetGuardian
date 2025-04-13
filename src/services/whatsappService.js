import axios from 'axios';
import config from '../config/env.js';

class WhatsAppService {
  async sendMessage(to, body, messageId) {
    try {
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        data: {
          messaging_product: 'whatsapp',
          to,
          text: { body },
          context: {
            message_id: messageId,
          },
        },
      });
    } catch (error) {
      console.error('Error sending message:', error?.response?.data || error.message);
      if (error?.response?.status) {
        console.error('HTTP Status:', error?.response?.status);
      }
    }
  }

  async markAsRead(messageId) {
    try {
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        data: {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
      });
    } catch (error) {
      console.error('Error marking message as read:', error?.response?.data || error.message);
      if (error?.response?.status) {
        console.error('HTTP Status:', error?.response?.status);
      }
    }
  }

  async sendInteractiveButtons(to, BodyText, buttons) {
    try {
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        data: {
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: { text: BodyText },
            action: {
              buttons: buttons
            }
          }
        },
      });
    } catch (error) {
      console.error('Error sending interactive buttons:', error?.response?.data || error.message);
      if (error?.response?.status) {
        console.error('HTTP Status:', error?.response?.status);
      }
    }
  }
}

export default new WhatsAppService();
