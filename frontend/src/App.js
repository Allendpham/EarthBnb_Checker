// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/Spots";
import SpotShow from "./components/SpotShow";
import CreateSpotForm from "./components/SpotFormPage";
import AccountPage from "./components/AccountPage";
import EditSpotForm from "./components/EditFormPage";
import CreateReviewForm from "./components/CreateReviewForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/signup">
            <SignupFormPage />
          </Route>

          <Route path="/spots/new" component={CreateSpotForm} />
          <Route exact path="/spots/:spotId" component={SpotShow} />
          <Route exact path="/" component={AllSpots}/>
          <Route path="/account" component={AccountPage}/>
          <Route path="/spots/:spotId/edit" component={EditSpotForm}/>
          <Route path="/spots/:spotId/reviews/new" component={CreateReviewForm}/>

        </Switch>
      )}

    </>
  );
}

export default App;
