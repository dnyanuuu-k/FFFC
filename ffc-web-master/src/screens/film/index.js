import CreateFilm from "./create/";
import {
  Routes,
  Route
} from "react-router-dom";

const Account = () => {
	return (
		<Routes>
	        <Route path="/create_film" element={<CreateFilm />} />
	    </Routes>
	)
}

export default Account;