import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import colors from 'themes/colors';
import toast from 'libs/toast';

const Link = ({ style, color, icon, url, label }) => {
	const showLink = () => {
		if (url) {
			Linking.openURL(url);
		} else {
			toast.notify('Link not added!');
		}
	};
	return (
		<Pressable onPress={showLink} style={style.linkRow}>
			<View style={style.linkIcon}>
				<FeatherIcon name={icon} size={20} color={color} />
			</View>
			<Text
				style={[
					style.link,
					{ color: url ? colors.primaryBlue : colors.holderColor },
				]}
			>
				{label}
			</Text>
		</Pressable>
	);
};

export default Link;
