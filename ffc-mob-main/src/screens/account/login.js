import React, { useState, useEffect, useRef } from 'react';
import { View, Keyboard, Text, StyleSheet, Image } from 'react-native';
import Animated, { withTiming, useSharedValue } from 'react-native-reanimated';
// Components
import Button from 'components/button';
import Input from 'components/input';
import Footer from 'components/footer';

// Hooks
import { useTheme, CommonActions } from '@react-navigation/native';

// Fuctions
import toast from 'libs/toast';
import Backend from 'backend';
import DB from 'db';

// Constants
import { ERROR_TEXT, WINDOW_WIDTH, HEADER_HEIGHT } from 'utils/constants';
import logoAsset from 'assets/images/logo.png';

const accountWidth = WINDOW_WIDTH * 0.9;

const Login = ({ navigation }) => {
	const { colors } = useTheme();
	const style = StyleSheet.create({
		logo: {
			tintColor: colors.selected,
			height: 30,
			width: 150,
			marginBottom: 8,
			alignSelf: 'center',
		},
		accountCover: {
			height: '100%',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: colors.card,
		},
		accountContent: {
			flex: 1,
			width: accountWidth,
			justifyContent: 'center',
		},
		title: {
			fontSize: 22,
			color: colors.text,
			fontWeight: 'bold',
		},
		subTitle: {
			marginTop: 5,
			fontSize: 15,
			color: colors.text,
		},
		inputStyle: {
			width: accountWidth,
			marginTop: 25,
		},
		header: {
			height: HEADER_HEIGHT,
			width: '100%',
			borderBottomWidth: 1,
			borderColor: colors.border,
			justifyContent: 'flex-end',
			position: 'absolute',
			top: 0,
			backgroundColor: colors.card,
			zIndex: 1,
		},
		link: {
			fontSize: 15,
			color: colors.primary,
			marginTop: 15,
		},
		btnStyle: {
			width: accountWidth,
			marginTop: 15,
		},
		footer: {
			height: 60,
			position: 'absolute',
			bottom: 0,
			width: accountWidth,
			alignSelf: 'center',
		},
	});
	const passwordRef = useRef();
	const [loading, setLoading] = useState(false);
	const opacity = useSharedValue();
	const [formData, setFormData] = useState({});
	const [keyboardVisible, setKeyboardVisible] = useState(false);

	const loginAccount = async () => {
		const { email, password } = formData;
		// RNTinodeClient.login(email, password, (data, error) => {
		// 	RNTinodeClient.initClient();
		// 	navigation.navigate('MessagesFlatList');
		// });
		// return;
		try {
			setLoading(true);
			const account = await Backend.Account.login({
				password,
				email,
			});
			if (account?.success) {
				toast.success('Logged In Successfully!');
				DB.Account.setCurrentToken(account.data.token);
				navigation.dispatch(
					CommonActions.reset({
						index: 0,
						routes: [{ name: 'GetStarted' }],
					})
				);
			} else {
				throw new Error(account.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			({ endCoordinates }) => {
				setKeyboardVisible(true);
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setKeyboardVisible(false);
			}
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	useEffect(() => {
		opacity.value = withTiming(keyboardVisible ? 0 : 1);
	}, [keyboardVisible]);

	const createAccount = () => {
		if (!loading) {
			navigation.navigate('Register');
		}
	};

	return (
		<View style={style.accountCover}>
			<View style={style.header}>
				<Image resizeMode="contain" style={style.logo} source={logoAsset} />
			</View>
			<View style={style.accountContent}>
				<Animated.Text style={[style.title, { opacity }]}>Login</Animated.Text>
				<Animated.Text numberOfLines={2} style={[style.subTitle, { opacity }]}>
					Get started with free account, organize festival or submit films.
				</Animated.Text>
				<Input
					onChangeText={(email) => setFormData({ ...formData, email })}
					placeholder="Email"
					autoCapitalize="none"
					style={style.inputStyle}
					keyboardType="email-address"
					onSubmitEditing={() => passwordRef.current.focus()}
				/>
				<Input
					ref={passwordRef}
					onChangeText={(password) => setFormData({ ...formData, password })}
					placeholder="Password"
					style={style.inputStyle}
					secureTextEntry
					onSubmitEditing={loginAccount}
				/>
				<Text style={style.link}>Forgot Password?</Text>
				<Button
					onPress={loginAccount}
					busy={loading}
					text="Login"
					style={style.inputStyle}
				/>
				<Button
					text="Create Account"
					type={Button.OUTLINE_PRIMARY}
					style={style.btnStyle}
					onPress={createAccount}
				/>
			</View>

			{keyboardVisible ? null : <Footer style={style.footer} />}
		</View>
	);
};

export default Login;