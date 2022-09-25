'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: 'Example url 1',
        preview: true
      },
      {
        spotId: 2,
        url: 'Example url 2',
        preview: true
      },
      {
        spotId: 3,
        url: 'Example url 3',
        preview: true
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('SpotImages', {
      url: {[Op.in]: ['Example url 1', 'Example url 2', 'Example url 3']}
  }, {})
  }
};
