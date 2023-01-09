import { csrfFetch } from "./csrf";

//Action Constants
const GET_BOOKINGS_OF_SPOT = 'bookings/getBookingsOfSpot';
const GET_BOOKINGS_OF_USER = 'bookings/getBookingsOfUser';
const DELETE_BOOKING = 'bookings/deleteBooking';
const CREATE_BOOKING = 'bookings/createBooking';

//Action Creators
const getBookingsOfSpot = (bookings) => {
   return {
      type: GET_BOOKINGS_OF_SPOT,
      bookings
   }
}

const getBookingsOfUser = (bookings) => {
   return {
      type: GET_BOOKINGS_OF_USER,
      bookings
   }
}

const deleteBooking = (bookingId) => {
   return {
      type: DELETE_BOOKING,
      bookingId
   }
}

const createBooking = (booking) => {
   return {
      type: CREATE_BOOKING,
      booking
   }
}

//Thunks
export const actionGetBookingsOfSpot = (spotId) => async (dispatch) => {
   const response = await csrfFetch(`/api/spots/${spotId}/bookings`);

   if(response.ok){
      const data = await response.json();
      dispatch(getBookingsOfSpot(data));
      return response;
   }
}

export const actionGetBookingsOfUser = () => async (dispatch) => {
   const response = await csrfFetch(`/api/bookings/current`);

   if(response.ok){
      const data = await response.json();
      dispatch(getBookingsOfUser(data));
      return response;
   }
}

export const actionDeleteBooking = (bookingId) => async (dispatch) => {
   const response = await csrfFetch(`/api/bookings/${bookingId}`, {
      method: 'DELETE'
   })

   if(response.ok) {
      dispatch(deleteBooking(bookingId));
   }
}

export const actionCreateBooking = (spotId, payload) => async(dispatch) => {
   const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
   })

   if(response.ok){
      const data = await response.json();
      dispatch(createBooking(data));
      return data;
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

      case GET_BOOKINGS_OF_USER: {
         const userState = {...state, spot: {}, user: {}};
         action.bookings.Bookings.forEach((booking) => (userState.user[booking.id] = booking));
         return userState;
      }

      case DELETE_BOOKING: {
         const delState = {...state, spot: {...state.spot}, user: {...state.user}};
         delete delState.spot[action.bookingId];
         delete delState.user[action.bookingId];
         return delState;
      }

      case CREATE_BOOKING: {
         const addState = {...state, spot: {...state.spot}, user: {...state.user}};
         addState.spot[action.booking.id] = action.booking;
         addState.user[action.booking.id] = action.booking;
         return addState;
      }

      default:
         return state;
   }
}

export default bookingsReducer;
