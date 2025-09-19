import { Injectable } from '@nestjs/common';
// Corrected import statement for node-telegram-bot-api
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class NotificationsService {
  private bot: TelegramBot;

  constructor() {
    // This will now work, but might fail quietly if the token is invalid.
    // We will handle this better in later stages.
    try {
      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN') {
        this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
        this.bot.onText(/\/start/, (msg) => {
          this.bot.sendMessage(msg.chat.id, 'مرحباً بك في بوت المحاسبة الذكي!');
        });
      } else {
        console.log('[NotificationsService] Telegram bot token is not provided. Skipping bot initialization.');
      }
    } catch (error) {
      console.error('[NotificationsService] Failed to initialize Telegram bot:', error.message);
    }
  }

  async sendNotification(chatId: string, message: string) {
    if (!this.bot) {
      console.warn('[NotificationsService] Cannot send notification, bot is not initialized.');
      return;
    }
    try {
      await this.bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
    }
  }
}
