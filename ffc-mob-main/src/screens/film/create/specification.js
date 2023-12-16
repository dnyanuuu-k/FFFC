import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import {
	ScrollView,
	gestureHandlerRootHOC,
} from 'react-native-gesture-handler';

//Custom Components
import Loading from 'components/modal/loading';
import Radio from 'components/radio/radio2';
import RuntimeInput from 'components/input/runtimeInput';
import Input from 'components/input';
import OptionInput from 'components/input/simpleOption';
import MultiOptionInput from 'components/input/multiOptionInput';
import CountryInput from 'components/input/countryInput';
import DateInput from 'components/input/dateInput';

import Title from './title';
import Header from './header';
import SaveButton from './saveButton';

//Helper Functions
import toast from 'libs/toast';
import Backend from 'backend';

//Libs
import languageList from 'libs/language/list';
import Language from 'libs/language';

// Hooks
import { useTheme } from '@react-navigation/native';

//Constants
import infoNote, { infoType } from './info';
import {
	ERROR_TEXT,
	BORDER_RADIUS,
	BUTTON_HEIGHT,
	YESNO_OPTIONS,
} from 'utils/constants';
import {
	TOP_GAP,
	TOP_GAP2,
	formWidth,
	formWidthInput,
	coverWidth,
	sharedStyle,
} from './constants';
import { fonts } from 'themes/topography';
const formWidthRadio = coverWidth / 2.5;
const budgetInputWidth = formWidthInput - 60;

const FilmSpecifications = ({ navigation, route }) => {
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
				optionInput: {
					height: BUTTON_HEIGHT,
					marginRight: 5,
					marginTop: TOP_GAP2,
				},
				currInput: {
					height: BUTTON_HEIGHT,
					width: 50,
					marginTop: 10,
					fontSize: fonts.regular,
				},
				inputBudget: {
					height: BUTTON_HEIGHT,
					width: budgetInputWidth,
					marginTop: 10,
					marginRight: 10,
					fontSize: fonts.regular,
				},
				inputRow: {
					flexDirection: 'row',
					flexWrap: 'wrap',
					alignItems: 'center',
				},
				inputArea: {
					fontSize: fonts.regular,
					paddingTop: 10,
					height: 150,
					width: formWidth,
					marginTop: 10,
					textAlignVertical: 'top',
				},
				checkboxInput: {
					paddingLeft: 0,
				},
				checkboxText: {
					fontSize: fonts.small,
					color: colors.holderColor,
				},
				radioThird: {
					marginTop: 20,
					marginRight: 20,
				},
				validFont: {
					fontSize: fonts.regular,
				},
			}),
		[colors]
	);
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState({});
	const [filmTypeList, setFilmTypes] = useState([]);
	const [filmColors, setFilmColors] = useState([]);
	const [filmGenreList, setFilmGenre] = useState([]);

	const onNewData = (newData) => {
		setData({
			...data,
			...newData,
		});
	};

	const init = async () => {
		try {
			setIsLoading(true);
			const response = await Backend.Film.getFormTypes();
			if (response?.success) {
				const formTypes = response.data;
				setFilmTypes(formTypes.filmTypeList);
				setFilmColors(formTypes.filmColors);
				setFilmGenre(formTypes.filmGenreList);
				loadFilmData();
			} else {
				navigation.goBack();
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			setTimeout(() => {
				toast.error(err.message);
			}, 200);
		}
	};

	const loadFilmData = async () => {
		try {
			setIsLoading(true);
			const filmId = route.params.id;
			const response = await Backend.Film.getStageWiseData({
				filmId,
				stageId: 3,
			});
			if (response?.success) {
				setData(response.data);
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
		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSave = async () => {
		try {
			setIsLoading(true);
			const response = await Backend.Film.updateFilmSpecifications(data);
			if (response.success) {
				setTimeout(() => {
					toast.success('Film Details Saved Successfully!');
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
				title="Film Specifications"
				subTitle="Basic film specifications"
			/>
			<View style={style.holder}>
				<ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
					<View style={style.main}>
						<Title text="Film Type" whatIsThis={infoNote[infoType.film_type]} />
						<Radio
							options={filmTypeList}
							value={data?.filmTypes}
							multiple={true}
							onChange={(v) => onNewData({ filmTypes: [...v] })}
							cardStyle={style.radioThird}
							width={formWidthRadio}
						/>

						<Title text="Genres" />
						<Radio
							options={filmGenreList}
							value={data?.filmGenres}
							multiple={true}
							onChange={(v) => onNewData({ filmGenres: [...v] })}
							cardStyle={style.radioThird}
							width={formWidthRadio}
						/>

						<Title text="Runtime" />
						<RuntimeInput
							style={style.input}
							runtimeSeconds={data?.runtimeSeconds}
							onSelect={(rs) => onNewData({ runtimeSeconds: rs })}
						/>

						<Title text="Completion Date" />
						<DateInput
							style={style.input}
							value={data?.completionDate}
							placeholder="Select date"
							textStyle={style.validFont}
							onSelect={(completionDate) =>
								onNewData({
									completionDate,
								})
							}
						/>

						<Title text="Production Budget" />
						<View style={style.inputRow}>
							<Input
								style={style.inputBudget}
								value={data?.productionBudget}
								onChangeText={(x) => onNewData({ productionBudget: x })}
							/>
							<Input style={style.currInput} value={'INR'} disabled />
						</View>

						<Title text="Country of Origin" />
						<CountryInput
							style={style.input}
							value={data?.countryOfOrgin}
							textStyle={sharedStyle.validFont}
							onSelect={(c) => onNewData({ countryOfOrgin: c })}
						/>

						<Title text="Language" />
						<MultiOptionInput
							style={sharedStyle.modalInput}
							onSelect={(x) =>
								onNewData({
									filmLanguages: x,
								})
							}
							label="Language"
							emptyText=""
							searchPlaceholder="Search languages"
							values={data?.filmLanguages}
							textStyle={sharedStyle.validFont}
							dataList={languageList}
							getCodeItem={Language.getLanguage}
						/>

						<Title text="Shooting Format" />
						<Input
							style={style.input}
							value={data?.shootingFormat}
							placeholder="Digital, Super 35mm, Full Frame"
							onChangeText={(x) => onNewData({ shootingFormat: x })}
						/>

						<Title text="Aspect Ratio" />
						<Input
							style={style.input}
							value={data?.aspectRatio}
							placeholder="16:9"
							onChangeText={(x) => onNewData({ aspectRatio: x })}
						/>

						<Title text="Film Color" />
						<OptionInput
							style={style.optionInput}
							textStyle={style.validFont}
							onSelect={(sr) => {
								onNewData({ filmColorId: sr });
							}}
							selectedValue={data?.filmColorId}
							options={filmColors}
							title="Select Film Color"
						/>

						<Title text="First Time" />
						<OptionInput
							style={style.optionInput}
							textStyle={style.validFont}
							onSelect={(sr) => {
								onNewData({ firstTime: sr });
							}}
							selectedValue={data?.firstTime}
							options={YESNO_OPTIONS}
							title="Is this your first time?"
						/>
					</View>
				</ScrollView>
			</View>
			<SaveButton colors={colors} onPress={handleSave} />
			<Loading busy={isLoading} />
		</>
	);
};

export default gestureHandlerRootHOC(FilmSpecifications);
