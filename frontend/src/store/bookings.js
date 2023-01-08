import { csrfFetch } from "./csrf";

//Action Constants
const GET_BOOKINGS_OF_SPOT = 'bookings/getBookingsOfSpot';

//Action Creators
const getBookingsOfSpot = (bookings) => {
   return {
      type: GET_BOOKINGS_OF_SPOT,
      bookings
   }
}

//Thunks
export const actionGetBookingsOfSpot = (spotId) => async (dispatch) => {
   const response = await csrfFetch(`/api/spots/${spotId}/bookings`);

   if(response.ok){
      const data = await response.json();
      console.log('tahtiastlas', data)
      dispatch(getBookingsOfSpot(data));
      return response;
   }
}

//Reducer
const initialState = {spot: {}, user: {}}
const bookingsReducer = (state = initialState, action) => {
   switch(action.type){
      case GET_BOOKINGS_OF_SPOT: {
         const newState = {...state, spot: {}, user: {}};
         action.bookings.Bookings.forEach((booking) => (newState.spot[booking.id] = booking));
         return newState;
      }



      default:
         return state;
   }
}

export default bookingsReducer;
