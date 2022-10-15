import React from 'react';
import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {getAllSpots} from '../../store/spots';

function AccountPage (){
   const dispatch = useDispatch();
   const spotsArr = useSelector(state => Object.values(state.spots.allSpots));
   const sessionUser = useSelector((state) => state.session.user);

   useEffect(() => {
      dispatch(getAllSpots());
   }, [dispatch])

   const ownedSpots = spotsArr.filter((spot) => spot.ownerId === sessionUser.id);

   return (
      <div className='account-page-wrapper'>
         <h1>Hello {sessionUser.username}</h1>
         <h2>Owned Spots</h2>
         <ul>
            {ownedSpots?.map((spot) => (
               <li key={spot.id}>{spot.name}
               <Link to={`/spots/${spot.id}/edit`}>Edit</Link>
               {/* <button>Edit</button> */}
               <button>Delete</button>
               </li>
            ))}
         </ul>
      </div>
   );
};

export default AccountPage;
