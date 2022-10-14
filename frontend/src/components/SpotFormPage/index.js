import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actionAddSpot } from '../../store/spots';

const CreateSpotForm = ({ formType }) => {
   const dispatch = useDispatch();
   const history = useHistory();
   const sessionUser = useSelector((state) => state.session.user);
   const [address, setAddress] = useState("");
   const [city, setCity] = useState("");
   const [state, setState] = useState("");
   const [country, setCountry] = useState("");
   const [lat, setLat] = useState(0);
   const [lng, setLng] = useState(0);
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState(0);
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

      let createdSpot =  dispatch(actionAddSpot(payload))
                           .catch(async (res) => {
                              const data = await res.json();
                              if (data && data.errors) setErrors(data.errors);
                           });
      if (createdSpot && !errors.length) {
         history.push('/');
      }
   }

   //To-do: adjust / implement formType as prop
   return (
      <form className='spot-form-wrapper' onSubmit={handleSubmit}>
         <h2>{formType}</h2>
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

         <button type="submit">Create Spot</button>
      </form>
   );
}

export default CreateSpotForm;
