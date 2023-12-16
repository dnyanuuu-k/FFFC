import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import {
	ScrollView,
	gestureHandlerRootHOC,
} from 'react-native-gesture-handler';

//Custom Components
import Loading from 'components/modal/loading';
import Input from 'components/input';
import Checkbox from 'components/checkbox';
import Title from './title';
import Header from './header';
import SaveButton from './saveButton';

//Helper Functions
import toast from 'libs/toast';
import Backend from 'backend';

// Hooks
import { useTheme } from '@react-navigation/native';

//Constants
import infoNote, { infoType } from './info';
import { ERROR_TEXT, BORDER_RADIUS, BUTTON_HEIGHT } from 'utils/constants';
import {
	TOP_GAP,
	formWidth,
	formWidthInput,
	coverWidth,
	sharedStyle,
} from './constants';
import { fonts } from 'themes/topography';

const FilmDetails = ({ navigation, route }) => {
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
			}),
		[colors]
	);
	const [isLoading, setIsLoading] = useState(false);
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
				stageId: 0,
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
		loadFilmData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSave = async () => {
		try {
			setIsLoading(true);
			const response = await Backend.Film.updateFilmDetails(data);
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
				title="Film Details"
				subTitle="Basic information about your film"
			/>
			<View style={style.holder}>
				<ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
					<View style={style.main}>
						<Title text="Film Title (English)" required />
						<Input
							style={style.input}
							value={data?.title}
							onChangeText={(title) => onNewData({ title })}
						/>

						<Title text="Short Summary (English)" required />
						<Input
							value={data?.shortSummary}
							onChangeText={(shortSummary) => onNewData({ shortSummary })}
							multiline
							style={style.inputArea}
							placeholder={infoNote[infoType.description]}
						/>

						<Title text="Storyline (English)" />
						<Input
							value={data?.storyline}
							onChangeText={(storyline) => onNewData({ storyline })}
							multiline
							style={style.inputArea}
							placeholder={infoNote[infoType.storyline]}
						/>

						<View style={style.checkboxCover}>
							<Checkbox
								label="My Project also has a non-English Title and Synopsis"
								checked={data?.hasNonEnglishTitle}
								cardStyle={style.checkboxInput}
								textStyle={style.checkboxText}
								onChange={(hasNonEnglishTitle) => {
									onNewData({
										hasNonEnglishTitle,
									});
								}}
							/>
						</View>

						{data?.hasNonEnglishTitle ? (
							<>
								<Title text="Film Title (Orignal)" />
								<Input
									style={style.input}
									value={data?.nativeTitle}
									onChangeText={(nativeTitle) => onNewData({ nativeTitle })}
								/>

								<Title text="Short Summary (Orignal)" />
								<Input
									value={data?.nativeShortSummary}
									onChangeText={(nativeShortSummary) =>
										onNewData({ nativeShortSummary })
									}
									multiline
									style={style.inputArea}
								/>

								<Title text="Storyline (English)" />
								<Input
									value={data?.nativeStoryLine}
									onChangeText={(nativeStoryLine) =>
										onNewData({ nativeStoryLine })
									}
									multiline
									style={style.inputArea}
								/>
							</>
						) : null}

						<View style={style.inputRow}>
							<View style={sharedStyle.marginFix}>
								<Title text="Facebook" />
								<Input
									style={style.inputHalf}
									value={data?.facebook}
									onChangeText={(facebook) => onNewData({ facebook })}
								/>
							</View>
							<View style={sharedStyle.marginFix}>
								<Title text="Instagram" />
								<Input
									style={style.inputHalf}
									value={data?.instagram}
									onChangeText={(instagram) => onNewData({ instagram })}
								/>
							</View>
						</View>
						<View style={style.inputRow}>
							<View style={sharedStyle.marginFix}>
								<Title text="Twitter" />
								<Input
									style={style.inputHalf}
									value={data?.twitter}
									onChangeText={(twitter) => onNewData({ twitter })}
								/>
							</View>
							<View style={sharedStyle.marginFix}>
								<Title text="Linkedin" />
								<Input
									style={style.inputHalf}
									value={data?.linkedin}
									onChangeText={(linkedin) => onNewData({ linkedin })}
								/>
							</View>
						</View>
					</View>
				</ScrollView>
			</View>
			<SaveButton colors={colors} onPress={handleSave} />
			<Loading busy={isLoading} />
		</>
	);
};

export default gestureHandlerRootHOC(FilmDetails);
