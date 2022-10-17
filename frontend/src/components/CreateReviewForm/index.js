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

   const handleSubmit = (e) => {
      e.preventDefault();

      const payload = {
         review,
         stars
      };

      let createdReview = dispatch(actionCreateAReview(payload, spotId))
                              .catch(async (res) => {
                                 const data = await res.json();
                                 if (data && data.errors) setErrors(data.errors);
                              });
      if(createdReview && !errors.length){
         history.push(`/spots/${spotId}`);
      }
   }

   return (
      <form className='review-form-wrapper' onSubmit={handleSubmit}>
         <div className="review-form-header">
            <h3>Leave a Review!</h3>
         </div>
         <ul>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
         </ul>

         <label>
            <textarea
            type='text'
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            placeholder='Enter your experience here.'
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
