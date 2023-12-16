import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import ReactSortable from 'react-native-draggable-flatlist';
import Input from 'components/input';
import DateInput from 'components/input/dateInput';

import {
	BORDER_RADIUS,
	BUTTON_HEIGHT,
	YYYYMMDD,
	MMMDDYYYY,
} from 'utils/constants';
import { fonts } from 'themes/topography';

import { useTheme } from '@react-navigation/native';
import moment from 'moment';

const TABLE_INPUT_HEIGHT = BUTTON_HEIGHT - 5;
const Table = ({
	onEmptyPress,
	emptyText,
	columns,
	rows,
	onSort,
	sortable,
	editable,
	pressable,
	onCellPress,
	onDelete,
	onEdit,
	onCellEdit,
}) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					width: '100%',
					borderWidth: 1,
					borderRadius: BORDER_RADIUS,
					borderColor: colors.border,
					marginTop: 10,
				},
				row: {
					flexDirection: 'row',
					height: BUTTON_HEIGHT,
					backgroundColor: colors.card,
				},
				emptyCard: {
					justifyContent: 'center',
					paddingLeft: 10,
					height: BUTTON_HEIGHT,
				},
				header: {
					flexDirection: 'row',
					borderBottomWidth: 1,
					height: BUTTON_HEIGHT,
					borderColor: colors.border,
					borderTopRightRadius: BORDER_RADIUS,
					borderTopLeftRadius: BORDER_RADIUS,
				},
				cell: {
					height: BUTTON_HEIGHT,
					justifyContent: 'center',
					paddingHorizontal: 10,
					outline: 'none',
				},
				cellInput: {
					fontSize: fonts.small,
					height: TABLE_INPUT_HEIGHT,
				},
				dateInput: {
					paddingLeft: 2,
					fontSize: fonts.small,
					height: TABLE_INPUT_HEIGHT,
				},
				cellText: {
					fontSize: fonts.small,
					color: colors.holderColor,
				},
				emptyText: {
					fontSize: 14,
					color: colors.holderColor,
				},
				cellValue: {
					fontSize: fonts.small,
					color: colors.text,
				},
				inputText: {
					fontSize: fonts.small,
				},
				actionCell: {
					flex: 1,
					paddingRight: 10,
					alignItems: 'center',
					flexDirection: 'row',
					justifyContent: 'flex-end',
				},
				icon: {
					marginLeft: 15,
				},
			}),
		[colors]
	);
	const renderEditable = (cell, rowIdx, colIdx) => {
		if (cell?.key === 'date') {
			return (
				<DateInput
					onSelect={(v) => onCellEdit(v, rowIdx, colIdx)}
					value={cell.value}
					textStyle={style.inputText}
					style={style.dateInput}
				/>
			);
		}
		return (
			<Input
				onChangeText={(v) => onCellEdit(v, rowIdx, colIdx)}
				value={cell.value}
				style={style.cellInput}
			/>
		);
	};

	const renderCell = (cell) => {
		let value = cell.value;
		if (cell?.key === 'date') {
			value = moment(value, YYYYMMDD).format(MMMDDYYYY);
		}
		return (
			<Text numberOfLines={1} style={style.cellValue}>
				{value}
			</Text>
		);
	};

	const renderColumn = (cell, index) => {
		return (
			<View style={[style.cell, { width: `${cell.width}%` }]} key={cell.title}>
				<Text
					numberOfLines={1}
					style={[style.cellText, { textAlign: cell.align }]}
				>
					{cell.title}
				</Text>
			</View>
		);
	};

	const renderRows = ({ item: data, drag, getIndex }) => {
		const rowIdx = getIndex();
		return (
			<View
				style={[style.row, { marginBottom: editable ? 7 : 0 }]}
				key={data.idx || data.id}
			>
				{data.values.map((cell, idx) => {
					return (
						<TouchableOpacity
							style={[style.cell, { width: `${columns[idx].width}%` }]}
							onPress={() => onCellPress(data)}
							disabled={!pressable && !editable}
							activeOpacity={1}
							key={idx}
						>
							{editable ? renderEditable(cell, rowIdx, idx) : renderCell(cell)}
						</TouchableOpacity>
					);
				})}
				<View style={style.actionCell}>
					{onDelete ? (
						<TouchableOpacity
							style={style.icon}
							onPress={() => onDelete(data, rowIdx)}
						>
							<FeatherIcon name="trash" color={colors.text} size={18} />
						</TouchableOpacity>
					) : null}
					{onEdit ? (
						<TouchableOpacity style={style.icon} onPress={() => onEdit(data)}>
							<FeatherIcon name="edit" color={colors.text} size={18} />
						</TouchableOpacity>
					) : null}
					{sortable ? (
						<TouchableOpacity onPressIn={drag} style={style.icon}>
							<FeatherIcon name="move" color={colors.primaryBlue} size={18} />
						</TouchableOpacity>
					) : null}
				</View>
			</View>
		);
	};

	const renderEmpty = () => {
		return (
			<View style={style.emptyCard}>
				<Text onPress={onEmptyPress} style={style.emptyText}>
					{emptyText}
				</Text>
			</View>
		);
	};

	return (
		<View style={style.main}>
			<View
				style={[
					style.header,
					{ marginBottom: editable && rows?.length > 0 ? 10 : 0 },
				]}
			>
				{columns.map(renderColumn)}
			</View>
			{rows?.length > 0 ? (
				<ReactSortable
					onDragEnd={onSort}
					data={rows}
					keyExtractor={(data) => data.idx || data.id}
					renderItem={renderRows}
				/>
			) : (
				renderEmpty()
			)}
		</View>
	);
};

Table.defaultProps = {
	columns: [],
	rows: [],
	editable: false,
	sortable: false,
	pressable: false,
	onSort: () => {},
	onCellPress: () => {},
	emptyText: 'No Data Found',
	onCellEdit: () => {},
};

export default Table;
