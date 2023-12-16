import React, { useState, useMemo, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet, StatusBar } from 'react-native';
import Preloader from 'components/preloader/basic';
import Button from 'components/button/';
import Input from 'components/input';
import { useTheme, CommonActions } from '@react-navigation/native';
import { fonts, weights } from 'themes/topography';
import {
	W90,
	WINDOW_HEIGHT,
	WINDOW_WIDTH,
	HEADER_HEIGHT,
	WORK_TYPE_MANAGE_FESTIVAL,
	WORK_TYPE_SUBMIT_WORK,
	ERROR_TEXT,
	WORK_TYPE_LIST
} from 'utils/constants';
import toast from 'libs/toast';
import Backend from 'backend';
import DB from 'db';
import BootSplash from 'react-native-bootsplash';
import NetInfo from '@react-native-community/netinfo';

const GetStarted = ({ navigation }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					height: WINDOW_HEIGHT,
					width: WINDOW_WIDTH,
					backgroundColor: colors.background,
				},
				header: {
					height: HEADER_HEIGHT,
					paddingTop: StatusBar.currentHeight,
					borderBottomWidth: 1,
					borderColor: colors.border,
					paddingHorizontal: 10,
					marginBottom: 20,
					backgroundColor: colors.card,
				},
				headerTitle: {
					fontSize: fonts.regular,
					fontWeight: weights.bold,
					color: colors.text,
				},
				headerSubTitle: {
					fontSize: fonts.small,
					color: colors.holderColor,
					marginTop: 2,
				},
				content: {
					paddingVertical: 20,
					backgroundColor: colors.card,
					width: WINDOW_WIDTH,
					alignItems: 'center',
				},
				input: {
					width: W90,
					fontSize: fonts.regular,
					height: 40,
					marginTop: 5,
					padding: 0,
					marginBottom: 20,
				},
				label: {
					width: W90,
					fontSize: fonts.small,
					fontWeight: weights.semibold,
					color: colors.text,
				},
				note: {
					width: W90,
					fontSize: fonts.small,
					color: colors.holderColor,
				},
				workCover: {
					flexDirection: 'row',
					height: 70,
					alignItems: 'center',
					width: W90,
					borderRadius: 5,
					borderWidth: 1,
					marginTop: 10,
				},
				radio: {
					width: 20,
					height: 20,
					borderRadius: 50,
					borderWidth: 2,
					justifyContent: 'center',
					alignItems: 'center',
					marginHorizontal: 15,
				},
				radioIn: {
					width: 12,
					height: 12,
					borderRadius: 30,
					backgroundColor: colors.primary,
				},
				validFont: {
					fontSize: fonts.small,
				},
				button: {
					width: W90,
					height: 40,
					marginTop: 20,
				},
				req: {
					color: colors.rubyRed,
				},
			}),
		[colors]
	);
	const [isBusy, setBusy] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setError] = useState(false);
	const [formDetails, setFormDetails] = useState({
		workType: WORK_TYPE_SUBMIT_WORK,
	});

	const setDetails = (params) => {
		setFormDetails((pre) => ({ ...pre, ...params }));
	};

	const logout = () => {
		DB.Account.deleteCurrentToken();
		resetPage();
	};

	const resetPage = (page = 'Login') => {
		BootSplash.hide({ fade: true });
		navigation.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [{ name: page }],
			})
		);
	};

	const setAsWorkType = (wk) => {
		if (wk === WORK_TYPE_MANAGE_FESTIVAL) {
			resetPage('HomeOrganizer');
		} else {
			resetPage('HomeFilmMaker');
		}
	};

	const invalidateUser = async () => {
		try {
			const netInfo = await NetInfo.fetch();
			if (!netInfo.isConnected) {
				BootSplash.hide({ fade: true });
				setError(true);
				return;
			}
			setIsLoading(true);
			setError(false);
			const response = await Backend.Account.initialSetupData();
			if (response?.success) {
				const data = response.data;
				const wk = parseInt(data.workType, 10);
				if (!data?.workType || !data?.firstName) {
					BootSplash.hide({ fade: true });
					return;
				}
				setAsWorkType(wk);
			} else if (response === 403) {
				logout();
			} else {
				BootSplash.hide({ fade: true });
				setError(true);
			}
		} catch (err) {
			logout();
		} finally {
			setIsLoading(false);
		}
	};

	const updateUser = async () => {
		try {
			setBusy(true);
			const response = await Backend.Account.updateSetupData(formDetails);
			if (response.success) {
				setAsWorkType(formDetails.workType);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setBusy(false);
		}
	};

	const init = async () => {
		const currentToken = await DB.Account.getCurrentToken();
		if (currentToken) {
			invalidateUser();
		} else {
			resetPage();
		}
	};

	useEffect(() => {
		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderWorkType = (item, index) => {
		const selected = formDetails.workType === item.id;
		const color = selected ? colors.primary : colors.border;
		const radioColor = selected ? colors.primary : colors.holderColor;

		return (
			<Pressable
				key={item.id}
				onPress={() => setDetails({ workType: item.id })}
				style={[style.workCover, { borderColor: color }]}
			>
				<View style={[style.radio, { borderColor: radioColor }]}>
					{selected ? <View style={style.radioIn} /> : null}
				</View>
				<View>
					<Text style={style.label}>{item.title}</Text>
					<Text style={style.note}>{item.note}</Text>
				</View>
			</Pressable>
		);
	};

	return (
		<View style={style.main}>
			<View style={style.header}>
				<Text style={style.headerTitle}>Basic Setup</Text>
				<Text numberOfLines={1} style={style.headerSubTitle}>
					Setup your profile, so that we can serve you better
				</Text>
			</View>

			<View style={style.content}>
				<Preloader
					errorText="No internet connection"
					isBusy={isLoading}
					onRetry={invalidateUser}
					hasError={hasError}
					isEmpty={false}
				>
					<Text style={style.label}>
						First Name <Text style={style.req}>*</Text>
					</Text>
					<Input
						style={style.input}
						value={formDetails.firstName}
						onChangeText={(x) =>
							setDetails({
								firstName: x,
							})
						}
					/>

					<Text style={style.label}>Last Name</Text>
					<Input
						style={style.input}
						value={formDetails.lastName}
						onChangeText={(x) =>
							setDetails({
								lastName: x,
							})
						}
					/>

					<Text style={style.label}>
						Work Preference <Text style={style.req}>*</Text>
					</Text>
					<Text style={style.note}>
						You can change it later, from account settings
					</Text>

					{WORK_TYPE_LIST.map(renderWorkType)}

					<Button
						busy={isBusy}
						onPress={updateUser}
						type={Button.PRIMARY}
						style={style.button}
						text={'Submit'}
						iconSize={16}
						textStyle={style.validFont}
					/>
				</Preloader>
			</View>
		</View>
	);
};

export default GetStarted;
