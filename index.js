import venom from "venom-bot"
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

venom
    .create()
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

function start(client) {
let status = "0"
let id = ""
// if(id !== "" && )
    client.onMessage(async (message) => {
        console.log(message.from)
       let resposta = ""
        if (message.body) {
            if (message.body === "SAIR") status = "1"
            if(message.body === "RECOMECAR") status = "0"
            if(status === "1") return
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
                        {
                            role: "system", "content":
                                "Você é o assistente virtual da loja techlooty, você ira ajudar os clientes com os produtos da loja e sem você detectar que o cliente quer falar com um humano, você o informa para digitar a seguinte palavra SAIR. nossos principais produtos na loja são Iphones e eletronicos, alguns de nossos iphones são o iphone 14 pro max de R$7,500,00 e temos também ebooks a partir de R$19,00! caso o usuario pergunte sobre algum preço de algum produto especifico, informe-o para entrar no link www.techlooty.com para mais informações, caso ele apenas perguntar sobre precos, você o informará sobre os produtos que você sabe. tente não repetir informações caso você detecte que não são necessarias no contexto da conversa, lembre-se de coisas importantes como nome email etc"
                        },
                        { role: "user", "content": generatePrompt(prompt) }
                    ],
                    max_tokens: 300

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
                        id = result.to.remote.user
                        console.log("ID", id)
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
