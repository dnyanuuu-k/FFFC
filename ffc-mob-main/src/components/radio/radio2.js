import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BORDER_RADIUS } from 'utils/constants';
import { fonts } from 'themes/topography';
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
					borderWidth: 1,
					paddingLeft: 5,
					paddingBottom: 10,
					borderRadius: BORDER_RADIUS,
					borderColor: colors.border,
					marginTop: 10,
				},
				option: {
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: 10,
				},
				optionText: {
					fontSize: fonts.small,
					marginLeft: 8,
					color: colors.text,
				},
				icon: {
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: multiple ? BORDER_RADIUS : 50,
					borderWidth: 1,
					width: 20,
					height: 20,
					borderColor: colors.border,
				},
			}),
		[colors, multiple]
	);
	const [currentValue, setCurrentValue] = useState(null);
	useEffect(() => {
		if (currentValue === value || currentValue?.length === value?.length) {
			// Ignore
		} else {
			if (multiple) {
				if (!multiple || currentValue?.length !== value?.length) {
					const current = new Set(value || []);
					setCurrentValue(current);
				}
			} else {
				setCurrentValue(value);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			onChange(value);
		}
	};

	const renderOption = (option) => {
		const selected = multiple
			? currentValue?.has?.(option.value)
			: option.value === currentValue;
		const backgroundColor = selected ? colors.primary : colors.card;
		return (
			<TouchableOpacity
				onPress={() => handleChange(option.value)}
				style={[
					style.option,
					cardStyle,
					{ minHeight: height, width },
				]}
				key={option.value}
			>
				<View style={[style.icon, { backgroundColor }]}>
					{selected ? (
						<FeatherIcon name="check" color={colors.buttonTxt} size={14} />
					) : null}
				</View>
				<Text style={[style.optionText, textStyle]}>{option.label}</Text>
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
	height: 30,
	width: 150,
	bodyStyle: {},
	cardStyle: {},
	multiple: false,
	onChange: () => {},
	textStyle: {},
	value: [],
};

export default Radio;