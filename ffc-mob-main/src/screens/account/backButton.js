import React from 'react';
import { Pressable } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const BackButton = ({ onPress, colors }) => {
	const style = {
		height: 40,
		width: 40,
		backgroundColor: colors.primaryLight,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 100,
		position: 'absolute',
		top: 0,
		left: 0,
	};
	return (
		<Pressable style={style} onPress={onPress}>
			<FeatherIcon name="arrow-left" size={26} color={colors.primary} />
		</Pressable>
	);
};

export default BackButton;
