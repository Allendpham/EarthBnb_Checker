'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ReviewImages', [
      {
        reviewId: 1,
        url: 'Example url 1'
      },
      {
        reviewId: 2,
        url: 'Example url 2'
      },
      {
        reviewId: 3,
        url: 'Example url 3'
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('ReviewImages', {
      url: {[Op.in]: ['Example url 1', 'Example url 2', 'Example url 3']}
  }, {})
  }
};
