import {useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actionAddSpot, actionAddImageUrl } from '../../store/spots';
import LoginFormModal from '../LoginFormModal';
import './index.css';

const CreateSpotForm = () => {
   const dispatch = useDispatch();
   const history = useHistory();
   const sessionUser = useSelector((state) => state.session.user);
   const [address, setAddress] = useState("");
   const [city, setCity] = useState("");
   const [state, setState] = useState("");
   const [country, setCountry] = useState("");
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [imgUrl, setImgUrl] = useState("");
   const [errors, setErrors] = useState([]);
   const [needDefaultImg, setNeedDefaultImg] = useState(false);

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

      const imgPayload = {
         url: imgUrl,
         preview: true
      }

      let imageError = false;
      if (!/^https?:\/\/.+\.(jpg|jpeg|png|JPG|JPEG|PNG)$/.test(imgUrl)) {
         setErrors(['Image Url must be valid. (e.g. https://example.jpg) (Accepted: .jpg | .jpeg | .png)']);
         imageError = true;

         const inputs = document.getElementsByTagName('input');

         // errors.includes("Image Url must be valid. (e.g. https://example.jpg) (.jpg|jpeg|png)") ?
            inputs[0].style.border = "2px solid rgb(192, 53, 21)"
            // inputs[0].style.border = '1px solid rgba(0, 0, 0, 0.4)';
      }

      if(!imageError){
         let createdSpot =  await dispatch(actionAddSpot(payload))
                              .catch(async (res) => {
                                 const data = await res.json();
                                 if (data && data.errors) {
                                    setErrors(data.errors);

                                    const inputs = document.getElementsByTagName('input');

                                    data.errors.includes("Image Url must be valid. (e.g. https:/example.jpg)") ?
                                       inputs[0].style.border = "2px solid rgb(192, 53, 21)" :
                                       inputs[0].style.border = '1px solid rgba(0, 0, 0, 0.4)';

                                    (data.errors.includes("Street address is required.") || data.errors.includes("Street address has a character limit of 255.")) ?
                                       inputs[1].style.border = "2px solid rgb(192, 53, 21)" :
                                       inputs[1].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                    data.errors.includes("City is required and can only contain letters.") || data.errors.includes('City has a character limit of 255.')?
                                       inputs[2].style.border = "2px solid rgb(192, 53, 21)" :
                                       inputs[2].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                    data.errors.includes("State is required and can only contain letters.") || data.errors.includes('State has a character limit of 255') ?
                                       inputs[3].style.border = "2px solid rgb(192, 53, 21)" :
                                       inputs[3].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                    data.errors.includes("Country is required and can only contain letters.") || data.errors.includes('Country has a character limit of 255.') ?
                                       inputs[4].style.border = "2px solid rgb(192, 53, 21)" :
                                       inputs[4].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                    data.errors.includes('Name must exist and be less than 50 characters.') ?
                                       inputs[5].style.border = "2px solid rgb(192, 53, 21)" :
                                       inputs[5].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                    data.errors.includes("Description is required.") || data.errors.includes('Description has a character limit of 255.') ?
                                       inputs[6].style.border = "2px solid rgb(192, 53, 21)" :
                                       inputs[6].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                    data.errors.includes('Price per day is required and must be greater than 0.') ?
                                       inputs[7].style.border = "2px solid rgb(192, 53, 21)" :
                                       inputs[7].style.border = "1px solid rgba(0, 0, 0, 0.4)";

                                 }
                              })

                              if(createdSpot) {
                                 dispatch(actionAddImageUrl(imgPayload, createdSpot.id));
                                 history.push('/account')
                              }
      }

   }

   function autoFillImage() {
      // let imgInput = document.getElementById('imgInput');
      // console.log(imgInput);
      // imgInput.value = 'https://i.imgur.com/Nkhlnvk.jpg';
      // // setImgUrl('https://i.imgur.com/Nkhlnvk.jpg');
      // // imgInput.getAttribute('required');
      // // imgInput.removeAttribute('required');
      // imgInput.setAttribute('required', '');
      // imgInput.required = false;

   }


   //To-do: adjust / implement formType as prop
   return (
      <div className='spot-form'>
         <form className='spot-form-wrapper' onSubmit={handleSubmit}>
            <h2>Host a Spot</h2>
            {!sessionUser && <span className='no-user-error'><i className='fa fa-exclamation-circle' />  Please login or signup to host a spot.</span>}
            <ul className='errors-list'>
               {errors.map((error, idx) => <li key={idx}><i className='fa fa-exclamation-circle' />  {error}</li>)}
            </ul>

            <label>
               <input
               type='text'
               value={imgUrl}
               onChange={(e) => setImgUrl(e.target.value)}
               placeholder='Preview Image URL'
               required
               onInvalid={e => (e.target.setCustomValidity('Preview Image Url is required. Consider using provided default below.'), setNeedDefaultImg(true))}
               onInput={e => e.target.setCustomValidity('')}
               id='imgInput'
               />
            </label>
            {needDefaultImg && <div onClick={() => autoFillImage()} id='default-image' className='default-image-url'>Default Image: https://i.imgur.com/Nkhlnvk.jpg</div>}

            <label>
               <input
               type='text'
               value={address}
               onChange={(e) => setAddress(e.target.value)}
               placeholder='Address'
               />
            </label>

            <label>
               <input
               type='text'
               value={city}
               onChange={(e) => setCity(e.target.value)}
               placeholder='City'
               />
            </label>

            <label>
               <input
               type='text'
               value={state}
               onChange={(e) => setState(e.target.value)}
               placeholder='State'
               />
            </label>

            <label>
               <input
               type='text'
               value={country}
               onChange={(e) => setCountry(e.target.value)}
               placeholder='Country'
               />
            </label>

            <label>
               <input
               type='text'
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder='Name'
               />
            </label>

            <label>
               <input
               type='text'
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder='Description'
               />
            </label>

            <label>
               <input
               type='number'
               value={price}
               onChange={(e) => setPrice(e.target.value)}
               placeholder='Price'
               className='price-input'
               />
            </label>

            <button type="submit" disabled={sessionUser? false: true}>Host Spot</button>
         </form>
      </div>

   );
}

export default CreateSpotForm;
