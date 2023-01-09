import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { actionCreateBooking } from "../../store/bookings";
import './index.css';

const BookingForm = ({price, checkIn, checkOut, setCheckIn, setCheckOut}) => {
   const dispatch = useDispatch();
   const history = useHistory();
   const sessionUser = useSelector(state => state.session.user);
   const singleSpot = useSelector(state => state.spots.singleSpot);

   // let tempCheckOutDate = new Date();
   // tempCheckOutDate.setDate(tempCheckOutDate.getDate() + 5);
   // const tempCheckOutMonth = tempCheckOutDate.getMonth() + 1;
   // const tempCheckOutDay = tempCheckOutDate.getDate();
   // const tempCheckOutYear = tempCheckOutDate.getFullYear();

   // let strCheckOutMonth = parseNumber(tempCheckOutMonth);
   // let strCheckOutDay = parseNumber(tempCheckOutDay);

   // const [checkIn, setCheckIn] = useState(`${year}-${strCheckInMonth}-${strCheckInDay}`);
   // const [checkOut, setCheckOut] = useState(`${tempCheckOutYear}-${strCheckOutMonth}-${strCheckOutDay}`);
   const [errors, setErrors] = useState([]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setErrors([]);

      if(checkIn === checkOut){
         setErrors(['Check-in and Check-out dates cannot be the same day.'])
         return
      }

      //Parse Dates
      const strCheckIn = checkIn.toISOString().split('T')[0];
      const strCheckOut = checkOut.toISOString().split('T')[0];

      const payload = {
         startDate: strCheckIn,
         endDate: strCheckOut
      }

      let createdBooking = await dispatch(actionCreateBooking(singleSpot.id, payload))
                           .catch(async(res) => {
                              const data = await res.json();
                              if(data && data.errors){
                                 setErrors(Object.values(data.errors));
                                 return
                              }
                           })

      if(createdBooking){
         history.push('/account');
      }

      //Create Booking
      //check for errors
      //upon success, redirect to account page displaying bookings
      //future: redirect to 'Confirm Booking' page instead
   }

   //Calculate Difference between Check In and Check Out for price calculation
   let date1 = new Date(checkIn)
   let date2 = new Date(checkOut)

   let timeDiff = date2.getTime() - date1.getTime();
   let daysDiff = timeDiff / (1000 * 3600 * 24);

   let showButton = true;
   if(sessionUser){
      sessionUser?.id !== singleSpot.ownerId ? showButton = true : showButton = false;
   }

   if(!sessionUser) showButton = false;

   return <div>
      <form className='booking-form-wrapper' onSubmit={handleSubmit}>
         <ul className='errors-list'>
            {errors?.map((error, idx) => <li key={idx}><i className='fa fa-exclamation-circle' />  {error}</li>)}
         </ul>
         <div className='date-inputs'>
            <div>
               CHECK-IN
                  <input
                     type="date"
                     value={new Date(checkIn).toISOString().slice(0, 10)}
                     min = {new Date().toISOString().split('T')[0]}
                     onChange={(e) => setCheckIn(e.target.value)}
                     disabled={true}
                     />
            </div>

            <div className='check-out'>
               CHECK-OUT
                  <input
                     type="date"
                     value={new Date(checkOut).toISOString().slice(0, 10)}
                     min = {new Date(checkIn).toISOString().split('T')[0]}
                     onChange={(e) => setCheckOut(e.target.value)}
                     disabled={true}
                     />
            </div>
         </div>

         {showButton && (
         <>
            <button id='reserve-button' type="submit">Reserve</button>
            <div className='disclaimer'>You won't be charged yet</div>
         </>
         )}

         {sessionUser?.id === singleSpot?.ownerId && (
            <div>You own this spot!</div>
         )}

         {!sessionUser && (
            <div className='disclaimer'>Please login or signup to reserve.</div>
         )}
      </form>

      <div className='bot-price-module'>
         <div className='calculation'>
            <div>${price} x ${daysDiff} nights</div>
            <div>${(price * daysDiff)}</div>
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
            <div>${(price * daysDiff + 100 + 255)}</div>
         </div>
      </div>
   </div>
}

export default BookingForm;
