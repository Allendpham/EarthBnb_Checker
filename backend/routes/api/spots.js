const express = require('express');
const { Spot, Review, SpotImage, sequelize, User } = require('../../db/models');
const spot = require('../../db/models/spot');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const router = express.Router();

//Add an Image to a Spot based on the Spot's Id
router.post('/:spotId/images', requireAuth, async(req, res, next) => {
   const spot = await Spot.findByPk(req.params.spotId);
   const userId = req.user.id;
   const {url, preview} = req.body;

   if(!spot){
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
   } else if (userId !== spot.ownerId){
      const err = new Error('User is not owner of spot');
      err.status = 403;
      return next(err);
   } else {
      const newImage = await SpotImage.create({
         spotId: spot.id,
         url,
         preview
      })
      res.json({
         id: newImage.id,
         url: newImage.url,
         preview: newImage.preview
      });
   }

})

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
               ],
               raw: true
            });

      const image = await SpotImage.findAll({
         where: {
            spotId: ownedSpots[i].id
         },
         attribute: ['url'],
         raw: true
      })

      let {id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt} = ownedSpots[i];
      resp.push({
               id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt,
               avgRating: Number(avg[0].avgRating),
               previewImage: image[0].url
            })
   }

   res.json({Spots: resp})
})

//Delete a Spot
router.delete('/:spotId', requireAuth, async( req, res, next ) => {
   const spot = await Spot.findByPk(req.params.spotId);
   const userId = req.user.id;

   if(!spot){
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
   } else if (userId !== spot.ownerId){
      const err = new Error('User is not owner of spot');
      err.status = 403;
      return next(err);
   } else {
      await spot.destroy();
      res.json({
         "message": "Successfully deleted",
         "statusCode": 200
      })
   }
})

//Edit a Spot
router.put('/:spotId', requireAuth, async( req, res, next ) => {
   const spot = await Spot.findByPk(req.params.spotId);
   const userId = req.user.id;
   const {address, city, state, country, lat, lng, name, description, price} = req.body;

   if(!spot){
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
   } else if (userId !== spot.ownerId){
      const err = new Error('User is not owner of spot');
      err.status = 403;
      return next(err);
   } else {
      spot.set({
         address, city, state, country, lat, lng, name, description, price
      })
      await spot.save();
      res.json(spot);
   }
})

//Get details of a Spot from an Id
router.get('/:spotId', async( req, res, next ) => {
   const spot = await Spot.findByPk(req.params.spotId, {
      include: [{
         model: SpotImage,
         attributes: ['id', 'url', 'preview']
      }, {
         model: User,
         as: 'Owner',
         attributes: ['id', 'firstName', 'lastName']
      }]
   });

   if(!spot){
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      next(err);
   } else {
      const reviewData = await Review.findAll({
         where: {
            spotId: spot.id
         },
         attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'],
                     [sequelize.fn('COUNT', sequelize.col('id')), 'numReviews']],
         raw: true
      });

      spot.dataValues.numReviews = reviewData[0].numReviews;
      spot.dataValues.avgStarRating = reviewData[0].avgRating;

      res.json(spot)
   }
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
               ],
               raw: true
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
               avgRating: Number(avg[0].avgRating),
               previewImage: image[0].dataValues.url
            })
   }

   res.json({Spots: resp})
})

module.exports = router;
