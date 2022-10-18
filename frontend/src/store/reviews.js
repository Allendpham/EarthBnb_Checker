import { csrfFetch } from "./csrf";

//Action Constants
const GET_REVIEWS_OF_SPOT = 'reviews/getReviewsOfSpot';
const CREATE_A_REVIEW = 'reviews/createAReview';
const DELETE_A_REVIEW = 'reviews/deleteAReview';
const GET_REVIEWS_OF_USER = 'reviews/getReviewsOfUser';

//Action Creators
const getReviewsOfSpot = (reviews) => {
   return {
      type: GET_REVIEWS_OF_SPOT,
      reviews
   }
}

const createAReview = (review) => {
   return {
      type: CREATE_A_REVIEW,
      review
   }
}

const deleteAReview = (reviewId) => {
   return {
      type: DELETE_A_REVIEW,
      reviewId
   }
}

const getReviewsOfUser = (reviews) => {
   return {
      type: GET_REVIEWS_OF_USER,
      reviews
   }
}

//Thunk Action Creators
export const actionGetReviewsOfSpot = (spotId) => async (dispatch) => {
   const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

   if(response.ok){
      const data = await response.json();
      dispatch(getReviewsOfSpot(data));
      return response;
   }
}

export const actionCreateAReview = (payload, spotId) => async (dispatch) => {
   const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
   });

   if(response.ok){
      const data = await response.json();
      console.log("this is the review data", data)
      dispatch(createAReview(data));
      return data;
   }
}

export const actionDeleteAReview = (reviewId) => async (dispatch) => {
   const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE'
   });

   if(response.ok){
      dispatch(deleteAReview(reviewId));
   }
}

export const actionGetReviewsOfUser = () => async (dispatch) => {
   const response = await csrfFetch('/api/reviews/current');
   if(response.ok){
      const data = await response.json();
      dispatch(getReviewsOfUser(data));
      return response;
   }
}

//reviewsReducer
const initialState = {spot: {}, user: {}};
const reviewsReducer = (state = initialState, action) => {
   switch(action.type){
      case GET_REVIEWS_OF_SPOT: {
         const newState = {...state, spot: {}};
         action.reviews.Reviews.forEach((review) => (newState.spot[review.id] = review));
         return newState;
      }

      case CREATE_A_REVIEW: {
         const addState = {...state, spot: {...state.spot}};
         addState.spot[action.review.id] = action.review;
         return addState;
      }

      case DELETE_A_REVIEW: {
         const delState = {...state, spot: {...state.spot}, user: {...state.user}};
         delete delState.spot[action.reviewId];
         delete delState.user[action.reviewId];
         return delState;
      }

      case GET_REVIEWS_OF_USER: {
         const userState = {...state, user: {...state.user}};
         action.reviews.Reviews.forEach((review) => (userState.user[review.id] = review));
         return userState;
      }

      default:
         return state;
   }
}

export default reviewsReducer;
