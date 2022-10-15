import { useEffect } from 'react';
import { useParams, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { actionGetOneSpot } from "../../store/spots";
import { actionGetReviewsOfSpot } from '../../store/reviews';
import ReviewItem from '../ReviewItem';

const SpotShow = () => {
   const dispatch = useDispatch();
   const {spotId} = useParams();
   const singleSpot = useSelector(state => state.spots.singleSpot);
   const spotReviewsArr = useSelector(state => Object.values(state.reviews.spot));
   const sessionUser = useSelector(state => state.session.user);

   useEffect(() => {
      dispatch(actionGetOneSpot(parseInt(spotId)));
      dispatch(actionGetReviewsOfSpot(parseInt(spotId)));
   }, [dispatch, spotId])


   if(!singleSpot || !spotReviewsArr) return null;

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



   return (
      <div className='spot-show-wrapper'>
         <h1>Hello from SpotShow</h1>
         <h2>{singleSpot?.name}</h2>
         <p>{singleSpot.description}</p>
         <h2>Reviews</h2>
            {allowCreate &&
               <NavLink to={`/spots/${spotId}/reviews/new`}>Leave a Review</NavLink>
            }
         <ul className='review-list'>
            {spotReviewsArr?.map(review => (
               <li key={review.id}><ReviewItem review={review}/></li>
            ))}
         </ul>
      </div>
   );
}

export default SpotShow;
