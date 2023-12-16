import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Image from 'components/image';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { WINDOW_WIDTH } from 'utils/constants';
import { fonts, weights } from 'themes/topography';

const creditCardWidth = WINDOW_WIDTH / 2.2;
const CastCrew = ({ credits, isOwner, onAddNew }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flexDirection: 'row',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
				},
				credit: {
					width: creditCardWidth,
					height: 60,
					flexDirection: 'row',
					marginBottom: 10,
					alignItems: 'center',
				},
				name: {
					color: colors.text,
					fontWeight: weights.semibold,
					fontSize: fonts.small,
				},
				desig: {
					color: colors.holderColor,
					fontSize: fonts.xsmall,
				},
				avatar: {
					height: 54,
					width: 54,
					borderRadius: 5,
					backgroundColor: colors.border,
				},
				content: {
					flex: 1,
					marginLeft: 10,
				},
				addButton: {
					borderWidth: 1,
					borderColor: colors.primary,
					justifyContent: 'center',
					alignItems: 'center',
					height: 54,
					width: 54,
					borderRadius: 5,
					borderStyle: 'dashed',
				},
				iconFix: {
					marginLeft: 5,
				},
			}),
		[colors]
	);
	const renderCredit = ({ id, name, designation, avatarUrl, avatarHash }) => {
		return (
			<View style={style.credit} key={id}>
				<Image style={style.avatar} hash={avatarHash} url={avatarUrl} />
				<View style={style.content}>
					<Text numberOfLines={2} style={style.name}>
						{name}
					</Text>
					<Text numberOfLines={1} style={style.desig}>
						{designation}
					</Text>
				</View>
			</View>
		);
	};
	return (
		<View style={style.main}>
			{credits.map(renderCredit)}
			{isOwner ? (
				<Pressable onPressIn={onAddNew} style={style.credit}>
					<View style={style.addButton}>
						<FeatherIcon
							color={colors.primary}
							style={style.iconFix}
							size={18}
							name="user-plus"
						/>
					</View>
					<View style={style.content}>
						<Text numberOfLines={2} style={style.name}>
							Add Person
						</Text>
						<Text numberOfLines={1} style={style.desig}>
							press to add
						</Text>
					</View>
				</Pressable>
			) : null}
		</View>
	);
};

export default CastCrew;
