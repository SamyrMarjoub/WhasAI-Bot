import venom from "venom-bot"
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

class Pessoa {

    id = "";
    status = "";
    context = [];

    constructor(id, status){
        this.id = id;
        this.status = status;
    }

}

global.pessoas = {};


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

        let pessoaMomento =  new Pessoa(message.from,"0");
       
        if(!global.pessoas[message.from]){
            global.pessoas[pessoaMomento.id] = new Pessoa(message.from,"0");
        }

        pessoaMomento =   global.pessoas[message.from];


        console.log(message.from)
       let resposta = ""
        if (message.body) {
            if (message.body === "SAIR") pessoaMomento.status = "1"
            if(message.body === "RECOMECAR"){ 
                pessoaMomento.status = "0"
                pessoaMomento.context = "";
            }
            if(pessoaMomento.status === "1") return
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
                const promptE = "Bem-vindo à Techlooty! Eu sou seu assistente virtual e estou aqui para ajudá-lo a encontrar os produtos que você procura. Você pode contar comigo para responder a todas as suas perguntas e fornecer as informações necessárias para tomar uma decisão informada de compra. Nossa loja oferece uma ampla variedade de produtos eletrônicos, incluindo iPhones e eBooks. Se você estiver interessado em um iPhone 14 Pro Max, ele está disponível por R$7.500,00. Além disso, temos eBooks a partir de R$19,00. Se você quiser saber mais sobre algum produto em particular, por favor, acesse o link www.techlooty.com para obter informações adicionais. Durante nossa conversa, terei o prazer de anotar seu nome e outras informações que você possa compartilhar, para que possamos manter contato e fornecer um atendimento personalizado no futuro. Se você precisar encerrar a conversa e ser atendido por um humano, digite a palavra 'SAIR' a qualquer momento. Por favor, não hesite em me perguntar sobre preços, recursos e qualquer outra coisa que possa ajudá-lo a tomar uma decisão informada de compra. Se você tiver alguma dúvida sobre o processo de compra ou sobre o envio do produto, fique à vontade para perguntar. Obrigado por escolher a Techlooty. Estou aqui para ajudá-lo a ter uma ótima experiência de compra.";

                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system", "content": promptE
                        },
                        { role: "user", "content": generatePrompt(prompt, message.from) }
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
    global.pessoas = pessoaMomento;
    });
}

function generatePrompt(prompt,id) {
    let pessoaMomento = new Pessoa();
    pessoaMomento = global.pessoas[id];

    const capitalizedAnimal = prompt[0].toUpperCase() + prompt.slice(1).toLowerCase();
    const promptAtual = `
      Pergunta: ${capitalizedAnimal}
      Resposta:`;
    if (pessoaMomento.context) {
        pessoaMomento.context.push(promptAtual);
    } else {
        pessoaMomento.context = [];
        pessoaMomento.context.push(promptAtual)
    }

    let promptFinal = ``;
    const total = pessoaMomento.context.length - 15;
    const n = total >= 0 ? total : 0;
    for (let i = n; i < pessoaMomento.context.length; i++) {
        const context = pessoaMomento.context[i];
        promptFinal += context;
    }
    let chatsAllNew = ""

    global.pessoas[id] = pessoaMomento;

    return promptFinal;

}