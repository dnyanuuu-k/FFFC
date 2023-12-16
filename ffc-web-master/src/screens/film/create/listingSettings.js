import React, { Component } from "react";
import { View, Text } from "react-native";

//Custom Components
import Button from "components/button/";
import Checkbox from "components/checkbox";
import Input from "components/input";
import Radio from "components/radio/radio2";
import Title from "./title";
import Header from "./header";

//Helper Functions
import Backend from "backend";

//Third-Party Functions
import toast from "react-hot-toast";

//Constants
import { ERROR_TEXT, HOST_NAME } from "utils/constants";
import { festivalDetailStyles as style } from "./style";

export default class ListingDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isBusy: false,
			festivalTags: [],
			festivalFocus: [],
		};
	}

	componentDidMount() {
		this.initData();
	}

	initData = async () => {
		const { onBusy } = this.props;
		try {
			onBusy(true);
			const response = await Backend.Metadata.getList();
			if (response.success) {
				this.setState({
					festivalTags: response.data.festivalTagList,
					festivalFocus: response.data.festivalFocusList,
				});
			}
			//TODO: ELSE
		} catch (tryErr) {
			console.log(tryErr);
			//TODO
		} finally {
			onBusy(false);
		}
	};

	handleContinue = async () => {
		const { data, onBusy, onNewData } = this.props;
		try {
			onBusy(true);
			const payload = {
				id: data?.id,
				festivalTags: data?.festivalTags || [],
				festivalFocus: data?.festivalFocus || [],
				minimumRuntime: data?.minimumRuntime || 0,
				maximumRuntime: data?.maximumRuntime || 0,
				listingUrl: data?.listingUrl,
				trackingPrefix:  data?.trackingPrefix,
				startingNumber:  data?.startingNumber,
				acceptsAllLength: data?.acceptsAllLength || false
			};
			const response = await Backend.Festival.updateListingDetails(
				payload
			);
			if (response.success) {
				onNewData({
					id: response.data.id
				});
				toast.success("Festival Listing Details Saved Successfully!");
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
		const { festivalTags, festivalFocus } = this.state;
		return (
			<View style={style.main}>
				<Header
					title="Listing Settings"
					subTitle="set festival focus area to help people search easily"
				/>

				<Title
					text="Festival Tags"
					whatIsThis
					extraTopMargin
				/>
				<Radio
					options={festivalTags}
					value={data?.festivalTags}
					multiple={true}
					onChange={(v) => onNewData({ festivalTags: v })}
					cardStyle={style.radioThird}
				/>

				<Title text="Festival focus" whatIsThis />
				<Radio
					options={festivalFocus}
					value={data?.festivalFocus}
					multiple={true}
					onChange={(v) => onNewData({ festivalFocus: v })}
					cardStyle={style.radio}
				/>

				<Title text="Runtime Search" whatIsThis />
				<View style={style.inputRow}>
					<Input
						style={style.inputThird}
						disabled={data?.acceptsAllLength || false}
						placeholder="Minimum (minutes)"
						value={data?.minimumRuntime}
						onChangeText={(minimumRuntime) => {
							onNewData({
								minimumRuntime
							})
						}}
					/>
					<Input
						style={style.inputThird}
						disabled={data?.acceptsAllLength || false}
						placeholder="Maximum (minutes)"
						value={data?.maximumRuntime}
						onChangeText={(maximumRuntime) => {
							onNewData({
								maximumRuntime
							})
						}}
					/>

					<Checkbox
						label="All Lengths Accepted"
						checked={data?.acceptsAllLength}
						cardStyle={style.validMargin}
						onChange={(acceptsAllLength) => {
							onNewData({
								acceptsAllLength
							});
						}}
					/>
				</View>

				<Title text="Listing URL" whatIsThis required />
				<View style={style.inputRow}>
					<Text style={style.urlText}>{HOST_NAME}/</Text>
					<Input
						onChangeText={(listingUrl) => {
							onNewData({
								listingUrl
							});
						}}
						value={data?.listingUrl}
						style={style.inputThird}
					/>
				</View>

				<Title text="Tracking Sequence" whatIsThis />
				<View style={style.inputRow}>
					<Input
						value={data?.trackingPrefix}
						onChangeText={(trackingPrefix) => {
							onNewData({
								trackingPrefix
							});
						}}
						placeholder="Prefix"
						style={style.inputThird}
					/>
					<Input
						value={data?.startingNumber}
						onChangeText={(startingNumber) => {
							onNewData({
								startingNumber
							});
						}}
						placeholder="Starting Number"
						style={style.inputThird}
					/>
					<Text style={style.urlText}>{data.trackingPrefix}{data.startingNumber}</Text>					
				</View>				
				<Button
					textStyle={style.buttonTxt}
					style={style.button}
					text="Save Listing Details"
					onPress={this.handleContinue}
				/>
			</View>
		);
	}
}