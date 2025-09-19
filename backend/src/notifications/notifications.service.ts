import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class NotificationsService {
  private bot: TelegramBot;

  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    this.bot.onText(/\/start/, (msg) => {
      this.bot.sendMessage(msg.chat.id, 'مرحباً بك في بوت المحاسبة الذكي!');
    });
  }

  async sendNotification(chatId: string, message: string) {
    try {
      await this.bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
    }
  }
}
