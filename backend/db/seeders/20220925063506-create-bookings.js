'use strict';

const { query } = require("express");

module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.bulkInsert('Bookings', [
    {
      spotId: 1,
      userId: 2,
      startDate: '2023-01-01',
      endDate: '2023-01-07'
    },
    {
      spotId: 2,
      userId: 1,
      startDate: '2023-02-01',
      endDate: '2023-02-07'
    },
    {
      spotId: 3,
      userId: 3,
      startDate: '2023-03-01',
      endDate: '2023-03-07'
    }
   ], {})
  },

  async down (queryInterface, Sequelize) {
   const Op = Sequelize.Op;
   return queryInterface.bulkDelete('Bookings', {
    spotId: { [Op.in]: [1, 2, 3] }
   }, {})
  }
};
