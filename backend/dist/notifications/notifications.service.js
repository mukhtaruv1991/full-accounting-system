"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const TelegramBot = require("node-telegram-bot-api");
let NotificationsService = class NotificationsService {
    constructor() {
        try {
            if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN') {
                this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
                this.bot.onText(/\/start/, (msg) => {
                    this.bot.sendMessage(msg.chat.id, 'مرحباً بك في بوت المحاسبة الذكي!');
                });
            }
            else {
                console.log('[NotificationsService] Telegram bot token is not provided. Skipping bot initialization.');
            }
        }
        catch (error) {
            console.error('[NotificationsService] Failed to initialize Telegram bot:', error.message);
        }
    }
    async sendNotification(chatId, message) {
        if (!this.bot) {
            console.warn('[NotificationsService] Cannot send notification, bot is not initialized.');
            return;
        }
        try {
            await this.bot.sendMessage(chatId, message);
        }
        catch (error) {
            console.error('Failed to send Telegram message:', error);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map