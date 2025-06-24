'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'resetToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('users', 'resetToken');
  }
};