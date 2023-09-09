const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const apiCredentials = require('./middlewares/apiCredentials');

const app = express();

// Configurações de middlewares
app.use(helmet()); // Adiciona headers de segurança
app.use(morgan('combined')); // Gera registros de requisições no console
app.use(express.static('./images')); // Permite servir arquivos estáticos a partir do diretório "./images"
app.use(cors()); // Habilita o suporte a Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Analisa o corpo da requisição e interpreta JSON
app.use(apiCredentials); // Middleware personalizado para validação de credenciais de API

// Limitador de taxa de requisições
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Muitas requisições originadas desta IP',
});
app.use(limiter); // Aplica o limitador de taxa a todas as rotas

// Dados de exemplo
let nextId = 3;
const times = [
  { id: 1, nome: 'São Paulo Futebol Clube', sigla: 'SPF' },
  { id: 2, nome: 'Sociedade Esportiva Palmeiras', sigla: 'PAL' },
];

// Middleware para validar o corpo da requisição
const validarTime = (req, res, next) => {
  const { nome, sigla } = req.body;
  if (!nome) return res.status(400).json({ message: 'O campo "nome" é obrigatório' });
  if (!sigla) return res.status(400).json({ message: 'O campo "sigla" é obrigatório' });
  next();
};

// Rotas
app.get('/times', (req, res) => res.json(times)); // Rota para obter todos os times

app.get('/times/:id', (req, res) => {
  const id = Number(req.params.id);
  const time = times.find((t) => t.id === id);
  if (time) {
    res.json(time); // Retorna o time se encontrado
  } else {
    res.sendStatus(404); // Retorna código de status 404 se o time não for encontrado
  }
});

app.post('/times', validarTime, (req, res) => {
  if (!times.some((t) => t.sigla === req.body.sigla)) {
    const time = { id: nextId, ...req.body };
    times.push(time); // Adiciona o novo time ao array de times
    nextId += 1; // Incrementa o ID para o próximo time
    res.status(201).json(time); // Retorna o novo time com o código de status 201 (Created)
  } else {
    res.status(422).json({ message: 'Já existe um time com essa sigla' }); // Retorna código de status 422 (Unprocessable Entity) se a sigla do time já existir
  }
});

app.put('/times/:id', validarTime, (req, res) => {
  const id = Number(req.params.id);
  const time = times.find((t) => t.id === id);
  if (time) {
    const index = times.indexOf(time);
    const atualizado = { id, ...req.body };
    times.splice(index, 1, atualizado); // Atualiza o time no array de times
    res.status(201).json(atualizado); // Retorna o time atualizado com o código de status 201 (Created)
  } else {
    res.sendStatus(400); // Retorna código de status 400 (Bad Request) se o time não for encontrado
  }
});

app.delete('/times/:id', (req, res) => {
  const id = Number(req.params.id);
  const time = times.find((t) => t.id === id);
  if (time) {
    const index = times.indexOf(time);
    times.splice(index, 1); // Remove o time do array de times
  }
  res.sendStatus(204); // Retorna código de status 204 (No Content) para indicar que a operação foi bem-sucedida, mas não há conteúdo para enviar na resposta
});

// Rota 404 - Será executada se nenhuma das rotas anteriores corresponder à requisição
app.use((req, res) => res.sendStatus(404));

module.exports = app; // Exporta a instância do aplicativo (app) para uso em outros arquivos
