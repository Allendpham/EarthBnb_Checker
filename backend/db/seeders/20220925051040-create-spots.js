'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '123 Allen Ln',
        city: 'Frisco',
        state: 'Texas',
        country: 'United States of America',
        lat: 33.1507,
        lng: 96.8236,
        name: 'Allen Home',
        description: 'Place where Allen built his first home',
        price: 100
      },
      {
        ownerId: 2,
        address: '456 Drivers Ln',
        city: 'Fountain Valley',
        state: 'California',
        country: 'United States of America',
        lat: 33.7090,
        lng: 117.9544,
        name: 'Humble Beginnings',
        description: 'A small locale where big things happen.',
        price: 123
      },
      {
        ownerId: 3,
        address: '789 Stonebrook Ln',
        city: 'New Orleans',
        state: 'Louisiana',
        country: 'United States of America',
        lat: 29.9511,
        lng: 90.0715,
        name: "Creole Corner",
        description: 'A wonderfully southern home with the great scent of food nearby',
        price: 109
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Spots', {
      address: { [Op.in]: ['123 Allen Ln', '456 Drivers Ln', '789 Stonebrook Ln']}
    }, {})
  }
};
