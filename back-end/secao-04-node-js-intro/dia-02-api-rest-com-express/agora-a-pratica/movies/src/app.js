// Importando o módulo Express
const express = require("express");

// Importando o módulo fs para lidar com operações de arquivo
const fs = require("fs").promises;
const path = require("path");

// Criando uma instância do aplicativo Express
const app = express();

// Habilitando o uso do middleware express.json() para analisar o corpo da solicitação como JSON
app.use(express.json());

// Resolvendo o caminho absoluto para o arquivo movies.json usando o diretório atual (__dirname)
const moviesPath = path.resolve(__dirname, "./movies.json");

// Definindo uma função assíncrona chamada readJson para ler o conteúdo do arquivo movies.json
const readJson = async () => {
  try {
    // Lendo o conteúdo do arquivo movies.json e aguardando a conclusão
    const data = await fs.readFile(moviesPath);

    // Analisando o conteúdo lido como JSON e retornando-o
    return JSON.parse(data);
  } catch (error) {
    // Lidando com erros e exibindo uma mensagem de erro no console
    console.error("Erro na leitura", error);
  }
};

// É importante que essa rota venha antes das demais que apresentam rotas dinâmicas no arquivo app.js para que funcione corretamente.
// Definindo uma rota GET para "/movies/search"
app.get("/movies/search", async (req, res) => {
  try {
    // Obtendo o parâmetro "q" da consulta da solicitação
    const { q } = req.query;

    // Lendo o conteúdo do arquivo movies.json
    const movies = await readJson();

    // Verificando se há um parâmetro de consulta "q" e filtrando os filmes com base nele
    if (q) {
      const filteredMovies = movies.filter((m) => m.movie.includes(q));
      return res.status(200).json(filteredMovies);
    }

    // Enviando uma resposta vazia com status 200 se não houver parâmetro de consulta
    res.status(200).end();
  } catch (error) {
    // Lidando com erros e enviando uma resposta com um status 500 e uma mensagem de erro
    res.status(500).send({ message: error.message });
  }
});

// Definindo uma rota GET para "/movies/:id"
app.get("/movies/:id", async (req, res) => {
  try {
    // Obtendo o parâmetro de ID da solicitação
    const { id } = req.params;

    // Lendo o conteúdo do arquivo movies.json
    const movies = await readJson();

    // Procurando um filme com o ID correspondente dentro do array de filmes
    const movie = movies.find((movie) => movie.id === Number(id));

    // Enviando uma resposta com o filme encontrado (ou undefined se não for encontrado)
    res.status(200).json(movie);
  } catch (error) {
    // Lidando com erros e enviando uma resposta com um status 500 e uma mensagem de erro
    res.status(500).send({ message: error.message });
  }
});

// Definindo uma rota GET para "/movies"
app.get("/movies", async (req, res) => {
  try {
    // Lendo o conteúdo do arquivo movies.json
    const movies = await readJson();

    // Enviando uma resposta com o array de filmes
    res.status(200).json(movies);
  } catch (error) {
    // Lidando com erros e enviando uma resposta com um status 500 e uma mensagem de erro
    res.status(500).send({ message: error.message });
  }
});

// Definindo uma rota POST para "/movies"
app.post("/movies", async (req, res) => {
  try {
    // Obtendo os dados do filme e do preço do corpo da solicitação
    const { movie, price } = req.body;

    // Lendo o conteúdo do arquivo movies.json
    const movies = await readJson();

    // Criando um novo objeto de filme com um ID único
    const newMovie = {
      id: movies[movies.length - 1].id + 1,
      movie,
      price,
    };

    // Convertendo o array de filmes atualizado para uma string JSON
    const allMovies = JSON.stringify([...movies, newMovie]);

    // Escrevendo a nova lista de filmes no arquivo movies.json
    await fs.writeFile(moviesPath, allMovies);

    // Enviando uma resposta com o novo filme adicionado
    res.status(201).json(newMovie);
  } catch (error) {
    // Lidando com erros e enviando uma resposta com um status 500 e uma mensagem de erro
    res.status(500).send({ message: error.message });
  }
});

// Definindo uma rota PUT para "/movies/:id"
app.put("/movies/:id", async (req, res) => {
  try {
    // Obtendo o parâmetro de ID da solicitação
    const { id } = res.params;

    // Obtendo os dados do filme e do preço do corpo da solicitação
    const { movie, price } = req.body;

    // Lendo o conteúdo do arquivo movies.json
    const movies = await readJson();

    // Procurando o índice do filme com o ID correspondente dentro do array de filmes
    const index = movies.findIndex((m) => m.id === Number(id));

    // Atualizando o filme no array de filmes
    movie[index] = {
      id: Number(id),
      movie,
      price,
    };

    // Convertendo a lista de filmes atualizada para uma string JSON
    const updatedMovies = JSON.stringify(movies, null, 2);

    // Escrevendo a lista de filmes atualizada no arquivo movies.json
    await fs.writeFile(moviesPath, updatedMovies);

    // Enviando uma resposta com o filme atualizado
    res.status(200).json(movies[index]);
  } catch (error) {
    // Lidando com erros e enviando uma resposta com um status 500 e uma mensagem de erro
    res.status(500).send({ message: error.message });
  }
});

// Definindo uma rota DELETE para "/movies/:id"
app.delete("/movies/:id", async (req, res) => {
  try {
    // Obtendo o parâmetro de ID da solicitação
    const { id } = req.params;

    // Lendo o conteúdo do arquivo movies.json
    const movies = await readJson();

    // Filtrando os filmes para remover o filme com o ID correspondente
    const filteredMovies = movies.filter((m) => m.id !== Number(id));

    // Convertendo a lista de filmes filtrada para uma string JSON
    const updatedMovies = JSON.stringify(filteredMovies, null, 2);

    // Escrevendo a lista de filmes atualizada no arquivo movies.json
    await fs.writeFile(moviesPath, updatedMovies);

    // Enviando uma resposta com um status 204 (No Content)
    res.status(204).end();
  } catch (error) {
    // Lidando com erros e enviando uma resposta com um status 500 e uma mensagem de erro
    res.status(500).send({ message: error.message });
  }
});

// Exportando o aplicativo Express para uso em outros módulos
module.exports = app;
