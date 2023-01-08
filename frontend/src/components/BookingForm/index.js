import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const BookingForm = ({price, checkIn, checkOut, setCheckIn, setCheckOut}) => {
   const dispatch = useDispatch();
   const history = useHistory();
   const sessionUser = useSelector(state => state.session.user);

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

   const handleSubmit = (e) => {
      e.preventDefault();

      console.log(checkIn, checkOut);
   }

   //Calculate Difference between Check In and Check Out for price calculation
   let date1 = new Date(checkIn)
   let date2 = new Date(checkOut)

   let timeDiff = date2.getTime() - date1.getTime();
   let daysDiff = timeDiff / (1000 * 3600 * 24);

   return <div>
      <form className='booking-form-wrapper' onSubmit={handleSubmit}>
         <ul className='errors-list'>
            {errors.map((error, idx) => <li key={idx}><i className='fa fa-exclamation-circle' />  {error}</li>)}
         </ul>
         <div className='date-inputs'>
            <label>
            CHECK-IN
               <input
                  type="date"
                  value={new Date(checkIn).toISOString().slice(0, 10)}
                  min = {new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  disabled={true}
                  />
            </label>
            CHECK-OUT
               <input
                  type="date"
                  value={new Date(checkOut).toISOString().slice(0, 10)}
                  min = {new Date(checkIn).toISOString().split('T')[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  disabled={true}
                  />
         </div>

         {sessionUser && (
            <button type="submit">Reserve</button>
         )}

         {!sessionUser && (
            <div>Please login or signup to reserve.</div>
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
