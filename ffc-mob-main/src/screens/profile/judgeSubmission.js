import React, { useMemo, useState } from 'react';
import {
	View,
	Text,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import Image from 'components/image';
import Animated, {
	FadeIn,
	FadeOut,
	SlideInDown,
	SlideOutDown,
} from 'react-native-reanimated';
import { W95, WINDOW_WIDTH, WINDOW_HEIGHT } from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import { RNSelectionMenu } from 'libs/Menu/';
import toast from 'libs/toast';
import Backend from 'backend';

const MODAL_HEIGHT = WINDOW_HEIGHT * 0.6;
const PressableAnimated = Animated.createAnimatedComponent(Pressable);
const JudgeSubmission = ({ dark, colors, navigation, list = [], onUpdate }) => {
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					width: W95,
					height: 50,
					alignSelf: 'center',
					borderRadius: 5,
					borderWidth: 1,
					padding: 10,
					backgroundColor: colors.card,
					marginTop: 10,
					borderColor: colors.border,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingHorizontal: 15,
				},
				title: {
					fontSize: fonts.regular,
					fontWeight: weights.semibold,
					color: colors.text,
				},
				badgeCover: {
					width: 24,
					height: 24,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 48,
					backgroundColor: colors.primary,
				},
				countTxt: {
					fontSize: fonts.xsmall,
					fontWeight: weights.semibold,
					color: colors.buttonTxt,
				},

				content: {
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
					paddingHorizontal: 10,
					height: MODAL_HEIGHT,
					backgroundColor: colors.card,
				},
				modalMain: {
					height: WINDOW_HEIGHT,
					width: WINDOW_WIDTH,
					justifyContent: 'flex-end',
					backgroundColor: colors.bgTrans69,
				},
				modalTitle: {
					fontSize: fonts.title,
					color: colors.primary,
					marginBottom: 18,
					marginTop: 14,
					fontWeight: weights.bold,
				},
				item: {
					borderBottomWidth: 1,
					borderColor: colors.border,
					paddingBottom: 10,
					marginBottom: 20,
					alignItems: 'center',
					flexDirection: 'row',
					width: W95,
				},
				label: {
					fontSize: fonts.small,
					color: colors.text,
					marginLeft: 10,
					fontWeight: weights.semibold,
				},
				note: {
					fontSize: fonts.small,
					color: colors.holderColor,
					marginTop: 2,
					marginLeft: 10,
				},
				image: {
					height: 40,
					width: 40,
					borderRadius: 100,
				},
				disabled: {
					width: WINDOW_WIDTH,
					height: '100%',
					position: 'absolute',
					backgroundColor: colors.bgTrans,
					justifyContent: 'center',
					alignItems: 'center',
				},
			}),
		[colors]
	);

	const [festivalListModal, setFestivalListModal] = useState(false);
	const [isBusy, setBusy] = useState(false);

	const showFestivalSubmissions = (festivalId) => {
		navigation.navigate('FestivalSubmissions', {
			festivalId,
		});
	};

	const updateInvitation = async (festivalJudgeId, accepted) => {
		try {
			setBusy(true);
			const response = await Backend.Judge.updateInvitation({
				festivalJudgeId,
				accepted,
			});
			if (response.success) {
				const newList = [...list];
				const idx = newList.findIndex((itm) => itm.id === festivalJudgeId);
				if (accepted) {
					newList[idx].accepted = true;
				} else {
					newList.splice(idx, 1);
				}
				onUpdate(newList);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setBusy(false);
		}
	};

	const handleSelect = (festivalJudgeId, festivalId, accepted) => {
		if (accepted) {
			setFestivalListModal(false);
			showFestivalSubmissions(festivalId);
			return;
		}

		const values = [
			{ value: 'Accept Invitation', type: 1 },
			{ value: 'Reject Invitation', type: 2 },
		];

		RNSelectionMenu.Show({
			values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 2,
			theme: dark ? 1 : 0,
			title: 'Judge Invitation',
			onSelection: (value) => {
				const idx = values.findIndex((v) => v.value === value);
				updateInvitation(festivalJudgeId, idx ? false : true);
			},
		});
	};

	const renderOption = ({ id, festival, accepted }, index) => {
		return (
			<Pressable
				key={festival.id}
				onPress={() => handleSelect(id, festival.id, accepted)}
				style={style.item}
			>
				<Image
					style={style.image}
					url={festival.logoUrl}
					hash={festival.logoHash}
				/>
				<View>
					<Text numberOfLines={1} style={style.label}>
						{festival.name}
					</Text>
					<Text style={style.note}>
						{accepted ? 'Manage Submissions' : 'Accept/Reject Invitation'}
					</Text>
				</View>
			</Pressable>
		);
	};

	return (
		<>
			<Pressable onPress={() => setFestivalListModal(true)} style={style.main}>
				<Text style={style.title}>Judge Submissions</Text>
				<View style={style.badgeCover}>
					<Text style={style.countTxt}>{list.length}</Text>
				</View>
			</Pressable>

			<Modal
				transparent
				onRequestClose={() => setFestivalListModal(false)}
				visible={festivalListModal}
				animationType="fade"
				statusBarTranslucent
			>
				<PressableAnimated
					onPress={() => setFestivalListModal(false)}
					entering={FadeIn}
					exiting={FadeOut}
					style={style.modalMain}
				>
					<PressableAnimated
						entering={SlideInDown}
						exiting={SlideOutDown}
						style={style.content}
					>
						<Text style={style.modalTitle}>Select Festival</Text>
						<ScrollView>{list.map(renderOption)}</ScrollView>

						{isBusy ? (
							<View style={style.disabled}>
								<ActivityIndicator color={colors.buttonTxt} size={30} />
							</View>
						) : null}
					</PressableAnimated>
				</PressableAnimated>
			</Modal>
		</>
	);
};

export default JudgeSubmission;