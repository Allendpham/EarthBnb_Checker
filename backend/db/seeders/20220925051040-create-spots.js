'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Spots', [
      {
        ownerId: 4,
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
        name: 'Humble Seclusion',
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
      },
      {
        ownerId: 4,
        address: '420 Wallaby Way',
        city: 'Sydney',
        state: 'North Dakota',
        country: 'United States of America',
        lat: 46.7308,
        lng: 98.7698,
        name: "Dory Finding",
        description: 'A modern home with beautiful blue views.',
        price: 255
      },
      {
        ownerId: 2,
        address: '369 Walker Dr',
        city: 'Madrid',
        state: 'Iowa',
        country: 'United States of America',
        lat: 41.8780,
        lng: 93.8157,
        name: "A Trip to Spain",
        description: 'A spaniard inspired home with plenty of space.',
        price: 315
      },
      {
        ownerId: 3,
        address: '100 Forest Way',
        city: 'Forest City',
        state: 'Kentucky',
        country: 'United States of America',
        lat: 35.3340,
        lng: 81.8651,
        name: "Kid Cud",
        description: 'Experience the day and night transformation.',
        price: 410
      },
      {
        ownerId: 1,
        address: '145 Ocean Dr',
        city: 'Galveston',
        state: 'Texas',
        country: 'United States of America',
        lat: 29.3013,
        lng: 94.7977,
        name: "Ocean Front",
        description: 'Stay close to the ocean in this great beach home.',
        price: 360
      },
      {
        ownerId: 2,
        address: '970 Stoneriver Ln',
        city: 'Eufaula',
        state: 'Alabama',
        country: 'United States of America',
        lat: 31.8913,
        lng: 85.1455,
        name: "Rich Comfort",
        description: 'A luxury home set within a lush forest.',
        price: 625
      },
      {
        ownerId: 3,
        address: '570 Tropical Dr',
        city: 'Miami',
        state: 'Florida',
        country: 'United States of America',
        lat: 25.7617,
        lng: 80.1918,
        name: "Modern Tropica",
        description: 'A tropical inspired home with a modern interior.',
        price: 375
      },
      {
        ownerId: 1,
        address: '200 Island Dr',
        city: 'Phoenix',
        state: 'Arizona',
        country: 'United States of America',
        lat: 33.4488,
        lng: 112.0740,
        name: "A Taste of Luxury",
        description: 'This luxury home comes with all the bells and whistles.',
        price: 950
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Spots', {
      ownerId: { [Op.in]: [1,2,3]}
    }, {})
  }
};
