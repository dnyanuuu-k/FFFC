import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { BORDER_RADIUS } from 'utils/constants';
import { fonts } from 'themes/topography';
import { useTheme } from '@react-navigation/native';

const Checkbox = (props = {}) => {
	const {
		label = '',
		height = 20,
		width = 70,
		onChange,
		checked = false,
		cardStyle = {},
		borderRadius = BORDER_RADIUS,
		textStyle = {},
	} = props;
	const { colors } = useTheme();
	const style = StyleSheet.create({
		option: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: 10,
			outline: 'none',
		},
		optionText: {
			fontSize: fonts.small,
			marginLeft: 8,
			color: colors.text,
		},
		icon: {
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius,
			borderWidth: 1,
			width: 20,
			height: 20,
			borderColor: colors.holderColor,
		},
	});
	const backgroundColor = checked ? colors.primary : colors.card;
	return (
		<TouchableOpacity
			onPress={() => onChange(!checked)}
			style={[style.option, cardStyle, { height, minWidth: width }]}
		>
			<View style={[style.icon, { backgroundColor }]}>
				{checked ? (
					<FeatherIcon name="check" color={colors.buttonTxt} size={14} />
				) : null}
			</View>
			{label ? (
				<Text style={[style.optionText, textStyle]}>{label}</Text>
			) : null}
		</TouchableOpacity>
	);
};

export default Checkbox;