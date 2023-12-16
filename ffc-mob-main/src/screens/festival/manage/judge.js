import React, { useMemo, useState, useEffect } from 'react';
import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	Pressable,
	RefreshControl,
} from 'react-native';
import Loading from 'components/modal/loading';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DraggableBottomSheet from 'components/modal/draggableBottomSheet';
import AnimatedBar from 'components/animated/bar';
import Header from 'components/header/basic';
import Button from 'components/button';
import Input from 'components/input';
import Radio from 'components/radio/radio2';
import Backend from 'backend';
import toast from 'libs/toast';
import { RNSelectionMenu } from 'libs/Menu/';
import { useTheme, useNavigation } from '@react-navigation/native';
import { fonts, weights } from 'themes/topography';
import { WINDOW_WIDTH, ERROR_TEXT, W70 } from 'utils/constants';

const MODAL_HEIGHT = 370;
const permissionList = [
	{
		label: 'Judge Submissions',
		value: 'judge',
	},
	{
		label: 'View submitter contact information',
		value: 'judge.contact',
	},
	{
		label: 'View submitter details (Synopsis, Digital Press Kit, etc.)',
		value: 'judge.details',
	},
	{
		label: 'Share ratings with submitter',
		value: 'judge.review',
	},
]; // TODO: Get Pemission List from backend

const defaultJudgeData = {
	permissions: [],
	email: '',
};
const FestivalJudge = ({ route }) => {
	const { colors, dark } = useTheme();
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
				title: {
					fontSize: fonts.regular,
					color: colors.text,
					fontWeight: weights.semibold,
				},
				note: {
					color: colors.holderColor,
					fontSize: fonts.xsmall,
				},

				button: {
					marginTop: 10,
					height: 35,
				},
				buttonTxt: {
					fontSize: fonts.small,
				},
				inputStyle: {
					marginTop: 10,
				},
				margin: {
					marginTop: 10,
				},

				checkboxInput: {
					marginTop: 5,
					paddingLeft: 5,
				},
				checkboxText: {
					width: W70,
					fontSize: fonts.small,
					color: colors.holderColor,
				},

				card: {
					height: 50,
					flexDirection: 'row',
					marginBottom: 10,
					alignItems: 'center',
				},
				cardContent: {
					flex: 1,
					justifyContent: 'center',
					paddingLeft: 10,
				},
				judgeName: {
					fontSize: fonts.small,
					color: colors.text,
				},
				judgeDesc: {
					fontSize: fonts.xsmall,
					color: colors.holderColor,
				},
				cardIcon: {
					height: 45,
					width: 45,
					justifyContent: 'center',
					alignItems: 'center',
				},
				avatar: {
					height: 45,
					width: 45,
					borderRadius: 100,
					backgroundColor: colors.background,
				},
			}),
		[colors]
	);

	const [judges, setJudges] = useState([]);
	const [visible, setVisible] = useState(false);
	const [newJudgeData, setNewJudgeData] = useState({
		permissions: [],
	});

	const navigation = useNavigation();
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const { festivalId } = route.params;

	const loadData = async () => {
		try {
			setLoading(true);
			const response = await Backend.Festival.getFestivalJudges({
				festivalId,
			});
			if (response?.success) {
				setJudges(response.data);
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

	const updateJudge = async () => {
		try {
			if (loading) {
				return;
			}
			setBusy(true);
			const response = await Backend.Festival.createFestivalJudge({
				festivalId,
				...newJudgeData,
			});
			if (response?.success) {
				toast.success(
					`Judge ${newJudgeData.festivalJudgeId ? 'Updated' : 'Added'}!`
				);

				if (newJudgeData.id) {
					// eslint-disable-next-line eqeqeq
					const index = judges.findIndex((j) => j.id == newJudgeData.id);
					if (index !== -1) {
						judges[index].permissions = response.data.permissions;
						setJudges(judges);
					}
				} else {
					judges.push(response.data);
					setJudges(judges);
				}
				setVisible(false);
				setNewJudgeData(defaultJudgeData);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setBusy(false);
		}
	};

	const deleteJudge = async (festivalJudgeId) => {
		try {
			if (loading) {
				return;
			}
			setBusy(true);
			const response = await Backend.Festival.deleteFestivalJudge({
				festivalJudgeId,
			});
			if (response?.success) {
				toast.success('Judge deleted!');
				const index = judges.findIndex((j) => j.id == festivalJudgeId);
				if (index !== -1) {
					judges.splice(index, 1);
					setJudges(judges);
				}
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setBusy(false);
		}
	};

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const startAddNewJudge = () => {
		setNewJudgeData(defaultJudgeData);
		setVisible(true);
	};

	const editJudge = ({ email, permissions, id }) => {
		setNewJudgeData({ email, permissions, id });
		setVisible(true);
	};

	const onClose = () => {
		setVisible(false);
		setNewJudgeData(defaultJudgeData);
	};

	const sureDelete = (id, email) => {
		const values = [
			{
				value: 'Yes',
				type: 0,
			},
			{
				value: 'No',
				type: 0,
			},
		];
		RNSelectionMenu.Show({
			values: values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Are you sure',
			subTitle: 'You want to delete ' + email,
			onSelection: (value) => {
				const index = values.findIndex((v) => v.value === value);
				if (index === 0) {
					deleteJudge(id);
				}
			},
		});
	};

	const showJudgeOptions = async (judgeData) => {
		const values = [
			{
				value: 'Edit',
				type: 0,
			},
			{
				value: 'Delete',
				type: 2,
			},
		];
		RNSelectionMenu.Show({
			values: values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Manage Judge',
			onSelection: (value) => {
				const index = values.findIndex((v) => v.value === value);
				if (index) {
					sureDelete(judgeData.id, judgeData.email);
				} else {
					editJudge(judgeData);
				}
			},
		});
	};

	const renderJudge = (judge, index) => {
		const name = judge.firstName ? judge.firstName : judge.email;
		return (
			<View style={style.card} key={judge.id}>
				<View style={style.cardContent}>
					<Text style={style.judgeName}>{name}</Text>
					<Text style={style.judgeDesc}>
						{judge.permissions.length} permissions
					</Text>
				</View>
				<Pressable
					style={style.cardIcon}
					onPress={() => showJudgeOptions(judge)}
				>
					<FeatherIcon
						name="more-vertical"
						size={15}
						color={colors.holderColor}
					/>
				</Pressable>
			</View>
		);
	};

	return (
		<>
			<View style={style.main}>
				<Header title="Manage Judges" />
				<ScrollView
					refreshControl={
						<RefreshControl refreshing={false} onRefresh={loadData} />
					}
				>
					<AnimatedBar height={3} width={WINDOW_WIDTH} busy={loading} />
					<View style={style.cover}>
						{(judges || []).map(renderJudge)}
						<Text style={style.note}>
							We sent notification on email and our mobile app, from below you
							can decided your notification preference
						</Text>

						<Button
							style={style.button}
							textStyle={style.buttonTxt}
							text="Add New Judge"
							type={Button.PRIMARY}
							onPress={startAddNewJudge}
						/>
					</View>

					<View style={style.gapBottom} />
				</ScrollView>
			</View>
			<DraggableBottomSheet
				height={MODAL_HEIGHT}
				colors={colors}
				onClose={onClose}
				visible={visible}
				padding={15}
			>
				<Text style={style.title}>New Judge</Text>
				<Input
					value={newJudgeData.email}
					onChangeText={(email) =>
						setNewJudgeData((prevState) => ({ ...prevState, email }))
					}
					placeholder="Email"
					style={style.inputStyle}
					keyboardType="email-address"
					disabled={newJudgeData?.id ? true : false}
				/>

				<Text style={[style.title, style.margin]}>Permissions</Text>
				<Radio
					options={permissionList}
					multiple
					value={newJudgeData?.permissions || []}
					onChange={(v) =>
						setNewJudgeData((prevState) => ({
							...prevState,
							permissions: [...v],
						}))
					}
					textStyle={style.checkboxText}
					cardStyle={style.checkboxInput}
					width={WINDOW_WIDTH}
				/>

				<Button
					style={style.button}
					textStyle={style.buttonTxt}
					text="Submit"
					type={Button.PRIMARY}
					onPress={updateJudge}
				/>
			</DraggableBottomSheet>
			<Loading busy={busy} />
		</>
	);
};

export default gestureHandlerRootHOC(FestivalJudge);