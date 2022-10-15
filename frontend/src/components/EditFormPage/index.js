import {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actionEditASpot } from '../../store/spots';

const EditSpotForm = () => {
   const dispatch = useDispatch();
   const history = useHistory();
   const {spotId} = useParams();
   const sessionUser = useSelector((state) => state.session.user);
   const spotsObj = useSelector(state => state.spots.allSpots);

   const chosenSpot = spotsObj[spotId];

   const [address, setAddress] = useState(chosenSpot.address);
   const [city, setCity] = useState(chosenSpot.city);
   const [state, setState] = useState(chosenSpot.state);
   const [country, setCountry] = useState(chosenSpot.country);
   const [lat, setLat] = useState(chosenSpot.lat);
   const [lng, setLng] = useState(chosenSpot.lng);
   const [name, setName] = useState(chosenSpot.name);
   const [description, setDescription] = useState(chosenSpot.description);
   const [price, setPrice] = useState(chosenSpot.price);
   const [errors, setErrors] = useState([]);


   //if no session user/not logged in redirect to log in page?
   //or remove the host a spot button when no user is logged in?

   const handleSubmit = (e) => {
      e.preventDefault();

      const payload = {
         address,
         city,
         state,
         country,
         lat,
         lng,
         name,
         description,
         price
      };

      let edittedSpot =  dispatch(actionEditASpot(payload, chosenSpot.id))
                           .catch(async (res) => {
                              const data = await res.json();
                              if (data && data.errors) setErrors(data.errors);
                           });
      if (edittedSpot && !errors.length) {
         history.push('/account');
      }
   }

   //To-do: adjust / implement formType as prop
   return (
      <form className='spot-form-wrapper' onSubmit={handleSubmit}>
         <h2>Create a Spot</h2>
         <ul>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
         </ul>
         <label>
            Address
            <input
            type='text'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            />
         </label>

         <label>
            City
            <input
            type='text'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            />
         </label>

         <label>
            State
            <input
            type='text'
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            />
         </label>

         <label>
            Country
            <input
            type='text'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            />
         </label>

         <label>
            Latitude
            <input
            type='number'
            value={lat}
            onChange={(e) => setLat(Number(e.target.value))}
            required
            />
         </label>

         <label>
            Longitude
            <input
            type='number'
            value={lng}
            onChange={(e) => setLng(Number(e.target.value))}
            required
            />
         </label>

         <label>
            Name
            <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />
         </label>

         <label>
            Description
            <textarea
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            />
         </label>

         <label>
            Price
            <input
            type='number'
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            />
         </label>

         <button type="submit">Edit Spot</button>
      </form>
   );
}

export default EditSpotForm;
