require('dotenv').config()
console.log(process.env.token)

const { token } = process.env
const { gameOptions, againOptions } = require('./options')
const sequelize = require('./db');
const TelegramApi = require('node-telegram-bot-api');

const bot = new TelegramApi(token, {polling: true})
const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать');
            const randomNumber = Math.floor(Math.random() * 10) + '';
            chats[chatId] = randomNumber;
            await bot.sendMessage(chatId, 'отгадывай', gameOptions)
}


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('подсключение к бд сломалось', e)
    }
    bot.setMyCommands([
        {command: '/start', description: 'terra incognito'},
        {command: '/info', description: 'возвращает юзернэйм'},
        {command: '/game', description: 'начинает игру'}
    ])
    
    bot.on('message', async msg => {
        console.log(msg);
        const text = msg.text
        const chatId = msg.chat.id
        const name = msg.from.first_name
        const username = msg.from.username
        await bot.sendMessage(chatId, `Что написал:${text}, твой айди: ${chatId}`)
        if (text === '/start') {
            return bot.sendMessage(chatId, `Добро пожаловать ${name}`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Твой username: ${username}`)
        }
        if (text === '/game') {
            console.log('starting game');
            return startGame(chatId);
            
        }
        return bot.sendMessage(chatId, 'Попробуйте ещще раз ')
    })
    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id;
        const data = msg.data;
        console.log('wwwwwwwwwwww',data)
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${data}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `К сожалению нет, бот загадал ${chats[chatId]}`, againOptions)
        }
        bot.sendMessage(chatId, `вы выбрали ${data} а надо было ${chats[chatId]}`)
    })
}

start();