import React, { Component } from "react";
import { View } from "react-native";

//Custom Components
import DateInput from "components/input/dateInput";
import OptionInput from "components/input/optionInput";
import Button from "components/button/";
import Input from "components/input";
import CountryInput from "components/input/countryInput";
import Title from "./title";
import Header from "./header";
import SectionText from "./sectionText";

//Third Party Components
import toast from "react-hot-toast";

//Constants
import { festivalDetailStyles as style } from "./style";
import { ERROR_TEXT, GENDER_OPTIONS } from "utils/constants";

//Helper functions
import Backend from "backend";

export default class SubmitterInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		const { data } = this.props;
		if (data?.submitterGender) {
			const selectedGender = GENDER_OPTIONS.find(
				(gender) => gender.value === data?.submitterGender
			);
			this.setState({
				selectedGender,
			});
		}
	}

	handleSave = async () => {
		const { data, onNewData, onBusy } = this.props;
		const { selectedGender } = this.state;
		try {
			onBusy(true);
			const payload = {
				...data,
				submitterGender: selectedGender?.value,
			};
			const response = await Backend.Film.updateSubmitterDetails(payload);
			if (response.success) {
				onNewData(response.data);
				toast.success("Submitter Details Saved Successfully!");
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
		const { selectedGender } = this.state;
		return (
			<View style={style.main}>
				<Header
					title="Submitter Information"
					subTitle="This information is saved and loaded from your profile"
				/>

				<Title text="Email" required />
				<Input
					value={data?.submitterEmail}
					onChangeText={(submitterEmail) =>
						onNewData({ submitterEmail })
					}
					style={style.input}
				/>

				<Title text="Phone" />
				<Input
					style={style.input}
					value={data?.submitterPhone}
					onChangeText={(submitterPhone) =>
						onNewData({ submitterPhone })
					}
				/>

				<Title text="Address" />
				<Input
					style={style.input}
					value={data?.submitterAddress}
					onChangeText={(submitterAddress) =>
						onNewData({ submitterAddress })
					}
				/>

				<View style={style.inputRow}>
					<View style={{ marginRight: 20 }}>
						<Title text="City" />
						<Input
							style={style.inputHalf}
							value={data?.submitterCity}
							onChangeText={(submitterCity) =>
								onNewData({ submitterCity })
							}
						/>
					</View>
					<View style={{ marginRight: 20 }}>
						<Title text="State / Province" />
						<Input
							style={style.inputHalf}
							value={data?.submitterState}
							onChangeText={(submitterState) =>
								onNewData({ submitterState })
							}
						/>
					</View>
				</View>

				<View style={style.inputRow}>
					<View style={{ marginRight: 20 }}>
						<Title text="Postal Code" />
						<Input
							style={style.inputHalf}
							value={data?.submitterPostalCode}
							onChangeText={(submitterPostalCode) =>
								onNewData({ submitterPostalCode })
							}
						/>
					</View>
					<View style={{ marginRight: 20 }}>
						<Title text="Country" required />
						<CountryInput
							style={style.inputHalf}
							value={data?.submitterCountry}
							onSelect={(submitterCountry) =>
								onNewData({ submitterCountry })
							}
						/>
					</View>
				</View>

				<SectionText
					text="Personal Info"
					subText="We keep your personal information safe and secure"
				/>
				<Title text="Birthdate" />
				<DateInput
					style={style.inputHalf}
					value={data?.submitterDob}
					textStyle={style.validFont}
					onSelect={(submitterDob) =>
						onNewData({
							submitterDob,
						})
					}
				/>
				<Title text="Gender" />
				<OptionInput
					style={style.optionInput}
					textStyle={style.validFont}
					onSelect={(selectedGender) => {
						this.setState({ selectedGender });
					}}
					selectedOption={selectedGender}
					options={GENDER_OPTIONS}
				/>
				<Button
					onPress={this.handleSave}
					textStyle={style.buttonTxt}
					style={style.button}
					text="Save & Continue"
				/>
			</View>
		);
	}
}