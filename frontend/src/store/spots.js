import { csrfFetch } from "./csrf";

//Action Constants
const GET_ALL_SPOTS = 'spots/getAllSpots';
const ADD_A_SPOT = 'spots/addASpot';
const REMOVE_A_SPOT = 'spots/removeASpot';
const GET_ONE_SPOT = 'spots/getOneSpot';
const ADD_IMAGE_URL = 'spots/addImageUrl';

//Action Creators
const loadSpots = (spots) => {
   return {
      type: GET_ALL_SPOTS,
      spots
   }
};

const addSpot = (spot) => {
   return {
      type: ADD_A_SPOT,
      spot
   }
}

const removeSpot = (spotId) => {
   return {
      type: REMOVE_A_SPOT,
      spotId
   }
}

const getOneSpot = (spot) => {
   return {
      type: GET_ONE_SPOT,
      spot
   }
}

const addImageUrl = (spotId, url) => {
   return {
      type: ADD_IMAGE_URL,
      spotId,
      url
   }
}

//Thunk Action Creators
export const getAllSpots = () => async (dispatch) => {
   const response = await csrfFetch('/api/spots');

   if(response.ok) {
      const data = await response.json();
      dispatch(loadSpots(data));
      return data;
   }
};

export const actionAddSpot = (payload) => async (dispatch) => {
   const response = await csrfFetch('/api/spots', {
      method: 'POST',
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify(payload)
   });

   if (response.ok) {
      const data = await response.json();
      dispatch(addSpot(data));
      return data;
   }
};

export const actionEditASpot = (payload, id) => async (dispatch) => {
   const response = await csrfFetch(`/api/spots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
   });

   if(response.ok){
      const data = await response.json();
      dispatch(addSpot(data));
      return data;
   }
};

export const actionRemoveASpot = (id) => async (dispatch) => {
   const response = await csrfFetch(`/api/spots/${id}`, {
      method: 'DELETE'
   });

   if(response.ok) {
      dispatch(removeSpot(id));
   }
}

export const actionGetOneSpot = (id) => async (dispatch) => {
   const response = await csrfFetch(`/api/spots/${id}`);

   if(response.ok){
      const singleSpot = await response.json();
      dispatch(getOneSpot(singleSpot));
      return response;
   }
}

export const actionAddImageUrl = (payload ,id) => async (dispatch) => {
   const response = await csrfFetch(`/api/spots/${id}/images`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
   });
   if(response.ok){
      const data = await response.json();
      dispatch(addImageUrl(id, payload));
   }
}

//spotsReducer
const initialState = {allSpots: {}, singleSpot: {}};
const spotsReducer = (state = initialState, action) => {
   switch(action.type){
      case GET_ALL_SPOTS: {
         const newState = {...state, allSpots: {}, singleSpot: {}};
         action.spots.Spots.forEach((spot) => (newState.allSpots[spot.id] = spot));
         return newState;
      }

      case ADD_A_SPOT: {
         const addState = {...state, allSpots: {...state.allSpots}};
         addState.allSpots[action.spot.id] = action.spot;
         return addState;
      }

      case REMOVE_A_SPOT: {
         const remState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}};
         delete remState.allSpots[action.spotId];
         return remState;
      }

      case GET_ONE_SPOT: {
         const oneState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}};
         oneState.singleSpot = action.spot;
         return oneState;
      }

      case ADD_IMAGE_URL: {
         const imgState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}};
         imgState.allSpots[action.spotId].previewImage = action.url;
         return imgState;
      }

      default:
         return state;
   }
}


export default spotsReducer;
