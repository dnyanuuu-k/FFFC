import React, { useState, useMemo } from 'react';
// Components
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

// Constants
import { BORDER_RADIUS, BUTTON_HEIGHT } from 'utils/constants';

// Hooks
import { useTheme } from '@react-navigation/native';

// Functions
import { RNSelectionMenu } from 'libs/Menu/';
import Country from 'libs/country';

// Fonts
import { fonts } from 'themes/topography';

const defaultCountry = {
	name: 'Select Country',
	code: null,
};

const CountryInput = (props) => {
	const { colors } = useTheme();
	const selected = Country.getCountry(props.value) || defaultCountry;
	const textColor = selected.code === null ? colors.holderColor : colors.text;
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
				countryName: {
					fontSize: 18,
					fontWeight: '300',
					color: textColor,
					width: '70%',
				},
				errorText: {
					fontSize: fonts.small,
					color: colors.rubyRed,
					marginTop: 3,
				},
				country: {
					width: 40,
					justifyContent: 'center',
					alignItems: 'center',
				},
				inputStyle: {
					paddingLeft: 5,
					flex: 1,
				},
				codeStyle: {
					fontSize: 20,
					marginTop: -4,
					marginRight: 6,
					fontWeight: '400',
				},
			}),
		[colors, textColor, opacity]
	);
	const showPicker = () => {
		try {
			RNSelectionMenu.Show({
				values: Country.countryOptions,
				selectedValues: ['IN'],
				selectionType: 0,
				presentationType: 3,
				enableSearch: true,
				theme: 0,
				title: 'Countries',
				searchPlaceholder: 'Search Country',
				searchTintColor: colors.holderColor,
				onSelection: (value) => {
					const code = value.split(' - ')[1];
					if (props?.onSelect) {
						props?.onSelect(code);
					}
				},
			});
		} catch (err) {
			console.log(err);
			// Ignore
		}
	};
	return (
		<TouchableOpacity
			disabled={props?.disabled}
			onPress={showPicker}
			style={[style.input, props.style]}
		>
			<Text numberOfLines={2} style={[style.countryName, props.textStyle]}>
				{selected.name || props.placeholder}
			</Text>
			<View style={style.country}>
				<FeatherIcon name="chevron-down" size={17} color={colors.holderColor} />
			</View>
		</TouchableOpacity>
	);
};

CountryInput.defaultProps = {
	style: {},
	textStyle: {},
};

export default CountryInput;
