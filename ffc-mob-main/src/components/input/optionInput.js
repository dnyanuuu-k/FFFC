import React, { useMemo } from 'react';
// Components
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { RNSelectionMenu } from 'libs/Menu/';

// Constants
import { BORDER_RADIUS, BUTTON_HEIGHT } from 'utils/constants';

// Hooks
import { useTheme } from '@react-navigation/native';

const OptionInput = (props) => {
	const { selectedOption, options, onSelect } = props;
	const { colors, dark } = useTheme();
	const textColor = selectedOption?.label ? colors.text : colors.holderColor;
	const opacity = props.disabled ? 0.5 : 1;
	const style = useMemo(
		() =>
			StyleSheet.create({
				input: {
					borderRadius: BORDER_RADIUS,
					borderWidth: 1,
					paddingLeft: 10,
					height: BUTTON_HEIGHT,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					borderColor: colors.border,
					opacity,
				},
				label: {
					fontSize: 18,
					fontWeight: '300',
					color: textColor,
					width: '70%',
				},
				optionBox: {
					width: 40,
					justifyContent: 'center',
					alignItems: 'center',
				},
			}),
		[colors, textColor, opacity]
	);

	const showPicker = () => {
		RNSelectionMenu.Show({
			values: options.map((op) => ({ value: op.label })),
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: props.title,
			onSelection: (label) => {
				const obj = options.find((v) => v.label === label);
				if (onSelect) {
					onSelect(obj);
				}
			},
		});
	};

	return (
		<TouchableOpacity onPress={showPicker} style={[style.input, props.style]}>
			<Text numberOfLines={2} style={[style.label, props.textStyle]}>
				{selectedOption?.label || ''}
			</Text>
			<View style={style.optionBox}>
				<FeatherIcon name="chevron-down" size={17} color={colors.holderColor} />
			</View>
		</TouchableOpacity>
	);
};

OptionInput.defaultProps = {
	style: {},
	textStyle: {},
};

export default OptionInput;
