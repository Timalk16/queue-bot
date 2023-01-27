const TelegramApi = require("node-telegram-bot-api")
const {gameOptions, againOptions} = require("./options")
const token = "5643754145:AAHRDSiYywZhoOGYLAXGNEaCCmxT4v3EypI"
const stickerUrl = "https://tlgrm.eu/_/stickers/c36/1c0/c361c044-f105-45f1-ba01-33626dfc1d57/9.webp"
const bot = new TelegramApi(token, {polling: true})
const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я заагадаю цифру от 0 до 9, а ты попробуй ее угадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: "/start", description: "Начальное приветсвие"},
        {command: "/info", description: "Информация о человеке"},
        {command: "/game", description: "Игра отгадай число"}
    ])

    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === "/start") {
            await bot.sendSticker(chatId, stickerUrl)
            return  bot.sendMessage(chatId, `Добро пожаловать в телеграм бот timalk, в этом боте вы можете составить очередь из людей для ваших лаб`)
        }
        if (text === "/info") {
            return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === "/game") {
            return  startGame(chatId)
        }
        return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз`)
    })

    bot.on("callback_query", async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === "/again") {
            return startGame(chatId)
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не отгадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()

