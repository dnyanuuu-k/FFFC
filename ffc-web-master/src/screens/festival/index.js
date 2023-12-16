import CreateFestival from "./create/";
import FestivalView from "./view/";
import {
  Routes,
  Route
} from "react-router-dom";

const Account = () => {
	return (
		<Routes>
	        <Route path="/create_festival" element={<CreateFestival />} />
	        <Route path="/:listing_url" element={<FestivalView />} />
	    </Routes>
	)
}

export default Account;