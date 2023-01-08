import { useEffect } from 'react';
import { useState } from 'react';
import { useParams, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { actionGetOneSpot, getAllSpots } from "../../store/spots";
import { actionGetReviewsOfSpot } from '../../store/reviews';
import { actionGetBookingsOfSpot } from '../../store/bookings';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import ReviewItem from '../ReviewItem';
import BookingForm from '../BookingForm';
import './index.css';

const SpotShow = () => {
   const dispatch = useDispatch();
   const {spotId} = useParams();
   const singleSpot = useSelector(state => state.spots.singleSpot);
   const spotReviewsArr = useSelector(state => Object.values(state.reviews.spot));
   const sessionUser = useSelector(state => state.session.user);

   const allSpotsObj = useSelector(state => state.spots.allSpots);
   const chosenSpot = allSpotsObj[spotId];

   const spotBookingsArr = useSelector(state => Object.values(state.bookings.spot));

   const tomorrow = new Date()
   tomorrow.setDate(tomorrow.getDate() + 1)

   let tempCheckOutDate = new Date();
   tempCheckOutDate.setDate(tempCheckOutDate.getDate() + 5);

   const [checkIn, setCheckIn] = useState(tomorrow);
   const [checkOut, setCheckOut] = useState(tempCheckOutDate);

   const [dates, setDates] = useState([
      {
         startDate: tomorrow,
         endDate: new Date(checkOut),
         key: 'selection'
     }
   ])

   useEffect(() => {
      // dispatch(getAllSpots());
      dispatch(actionGetOneSpot(parseInt(spotId)));
      dispatch(actionGetReviewsOfSpot(parseInt(spotId)));
      dispatch(actionGetBookingsOfSpot(parseInt(spotId)));
   }, [dispatch, spotId])


   if(!Object.keys(singleSpot).length || !spotReviewsArr) return null;

   const handleSelect = (e) => {
      setCheckIn(e.selection.startDate)
      setCheckOut(e.selection.endDate)
      setDates([e.selection])
   }

   //Code to handle avgRating
   let displayRating;
   let ratingArr = singleSpot?.avgStarRating?.toString().split('');

   if(Number(singleSpot?.avgStarRating) === 0) displayRating = "No Current Reviews";
   else if(Number.isInteger(Number(singleSpot?.avgStarRating))) displayRating = `${Number(singleSpot?.avgStarRating)}.0`;
   else if(ratingArr.slice(2).length === 1) displayRating = singleSpot?.avgStarRating;
   else displayRating = parseFloat(singleSpot?.avgStarRating).toFixed(2);

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
            <h1>{singleSpot?.name}</h1>
            <div>
               <span>★ {displayRating} · </span>
               <span>{singleSpot?.numReviews} reviews · </span>
               <span>{singleSpot?.city}, {singleSpot?.state}, {singleSpot?.country}</span>
            </div>
         </div>

         <div className='img-wrapper'>
            <img className="main-img" src={singleSpot?.SpotImages[0].url} alt="SpotImage" />

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
               <p>{singleSpot?.description}</p>
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

                  <div className='existing-bookings'>
                  <div className="calendar">
                                <div className="calendar-header">Available Dates</div>
                                <DateRange
                                    ranges={dates}
                                    editableDateInputs={false}
                                    moveRangeOnFirstSelection={false}
                                    rangeColors={['black']}
                                    onChange={(e) => handleSelect(e)}
                                    showDateDisplay={false}
                                    months={2}
                                    minDate={new Date()}
                                    direction={"horizontal"}
                                    // disabledDates={[new Date()]}
                                />
                            </div>

                  </div>
               </div>
            </div>
            <div className='price-module'>
               <div className='top-price-module'>
                  <span><span className='module-price-number'>${singleSpot?.price}</span> per night</span>
                  <span className='module-rating'>★ {displayRating} · {singleSpot?.numReviews} reviews</span>
               </div>

               <div className='booking-form'>
                  <BookingForm price={singleSpot?.price} checkIn={checkIn} checkOut={checkOut} setCheckIn={setCheckIn} setCheckOut={setCheckOut} />
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
