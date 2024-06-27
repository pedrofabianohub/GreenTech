const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Configuração do CORS
app.use(cors());

// Exemplo de rota para processar mensagens
app.post('/mensagem', async (req, res) => {
  const mensagemUsuario = req.body.mensagem;

  try {
    // Lógica para processar a mensagem e enviar resposta
    const respostaGemini = await chatSession.sendMessage(mensagemUsuario);
    res.json({ resposta: respostaGemini.response.text() });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao processar a mensagem.' });
  }
});

module.exports = app;