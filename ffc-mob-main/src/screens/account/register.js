import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StatusBar, Keyboard, View, Text, StyleSheet } from 'react-native';

// Components
import PhoneInput from 'components/input/phoneInput';
import Button from 'components/button';
import Input from 'components/input';
import Footer from 'components/footer';
import BackButton from './backButton';

// Hooks
import { useTheme, CommonActions } from '@react-navigation/native';

// Fuctions
import Backend from 'backend';
import DB from 'db';
import toast from 'libs/toast';

// Constants
import { ERROR_TEXT, WINDOW_WIDTH } from 'utils/constants';

const accountWidth = WINDOW_WIDTH * 0.9;
const Register = ({ navigation }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				accountCover: {
					height: '100%',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: colors.card,
					paddingTop: StatusBar.currentHeight,
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
				link: {
					fontSize: 15,
					color: colors.primary,
					marginTop: 15,
				},
				loginLink: {
					fontSize: 15,
					color: colors.primary,
					marginTop: 20,
					textAlign: 'center',
					width: '100%',
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
			}),
		[colors]
	);
	const phoneRef = useRef();
	const passwordRef = useRef();
	const [keyboardVisible, setKeyboardVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({});
	const [currentCountryCode, setCountryCode] = useState('IN');

	const loginAccount = () => {
		if (!loading) {
			navigation.navigate('Login');
		}
	};

	const createAccount = async () => {
		try {
			setLoading(true);
			const { email, phoneNo, password } = formData;
			const account = await Backend.Account.create({
				password,
				email,
				phoneNo,
				countryCode: currentCountryCode,
			});
			if (account?.success) {
				toast.success('Account Created!');
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

	const handleBack = () => {
		if (!loading) {
			navigation.goBack();
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

	return (
		<View style={style.accountCover}>
			<View style={style.accountContent}>
				{keyboardVisible ? null : (
					<BackButton colors={colors} onPress={handleBack} />
				)}
				<Text style={style.title}>Create Account</Text>
				<Text numberOfLines={2} style={style.subTitle}>
					Get started with free account, organize festival or submit films.
				</Text>
				<Input
					onChangeText={(email) => setFormData({ ...formData, email })}
					placeholder="Email"
					style={style.inputStyle}
					autoCapitalize="none"
					keyboardType="email-address"
					onSubmitEditing={() => phoneRef.current.focus()}
				/>
				<PhoneInput
					ref={phoneRef}
					onChangeText={(phoneNo) => setFormData({ ...formData, phoneNo })}
					placeholder="Phone"
					style={style.inputStyle}
					keyboardType="numeric"
					onChangeCountry={setCountryCode}
					onSubmitEditing={() => passwordRef.current.focus()}
				/>
				<Input
					ref={passwordRef}
					onChangeText={(password) => setFormData({ ...formData, password })}
					placeholder="Password"
					style={style.inputStyle}
					secureTextEntry
					onSubmitEditing={createAccount}
				/>
				<Text onPress={loginAccount} style={style.link}>
					Forgot Password?
				</Text>
				<Button
					onPress={createAccount}
					busy={loading}
					text="Create Account"
					style={style.inputStyle}
				/>
				<Text onPress={loginAccount} style={style.loginLink}>
					Already have an account
				</Text>
			</View>

			{keyboardVisible ? null : <Footer style={style.footer} />}
		</View>
	);
};

export default Register;
