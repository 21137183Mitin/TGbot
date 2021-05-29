require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')

const token = process.env.TOKEN;

const bot = new TelegramApi(token, {polling: true})

const chat = {}



const starGame = async (chatId) => {
    await bot.sendMessage(chatId, `I will guess a number from 0 - 9, and you need to guess.`) ;
    const randomNumber = Math.floor(Math.random() * 10)
    chat[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Try to guess!`, gameOptions);
}

const start = ()=> {
    bot.setMyCommands([
        {command: '/info', description: 'Get info about your name'},
        {command: '/game', description: 'I want to play a game with you'}
        
    ])

    bot.on('message', async msg=> {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/747/d48/747d480a-1032-348f-94ed-2e948215a11d/12.webp')
            return bot.sendMessage(chatId, `Welcome to chat!!!`)};
            text === '/info' ? await bot.sendMessage(chatId, `Your name ${msg.from.username}`) : false;
            if (text === '/game') {
                return starGame(chatId);
            };
            return bot.sendMessage(chatId, 'Unknown command')
        })
        
        bot.on ('callback_query', msg => {
            const data = msg.data;
            const chatId = msg.message.chat.id;
            if(data === '/again') {
                return starGame(chatId);
            }
            if(data == chat[chatId]){
                return  bot.sendMessage(chatId, 'Bingo!!!', againOptions)
            } else {
                // console.log('data: ', typeof data, ' ', data, 'chatId: ', typeof chat[chatId], ' ',chat[chatId])
                return  bot.sendMessage(chatId, `Sry, you lose. Number was ${chat[chatId]} Try again.`, againOptions)
            }
            //bot.sendMessage(chatId, `You chose number ${data}`)
        })
}

start()