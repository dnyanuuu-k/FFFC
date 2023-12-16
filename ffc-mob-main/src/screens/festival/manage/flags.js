import React, { useMemo, useState, useEffect } from 'react';
import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	Pressable,
	TextInput,
	RefreshControl,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { RNSelectionMenu } from 'libs/Menu/';
import AnimatedBar from 'components/animated/bar';
import Loading from 'components/modal/loading';
import Header from 'components/header/basic';
import Button from 'components/button';
import Backend from 'backend';
import toast from 'libs/toast';
import { useTheme, useNavigation } from '@react-navigation/native';
import { fonts, weights } from 'themes/topography';
import { WINDOW_WIDTH, DEFAULT_FLAGS, ERROR_TEXT } from 'utils/constants';

const flagRowWidth = WINDOW_WIDTH - 20;
const flagHolderWidth = 50;
const flagOptionWidth = 50;
const flagInputWidth = flagRowWidth - (flagHolderWidth + flagOptionWidth);

const FestivalFlags = ({ route }) => {
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
				margin: {
					marginTop: 5,
				},
				note: {
					color: colors.holderColor,
					fontSize: fonts.xsmall,
				},

				checkboxInput: {
					marginTop: 20,
					paddingLeft: 5,
				},
				checkboxText: {
					width: 300,
					minHeight: 40,
					fontSize: fonts.small,
					color: colors.holderColor,
				},

				noteRed: {
					fontSize: fonts.xsmall,
					color: colors.rubyRed,
					fontWeight: weights.semibold,
				},

				statRow: {
					marginTop: 20,
					height: 80,
					width: '100%',
					borderTopWidth: 1,
					borderColor: colors.border,
					flexDirection: 'row',
				},
				statBox: {
					height: 90,
					width: '33%',
					alignItems: 'center',
				},
				statBorder: {
					borderLeftWidth: 1,
					borderRightWidth: 1,
					borderColor: colors.border,
				},
				statVal: {
					fontSize: fonts.small,
					color: colors.text,
					marginTop: 20,
				},
				statKey: {
					fontSize: fonts.xsmall,
					color: colors.holderColor,
					textAlign: 'center',
				},

				button: {
					marginTop: 20,
					height: 35,
				},
				buttonTxt: {
					fontSize: fonts.small,
				},

				flagRow: {
					width: flagRowWidth,
					height: 40,
					flexDirection: 'row',
					borderColor: colors.border,
					borderRadius: 10,
					marginTop: 10,
					borderWidth: 1,
				},
				flagHolder: {
					width: flagHolderWidth,
					height: 40,
					justifyContent: 'center',
					alignItems: 'center',
				},
				flagInput: {
					width: flagInputWidth,
					height: 40,
					paddingLeft: 10,
					color: colors.text,
					fontSize: fonts.small,
				},
				flagOption: {
					width: flagOptionWidth,
					height: 40,
					justifyContent: 'center',
					alignItems: 'center',
				},
			}),
		[colors]
	);
	const [flags, setFlags] = useState([]);

	const navigation = useNavigation();
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const { festivalId } = route.params;

	const loadData = async () => {
		try {
			setLoading(true);
			const response = await Backend.Festival.getFestivalFlags({
				festivalId,
			});
			if (response?.success) {
				setFlags(response.data);
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

	const saveFlags = async () => {
		try {
			setBusy(true);
			const response = await Backend.Festival.saveFestivalFlags({
				festivalId,
				flags,
			});
			if (response?.success) {
				toast.success('Flags saved sucessfully!');
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

	const deleteFlag = (flag, index) => {
		const deleteCurrent = () => {
			flags.splice(index, 1);
			setFlags([...flags]);
		};
		if (flag.isUsed) {
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
				title: 'Flag is being used',
				subTitle: 'Deleting this will removed flag assigned to submission',
				onSelection: (value) => {
					const optIdx = values.findIndex((v) => v.value === value);
					if (optIdx === 0) {
						deleteCurrent();
					}
				},
			});
		} else {
			deleteCurrent();
		}
	};

	const setFlagName = (title, index) => {
		flags[index].title = title;
		setFlags([...flags]);
	};

	const addNewFlag = () => {
		if (flags.length >= DEFAULT_FLAGS.length) {
			toast.error('Only ' + DEFAULT_FLAGS.length + ' can be added');
			return;
		}
		const fcolors = flags.map((d) => d.color);
		const dcolors = DEFAULT_FLAGS.map((d) => d.color);
		const flagIndex = dcolors.findIndex((v) => !fcolors.includes(v));
		if (flagIndex !== -1) {
			flags.push(DEFAULT_FLAGS[flagIndex]);
			setFlags([...flags]);
		}
	};

	const renderFlag = (flag, index) => {
		return (
			<View style={style.flagRow} key={flag.color}>
				<View style={style.flagHolder}>
					<FeatherIcon color={flag.color} name="flag" size={15} />
				</View>
				<TextInput
					value={flag.title}
					style={style.flagInput}
					placeholder="Flag Name"
					placeholderTextColor={colors.holderColor}
					onChangeText={(text) => setFlagName(text, index)}
				/>
				<Pressable
					style={style.flagOption}
					onPress={() => deleteFlag(flag, index)}
				>
					<FeatherIcon color={colors.holderColor} name="trash-2" size={15} />
				</Pressable>
			</View>
		);
	};

	return (
		<View style={style.main}>
			<Header title="Custom Flags" />
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={false} onRefresh={loadData} />
				}
			>
				<AnimatedBar height={3} width={WINDOW_WIDTH} busy={loading} />
				<View style={style.cover}>
					<Text style={[style.note, style.margin]}>
						Create custom labels to your flags to make managing submissions
						clearer and easier.
					</Text>

					{flags.map(renderFlag)}

					<Button
						style={style.button}
						textStyle={style.buttonTxt}
						text="Add New Flag"
						type={Button.OUTLINE_PRIMARY}
						onPress={addNewFlag}
					/>

					<Button
						style={style.button}
						textStyle={style.buttonTxt}
						text="Save Flags"
						type={Button.PRIMARY}
						onPress={saveFlags}
					/>
				</View>

				<View style={style.gapBottom} />
			</ScrollView>
			<Loading busy={busy} />
		</View>
	);
};

export default FestivalFlags;