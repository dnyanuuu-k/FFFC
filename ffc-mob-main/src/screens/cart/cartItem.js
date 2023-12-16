import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import FilmCard from './filmCard';
import ProductCard from './productCard';
import { BORDER_RADIUS } from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import { useTheme } from '@react-navigation/native';

const CartItem = ({ data, currency, onRemove }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					borderRadius: BORDER_RADIUS,
					borderWidth: 1,
					width: '100%',
					borderColor: colors.border,
					marginTop: 30,
				},
				header: {
					height: 50,
					paddingHorizontal: 8,
					flexDirection: 'row',
					borderBottomWidth: 1,
					borderColor: colors.border,
					alignItems: 'center',
				},
				footer: {
					height: 50,
					marginTop: 20,
					paddingHorizontal: 10,
					borderTopWidth: 1,
					borderColor: colors.border,
					alignItems: 'flex-end',
					justifyContent: 'center',
				},
				title: {
					fontSize: fonts.regular,
					marginLeft: 5,
					color: colors.text,
				},
				key: {
					fontSize: 16,
					color: colors.holderColor,
					fontWeight: weights.light,
				},
				value: {
					fontSize: 16,
					color: colors.text,
					fontWeight: fonts.semibold,
					textAlign: 'right',
				},
				hr: {
					marginTop: 20,
					height: 1,
					width: '100%',
					backgroundColor: colors.border,
				},
			}),
		[colors]
	);

	const filmCardStyle = StyleSheet.create({
		main: {
			width: '100%',
			marginTop: 20,
			paddingHorizontal: 10,
		},
		content: {
			flex: 1,
			paddingLeft: 10,
		},
		options: {
			justifyContent: 'space-between',
			alignItems: 'flex-end',
		},
		image: {
			height: 50,
			width: 50,
			overflow: 'hidden',
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: BORDER_RADIUS,
			backgroundColor: colors.border,
		},
		title: {
			fontSize: fonts.regular,
			color: colors.text,
			fontWeight: 'bold',
		},
		key: {
			fontSize: fonts.small,
			color: colors.holderColor,
			fontWeight: '300',
			marginTop: 8,
		},
		value: {
			fontSize: fonts.small,
			color: colors.text,
			fontWeight: '300',
			textAlign: 'right',
		},
		fee: {
			fontSize: 16,
			color: colors.text,
			fontWeight: '600',
			textAlign: 'right',
		},
		remove: {
			fontSize: 13,
			fontWeight: '500',
			color: colors.rubyRed,
			position: 'absolute',
			top: 0,
			right: 10,
		},
		feeText: {
			position: 'absolute',
			bottom: 0,
			right: 10,
		},
		row: {
			flexDirection: 'row',
			alignItems: 'center',
		},
	});

	const total = Number(data.total).toFixed(2);
	return (
		<View style={style.main}>
			<View style={style.header}>
				<Text style={style.title}>{data.name}</Text>
			</View>

			<FlatList
				data={data.items}
				renderItem={({ item }) =>
					item.type === 'product' ? (
						<ProductCard
							onRemove={onRemove}
							currency={currency}
							data={item}
							style={filmCardStyle}
						/>
					) : (
						<FilmCard
							onRemove={onRemove}
							currency={currency}
							data={item}
							style={filmCardStyle}
						/>
					)
				}
				ItemSeparatorComponent={<View style={style.hr} />}
			/>

			<View style={style.footer}>
				<Text style={style.key}>
					Subtotal :{' '}
					<Text style={style.value}>
						{currency}
						{total}
					</Text>
				</Text>
			</View>
		</View>
	);
};

export default CartItem;