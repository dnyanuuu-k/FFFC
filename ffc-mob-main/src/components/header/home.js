import React, { useMemo } from 'react';
import {
	StatusBar,
	Text,
	View,
	Pressable,
	StyleSheet,
	Image,
} from 'react-native';

// Components
import FeatherIcon from 'react-native-vector-icons/Feather';

// Hooks
import { useTheme, useNavigation } from '@react-navigation/native';

// Constants
import { HEADER_HEIGHT, WINDOW_WIDTH } from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import logoAsset from 'assets/images/logo.png';

// Functions
import AppMode from 'libs/appMode';

const HomeHeader = ({ cartCount, cartVisible }) => {
	const { colors, dark } = useTheme();
	const count = useMemo(() => {
		if (cartVisible) {
			const text = cartCount ? (cartCount > 9 ? '9+' : cartCount) : null;
			return text;
		}
		return '';
	}, [cartCount, cartVisible]);
	const navigation = useNavigation();
	const style = StyleSheet.create({
		main: {
			height: HEADER_HEIGHT,
			width: WINDOW_WIDTH,
			borderColor: colors.border,
			backgroundColor: colors.card,
			borderBottomWidth: 1,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingHorizontal: 14,
			paddingTop: StatusBar.currentHeight,
		},
		mode: {
			width: 36,
			height: 36,
		},
		logo: {
			tintColor: colors.selected,
			height: 30,
			width: 150,
		},
		icon: {
			width: 50,
			alignItems: 'flex-end',
		},
		row: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		dot: {
			height: 21,
			width: 21,
			borderWidth: 1,
			borderRadius: 44,
			backgroundColor: colors.primary,
			position: 'absolute',
			borderColor: colors.card,
			right: -7,
			top: -5,
			justifyContent: 'center',
			alignItems: 'center',
		},
		count: {
			color: colors.buttonTxt,
			fontWeight: weights.bold,
			fontSize: 12,
		},
	});

	const setDarkMode = () => {
		const currentMode = AppMode.getCurrentMode();
		const isDark = currentMode === AppMode.DARK_MODE;
		const newMode = isDark ? AppMode.LIGHT_MODE : AppMode.DARK_MODE;
		AppMode.setAppMode(newMode);
	};

	const goToCart = () => {
		navigation.navigate('CartScreen');
	};

	return (
		<View style={style.main}>
			<Image resizeMode="contain" style={style.logo} source={logoAsset} />
			<View style={style.row}>
				<Pressable onPress={setDarkMode}>
					<FeatherIcon
						name={dark ? 'sun' : 'moon'}
						color={colors.selected}
						size={fonts.xlarge}
					/>
				</Pressable>
				{cartVisible ? (
					<Pressable onPress={goToCart} style={style.icon}>
						<FeatherIcon
							name={'shopping-cart'}
							color={colors.selected}
							size={fonts.xlarge}
						/>
						{count ? (
							<View style={style.dot}>
								<Text style={style.count}>{count}</Text>
							</View>
						) : null}
					</Pressable>
				) : null}
			</View>
		</View>
	);
};

export default HomeHeader;
