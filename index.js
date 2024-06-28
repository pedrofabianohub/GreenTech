const express = require('express');
const cors = require('cors');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const app = express();
app.use(express.json());

app.use(cors());

const port = process.env.PORT || 8000;

const apiKey = 'AIzaSyCUSwm5rHE-ut59qGlw437xYn6idrnxId0';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Aja como um assistente para um agricultor. Utilize palavras simples, e se possivel, desenhe com caracteres algumas coisas. o assistente deve ser intuitivo e acessivel. Utilize o nome GreenTech como nome do assistente. para a resposta utilize apenas uma chave.\n\nex: texto\n\nesse texto acima é apenas um exemplo de como você não deve mandar o texto, você não deve colocar um olá toda vez que for dar uma resposta. a saída não deve ter chaves, somente o texto.",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

app.get('/', (req, res) => {
  res.json('hello world');
});

app.post('/', async (req, res) => {
  const mensagemUsuario = req.body.mensagem;
  console.log('Mensagem recebida:', mensagemUsuario);

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const respostaGemini = await chatSession.sendMessage(mensagemUsuario);
    console.log('Resposta da API:', respostaGemini.response.text());
    res.json({ resposta: respostaGemini.response.text() });
  } catch (erro) {
    console.error('Erro ao chamar a API:', erro);
    res.status(500).json({ erro: 'Erro ao processar a mensagem.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;
