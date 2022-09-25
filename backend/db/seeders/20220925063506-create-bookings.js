'use strict';

const { query } = require("express");

module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.bulkInsert('Bookings', [
    {
      spotId: 1,
      userId: 2,
      startDate: new Date('January 1, 2023'),
      endDate: new Date('January 7, 2023')
    },
    {
      spotId: 2,
      userId: 1,
      startDate: new Date('February 1, 2023'),
      endDate: new Date('February 7, 2023')
    },
    {
      spotId: 3,
      userId: 3,
      startDate: new Date('March 1, 2023'),
      endDate: new Date('March 7, 2023')
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
