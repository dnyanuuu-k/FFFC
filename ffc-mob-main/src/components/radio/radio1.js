import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BORDER_RADIUS, BUTTON_HEIGHT, FORM_FONT_SIZE } from 'utils/constants';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const Radio = ({
	options,
	value,
	onChange,
	multiple,
	iconSize,
	cardStyle,
	height,
	width,
	textStyle,
	bodyStyle,
}) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flexDirection: 'row',
					flexWrap: 'wrap',
				},
				option: {
					borderRadius: BORDER_RADIUS,
					borderColor: colors.border,
					borderWidth: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingHorizontal: 10,
				},
				optionText: {
					fontSize: FORM_FONT_SIZE,
				},
				icon: {
					justifyContent: 'center',
					alignItems: 'center',
				},
			}),
		[colors]
	);
	const [currentValue, setCurrentValue] = useState(null);
	useEffect(() => {
		if (multiple) {
			const current = new Set(value || []);
			setCurrentValue(current);
		} else {
			setCurrentValue(value);
		}
	}, [value, multiple]);

	const handleChange = (v) => {
		if (!multiple) {
			if (onChange) {
				onChange(v);
			}
			return;
		}
		const idx = (value || []).indexOf(v);
		if (idx !== -1) {
			value.splice(idx, 1);
		} else if (value?.length > 0) {
			value.push(v);
		} else {
			value = [v];
		}
		if (onChange) {
			onChange([...value]);
		}
	};

	const renderOption = (option) => {
		const selected = multiple
			? currentValue?.has(option.value)
			: option.value === currentValue;
		const color = selected ? colors.primary : colors.holderColor;
		const borderColor = selected ? colors.primary : colors.border;
		const backgroundColor = selected ? colors.primaryLight : colors.card;
		return (
			<TouchableOpacity
				onPress={() => handleChange(option.value)}
				style={[
					style.option,
					cardStyle,
					{ height, minWidth: width, borderColor, backgroundColor },
				]}
				key={option.value}
			>
				<Text style={[style.optionText, { color }, textStyle]}>
					{option.label}
				</Text>
				{selected ? (
					<View style={style.icon}>
						<FeatherIcon
							name="check"
							color={colors.primaryBlue}
							size={iconSize}
						/>
					</View>
				) : null}
			</TouchableOpacity>
		);
	};
	return (
		<View style={[style.main, bodyStyle]}>
			{(options || []).map(renderOption)}
		</View>
	);
};

Radio.defaultProps = {
	height: BUTTON_HEIGHT,
	width: 90,
	iconSize: 20,
	bodyStyle: {},
	cardStyle: {
		marginRight: 20,
	},
	multiple: false,
	onChange: () => {},
	textStyle: {},
	value: [],
};

export default Radio;
