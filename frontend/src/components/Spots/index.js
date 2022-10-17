import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots, actionGetOneSpot } from '../../store/spots';
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
                  <SpotItem key={spot.id} spot={spot}/>
               </li>
               // onClick of the link dispatch the action to getOneSpot?
            ))
            }
         </ul>
      </div>
   );
}

export default AllSpots;
