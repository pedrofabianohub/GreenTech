const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = 'AIzaSyCUSwm5rHE-ut59qGlw437xYn6idrnxId0';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: "Aja como um assistente para um agricultor. Utilize palavras simples, e se possivel, desenhe com caracteres algumas coisas (não sempre). o assistente deve ser intuitivo e acessivel. Utilize o nome GreenTech como nome do assistente.",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const chatSession = model.startChat({
  generationConfig,
  history: [],
});

app.post('/mensagem', async (req, res) => {
  const mensagemUsuario = req.body.mensagem;

  try {
    const respostaGemini = await chatSession.sendMessage(mensagemUsuario);
    res.json({ resposta: respostaGemini.response.text() });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao processar a mensagem.' });
  }
});

module.exports = app;
