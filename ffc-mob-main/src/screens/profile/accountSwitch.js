import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SheetButtonModal from 'components/modal/sheetButtonModal';
import LoadingModal from 'components/modal/loading';
import { useNavigation, CommonActions } from '@react-navigation/native';
import {
	W95,
	WORK_TYPE_LIST,
	W90,
	ERROR_TEXT,
	WORK_TYPE_MANAGE_FESTIVAL,
} from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import toast from 'libs/toast';
import Backend from 'backend';
import Tinode from 'libs/tinode';

const AccountSwitch = ({ colors, workType }) => {
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					width: W95,
					height: 70,
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
				desc: {
					fontSize: fonts.small,
					color: colors.holderColor,
				},
				label: {
					width: W90,
					fontSize: fonts.small,
					fontWeight: weights.semibold,
					color: colors.text,
				},
				note: {
					width: W90,
					fontSize: fonts.xsmall,
					color: colors.holderColor,
				},
				workCover: {
					flexDirection: 'row',
					height: 70,
					alignItems: 'center',
					width: '100%',
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
					marginHorizontal: 10,
				},
				radioIn: {
					width: 12,
					height: 12,
					borderRadius: 30,
					backgroundColor: colors.primary,
				},
			}),
		[colors]
	);
	const navigation = useNavigation();
	const [isBusy, setBusy] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentWorkType, setCurrentWorkType] = useState(workType);
	const currentWorkData = useMemo(() => {
		// eslint-disable-next-line eqeqeq
		const d = WORK_TYPE_LIST.find((x) => x.id == workType);
		return d || {};
	}, [workType]);

	const resetPage = (page) => {
		navigation.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [{ name: page }],
			})
		);
	};

	const changeWorkType = async () => {
		try {
			if (currentWorkType === workType) {
				setIsModalVisible(false);
				return;
			}
			setBusy(true);
			const response = await Backend.Account.updateWorkType(currentWorkType);
			if (response.success) {
				Tinode.clearCurrent();
				if (currentWorkType === WORK_TYPE_MANAGE_FESTIVAL) {
					resetPage('HomeOrganizer');
				} else {
					resetPage('HomeFilmMaker');
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

	const showModal = () => {
		setCurrentWorkType(workType);
		setIsModalVisible(true);
	};

	const renderWorkType = (item, index) => {
		const selected = currentWorkType === item.id;
		const color = selected ? colors.primary : colors.border;
		const radioColor = selected ? colors.primary : colors.holderColor;

		return (
			<Pressable
				key={item.id}
				onPress={() => setCurrentWorkType(item.id)}
				style={[style.workCover, { borderColor: color }]}
			>
				<View style={[style.radio, { borderColor: radioColor }]}>
					{selected ? <View style={style.radioIn} /> : null}
				</View>
				<View>
					<Text style={style.label}>{item.title}</Text>
					<Text numberOfLines={1} style={style.note}>
						{item.note}
					</Text>
				</View>
			</Pressable>
		);
	};

	return (
		<>
			<Pressable onPress={showModal} style={style.main}>
				<View>
					<Text style={style.title}>{currentWorkData.title}</Text>
					<Text style={style.desc}>Switch Account Type</Text>
				</View>
				<FeatherIcon size={24} name="refresh-cw" color={colors.text} />
			</Pressable>
			<SheetButtonModal
				title="Change Work Type"
				onClose={() => setIsModalVisible(false)}
				onSubmit={changeWorkType}
				visible={isModalVisible}
			>
				{WORK_TYPE_LIST.map(renderWorkType)}
			</SheetButtonModal>
			<LoadingModal busy={isBusy} />
		</>
	);
};

export default AccountSwitch;