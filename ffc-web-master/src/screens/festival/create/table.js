import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FeatherIcon from "feather-icons-react";
import colors from "themes/colors";
import { ReactSortable } from "react-sortablejs";
import {
	BORDER_RADIUS,
	BUTTON_FORM_HEIGHT,
	FORM_FONT_SIZE,
} from "utils/constants";
import Input from "components/input";
import DateInput from "components/input/dateInput";
const TABLE_INPUT_HEIGHT = BUTTON_FORM_HEIGHT - 5;
class Table extends PureComponent {
	renderEditable = (cell, rowIdx, colIdx) => {
		if (cell?.key === "date") {
			return (
				<DateInput
					onSelect={(v) => this.props.onCellEdit(v, rowIdx, colIdx)}
					value={cell.value}
					textStyle={style.inputText}
					style={style.cellInput}
				/>
			);
		}
		return (
			<Input
				onChangeText={(v) => this.props.onCellEdit(v, rowIdx, colIdx)}
				value={cell.value}
				style={style.cellInput}
			/>
		);
	};
	renderColumn = (cell, index) => {
		return (
			<View
				style={[style.cell, { width: `${cell.width}%` }]}
				key={cell.title}
			>
				<Text
					numberOfLines={1}
					style={[style.cellText, { textAlign: cell.align }]}
				>
					{cell.title}
				</Text>
			</View>
		);
	};

	renderRows = (data, rowIdx) => {
		const {
			columns,
			editable,
			sortable,
			pressable,
			onCellPress,
			onDelete,
			onEdit,
		} = this.props;
		return (
			<View
				style={[style.row, { marginBottom: editable ? 7 : 0 }]}
				key={data.idx || data.id}
			>
				{data.values.map((cell, idx) => {
					return (
						<TouchableOpacity
							style={[
								style.cell,
								{ width: `${columns[idx].width}%` },
							]}
							onPress={() => onCellPress(data)}
							disabled={!pressable && !editable}
							activeOpacity={1}
							key={idx}
						>
							{editable ? (
								this.renderEditable(cell, rowIdx, idx)
							) : (
								<Text numberOfLines={1} style={style.cellValue}>
									{cell.value}
								</Text>
							)}
						</TouchableOpacity>
					);
				})}
				<View style={style.actionCell}>
					{onDelete ? (
						<TouchableOpacity
							style={style.icon}
							onPress={() => onDelete(data, rowIdx)}
						>
							<FeatherIcon
								icon="trash"
								color={colors.textBlack}
								size={18}
							/>
						</TouchableOpacity>
					) : null}
					{onEdit ? (
						<TouchableOpacity
							style={style.icon}
							onPress={() => onEdit(data)}
						>
							<FeatherIcon
								icon="edit"
								color={colors.textBlack}
								size={18}
							/>
						</TouchableOpacity>
					) : null}
					{sortable ? (
						<div style={style.icon2} className="movable">
							<FeatherIcon
								icon="move"
								color={colors.primaryBlue}
								size={18}
							/>
						</div>
					) : null}
				</View>
			</View>
		);
	};

	renderEmpty = () => {
		return (
			<View style={style.emptyCard}>
				<Text onPress={this.props.onEmptyPress} style={style.emptyText}>
					{this.props.emptyText}
				</Text>
			</View>
		);
	};

	render() {
		const { columns, rows, onSort, sortable, editable } = this.props;
		return (
			<View style={style.main}>
				<View
					style={[
						style.header,
						{ marginBottom: editable && rows?.length > 0 ? 10 : 0 },
					]}
				>
					{columns.map(this.renderColumn)}
				</View>
				{rows?.length > 0 ? (
					sortable ? (
						<ReactSortable
							setList={onSort}
							list={rows}
							handle=".movable"
						>
							{rows.map(this.renderRows)}
						</ReactSortable>
					) : (
						rows.map(this.renderRows)
					)
				) : (
					this.renderEmpty()
				)}
			</View>
		);
	}
}

const style = {
	main: {
		width: "100%",
		borderWidth: 1,
		borderRadius: BORDER_RADIUS,
		borderColor: colors.borderColor,
		marginTop: 10,
	},
	row: {
		flexDirection: "row",
		height: BUTTON_FORM_HEIGHT,
		backgroundColor: colors.popupBg,
	},
	emptyCard: {
		justifyContent: "center",
		paddingLeft: 10,
		height: BUTTON_FORM_HEIGHT,
	},
	header: {
		flexDirection: "row",
		borderBottomWidth: 1,
		height: BUTTON_FORM_HEIGHT,
		borderColor: colors.borderColor,
		borderTopRightRadius: BORDER_RADIUS,
		borderTopLeftRadius: BORDER_RADIUS,
	},
	cell: {
		height: BUTTON_FORM_HEIGHT,
		justifyContent: "center",
		paddingHorizontal: 10,
		outline: "none",
	},
	cellInput: {
		fontSize: FORM_FONT_SIZE,
		height: TABLE_INPUT_HEIGHT,
	},
	cellText: {
		fontSize: FORM_FONT_SIZE,
		color: colors.holderColor,
	},
	emptyText: {
		fontSize: 14,
		color: colors.holderColor,
	},
	cellValue: {
		fontSize: FORM_FONT_SIZE,
		color: colors.textBlack,
	},
	inputText: {
		fontSize: FORM_FONT_SIZE,
	},
	actionCell: {
		flex: 1,
		paddingRight: 10,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	icon: {
		marginLeft: 25,
	},
	icon2: {
		marginLeft: 25,
		marginTop: 5,
		cursor: "pointer",
	},
};

Table.defaultProps = {
	columns: [],
	rows: [],
	editable: false,
	sortable: false,
	pressable: false,
	onSort: () => {},
	onCellPress: () => {},
	emptyText: "No Data Found",
};

export default Table;