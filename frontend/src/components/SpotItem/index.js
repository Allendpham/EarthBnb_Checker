import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
//import useSelector?
import { actionGetOneSpot } from '../../store/spots';
import { actionGetReviewsOfSpot } from '../../store/reviews';
import SpotCard from './SpotCard';
import './index.css';

const SpotItem = ({ spot }) => {
   const dispatch = useDispatch();

   const runDispatches = (spotId) => {
      dispatch(actionGetOneSpot(spotId));
      dispatch(actionGetReviewsOfSpot(spotId))
   }

   //onClick={ () => runDispatches(spot.id)}
   return (
      <div className='spot-item-wrapper'>
         <Link className="spot-links" to={`/spots/${spot.id}`}><SpotCard spot={spot} /></Link>
      </div>
   );
};

export default SpotItem;
