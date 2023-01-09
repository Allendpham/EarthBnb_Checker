import React from 'react';
import {useEffect} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {getAllSpots, actionRemoveASpot} from '../../store/spots';
import { actionGetReviewsOfUser, actionDeleteAReview } from '../../store/reviews';
import { actionGetBookingsOfUser, actionDeleteBooking } from '../../store/bookings';
import './index.css';

function AccountPage (){
   const dispatch = useDispatch();
   const spotsArr = useSelector(state => Object.values(state.spots.allSpots));
   const sessionUser = useSelector((state) => state.session.user);
   const userReviewsArr = useSelector(state => Object.values(state.reviews.user));
   const userBookingsArr = useSelector(state => Object.values(state.bookings.user));

   useEffect(() => {
      dispatch(getAllSpots());
      dispatch(actionGetReviewsOfUser());
      dispatch(actionGetBookingsOfUser());
   }, [dispatch])

   const ownedSpots = spotsArr?.filter((spot) => spot.ownerId === sessionUser.id);

   //Helper Function to Parse Review Dates
   const createDate = (createdAt) => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      const date = new Date(createdAt);
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return [month, year];
   }

   const displayStars = (int) => {
      let arr = [];
      for(let i = 0; i < int; i++) {
         arr.push("★");
      };
      return arr.join(" ");
   }

   //UserReviewsArr && ownedSpots
   //Display a default text if there are no owned spots
   //Display a default text if there are no user reviews

   let noOwnedSpots = false;
   let noOwnedReviews = false;

   if(ownedSpots.length === 0) noOwnedSpots = true;
   if(noOwnedReviews.length === 0) noOwnedReviews = true;

   return (

      <div className='account-page-wrapper'>
         <div className='account-page-module'>
            <ul className='user-info'>
               <li><div>Username</div>{sessionUser?.username}</li>
               <li><div>Email</div>{sessionUser?.email}</li>
               <li><div>First Name</div>{sessionUser?.firstName}</li>
               <li><div>Last Name</div>{sessionUser?.lastName}</li>
            </ul>
         </div>

         <div className='account-page-info-wrapper'>
            <h1>Hi, {sessionUser?.firstName}</h1>

            <h2>Manage Your Upcoming Trips</h2>
            {userBookingsArr.length < 1 && <h4>You currently do not have any upcoming trips.</h4>}
            <ul>
               {userBookingsArr?.map((booking) => (
                  <li key={booking?.id}>
                     <NavLink className="link" key={booking?.Spot?.id} to={`/spots/${booking?.Spot?.id}`}><img className='account-spot-image' src={booking?.Spot?.previewImage} alt='SpotImage'/></NavLink>

                     <div className='spot-info'>
                        <div className="spot-name">{booking?.Spot?.name}</div>
                        <div>{booking?.Spot?.city}, {booking?.Spot?.state}</div>
                        ${booking?.Spot?.price} per night
                     </div>

                     <div className='booking-dates'>
                        <div>Start Date: {booking?.startDate}</div>
                        <div>End Date: {booking?.endDate}</div>
                     </div>

                     <div>
                        <button className='review-delete-button' onClick={() => dispatch(actionDeleteBooking(booking?.id))}>Delete</button>
                     </div>
                  </li>
               ))}
            </ul>

            <h2>Manage Your Spots</h2>
            {ownedSpots.length < 1 && (<h4 className='no-owned'>You currently do not own any spots. Consider <NavLink className='no-spot-link' to='/spots/new'> Hosting a Spot! </NavLink></h4>)}
            <ul>
               {ownedSpots?.map((spot) => (
                  <li className='spot-list-item' key={spot.id}>
                     <NavLink className="link" key={spot.id} to={`/spots/${spot.id}`}><img className='account-spot-image' src={spot.previewImage} alt='SpotImage'/></NavLink>

                     <div className='spot-info'>
                        <div className="spot-name">{spot.name}</div>
                        <div>{spot.city}, {spot.state}</div>
                        ${spot.price} per night
                     </div>

                     <div className='manage-spot-buttons'>
                        <Link className="edit-link" to={`/spots/${spot.id}/edit`}>Edit</Link>
                        <button className='delete-button' onClick={() => dispatch(actionRemoveASpot(spot.id))}>Delete</button>
                     </div>
                  </li>
               ))}
            </ul>

            <h2>Manage Your Reviews</h2>
            {userReviewsArr < 1 && <h4>You currently do not have any reviews.</h4>}
            <ul>
               {userReviewsArr?.map((review) => (
                  <li className='review-item' key={review.id}>
                     <div className='top-review-item'>
                        <div className='review-item-name'>
                           <NavLink className='review-link' key={review?.Spot?.id} to={`/spots/${review?.Spot?.id}`}>{review?.Spot?.name}</NavLink>
                        </div>
                        <div className='review-item-date'>{createDate(review?.createdAt)[0]} {createDate(review?.createdAt)[1]}</div>
                        <div className='review-item-date'>{review?.Spot?.city}, {review?.Spot?.state}</div>
                     </div>
                     <div className='review-item-stars'>{displayStars(review?.stars)}</div>
                     {review?.review}
                     <div>
                        <button className='review-delete-button' onClick={() => dispatch(actionDeleteAReview(review.id))}>Delete</button>
                     </div>
                  </li>
               ))}
            </ul>
         </div>
      </div>

   );
};

export default AccountPage;
