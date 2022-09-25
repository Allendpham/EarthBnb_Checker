'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.bulkInsert('Reviews', [
    {
      spotId: 1,
      userId: 1,
      review: "This place was awesome!",
      stars: 5
    },
    {
      spotId: 1,
      userId: 2,
      review: "This place was alright.",
      stars: 4
    },
    {
      spotId: 2,
      userId: 1,
      review: "I wish I had chosen another place.",
      stars: 1
    },
    {
      spotId: 2,
      userId: 3,
      review: "This place was okay at best.",
      stars: 3
    },
    {
      spotId: 3,
      userId: 2,
      review: "This place was a dream!",
      stars: 5
    },
    {
      spotId: 3,
      userId: 3,
      review: "It could have been better.",
      stars: 3
    }
   ], {})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Reviews', {
      review: {[Op.in]: ["This place was awesome!",
                          "This place was alright.",
                          "I wish I had chosen another place.",
                          "This place was okay at best.",
                          "This place was a dream!",
                          "It could have been better."]}
    }, {})
  }
};
