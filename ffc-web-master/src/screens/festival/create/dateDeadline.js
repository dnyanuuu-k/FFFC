import React, { Component } from "react";
import { View, Text } from "react-native";

//Custom Components
import DateInput from "components/input/dateInput";
import Loading from "components/modal/loading";
import Button from "components/button/";
import Header from "./header";
import Table from "./table";
import Title from "./title";

//Modals
import DeadlineModal from "modals/deadline";

//Third Party Functions
import moment from "moment";
import toast from "react-hot-toast";

//Helper Fuctions
import Backend from "backend";

//Constants
import { ERROR_TEXT } from "utils/constants";
import { festivalDetailStyles as style } from "./style";
import infoNote, { infoType } from "./info";

export default class DateDeadline extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isBusy: false,
		};
	}

	addDeadline = () => {
		const { data, onNewData } = this.props;
		if (data.festivalDateDeadlines.length > 10) {
			toast.error("You can add upto 10 deadlines");
			return;
		}
		const idx = moment().unix();
		const newDeadline = DeadlineModal.createDeadlineTableStructure(
			null,
			idx
		);
		const currentDeadlines = data.festivalDateDeadlines;
		currentDeadlines.push(newDeadline);
		onNewData({
			festivalDateDeadlines: currentDeadlines,
		});
	};

	handleDeadlineDelete = (cellData) => {
		const { data, onNewData } = this.props;
		const festivalDateDeadlines = data?.festivalDateDeadlines || [];
		const deleteIdx = festivalDateDeadlines.findIndex(
			(o) => o.idx === cellData.idx
		);
		if (deleteIdx === -1) {
			toast.error(ERROR_TEXT);
		}
		festivalDateDeadlines.splice(deleteIdx, 1);
		onNewData({ festivalDateDeadlines });
	};

	handleCellEdit = (newValue, rowIdx, colIdx) => {
		const { data, onNewData } = this.props; 
		const festivalDateDeadlines = data.festivalDateDeadlines;
		festivalDateDeadlines[rowIdx].values[colIdx].value = newValue;
		onNewData({
			festivalDateDeadlines
		});
	}

	handleSave = async () => {
		const { data, onNewData, onBusy } = this.props;
		try {
			onBusy(true);
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
			const response =
				await Backend.Festival.updateFestivalDeadlineDetails(payload);
			if (response.success) {
				onNewData({
					festivalDateId: response.data.festivalDateId,
					festivalDateDeadlines: DeadlineModal.createAllDeadlineTableStructure(
						response.data.festivalDateDeadlines
					),
				});
				toast.success("Dates & Deadline Details Saved Successfully!");
				this.props?.nextSection();
				return;
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			onBusy(false);
		}
	};

	render() {
		const { data, onNewData } = this.props;
		const { isBusy } = this.state;
		return (
			<>
				<View style={style.main}>
					<Header
						title="Dates & Deadlines"
						subTitle="Important dates for your festival"
					/>
					<Title
						text="Opening Date"
						whatIsThis={infoNote[infoType.opening_date]}
						required
						extraTopMargin
					/>
					<DateInput
						style={style.inputHalf}
						value={data?.openingDate}
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
							{ title: "Deadline", width: 37, key: "name" },
							{
								title: "Date",
								width: 37,
								key: "date",
							},
							{ title: "Actions", width: 26, align: "right" },
						]}
						onCellEdit={this.handleCellEdit}
						editable
						rows={data?.festivalDateDeadlines}
						emptyText="Click here to add deadline"
						onEmptyPress={this.addDeadline}
						onDelete={this.handleDeadlineDelete}
					/>
					<Button
						icon={"plus"}
						type={Button.OUTLINE_ICON_PRIMARY}
						style={[style.titleButton, { width: 120 }]}
						text={"Add Deadline"}
						onPress={this.addDeadline}
						iconSize={16}
						textStyle={{ fontSize: 14, fontWeight: 400 }}
					/>

					<Title
						text="Notification Date"
						whatIsThis={infoNote[infoType.notification_date]}
						required
						extraTopMargin
					/>
					<DateInput
						style={style.inputHalf}
						value={data?.notificationDate}
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
							onSelect={(festivalEnd) =>
								onNewData({
									festivalEnd,
								})
							}
						/>
					</View>

					<Button
						textStyle={style.buttonTxt}
						style={style.button}
						onPress={this.handleSave}
						text="Save & Continue"
					/>
				</View>
				<Loading busy={isBusy} />
			</>
		);
	}
}