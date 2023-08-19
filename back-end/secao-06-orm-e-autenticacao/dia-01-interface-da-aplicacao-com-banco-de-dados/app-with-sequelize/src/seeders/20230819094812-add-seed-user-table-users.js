'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.bulkInsert("Users", [
      {
        fullName: "Antônio",
        email: "antonio@email.com",
        // usamos a função CURRENT_TIMESTAMP do SQL para salvar a data e hora atual nos campos `createdAt` e `updatedAt`
        createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      {
        fullName: "Pedro",
        email: "pedro@email.com",
        // usamos a função CURRENT_TIMESTAMP do SQL para salvar a data e hora atual nos campos `createdAt` e `updatedAt`
        createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    ]),

  down: async (queryInterface, Sequelize) =>
    queryInterface.bulkDelete("Users", null, {}),
};
