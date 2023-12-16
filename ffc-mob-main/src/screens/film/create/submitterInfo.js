import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import {
	ScrollView,
	gestureHandlerRootHOC,
} from 'react-native-gesture-handler';

//Custom Components
import CountryInput from 'components/input/countryInput';
import DateInput from 'components/input/dateInput';
import OptionInput from 'components/input/optionInput';
import Loading from 'components/modal/loading';
import Input from 'components/input';
import SectionText from './sectionText';
import Title from './title';
import Header from './header';
import SaveButton from './saveButton';

//Helper Functions
import toast from 'libs/toast';
import Backend from 'backend';

// Hooks
import { useTheme } from '@react-navigation/native';

//Constants
import {
	GENDER_OPTIONS,
	ERROR_TEXT,
	BORDER_RADIUS,
	BUTTON_HEIGHT,
} from 'utils/constants';
import {
	TOP_GAP,
	formWidth,
	formWidthInput,
	coverWidth,
	sharedStyle,
} from './constants';
import { fonts } from 'themes/topography';

const FilmSubmitter = ({ navigation, route }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				holder: {
					alignItems: 'center',
					alignSelf: 'center',
					width: coverWidth,
					backgroundColor: colors.card,
					paddingBottom: 120,
				},
				main: {
					width: formWidth,
					paddingBottom: TOP_GAP,
				},
				checkboxCover: {
					marginTop: TOP_GAP,
					padding: TOP_GAP,
					borderColor: colors.border,
					borderWidth: 1,
					borderRadius: BORDER_RADIUS,
				},
				input: {
					height: BUTTON_HEIGHT,
					width: formWidth,
					marginTop: 10,
					fontSize: fonts.regular,
				},
				inputHalf: {
					height: BUTTON_HEIGHT,
					width: formWidthInput,
					marginTop: 10,
					fontSize: fonts.regular,
				},
				inputRow: {
					flexDirection: 'row',
					flexWrap: 'wrap',
					alignItems: 'center',
				},
			}),
		[colors]
	);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedGender, setGender] = useState(null);
	const [data, setData] = useState({});

	const onNewData = (newData) => {
		setData({
			...data,
			...newData,
		});
	};

	const loadFilmData = async () => {
		try {
			setIsLoading(true);
			const filmId = route.params.id;
			const response = await Backend.Film.getStageWiseData({
				filmId,
				stageId: 1,
			});
			if (response?.success) {
				const rdata = response.data;
				const sg = GENDER_OPTIONS.find(
					(gender) => gender.value === rdata?.submitterGender
				);
				setData({
					...rdata,
					submitterPostalCode: `${rdata.submitterPostalCode || ''}`,
				});
				setGender(sg);
			} else if (filmId) {
				navigation.goBack();
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			setTimeout(() => {
				toast.error(err.message);
			}, 200);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadFilmData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSave = async () => {
		try {
			setIsLoading(true);
			const payload = {
				...data,
				submitterGender: selectedGender?.value,
			};
			const response = await Backend.Film.updateSubmitterDetails(payload);
			if (response.success) {
				setTimeout(() => {
					toast.success('Submitter Details Saved Successfully!');
				}, 200);
				navigation.goBack();
				return;
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			setTimeout(() => {
				toast.error(err.message);
			}, 300);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Header
				title="Submitter Information"
				subTitle="Information related to film submitter"
			/>
			<View style={style.holder}>
				<ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
					<View style={style.main}>
						<Title text="Email" required />
						<Input
							value={data?.submitterEmail}
							onChangeText={(submitterEmail) => onNewData({ submitterEmail })}
							style={style.input}
						/>

						<Title text="Phone" />
						<Input
							style={style.input}
							value={data?.submitterPhone}
							onChangeText={(submitterPhone) => onNewData({ submitterPhone })}
						/>

						<Title text="Address" />
						<Input
							style={style.input}
							value={data?.submitterAddress}
							onChangeText={(submitterAddress) =>
								onNewData({ submitterAddress })
							}
						/>

						<View style={style.inputRow}>
							<View style={sharedStyle.marginFix}>
								<Title text="City" />
								<Input
									style={style.inputHalf}
									value={data?.submitterCity}
									onChangeText={(submitterCity) => onNewData({ submitterCity })}
								/>
							</View>
							<View style={sharedStyle.marginFix}>
								<Title text="State / Province" />
								<Input
									style={style.inputHalf}
									value={data?.submitterState}
									onChangeText={(submitterState) =>
										onNewData({ submitterState })
									}
								/>
							</View>
						</View>

						<View style={style.inputRow}>
							<View style={sharedStyle.marginFix}>
								<Title text="Postal Code" />
								<Input
									style={style.inputHalf}
									value={data?.submitterPostalCode}
									onChangeText={(submitterPostalCode) =>
										onNewData({ submitterPostalCode })
									}
								/>
							</View>
							<View style={sharedStyle.marginFix}>
								<Title text="Country" required />
								<CountryInput
									style={style.inputHalf}
									value={data?.submitterCountry}
									onSelect={(submitterCountry) =>
										onNewData({ submitterCountry })
									}
								/>
							</View>
						</View>

						<SectionText
							text="Personal Info"
							subText="We keep your personal information safe and secure"
						/>
						<Title text="Birthdate" />
						<DateInput
							style={style.inputHalf}
							value={data?.submitterDob}
							textStyle={sharedStyle.validFont}
							onSelect={(submitterDob) =>
								onNewData({
									submitterDob,
								})
							}
						/>

						<Title text="Gender" />
						<OptionInput
							style={sharedStyle.optionInput}
							textStyle={sharedStyle.validFont}
							onSelect={(x) => setGender(x)}
							selectedOption={selectedGender}
							options={GENDER_OPTIONS}
						/>
					</View>
				</ScrollView>
			</View>
			<SaveButton colors={colors} onPress={handleSave} />
			<Loading busy={isLoading} />
		</>
	);
};

export default gestureHandlerRootHOC(FilmSubmitter);
