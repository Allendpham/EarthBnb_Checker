import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
// ? useDispatch to dispatch an action to get one Spot?

const SpotShow = () => {
   const {spotId} = useParams();
   const allSpotsObj = useSelector(state => state.allSpots);

   const individualSpot = allSpotsObj[spotId];

   return (
      <div className='spot-show-wrapper'>
         <h1>Hello from SpotShow {individualSpot.address}</h1>
      </div>
   );
}

export default SpotShow;
