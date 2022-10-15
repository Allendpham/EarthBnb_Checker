import React from 'react';
import {useEffect} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {getAllSpots, actionRemoveASpot} from '../../store/spots';
import { actionGetReviewsOfUser, actionDeleteAReview } from '../../store/reviews';

function AccountPage (){
   const dispatch = useDispatch();
   const spotsArr = useSelector(state => Object.values(state.spots.allSpots));
   const sessionUser = useSelector((state) => state.session.user);
   const userReviewsArr = useSelector(state => Object.values(state.reviews.user));

   useEffect(() => {
      dispatch(getAllSpots());
      dispatch(actionGetReviewsOfUser());
   }, [dispatch])

   const ownedSpots = spotsArr.filter((spot) => spot.ownerId === sessionUser.id);

   return (
      <div className='account-page-wrapper'>
         <h1>Hello {sessionUser.username}</h1>
         <h2>Owned Spots</h2>
         <ul>
            {ownedSpots?.map((spot) => (
               <li key={spot.id}>
                  <NavLink key={spot.id} to={`/spots/${spot.id}`}>{spot.name}</NavLink>
                  <Link to={`/spots/${spot.id}/edit`}>Edit</Link>
                  <button onClick={() => dispatch(actionRemoveASpot(spot.id))}>Delete</button>
               </li>
            ))}
         </ul>

         <h2>Your Reviews</h2>
         <ul>
            {userReviewsArr.map((review) => (
               <li key={review.id}>{review.review}{review.stars}
                  <button onClick={() => dispatch(actionDeleteAReview(review.id))}>Delete</button>
               </li>
            ))}
         </ul>
      </div>
   );
};

export default AccountPage;
