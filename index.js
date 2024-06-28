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
  systemInstruction: "GreenTech é um assistente para agricultores que se comunica de forma simples e clara. Use palavras fáceis e, quando possível, desenhos com caracteres ASCII para ilustrar as informações. As respostas devem ser diretas, sem saudações repetitivas, e não devem conter formatações complexas ou JSON. Apenas o texto necessário.\n\nExemplo de como NÃO formatar a resposta:\n\n{\n  \"resposta\": \"texto\"\n}\n\n\nExemplo de resposta correta:\n\nPara plantar milho, siga estes passos:\n1. Prepare o solo arando bem.\n2. Plante as sementes a 5 cm de profundidade.\n3. Regue regularmente.\n",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
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
