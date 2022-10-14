import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';

function AllSpots(){
   const dispatch = useDispatch();
   console.log('helloo its me')
   // const spotList = [];
   const spotList = useSelector((state) => Object.values(state.spots.allSpots));
   console.log('This is spotlist',spotList);
   // console.log(useSelector(state => state.spots))
   useEffect(() => {
      dispatch(getAllSpots());
   }, [dispatch])

   return (
      <div className='all-spots-wrapper'>
         <h1>Hello from AllSpots</h1>
         <ul>
            {spotList?.map(spot => (
               <li key={spot.id}>{spot.name}</li>
               //Replace this with SpotItem and pass spot as a prop, remember key!
            ))
            }
         </ul>
      </div>
   );
}

export default AllSpots;
