import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { actionCreateAReview } from '../../store/reviews';
import './index.css';

function CreateReviewForm () {
   const dispatch = useDispatch();
   const history = useHistory();
   const [review, setReview] = useState("");
   const [stars, setStars] = useState(1);
   const [errors, setErrors] = useState([]);
   const {spotId} = useParams();

   const handleSubmit = async (e) => {
      e.preventDefault();

      const payload = {
         review,
         stars
      };

      let createdReview = await dispatch(actionCreateAReview(payload, spotId))
                              .catch(async (res) => {
                                 const data = await res.json();
                                 if (data && data.errors) {
                                    setErrors(data.errors);

                                    const inputs = document.getElementsByTagName('textarea');

                                    data.errors.includes("Review text is required.") ?
                                       inputs[0].style.border = "2px solid rgb(192, 53, 21)" :
                                       inputs[0].style.border = "1px solid rgba(0, 0, 0, 0.4)";
                                 }
                              });
      if(createdReview){
         history.push(`/spots/${spotId}`);
      }
   }

   return (
      <form className='review-form-wrapper' onSubmit={handleSubmit}>
         <div className="review-form-header">
            <h3>Leave a Review!</h3>
         </div>
         <ul className='errors-list'>
            {errors.map((error, idx) => <li key={idx}><i className='fa fa-exclamation-circle' />  {error}</li>)}
         </ul>

         <label>
            <textarea
            type='text'
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder='Enter your experience here.'
            className='review-textarea'
            />
         </label>

         <div className="star-radio-buttons">

            <label>
               Select a Rating
               <label>
               <input
                  type="radio"
                  value="1"
                  name="stars"
                  onChange={(e) => setStars(parseInt(e.target.value))}
                  checked={stars === 1 ? true: false}
               />
               ★
               </label>

               <label>
               <input
                  type="radio"
                  value="2"
                  name="stars"
                  onChange={(e) => setStars(parseInt(e.target.value))}
                  checked={stars === 2 ? true: false}
               />
               ★★
               </label>

               <label>
               <input
                  type="radio"
                  value="3"
                  name="stars"
                  onChange={(e) => setStars(parseInt(e.target.value))}
                  checked={stars === 3 ? true: false}
               />
               ★★★
               </label>

               <label>
               <input
                  type="radio"
                  value="4"
                  name="stars"
                  onChange={(e) => setStars(parseInt(e.target.value))}
                  checked={stars === 4 ? true: false}
               />
               ★★★★
               </label>

               <label>
               <input
                  type="radio"
                  value="5"
                  name="stars"
                  onChange={(e) => setStars(parseInt(e.target.value))}
                  checked={stars === 5 ? true: false}
               />
               ★★★★★
               </label>
            </label>
         </div>

         <button type="submit">Submit Review</button>
      </form>
   );
}

export default CreateReviewForm;
