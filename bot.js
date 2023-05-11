require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// process.env.(переменная) - эта функция загружает переменную из переменного оружения.
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const API_URL = `https://api.weatherapi.com/v1/current.json?key=${process.env.API_TOKEN}&q=`


bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id;

    if (text === '/start') {
        return bot.sendMessage(chatId,
            `Hi ${msg.from.first_name}!\nThis bot shows the weather.\nSend the name of the city and you will see the current weather in it.
        `)
    };

    const resp = await fetch(API_URL + text + '&aqi=no');
    const respData = await resp.json();

    if (respData.error) {
        bot.sendMessage(chatId, `City ( ${text} ) does not exist or was not found.`)
    } else {
        const photo = 'https://cdn.weatherapi.com/weather/128x128/' + (respData.current.condition.icon).slice(35)
        const city = respData.location.name
        const country = respData.location.country
        const temp = respData.current.temp_c
        const wind = (respData.current.wind_kph / 3.6).toFixed(1)
        const time = (respData.location.localtime).slice(-5)

        // Отправка данных пользователю
        bot.sendPhoto(chatId, photo, {
            caption: `
            Weather in ${city} ( ${country} )
            - Temperature: ${temp}°C
            - Wind: ${wind} m/s
            - Local time: ${time}

            `})
    }
})

