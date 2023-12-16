import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

//Custom Components
import Loading from 'components/modal/loading';
import Checkbox from 'components/checkbox';
import Input from 'components/input';
import Radio from 'components/radio/radio2';
import Title from './title';
import Header from './header';
import SaveButton from './saveButton';

//Helper Functions
import Backend from 'backend';

// Hooks
import { useTheme } from '@react-navigation/native';

//Third-Party Functions
import toast from 'libs/toast';

//Constants
import infoNote, { infoType } from './info';
import { ERROR_TEXT, BUTTON_HEIGHT, HOST_NAME } from 'utils/constants';
import {
	TOP_GAP,
	TOP_GAP2,
	coverWidth,
	formWidth,
	formWidthInput,
	formWidthRadio,
} from './constants';
import { fonts } from 'themes/topography';

const ListingDetails = ({ navigation, route }) => {
	const festivalId = route.params.id;
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
				validMargin: {
					marginTop: 20,
				},
				inputRow: {
					flexDirection: 'row',
					flexWrap: 'wrap',
					alignItems: 'center',
				},
				radio: {
					height: BUTTON_HEIGHT,
					width: formWidthInput,
					marginTop: 20,
					marginRight: 20,
				},
				inputThird: {
					height: BUTTON_HEIGHT,
					width: formWidthRadio,
					marginTop: TOP_GAP2,
					fontSize: fonts.regular,
					marginRight: TOP_GAP2,
				},
				radioThird: {
					height: BUTTON_HEIGHT,
					width: formWidthRadio,
					marginTop: 20,
					marginRight: 20,
				},
				urlText: {
					marginRight: TOP_GAP2,
					marginTop: TOP_GAP2,
					fontSize: fonts.regular,
					color: colors.primary,
				},
			}),
		[colors]
	);
	const [data, setData] = useState({});
	const onNewData = (newData) => {
		setData({
			...data,
			...newData,
		});
	};
	const [isLoading, setIsLoading] = useState(false);
	const [festivalTags, setFestivalTags] = useState([]);
	const [festivalFocus, setFestivalFocus] = useState([]);

	const initData = async () => {
		try {
			setIsLoading(true);
			const response = await Backend.Metadata.getList();
			if (response.success) {
				const { festivalTagList, festivalFocusList } = response.data;
				setFestivalTags(festivalTagList);
				setFestivalFocus(festivalFocusList);
				loadFestivalData();
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
			navigation.goBack();
		}
	};

	const loadFestivalData = async () => {
		try {
			setIsLoading(true);
			const response = await Backend.Festival.getStageWiseData({
				festivalId,
				stageId: 4,
			});
			if (response?.success) {
				const festival = response.data;
				const maximumRuntime = `${festival.maximumRuntime}`;
				const minimumRuntime = `${festival.minimumRuntime}`;
				setData({ ...festival, maximumRuntime, minimumRuntime });
			} else if (festivalId) {
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

	const handleContinue = async () => {
		try {
			setIsLoading(true);
			const payload = {
				id: data?.id,
				festivalTags: data?.festivalTags || [],
				festivalFocus: data?.festivalFocus || [],
				minimumRuntime: data?.minimumRuntime || 0,
				maximumRuntime: data?.maximumRuntime || 0,
				listingUrl: data?.listingUrl,
				trackingPrefix: data?.trackingPrefix,
				startingNumber: data?.startingNumber,
				acceptsAllLength: data?.acceptsAllLength || false,
			};
			const response = await Backend.Festival.updateListingDetails(payload);
			if (response.success) {
				onNewData({
					id: response.data.id,
				});
				toast.success('Festival Listing Details Saved Successfully!');
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

	useEffect(() => {
		initData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Header
				title="Listing Settings"
				subTitle="Help people find your festival"
			/>
			<View style={style.holder}>
				<ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
					<View style={style.main}>
						<Title
							text="Listing URL"
							whatIsThis={infoNote[infoType.listingUrl]}
							required
						/>
						<View style={style.inputRow}>
							<Text style={style.urlText}>{HOST_NAME}/</Text>
							<Input
								onChangeText={(listingUrl) => {
									onNewData({
										listingUrl,
									});
								}}
								value={data?.listingUrl}
								style={style.inputThird}
							/>
						</View>
						<Title
							text="Festival Tags"
							whatIsThis={infoNote[infoType.category]}
						/>
						<Radio
							options={festivalTags}
							value={data?.festivalTags}
							multiple={true}
							onChange={(v) => onNewData({ festivalTags: [...v] })}
							cardStyle={style.radioThird}
						/>

						<Title
							text="Festival focus"
							whatIsThis={infoNote[infoType.festival_focus]}
						/>
						<Radio
							options={festivalFocus}
							value={data?.festivalFocus}
							multiple={true}
							onChange={(v) => onNewData({ festivalFocus: [...v] })}
							cardStyle={style.radio}
						/>

						<Title
							text="Runtime Search"
							whatIsThis={infoNote[infoType.runtime_search]}
						/>
						<View style={style.inputRow}>
							<Input
								style={style.inputThird}
								disabled={data?.acceptsAllLength || false}
								placeholder="Minimum (mins)"
								value={data?.minimumRuntime}
								onChangeText={(minimumRuntime) => {
									onNewData({
										minimumRuntime,
									});
								}}
							/>
							<Input
								style={style.inputThird}
								disabled={data?.acceptsAllLength || false}
								placeholder="Maximum (mins)"
								value={data?.maximumRuntime}
								onChangeText={(maximumRuntime) => {
									onNewData({
										maximumRuntime,
									});
								}}
							/>

							<Checkbox
								label="All Lengths Accepted"
								checked={data?.acceptsAllLength}
								cardStyle={style.validMargin}
								onChange={(acceptsAllLength) => {
									onNewData({
										acceptsAllLength,
									});
								}}
							/>
						</View>

						<Title
							text="Tracking Sequence"
							whatIsThis={infoNote[infoType.sequence]}
						/>
						<View style={style.inputRow}>
							<Input
								value={data?.trackingPrefix}
								onChangeText={(trackingPrefix) => {
									onNewData({
										trackingPrefix,
									});
								}}
								placeholder="Prefix"
								style={style.inputThird}
							/>
							<Input
								value={data?.startingNumber}
								onChangeText={(startingNumber) => {
									onNewData({
										startingNumber,
									});
								}}
								placeholder="Starting Number"
								style={style.inputThird}
							/>
							<Text style={style.urlText}>
								{data.trackingPrefix}
								{data.startingNumber}
							</Text>
						</View>
					</View>
				</ScrollView>
			</View>
			<SaveButton
				colors={colors}
				onPress={handleContinue}
				label="Save Listing Details"
			/>
			<Loading busy={isLoading} />
		</>
	);
};

export default ListingDetails;
