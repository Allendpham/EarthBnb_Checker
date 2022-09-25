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

//Create a spot
router.post('/', requireAuth, async( req, res, next ) => {
   const userId = req.user.id;
   const {address, city, state, country, lat, lng, name, description, price} = req.body;

   try{
   const newSpot = await Spot.create({
      ownerId: userId,
      address,
      city,
      state,
      country,
      lat: lat,
      lng: lng,
      name,
      description,
      price
   })
      res.statusCode = 201;
      res.json(newSpot)
   } catch (err){
         const error = new Error('Validation Error')
         error.statusCode = 400;
         error.errors = {
         "address": "Street address is required",
         "city": "City is required",
         "state": "State is required",
         "country": "Country is required",
         "lat": "Latitude is not valid",
         "lng": "Longitude is not valid",
         "name": "Name must be less than 50 characters",
         "description": "Description is required",
         "price": "Price per day is required"
       };
       console.log(error)
       res.json({
         message: 'Validation Error',
         ...error
      });
   }
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
