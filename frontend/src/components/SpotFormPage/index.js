import {useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actionAddSpot, actionAddImageUrl } from '../../store/spots';
import './index.css';

const CreateSpotForm = () => {
   const dispatch = useDispatch();
   const history = useHistory();
   const sessionUser = useSelector((state) => state.session.user);
   const [address, setAddress] = useState("");
   const [city, setCity] = useState("");
   const [state, setState] = useState("");
   const [country, setCountry] = useState("");
   const [lat, setLat] = useState("");
   const [lng, setLng] = useState("");
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [imgUrl, setImgUrl] = useState("");
   const [errors, setErrors] = useState([]);

   const handleSubmit = async (e) => {
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

      const imgPayload = {
         url: imgUrl,
         preview: true
      }

      let createdSpot =  await dispatch(actionAddSpot(payload))
                           .catch(async (res) => {
                              const data = await res.json();
                              if (data && data.errors) setErrors(data.errors);
                           })
      dispatch(actionAddImageUrl(imgPayload, createdSpot.id));

      if (createdSpot && !errors.length) {
         history.push(`/account`);
      }
   }

   //To-do: adjust / implement formType as prop
   return (
      <div className='spot-form'>
         <form className='spot-form-wrapper' onSubmit={handleSubmit}>
            <h2>Create a Spot</h2>
            {!sessionUser && <span>Please login or signup to host a spot.</span>}
            <ul>
               {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <label>
               <input
               type='text'
               value={address}
               onChange={(e) => setAddress(e.target.value)}
               required
               placeholder='Address'
               />
            </label>

            <label>
               <input
               type='text'
               value={city}
               onChange={(e) => setCity(e.target.value)}
               required
               placeholder='City'
               />
            </label>

            <label>
               <input
               type='text'
               value={state}
               onChange={(e) => setState(e.target.value)}
               required
               placeholder='State'
               />
            </label>

            <label>
               <input
               type='text'
               value={country}
               onChange={(e) => setCountry(e.target.value)}
               required
               placeholder='Country'
               />
            </label>

            <label>
               <input
               type='number'
               value={lat}
               onChange={(e) => setLat(Number(e.target.value))}
               required
               placeholder='Latitude'
               />
            </label>

            <label>
               <input
               type='number'
               value={lng}
               onChange={(e) => setLng(Number(e.target.value))}
               required
               placeholder='Longitude'
               />
            </label>

            <label>
               <input
               type='text'
               value={name}
               onChange={(e) => setName(e.target.value)}
               required
               placeholder='Name'
               />
            </label>

            <label>
               <input
               type='text'
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               required
               placeholder='Description'
               />
            </label>

            <label>
               <input
               type='number'
               value={price}
               onChange={(e) => setPrice(Number(e.target.value))}
               required
               placeholder='Price'
               />
            </label>

            <label>
               <input
               type='text'
               value={imgUrl}
               onChange={(e) => setImgUrl(e.target.value)}
               required
               placeholder='Preview Image URL'
               />
            </label>

            <button type="submit" disabled={sessionUser? false: true}>Create Spot</button>
         </form>
      </div>

   );
}

export default CreateSpotForm;
