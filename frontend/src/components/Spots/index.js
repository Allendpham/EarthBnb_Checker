import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import { NavLink } from 'react-router-dom';
import SpotItem from '../SpotItem';
import './index.css';

function AllSpots(){
   const dispatch = useDispatch();

   const spotList = useSelector((state) => Object.values(state.spots.allSpots));

   useEffect(() => {
      dispatch(getAllSpots());
   }, [dispatch])

   return (
      <div className='all-spots-div'>
         <ul className='all-spots-wrapper'>
            {spotList?.map(spot => (
               <li key={spot.id}>
                  {/* <NavLink key={spot.id} to={`/spots/${spot.id}`}>{spot.name}</NavLink> */}
                  {/* Create individual spot card component? SpotItem*/}
                  <SpotItem key={spot.id} spot={spot}/>
               </li>

            ))
            }
         </ul>
      </div>
   );
}

export default AllSpots;
