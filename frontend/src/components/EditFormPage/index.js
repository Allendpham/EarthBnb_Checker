import {useState, useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actionEditASpot, getAllSpots } from '../../store/spots';
import './index.css';

const EditSpotForm = () => {
   const dispatch = useDispatch();
   const history = useHistory();
   const {spotId} = useParams();
   const sessionUser = useSelector((state) => state.session.user);
   const spotsObj = useSelector(state => state.spots.allSpots);

   useEffect(() => {
      dispatch(getAllSpots())
   }, [dispatch])

   const chosenSpot = spotsObj[spotId];

   const [address, setAddress] = useState(chosenSpot?.address);
   const [city, setCity] = useState(chosenSpot?.city);
   const [state, setState] = useState(chosenSpot?.state);
   const [country, setCountry] = useState(chosenSpot?.country);
   const [name, setName] = useState(chosenSpot?.name);
   const [description, setDescription] = useState(chosenSpot?.description);
   const [price, setPrice] = useState(chosenSpot?.price);
   const [errors, setErrors] = useState([]);

   // if(!Object.values(chosenSpot)) return null;
   if(!chosenSpot) return null;

   const handleSubmit = async (e) => {
      e.preventDefault();

      const payload = {
         address,
         city,
         state,
         country,
         name,
         description,
         price
      };

      let edittedSpot =  await dispatch(actionEditASpot(payload, spotId))
                           .catch(async (res) => {
                              const data = await res.json();
                              if (data && data.errors) {
                                 setErrors(data.errors)

                                 const inputs = document.getElementsByTagName('input');

                                 data.errors.includes("Street address is required.") ?
                                    inputs[0].style.border = "2px solid rgb(192, 53, 21)" :
                                    inputs[0].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                 data.errors.includes("City is required and can only contain letters.") ?
                                    inputs[1].style.border = "2px solid rgb(192, 53, 21)" :
                                    inputs[1].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                 data.errors.includes("State is required and can only contain letters.") ?
                                    inputs[2].style.border = "2px solid rgb(192, 53, 21)" :
                                    inputs[2].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                 data.errors.includes("Country is required and can only contain letters.") ?
                                    inputs[3].style.border = "2px solid rgb(192, 53, 21)" :
                                    inputs[3].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                 data.errors.includes('Name must exist and be less than 50 characters.') ?
                                    inputs[4].style.border = "2px solid rgb(192, 53, 21)" :
                                    inputs[4].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                 data.errors.includes("Description is required.") ?
                                    inputs[5].style.border = "2px solid rgb(192, 53, 21)" :
                                    inputs[5].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                 data.errors.includes('Price per day is required and must be greater than 0.') ?
                                    inputs[6].style.border = "2px solid rgb(192, 53, 21)" :
                                    inputs[6].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                              };
                           });
      if (edittedSpot) {
         history.push('/account');
      }
   }

   //To-do: adjust / implement formType as prop
   return (
      <form className='spot-form-wrapper' onSubmit={handleSubmit}>
         <h2>Edit Your Spot</h2>
         <ul className='error-list'>
            {errors.map((error, idx) => <li key={idx}><i className='fa fa-exclamation-circle' />  {error}</li>)}
         </ul>
         <label>
            <input
            type='text'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={`Address: ${chosenSpot?.address}`}
            />
         </label>

         <label>
            <input
            type='text'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={`City: ${chosenSpot?.city}`}
            />
         </label>

         <label>
            <input
            type='text'
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder={`State: ${chosenSpot?.state}`}
            />
         </label>

         <label>
            <input
            type='text'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder={`Country: ${chosenSpot?.country}`}
            />
         </label>

         <label>
            <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Name: ${chosenSpot?.name}`}
            />
         </label>

         <label>
            <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Description: ${chosenSpot?.description}`}
            />
         </label>

         <label>
            <input
            type='number'
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder={`Price: $${chosenSpot?.price}`}
            />
         </label>

         <button type="submit">Edit Spot</button>
      </form>
   );
}

export default EditSpotForm;
