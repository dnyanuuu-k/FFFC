import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';

//Modals
import DeadlineModal from 'modals/deadline';

//Custom Components
import Loading from 'components/modal/loading';
import DateInput from 'components/input/dateInput';
import Button from 'components/button/';
import Table from './table';
import Title from './title';
import Header from './header';
import SaveButton from './saveButton';

//Helper Functions
import moment from 'moment';
import toast from 'libs/toast';
import Backend from 'backend';

// Hooks
import { useTheme } from '@react-navigation/native';

//Constants
import infoNote, { infoType } from './info';
import { ERROR_TEXT, BUTTON_HEIGHT } from 'utils/constants';
import {
	TOP_GAP,
	formWidth,
	formWidthInput,
	coverWidth,
	sharedStyle,
} from './constants';
import { fonts } from 'themes/topography';

const DateDeadline = ({ navigation, route }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				addButton: { fontSize: 14, fontWeight: 400 },
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
				validFont: {
					fontSize: fonts.regular,
				},
				inputRow: {
					flexDirection: 'row',
					flexWrap: 'wrap',
					alignItems: 'center',
				},
				inputArea: {
					fontSize: fonts.regular,
					paddingTop: 20,
					height: 150,
					width: formWidth,
					marginTop: 10,
					textAlignVertical: 'top',
				},
				required: {
					color: colors.rubyRed,
				},
				titleButton: {
					marginTop: 20,
					height: 30,
					width: 120,
				},
				note: {
					fontSize: fonts.small,
					color: colors.primary,
					marginTop: 10,
				},
				textHr: {
					fontSize: fonts.small,
					color: colors.text,
					marginHorizontal: 10,
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

	const loadFestivalData = async () => {
		try {
			setIsLoading(true);
			const festivalId = route.params.id;
			const response = await Backend.Festival.getStageWiseData({
				festivalId,
				stageId: 2,
			});
			if (response?.success) {
				const festival = response.data;
				const festivalDateDeadlines =
					DeadlineModal.createAllDeadlineTableStructure(
						festival?.festivalDateDeadlines
					);
				setData({
					...festival,
					festivalDateDeadlines,
				});
			} else if (festivalId) {
				navigation.goBack();
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message || ERROR_TEXT);
		} finally {
			setIsLoading(false);
		}
	};

	const addDeadline = () => {
		if (data?.festivalDateDeadlines?.length > 10) {
			toast.error('You can add upto 10 deadlines');
			return;
		}
		const idx = moment().unix();
		const newDeadline = DeadlineModal.createDeadlineTableStructure(null, idx);
		const currentDeadlines = Array.from(data?.festivalDateDeadlines || []);
		currentDeadlines.push(newDeadline);
		onNewData({
			festivalDateDeadlines: currentDeadlines,
		});
	};

	const handleDeadlineDelete = (cellData) => {
		let festivalDateDeadlines = [...(data?.festivalDateDeadlines || [])];
		const deleteIdx = festivalDateDeadlines.findIndex(
			(o) => o.idx === cellData.idx
		);
		if (deleteIdx === -1) {
			toast.error(ERROR_TEXT);
		}
		festivalDateDeadlines.splice(deleteIdx, 1);
		onNewData({ festivalDateDeadlines });
	};

	const handleCellEdit = (newValue, rowIdx, colIdx) => {
		let festivalDateDeadlines = [...data.festivalDateDeadlines];
		let values = Array.from(festivalDateDeadlines[rowIdx].values);
		values[colIdx] = { ...values[colIdx], value: newValue };
		festivalDateDeadlines[rowIdx].values = values;
		onNewData({
			festivalDateDeadlines,
		});
	};

	const handleSave = async () => {
		try {
			setIsLoading(true);
			const payload = {
				id: data.festivalDateId,
				festivalId: data.id,
				openingDate: data.openingDate,
				notificationDate: data.notificationDate,
				festivalStart: data.festivalStart,
				festivalEnd: data.festivalEnd,
				festivalDateDeadlines: DeadlineModal.getAllDeadlineTableStructure(
					data.festivalDateDeadlines
				),
			};
			const response = await Backend.Festival.updateFestivalDeadlineDetails(
				payload
			);
			if (response.success) {
				toast.success('Dates & Deadline Details Saved Successfully!');
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
		loadFestivalData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const deleteFunction = data?.disabled ? undefined : handleDeadlineDelete;

	return (
		<>
			<Header
				title="Dates & Deadlines"
				subTitle="Important dates for your festival"
			/>
			<View style={style.holder}>
				<NestableScrollContainer showsVerticalScrollIndicator={false}>
					<View style={style.main}>
						<Title
							text="Opening Date"
							whatIsThis={infoNote[infoType.opening_date]}
							required
						/>
						<DateInput
							disabled={data?.disabled}
							style={style.inputHalf}
							value={data?.openingDate}
							placeholder="Select date"
							textStyle={style.validFont}
							onSelect={(openingDate) =>
								onNewData({
									openingDate,
								})
							}
						/>

						<Title text="Entry Deadlines" required extraTopMargin />
						<Table
							columns={[
								{ title: 'Deadline', width: 42, key: 'name' },
								{
									title: 'Date',
									width: 45,
									key: 'date',
								},
								{ title: '', width: 10, align: 'left' },
							]}
							onCellEdit={handleCellEdit}
							editable={!data?.disabled}
							rows={data?.festivalDateDeadlines}
							emptyText="Click here to add deadline"
							onEmptyPress={addDeadline}
							onDelete={deleteFunction}
						/>
						{data?.disabled ? (
							<Text style={style.note}>
								Deadlines cannot be edited when submissions are started
							</Text>
						) : (
							<Button
								icon={'plus'}
								type={Button.OUTLINE_ICON_PRIMARY}
								style={style.titleButton}
								text={'Add Deadline'}
								onPress={addDeadline}
								iconSize={16}
								textStyle={sharedStyle.addButton}
							/>
						)}

						<Title
							text="Notification Date"
							required
							extraTopMargin
							whatIsThis={infoNote[infoType.notification_date]}
						/>
						<DateInput
							style={style.inputHalf}
							value={data?.notificationDate}
							placeholder="Select date"
							textStyle={style.validFont}
							onSelect={(notificationDate) =>
								onNewData({
									notificationDate,
								})
							}
						/>

						<Title text="Festival Date(s)" required extraTopMargin />
						<View style={style.inputRow}>
							<DateInput
								style={style.inputHalf}
								value={data?.festivalStart}
								textStyle={style.validFont}
								placeholder="Start Date"
								onSelect={(festivalStart) =>
									onNewData({
										festivalStart,
									})
								}
							/>
							<Text style={style.textHr}>to</Text>
							<DateInput
								style={style.inputHalf}
								value={data?.festivalEnd}
								textStyle={style.validFont}
								placeholder="End Date"
								onSelect={(festivalEnd) =>
									onNewData({
										festivalEnd,
									})
								}
							/>
						</View>
					</View>
				</NestableScrollContainer>
			</View>
			<SaveButton colors={colors} onPress={handleSave} />
			<Loading busy={isLoading} />
		</>
	);
};

export default gestureHandlerRootHOC(DateDeadline);
