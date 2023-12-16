import React from "react";
import { View, Text } from "react-native";
import Image from "components/image";
import Link from "./link";
import style from "./style";
// const mapURL = "https://static-assets.filmfreeway.com/assets/map/maptile-c080587b83146625f6ad317674ea3fea3a8cfefa996108ecaad52e644fb93c54.jpg";
const Contact = (props) => {
	const { facebook, mapHash, subAddress, address, instagram, website, email, phone, twitter } = props.data || {};
	return (
		<View style={style.contactRow}>
			<View style={style.contactContent}>
				<Link icon="mail" label="Mail" url={`mailto:${email}`} />
				<Link icon="phone" label={phone} url={`tel:${phone}`} />
				<Link icon="globe" label="Website" url={website} />
				<Link icon="facebook" label="Facebook" url={facebook} />
				<Link icon="instagram" label="Instagram" url={instagram} />
				<Link icon="twitter" label="Twitter" url={twitter} />
			</View>
			<View>
				<Image
					style={style.contactMapView}
					hash={mapHash}
					// url={mapURL}
				/>
				<Text style={style.contactAddress}>
					{address}
				</Text>
				<Text style={style.contactSubAddress}>
					{subAddress}
				</Text>				
			</View>
		</View>
	);
};

export default Contact;