const express = require('express');
const { Spot, Review, SpotImage, sequelize } = require('../../db/models');
const router = express.Router();

//Get all spots
router.get('/', async(req, res) => {
   const allSpots = await Spot.findAll({});

   let resp = []
   for(let i = 0; i < allSpots.length; i++){
      const avg = await Review.findAll({
               where: {
                  spotId: allSpots[i].id
               },
               attributes: [
                  [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
               ]
            });

      const image = await SpotImage.findAll({
         where: {
            spotId: allSpots[i].id
         },
         attribute: ['url']
      })

      let {id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt} = allSpots[i];
      resp.push({
               id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt,
               avgRating: avg[0].dataValues.avgRating,
               previewImage: image[0].dataValues.url
            })
   }

   res.json({Spots: resp})
})

module.exports = router;
