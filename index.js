import * as dotenv from 'dotenv'
dotenv.config()
import venom from "venom-bot"
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.API_KEY
});
const openai = new OpenAIApi(configuration);

venom
    .create()
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

function start(client) {
    let resposta = ""

    client.onMessage(async (message) => {
        if (message.body) {

            if (!configuration.apiKey) console.log("Key não configurada")
            const prompt = message.body || ""
            if (prompt.trim().length === 0) {
                console.log("Insira algo")
                return;
            }
            try {
                // const completion = await openai.createCompletion({
                //     model: "text-davinci-003",
                //     prompt: generatePrompt(prompt),
                //     temperature: 0.6,
                //     max_tokens: 300,

                // });
                // resposta = completion.data.choices[0].text
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", "content": "Você vai responder qualquer pergunta feita a você, finja que você é a IA desenvolvida pelo Samyr, seja sempre muito coerente e preciso em suas respostas, não responda perguntas de forma errada, só responda dados certeiros." },
                        { role: "user", "content": generatePrompt(prompt) }
                    ],
                    max_tokens:300

                })
             resposta = completion.data.choices[0].message.content.trim()
            } catch (error) {
                // Consider adjusting the error handling logic for your use case
                if (error.response) {
                    console.error(error.response.status, error.response.data);
                } else {
                    console.error(`Error with OpenAI API request: ${error.message}`);
                }
            }


            await client
                .sendText(message.from, `BOT:${resposta}`)
                .then((result) => {
                    console.log('Result: ', result); //return object success
                })
                .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
        }
    });
}

function generatePrompt(prompt) {
    const capitalizedAnimal = prompt[0].toUpperCase() + prompt.slice(1).toLowerCase();
    const promptAtual = `
      Pergunta: ${capitalizedAnimal}
      Resposta:`;
    if (global.context) {
        global.context.push(promptAtual);
    } else {
        global.context = [];
        global.context.push(promptAtual)
    }

    let promptFinal = ``;
    const total = global.context.length - 15;
    const n = total >= 0 ? total : 0;
    for (let i = n; i < global.context.length; i++) {
        const context = global.context[i];
        promptFinal += context;
    }
    let chatsAllNew = ""

    return promptFinal;

}