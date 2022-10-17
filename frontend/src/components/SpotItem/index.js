import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
//import useSelector
import SpotCard from './SpotCard';
import './index.css';

const SpotItem = ({ spot }) => {
   return (
      <div className='spot-item-wrapper'>
         {/* <SpotCard spot={spot} /> */}
         <Link className="spot-links" to={`/spots/${spot.id}`}><SpotCard spot={spot} /></Link>
      </div>
   );
};

export default SpotItem;
