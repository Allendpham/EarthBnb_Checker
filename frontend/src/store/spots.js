import { csrfFetch } from "./csrf";

//Action Constants
const GET_ALL_SPOTS = 'spots/getAllSpots';
const ADD_A_SPOT = 'spots/addASpot';

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
      return response;
   }
};


const initialState = {allSpots: {}};
//spotsReducer
const spotsReducer = (state = initialState, action) => {
   switch(action.type){
      case GET_ALL_SPOTS: {
         const newState = {...state, allSpots: {...state.allSpots}};
         action.spots.Spots.forEach((spot) => (newState.allSpots[spot.id] = spot));
         return newState;
      }

      case ADD_A_SPOT: {
         const addState = {...state, allSpots: {...state.allSpots}};
         console.log("This is a spot",action.spot);
         addState.allSpots[action.spot.id] = action.spot;
         return addState;
      }

      default:
         return state;
   }
}


export default spotsReducer;
