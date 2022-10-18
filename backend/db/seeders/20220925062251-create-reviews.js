'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.bulkInsert('Reviews', [
    {
      spotId: 1,
      userId: 3,
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
      userId: 4,
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
      userId: 4,
      review: "It could have been better.",
      stars: 3
    },
    {
      spotId: 4,
      userId: 2,
      review: "The whole family loved this place!",
      stars: 5
    },
    {
      spotId: 4,
      userId: 3,
      review: "I am so glad I chose to stay here!",
      stars: 4
    },
    {
      spotId: 5,
      userId: 4,
      review: "There are much better options out there.",
      stars: 1
    },
    {
      spotId: 5,
      userId: 3,
      review: "The place was amazing but I'm not sure the price was justified.",
      stars: 4
    },
    {
      spotId: 6,
      userId: 1,
      review: "Do not pass up the opportunity to see this place for yourself! Highly recommend.",
      stars: 5
    },
    {
      spotId: 6,
      userId: 2,
      review: "This place was very well kept and clean upon arrival. I would vacation here again!",
      stars: 5
    },
    {
      spotId: 7,
      userId: 2,
      review: "Getting to the location was quite difficult. Besides that, I enjoyed how close the house is to the beach.",
      stars: 4
    },
    {
      spotId: 7,
      userId: 3,
      review: "The kids absolutely loved waking up in the morning and running straight to the beach. Lovely view!",
      stars: 5
    },
    {
      spotId: 8,
      userId: 1,
      review: "The pictures of this location hide the problems of the interior. This place was not well maintained.",
      stars: 2
    },
    {
      spotId: 8,
      userId: 3,
      review: "I have stayed in worse places before but this place wasn't the best either.",
      stars: 3
    },
    {
      spotId: 9,
      userId: 1,
      review: "My wife and I chosen this place as our honeymoon location and we could not have been more happy with our choice.",
      stars: 5
    },
    {
      spotId: 9,
      userId: 2,
      review: "This place was such a deal in terms of price and quality! If you are in between on this location, go for this one!",
      stars: 4
    },
    {
      spotId: 10,
      userId: 2,
      review: "This place is truly a dream but that price is quite daunting.",
      stars: 4
    },
    {
      spotId: 10,
      userId: 3,
      review: "Gosh! Why is this place so expensive. I could have easily spent my money elsewhere for just as nice of a location but for cheaper.",
      stars: 3
    }
   ], {})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Reviews', {
      spotId: {[Op.in]: [1,2,3,4,5,6,7,8,9,10]}
    }, {})
  }
};
