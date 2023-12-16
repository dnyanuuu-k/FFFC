import React, { useEffect } from "react";
import { View } from "react-native";
import { useNavigate, useLocation } from "react-router-dom";

//Constants
import { WINDOW_WIDTH, WINDOW_HEIGHT } from "utils/constants";
import DB from "db";

const Session = (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	useEffect(() => {
	    const token = DB.Account.getCurrentToken();
	    if(!token && location?.pathname !== "/login"){
	    	navigate("/login");
	    }
	});
	return (
		<>
			<View style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT }}>
				{props.children}
			</View>
			<input
				type="file"
				id="FFCPicker"				
				hidden
				style={{ display: 'none' }}
			/>
		</>
	)
}

export default Session;