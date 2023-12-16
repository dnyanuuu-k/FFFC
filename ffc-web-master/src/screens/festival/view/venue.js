import React from "react";
import {
	View,
	Text
} from "react-native";
import Button from "components/button";
import Image from "components/image";
import style from "./style";

const Venue = ({ list = [] } = {}) => {
	return list.map((venue) => (
		<View style={style.venueRow} key={venue.id}>
			<Image
				style={style.contactMapView}
				hash={venue.hash}
				// url={mapURL}
			/>
			<View style={style.venueContent}>
				<Text style={style.venueTitle}>{venue.address}</Text>
				<Text style={style.venueSubTitle}>{venue.subAddress}</Text>				
				<View style={style.venueRow}>
					<Button
						icon={"map-pin"}
						type={Button.OUTLINE_ICON_PRIMARY}
						style={style.venueButton}
						text={"Locate Venue"}
						iconSize={14}
						textStyle={style.venueButtonText}
					/>
					<Button
						icon={"share-2"}
						type={Button.OUTLINE_ICON_SUCCESS}
						style={style.venueButton}
						text={"Share Location"}
						iconSize={14}
						textStyle={style.venueButtonText}
					/>
				</View>
			</View>
		</View>
	));
}

export default Venue;