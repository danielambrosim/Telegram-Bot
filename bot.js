const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const token = '7137182747:AAFXwmm8Fyzeja7cZSoSITCOo8IWkq2dpWI';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {  
  const chatId = msg.chat.id;
  const resp = match[1];   
  bot.sendMessage(chatId, resp);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;  
  const date = new Date(msg.date * 1000);
  const hour = date.getHours();
  
  if (hour >= 9 && hour <= 18) {    
    bot.sendMessage(chatId, 'bom dia/boa tarde, link do site:https://uvv.br');
  } else {    
    bot.sendMessage(chatId, 'Estamos fora do horário comercial (09:00 às 18:00). Por favor, forneça seu e-mail para que possamos entrar em contato.');
    bot.once('message', async (msg) => {      
      const email = msg.text;
      await prisma.email.create({
        data: {
          email: email,
          time: new Date(),
        },
      });
      bot.sendMessage(chatId, 'Received your email: ' + email);
    });
  }
});

