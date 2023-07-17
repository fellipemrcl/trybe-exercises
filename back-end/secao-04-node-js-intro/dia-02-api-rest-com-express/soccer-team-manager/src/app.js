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

module.exports = app;