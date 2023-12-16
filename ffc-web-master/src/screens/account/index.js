import Main from "./main";
import { Routes, Route } from "react-router-dom";

const Account = () => {
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/login" element={<Main />} />
			<Route path="/register" element={<Main />} />
			<Route path="/forgot_password" element={<Main />} />
		</Routes>
	);
};

export default Account;