import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import { NavLink } from 'react-router-dom';

function AllSpots(){
   const dispatch = useDispatch();

   const spotList = useSelector((state) => Object.values(state.spots.allSpots));

   useEffect(() => {
      dispatch(getAllSpots());
   }, [dispatch])

   return (
      <div className='all-spots-wrapper'>
         <h1>Hello from AllSpots</h1>
         <ul>
            {spotList?.map(spot => (
               <li key={spot.id}>
                  <NavLink key={spot.id} to={`/spots/${spot.id}`}>{spot.name}</NavLink>
               </li>

            ))
            }
         </ul>
      </div>
   );
}

export default AllSpots;
