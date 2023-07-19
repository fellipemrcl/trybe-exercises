const chai = require("chai"); // Importando a biblioteca Chai, que fornece vários métodos de asserção para testes.
const chaiHttp = require("chai-http"); // Importando a biblioteca chai-http, que permite fazer solicitações HTTP para testes.
const app = require("../../app"); // Importando o aplicativo Express principal que será testado.
const sinon = require("sinon"); // Importando o Sinon, uma biblioteca para criar testes duplos (spies, stubs, mocks).
const fs = require("fs"); // Importando o módulo de sistema de arquivos para ler arquivos.

const { expect } = chai; // Destruturando 'expect' do Chai para um código de teste mais conciso.

chai.use(chaiHttp); // Habilitando o plugin chai-http para fazer solicitações HTTP nos testes.

// O JSON a seguir representa o conteúdo simulado de um arquivo que será usado nos testes.
const mockFile = JSON.stringify({
  brands: [
    {
      id: 1,
      name: "Lindt & Sprungli",
    },
    {
      id: 2,
      name: "Ferrero",
    },
    {
      id: 3,
      name: "Ghirardelli",
    },
  ],
  chocolates: [
    {
      id: 1,
      name: "Mint Intense",
      brandId: 1,
    },
    {
      id: 2,
      name: "White Coconut",
      brandId: 1,
    },
    {
      id: 3,
      name: "Mon Chéri",
      brandId: 2,
    },
    {
      id: 4,
      name: "Mounds",
      brandId: 3,
    },
  ],
});

describe("Usando o método GET em /chocolates", function () {
  // Configurando um gancho "beforeEach", que será executado antes de cada teste neste bloco "describe".
  beforeEach(function () {
    // Substituindo o método "readFile" de "fs.promises" para retornar o conteúdo simulado do arquivo.
    sinon.stub(fs.promises, "readFile").resolves(mockFile);
  });

  // Configurando um gancho "afterEach", que será executado após cada teste neste bloco "describe".
  afterEach(function () {
    // Restaurando o comportamento original do método "readFile" para evitar interferências em outros testes.
    sinon.restore();
  });

  // O primeiro caso de teste dentro deste bloco "describe".
  it("Retorna a lista completa de chocolates!", async function () {
    // Saída esperada para a solicitação feita para "/chocolates".
    const output = [
      { id: 1, name: "Mint Intense", brandId: 1 },
      { id: 2, name: "White Coconut", brandId: 1 },
      { id: 3, name: "Mon Chéri", brandId: 2 },
      { id: 4, name: "Mounds", brandId: 3 },
    ];

    // Fazendo uma solicitação HTTP GET para o endpoint "/chocolates" do aplicativo.
    const response = await chai.request(app).get("/chocolates");

    // Verificando se o status da resposta é 200 (OK).
    expect(response.status).to.be.equals(200);

    // Verificando se o corpo da resposta contém a propriedade "chocolates" igual à saída esperada.
    expect(response.body.chocolates).to.deep.equal(output);
  });

  // Bloco "describe" para testar o endpoint "/chocolates/:id" com ID 4.
  describe("Usando o método GET em /chocolates/:id para buscar o ID 4", function () {
    it("Retorna o chocolate Mounds", async function () {
      // Fazendo uma solicitação HTTP GET para o endpoint "/chocolates/4" do aplicativo.
      const response = await chai.request(app).get("/chocolates/4");

      // Verificando se o status da resposta é 200 (OK).
      expect(response.status).to.be.equal(200);

      // Verificando se o corpo da resposta é igual ao objeto de chocolate esperado com ID 4.
      expect(response.body.chocolate).to.deep.equal({
        id: 4,
        name: "Mounds",
        brandId: 3,
      });
    });
  });

  // Bloco "describe" para testar o endpoint "/chocolates/:id" com um ID inválido (ID 99).
  describe("Usando o método GET em /chocolates/:id para buscar o ID 99", function () {
    it('Retorna status 404 com a mensagem "Chocolate not found"', async function () {
      // Fazendo uma solicitação HTTP GET para o endpoint "/chocolates/99" do aplicativo.
      const response = await chai.request(app).get("/chocolates/99");

      // Verificando se o status da resposta é 404 (Não encontrado).
      expect(response.status).to.be.equal(404);

      // Verificando se o corpo da resposta contém a mensagem de erro esperada.
      expect(response.body).to.deep.equal({ message: "Chocolate not found" });
    });
  });

  // Bloco "describe" para testar o endpoint "/chocolates/brand/:brandId" com brandId 1.
  describe("Usando o método GET em /chocolates/brand/:brandId para buscar brandId 1", function () {
    it("Retorna os chocolates da marca Lindt & Sprungli", async function () {
      // Fazendo uma solicitação HTTP GET para o endpoint "/chocolates/brand/1" do aplicativo.
      const response = await chai.request(app).get("/chocolates/brand/1");

      // Verificando se o status da resposta é 200 (OK).
      expect(response.status).to.be.equal(200);

      // Verificando se o corpo da resposta contém os chocolates associados ao brandId 1.
      expect(response.body.chocolates).to.deep.equal([
        {
          id: 1,
          name: "Mint Intense",
          brandId: 1,
        },
        {
          id: 2,
          name: "White Coconut",
          brandId: 1,
        },
      ]);
    });
  });

  describe('Usando o método GET em /chocolates/total', function () {
    it('Retorna a quantidade total de chocolates', async function () {
      const response = await chai.request(app).get('/chocolates/total');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({ totalChocolates: 4 });
    })
  });
});
