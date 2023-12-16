import React, { useMemo, useState, useEffect } from 'react';
import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	Pressable,
	Image as RNImage,
	RefreshControl,
} from 'react-native';
import AnimatedBar from 'components/animated/bar';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Header from 'components/header/basic';
import LinearGradient from 'react-native-linear-gradient';
import Button from 'components/button';
import Backend from 'backend';
import toast from 'libs/toast';
import { useTheme, useNavigation } from '@react-navigation/native';
import { fonts, weights } from 'themes/topography';
import { HOST_NAME, WINDOW_WIDTH, STATIC_URL } from 'utils/constants';

const colorBoxSize = 50;
const submitButtonHeight = 38;
const submitButtonWidth = 199;
const heightRatio = 468 / 156;

const logoWidth = 150;
const logoHeight = logoWidth / heightRatio;

const ButtonAndLogo = ({ route }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flex: 1,
					backgroundColor: colors.background,
				},
				gapBottom: {
					height: 20,
				},
				cover: {
					backgroundColor: colors.card,
					marginTop: 10,
					padding: 10,
				},
				row: {
					flexDirection: 'row',
					justifyContent: 'space-between',
				},
				title: {
					fontSize: fonts.regular,
					color: colors.text,
					fontWeight: weights.semibold,
				},
				subTitle: {
					fontSize: fonts.small,
					color: colors.holderColor,
					fontWeight: weights.semibold,
					marginTop: 10,
				},
				link: {
					marginTop: 20,
					marginBottom: 10,
					fontSize: fonts.small,
					color: colors.primary,
				},
				linkSmall: {
					fontSize: fonts.xsmall,
					color: colors.primary,
				},
				linkSmall2: {
					fontSize: fonts.xsmall,
					color: colors.primary,
					marginTop: 10,
				},
				note: {
					marginTop: 10,
					color: colors.holderColor,
					fontSize: fonts.xsmall,
				},
				colorRow: {
					flexDirection: 'row',
					flexWrap: 'wrap',
				},
				colorBox: {
					justifyContent: 'center',
					alignItems: 'center',
					width: colorBoxSize,
					height: colorBoxSize,
					borderRadius: 5,
					marginRight: 10,
					marginTop: 10,
				},
				checkBox: {
					backgroundColor: colors.buttonTxt,
					borderRadius: 50,
					width: 25,
					height: 25,
					justifyContent: 'center',
					alignItems: 'center',
				},
				submitButton: {
					height: submitButtonHeight,
					width: submitButtonWidth,
					borderRadius: 3,
					marginTop: 10,
					justifyContent: 'center',
					alignItems: 'center',
				},
				submitButtonImage: {
					height: submitButtonHeight,
					width: submitButtonWidth,
					tintColor: colors.buttonTxt,
				},
				button: {
					height: 30,
					width: 120,
					marginTop: 10,
				},
				buttonTxt: {
					fontSize: fonts.small,
				},
				logoRow: {
					flexDirection: 'row',
					flexWrap: 'wrap',
				},
				logo: {
					marginTop: 10,
					width: logoWidth,
					height: logoHeight,
					marginRight: 10,
					borderWidth: 1,
					borderColor: colors.border,
				},
			}),
		[colors]
	);
	const navigation = useNavigation();
	const [loading, setLoading] = useState(true);
	const [festival, setFestivalData] = useState({});
	const [selectedButton, setSelectedButton] = useState({});
	const { festivalId } = route.params;

	const loadData = async () => {
		try {
			setLoading(true);
			const response = await Backend.Festival.buttonAndLogo({
				festivalId,
			});
			if (response?.success) {
				const buttons = response.data.submitButtons;
				setFestivalData(response.data);
				setSelectedButton(buttons[0]);
			} else {
				throw new Error(response?.message);
			}
		} catch (err) {
			toast.error('Unable to load data');
			navigation.goBack();
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderColor = (button, index) => {
		const selected = button.id === selectedButton.id;
		return (
			<Pressable onPress={() => setSelectedButton(button)} key={index}>
				<LinearGradient
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0 }}
					colors={button.background}
					style={style.colorBox}
				>
					{selected ? (
						<View style={style.checkBox}>
							<FeatherIcon color={colors.greenDark} name="check" size={15} />
						</View>
					) : null}
				</LinearGradient>
			</Pressable>
		);
	};

	return (
		<View style={style.main}>
			<Header title="Button & Logos" />
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={false} onRefresh={loadData} />
				}
			>
				<AnimatedBar height={3} width={WINDOW_WIDTH} busy={loading} />
				<View style={style.cover}>
					<View style={style.row}>
						<Text style={style.title}>Festival Listing URL</Text>
						<Text style={style.linkSmall}>Copy url</Text>
					</View>

					<Text style={style.link}>
						{HOST_NAME}/{festival.listingUrl}
					</Text>

					<Text style={style.note}>
						Help people reach faster to your festival, add this FilmFestBook
						link to your website or social media accounts
					</Text>
				</View>

				<View style={style.cover}>
					<Text style={style.title}>Submission Buttons</Text>
					<Text style={style.note}>
						Add our button directly to your website by code, or you can download
					</Text>

					<Text style={style.subTitle}>Select color</Text>

					<View style={style.colorRow}>
						{(festival.submitButtons || []).map(renderColor)}
					</View>

					<Text style={style.subTitle}>Button</Text>

					{selectedButton?.id ? (
						<LinearGradient
							start={{ x: 0, y: 1 }}
							end={{ x: 1, y: 0 }}
							colors={selectedButton.background}
							style={style.submitButton}
						>
							<RNImage
								resizeMode="contain"
								source={{ uri: STATIC_URL + festival.backgroundImage }}
								style={style.submitButtonImage}
							/>
						</LinearGradient>
					) : null}

					<Button
						icon="code"
						text="Copy code"
						iconSize={15}
						style={style.button}
						textStyle={style.buttonTxt}
						type={Button.OUTLINE_ICON_PRIMARY}
					/>
				</View>

				<View style={style.cover}>
					<Text style={style.title}>Logos</Text>
					<Text style={style.note}>
						Feel free to use our logo for promotional purpose like website, ads,
						sponser list, banners etc.
					</Text>
					<View style={style.logoRow}>
						<RNImage
							resizeMode="contain"
							source={{ uri: STATIC_URL + festival.logoImage }}
							style={[style.logo, { tintColor: colors.primary }]}
						/>
						<RNImage
							resizeMode="contain"
							source={{ uri: STATIC_URL + festival.logoImage }}
							style={[style.logo, { tintColor: colors.greenDark }]}
						/>
						<RNImage
							resizeMode="contain"
							source={{ uri: STATIC_URL + festival.logoImage }}
							style={[style.logo, { tintColor: colors.text }]}
						/>
					</View>

					<Text style={style.linkSmall2}>Press here to download logo pack</Text>
				</View>

				<View style={style.gapBottom} />
			</ScrollView>
		</View>
	);
};

export default ButtonAndLogo;