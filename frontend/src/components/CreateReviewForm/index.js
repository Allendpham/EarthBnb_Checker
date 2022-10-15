import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { actionCreateAReview } from '../../store/reviews';

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
         <h2>Create a Review</h2>
         <ul>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
         </ul>

         <label>
            Review
            <textarea
            type='text'
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            />
         </label>

         <label>
            Stars
            <label>
            <input
               type="radio"
               value="1"
               name="stars"
               onChange={(e) => setStars(parseInt(e.target.value))}
                checked={stars === 1 ? true: false}
            />
            1
            </label>

            <label>
            <input
               type="radio"
               value="2"
               name="stars"
               onChange={(e) => setStars(parseInt(e.target.value))}
                checked={stars === 2 ? true: false}
            />
            2
            </label>

            <label>
            <input
               type="radio"
               value="3"
               name="stars"
               onChange={(e) => setStars(parseInt(e.target.value))}
                checked={stars === 3 ? true: false}
            />
            3
            </label>

            <label>
            <input
               type="radio"
               value="4"
               name="stars"
               onChange={(e) => setStars(parseInt(e.target.value))}
                checked={stars === 4 ? true: false}
            />
            4
            </label>

            <label>
            <input
               type="radio"
               value="5"
               name="stars"
               onChange={(e) => setStars(parseInt(e.target.value))}
                checked={stars === 5 ? true: false}
            />
            5
            </label>
         </label>
         <button type="submit">Submit Review</button>
      </form>
   );
}

export default CreateReviewForm;
