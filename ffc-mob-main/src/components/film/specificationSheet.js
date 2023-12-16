import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DraggableBottomSheet from '../modal/draggableBottomSheet';
import { useTheme } from '@react-navigation/native';
import { MMMDDYYYY } from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import moment from 'moment';
import helper from 'utils/helper';
import Country from 'libs/country';

const MODAL_HEIGHT = 500;

const SpecificationSheet = ({ visible, data = {}, onClose }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				title: {
					marginTop: 10,
					color: colors.primary,
					fontSize: fonts.regular,
					fontWeight: weights.bold,
				},
				dataRow: {
					alignItems: 'center',
					flexDirection: 'row',
					marginTop: 15,
					justifyContent: 'space-between',
				},
				dataKey: {
					color: colors.holderColor,
					fontSize: fonts.small,
				},
				dataVal: {
					color: colors.holderColor,
					fontSize: fonts.small,
					fontWeight: weights.bold,
				},
				button: {
					marginTop: 20,
				},
				buttonTxt: {
					fontSize: fonts.regular,
				},
			}),
		[colors]
	);

	const specification = useMemo(() => {
		const filmTypes = (data.filmTypes || []).join(',');
		const filmGenres = (data.filmGenres || []).join(',');
		const filmLanguages = (data.filmLanguages || []).join(',');
		const runtime = data.runtimeSeconds
			? helper.formatSeconds(data.runtimeSeconds)
			: false;
		const completionDate = data.completionDate
			? moment(data.completionDate).format(MMMDDYYYY)
			: null;
		const productionBudget = data.productionBudget
			? helper.prettyNumber(
					data.productionBudget,
					data.productionBudgetCurrency
			  )
			: false;
		const country = data.countryOfOrigin
			? Country.getCountry(data.countryOfOrigin)
			: {};
		const shootingFormat = data.shootingFormat?.length
			? data.shootingFormat
			: false;
		const firstTime = data.firstTime?.length
			? data.firstTime
				? 'Yes'
				: 'No'
			: false;
		const filmColor = data.filmColor?.length ? data.filmColor : false;
		return {
			filmTypes,
			filmGenres,
			runtime,
			completionDate,
			productionBudget,
			country,
			filmLanguages,
			shootingFormat,
			filmColor,
			firstTime,
		};
	}, [data]);

	return (
		<DraggableBottomSheet
			height={MODAL_HEIGHT}
			colors={colors}
			onClose={onClose}
			visible={visible}
			padding={15}
		>
			<Text style={style.title}>Film Specifications</Text>

			{specification.filmTypes.length ? (
				<View style={style.dataRow}>
					<Text style={style.dataKey}>Project Type</Text>
					<Text style={style.dataVal}>{specification.filmTypes}</Text>
				</View>
			) : null}

			{specification.filmGenres.length ? (
				<View style={style.dataRow}>
					<Text style={style.dataKey}>Genres</Text>
					<Text style={style.dataVal}>{specification.filmGenres}</Text>
				</View>
			) : null}

			{specification.runtime ? (
				<View style={style.dataRow}>
					<Text style={style.dataKey}>Runtime</Text>
					<Text style={style.dataVal}>{data.runtime}</Text>
				</View>
			) : null}

			{specification.completionDate ? (
				<View style={style.dataRow}>
					<Text style={style.dataKey}>Completion Date</Text>
					<Text style={style.dataVal}>{data.completionDate}</Text>
				</View>
			) : null}

			{specification.productionBudget ? (
				<View style={style.dataRow}>
					<Text style={style.dataKey}>Production Budget</Text>
					<Text style={style.dataVal}>{data.productionBudget}</Text>
				</View>
			) : null}

			{specification.country?.name ? (
				<View style={style.dataRow}>
					<Text style={style.dataKey}>Country of origin</Text>
					<Text style={style.dataVal}>{specification.country.name}</Text>
				</View>
			) : null}

			{specification.filmLanguages.length ? (
				<View style={style.dataRow}>
					<Text style={style.dataKey}>Languages</Text>
					<Text style={style.dataVal}>{specification.filmLanguages}</Text>
				</View>
			) : null}

			{specification.shootingFormat ? (
				<View style={style.dataRow}>
					<Text style={style.dataKey}>Shooting Format</Text>
					<Text style={style.dataVal}>{specification.shootingFormat}</Text>
				</View>
			) : null}

			{specification.filmColor ? (
				<View style={style.dataRow}>
					<Text style={style.dataKey}>Film Color</Text>
					<Text style={style.dataVal}>{specification.filmColor}</Text>
				</View>
			) : null}

			{specification.firstTime ? (
				<View style={style.dataRow}>
					<Text style={style.dataKey}>First time filmmaker</Text>
					<Text style={style.dataVal}>{specification.firstTime}</Text>
				</View>
			) : null}
		</DraggableBottomSheet>
	);
};

export default SpecificationSheet;
