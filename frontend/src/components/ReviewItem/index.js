import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { actionDeleteAReview } from "../../store/reviews";
import { actionGetOneSpot } from "../../store/spots";
import './index.css';


const ReviewItem = ({review}) => {
   const dispatch = useDispatch();
   const sessionUser = useSelector(state => state.session.user);
   let ownerOfReview = false;
   if(sessionUser){
      if(review.userId === sessionUser.id) ownerOfReview = true;
   }

   const displayStars = (int) => {
      let arr = [];
      for(let i = 0; i < int; i++) {
         arr.push("★");
      };
      return arr.join(" ");
   }

   //Parse createdAt Date
   const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
   const createdAt = new Date(review?.createdAt);
   const month = months[createdAt.getMonth()];
   const year = createdAt.getFullYear();

   const deleteDispatches = () => {
      dispatch(actionDeleteAReview(review.id));

         setTimeout(() => {
            dispatch(actionGetOneSpot(review.spotId));
         }, 100)


   }


   return (
      <div className='review-item'>
         <div className='top-review-item'>
            <div className='review-item-name'>{review?.User?.firstName}</div>
            <div className='review-item-date'>{month} {year}</div>
         </div>
         <div className='review-item-stars'>
            {displayStars(review?.stars)}
         </div>
         <div className='review'>{review?.review}</div>
         {ownerOfReview &&
               <button className='spots-review-delete-button' onClick={ () => deleteDispatches()}>Delete Your Review</button>
            }
      </div>
   );
}

export default ReviewItem;
