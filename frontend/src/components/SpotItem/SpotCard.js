import { useSelector } from "react-redux";

const SpotCard= ({spot}) => {

   let displayRating;
   let ratingArr = spot.avgRating.toString().split('');

   if(spot.avgRating === 0) displayRating = "No Current Reviews";
   else if(Number.isInteger(spot.avgRating)) displayRating = `${spot.avgRating}.0`;
   else if(ratingArr.slice(2).length === 1) displayRating = spot.avgRating;
   else displayRating = parseFloat(spot.avgRating).toFixed(2);

   return (
      <div>
         <img className="spot-card-image" src={spot.previewImage} alt="SpotImage"/>
         <div className="spot-card-bottom-wrapper">
            <div className="spot-card-bottom-left">
               <div>
                  <span className="spot-card-location">{spot.city}, {spot.state}</span>
               <div className="spot-card-description">
                  {spot.name}
               </div>
            </div>
               <div className="spot-card-price-wrapper">
                  <span className='spot-card-price'>${spot.price}</span> per night
               </div>
            </div>
            <div className="spot-card-bottom-right">
              ★{displayRating}
            </div>
         </div>
      </div>
   );
}

export default SpotCard;
