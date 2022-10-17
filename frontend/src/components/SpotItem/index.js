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

   const runDispatches = async (spotId) => {
      dispatch(actionGetOneSpot(spotId));
      dispatch(actionGetReviewsOfSpot(spotId))
   }

   return (
      <div className='spot-item-wrapper'>
         <Link onClick={ async () => await runDispatches(spot.id)} className="spot-links" to={`/spots/${spot.id}`}><SpotCard spot={spot} /></Link>
      </div>
   );
};

export default SpotItem;
