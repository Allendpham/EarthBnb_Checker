import { useEffect } from 'react';
import { useParams, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { actionGetOneSpot, getAllSpots } from "../../store/spots";
import { actionGetReviewsOfSpot } from '../../store/reviews';
import ReviewItem from '../ReviewItem';
import './index.css';

const SpotShow = () => {
   const dispatch = useDispatch();
   const {spotId} = useParams();
   const singleSpot = useSelector(state => state.spots.singleSpot);
   const spotReviewsArr = useSelector(state => Object.values(state.reviews.spot));
   const sessionUser = useSelector(state => state.session.user);

   const allSpotsObj = useSelector(state => state.spots.allSpots);
   const chosenSpot = allSpotsObj[spotId];

   //Use AllSpots to display base information?
   //Or Use persist package

   useEffect(() => {
      // dispatch(getAllSpots());
      dispatch(actionGetOneSpot(parseInt(spotId)));
      dispatch(actionGetReviewsOfSpot(parseInt(spotId)));
   }, [dispatch, spotId])


   if(!Object.keys(singleSpot).length || !spotReviewsArr) return null;

   let displayRating;
   if(chosenSpot?.avgRating === 0) displayRating = "No Current Reviews";
   else if(Number.isInteger(chosenSpot?.avgRating)) displayRating = `${chosenSpot?.avgRating}.0`;
   else displayRating = chosenSpot?.avgRating;

   //There must be a currently logged in user to create a review
   //AND
   //Current Session User cannot be the owner of the spot
   //AND
   //Currently does not have a review for that given spot
   let allowCreate = false;
   if(sessionUser){
      let ownedReview = spotReviewsArr.find((review) => review.userId === sessionUser.id)
      if((sessionUser.id !== singleSpot.ownerId) && !ownedReview) allowCreate = true;
   }

   let extraImagesArr = singleSpot.SpotImages?.slice(1);

   return (
      <div className='spot-show-wrapper'>
         <div className='top-info'>
            <h1>{chosenSpot?.name}</h1>
            <div>
               <span>★ {displayRating} · </span>
               <span>{singleSpot?.numReviews} reviews · </span>
               <span>{chosenSpot?.city}, {chosenSpot?.state}, {chosenSpot?.country}</span>
            </div>
         </div>

         <div className='img-wrapper'>
            <img className="main-img" src={chosenSpot?.previewImage} alt="SpotImage" />

            <div className="other-images-grid">
               <ul>
                  {extraImagesArr?.map((image) => (
                     <li className='extra-pics' key={image.id}><img src={image.url} alt="SecondarySpotImage"/></li>
                  ))}
               </ul>
            </div>
         </div>

         <div className='middle-info-wrapper'>
            <div className='bot-info'>
               <h2>Hosted by {singleSpot?.Owner?.firstName}</h2>
               <p>{chosenSpot?.description}</p>
               <div className="more-info">
                  <div>
                     <div className="more-info-title">Self check-in</div>
                     Check yourself in with the lockbox.
                  </div>
                  <div>
                     <div className="more-info-title">Highly rated Host</div>
                     {singleSpot?.Owner?.firstName} has received great ratings from guests!
                  </div>
                  <div className="more-info-title">Free cancellation for 48 hours.</div>
               </div>
            </div>
            <div className='price-module'>
               <div className='top-price-module'>
                  <span><span className='module-price-number'>${chosenSpot?.price}</span> per night</span>
                  <span className='module-rating'>★ {displayRating} · {singleSpot?.numReviews} reviews</span>
               </div>
               <div className='bot-price-module'>
                  <div className='calculation'>
                     <div>${chosenSpot?.price} x 5 nights</div>
                     <div>${(chosenSpot?.price * 5)}</div>
                  </div>

                  <div className='calculation'>
                     <div>Cleaning fee</div>
                     <div>$100</div>
                  </div>

                  <div className='calculation'>
                     <div>Service fee</div>
                     <div>$255</div>
                  </div>

                  <div className='final calculation'>
                     <div>Total before taxes</div>
                     <div>${(chosenSpot?.price * 5 + 100 + 255)}</div>
                  </div>
               </div>
            </div>
         </div>

         <div className='review-wrapper'>
            <h3>★ {displayRating} · {singleSpot?.numReviews} reviews</h3>
            {allowCreate &&
               <NavLink className='leave-a-review-link' to={`/spots/${spotId}/reviews/new`}>Leave a Review!</NavLink>
            }
            <ul className='review-list'>
               {spotReviewsArr?.map(review => (
                  <li key={review.id}><ReviewItem review={review}/></li>
               ))}
            </ul>
         </div>
      </div>
   );
}

export default SpotShow;
