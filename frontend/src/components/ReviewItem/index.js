import { useSelector, useDispatch } from "react-redux";
import { actionDeleteAReview } from "../../store/reviews";

const ReviewItem = ({review}) => {
   const dispatch = useDispatch();
   const sessionUser = useSelector(state => state.session.user);
   let ownerOfReview = false;
   if(sessionUser){
      if(review.userId === sessionUser.id) ownerOfReview = true;
   }

   return (
      <div className='review-item'>
         {review.review}
         {ownerOfReview &&
            <button onClick={() => dispatch(actionDeleteAReview(review.id))}>Delete</button>
         }
      </div>
   );
}

export default ReviewItem;
