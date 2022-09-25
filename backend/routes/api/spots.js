const express = require('express');
const { Spot, Review, SpotImage, sequelize } = require('../../db/models');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const router = express.Router();

//Get all spots owned by current user
router.get('/current', requireAuth, async(req, res, next) => {
   const userId = req.user.id;
   const ownedSpots = await Spot.findAll({
      where: {
         ownerId: userId
      }
   })
   let resp = []
   for(let i = 0; i < ownedSpots.length; i++){
      const avg = await Review.findAll({
               where: {
                  spotId: ownedSpots[i].id
               },
               attributes: [
                  [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
               ]
            });

      const image = await SpotImage.findAll({
         where: {
            spotId: ownedSpots[i].id
         },
         attribute: ['url']
      })

      let {id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt} = ownedSpots[i];
      resp.push({
               id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt,
               avgRating: Number(avg[0].dataValues.avgRating),
               previewImage: image[0].dataValues.url
            })
   }

   res.json({Spots: resp})
})

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
               avgRating: Number(avg[0].dataValues.avgRating),
               previewImage: image[0].dataValues.url
            })
   }

   res.json({Spots: resp})
})

module.exports = router;
