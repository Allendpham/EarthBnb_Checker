import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
//will use dispatch later to add functionality to edit a spot IF current
//user is the owner of the spot
//also to delete a spot IF current user is owner of spot`

const SpotItem = ({ spot }) => {
   return (
      <div className='spot-item-wrapper'>
         <h1>Hello from SpotItem</h1>
         {/* <Link to={`/spots/${spot.id}`}>{spot.address}</Link> */}
      </div>
   );
};

export default SpotItem;
