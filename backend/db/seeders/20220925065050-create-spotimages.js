'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: 'https://i.imgur.com/woWkuos.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/4OHIVwq.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/95OKWXQ.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/AVUpY0z.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/KPLXWc1.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/zby1lfI.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/MLzivSy.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/BXpby91.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/44ZQwRU.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/yBC0dT9.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/cUCulqB.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/iZbXQXr.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/wBlBrR4.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/JocZSGC.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://i.imgur.com/Voh13gF.jpg',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://i.imgur.com/qMfBOxI.jpg',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://i.imgur.com/vWtNEwz.jpg',
        preview: true
      },
      {
        spotId: 9,
        url: 'https://i.imgur.com/qCqLBkq.jpg',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://i.imgur.com/KxCUsl1.jpg',
        preview: true
      },
      {
        spotId: 10,
        url: 'https://i.imgur.com/Uc7wYII.jpg',
        preview: false
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('SpotImages', {
      spotId: {[Op.in]: [1,2,3,4,5,6,7,8,9,10]}
  }, {})
  }
};
