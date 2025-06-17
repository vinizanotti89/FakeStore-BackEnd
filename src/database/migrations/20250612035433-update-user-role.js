'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove a coluna antiga
    await queryInterface.removeColumn('users', 'admin');

    // Adiciona a nova coluna 'role'
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user',
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverte: remove 'role' e adiciona 'admin' de volta
    await queryInterface.removeColumn('users', 'role');

    await queryInterface.addColumn('users', 'admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  }
};
