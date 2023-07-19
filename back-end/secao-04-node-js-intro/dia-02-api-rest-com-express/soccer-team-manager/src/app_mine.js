const express = require('express');

const teams = [
    {
      id: 1,
      name: 'São Paulo Futebol Clube',
      initials: 'SPF',
    },
    {
      id: 2,
      name: 'Clube Atlético Mineiro',
      initials: 'CAM',
    },
  ];

const app = express();

app.use(express.json());

const OK = 200;

app.get('/', (req, res) => res.status(OK).json({ message: 'Olá Mundo!' }));

app.get('/teams', (req, res) => res.status(OK).json({ teams }));

app.post('/teams', (req, res) => {
    const newTeam = { ...req.body };
    teams.push(newTeam);
  
    res.status(201).json({ team: newTeam });
  });

app.put('/teams/:id', (req, res) => {
  const { id } = req.params;
  const { name, initials } = req.body;

  const updateTeam = teams.find((team) => team.id === Number(id));

  if (!updateTeam) {
    return res.status(404).json({ message: 'Team not found' });
  }

  updateTeam.name = name;
  updateTeam.initials = initials;
  res.status(200).json({ updateTeam });
});

app.get('/teams/:id', (req, res) => {
    const { id } = req.params;
    const teamFound = teams.find((team) => team.id === Number(id));
    if (!teamFound) {
        return res.status(404).json({ message: 'Team not found' });
    }
    res.status(201).json({ teamFound });
});

/* const validateTeam = (req, res, next) => {
  // Lista de propriedades obrigatórias nos objetos enviados no corpo das requisições.
  const requiredProperties = ['nome', 'sigla'];
  
  // Verifica se todas as propriedades obrigatórias estão presentes no corpo da requisição.
  if (requiredProperties.every((property) => property in req.body)) {
    next(); // Chama o próximo middleware ou rota, se a validação for bem-sucedida.
  } else {
    res.sendStatus(400); // Responde com código de status 400 (Bad Request) se a validação falhar.
  }
}; */

/* app.post('/teams', validateTeam, (req, res) => {
  // Cria um novo objeto de time com um ID único (gerado através da variável 'nextId')
  // e as informações fornecidas no corpo da requisição.
  const team = { id: nextId, ...req.body };
  
  // Adiciona o novo time à lista de times.
  teams.push(team);
  
  // Incrementa o valor de 'nextId' para garantir que o próximo time tenha um ID único.
  nextId += 1;
  
  // Responde com o novo time criado em formato JSON e código de status 201 (Created).
  res.status(201).json(team);
}); */

module.exports = app;