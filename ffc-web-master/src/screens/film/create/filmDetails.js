import React, { Component } from "react";
import { View } from "react-native";

//Custom Components
import Button from "components/button/";
import Input from "components/input";
import Checkbox from "components/checkbox";
import Title from "components/form/title";
import Header from "./header";

//Third Party Functions
import toast from "react-hot-toast";

//Helper Functions
import Backend from "backend";

//Constants
import { festivalDetailStyles as style } from "./style";
import infoNote, { infoType } from "./info";
import { ERROR_TEXT } from "utils/constants";

export default class FilmDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			festivalTypes: [],
		};
	}

	handleSave = async () => {
		try {
			const { data, onNewData } = this.props;
			this.props.onBusy(true);
			const response = await Backend.Film.updateFilmDetails(
				data
			);
			if (response.success) {
				onNewData(response.data);
				toast.success("Film Details Saved Successfully!");
				this.props?.nextSection();
				return;
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			this.props.onBusy(false);
		}
	};

	render() {
		const { data, onNewData } = this.props;
		return (
			<>
				<View style={style.main}>
					<Header
						title="Film Details"
						subTitle="Basic information about your film"
					/>

					<Title text="Film Title (English)" required />
					<Input
						style={style.input}
						value={data?.title}
						onChangeText={(title) => onNewData({ title })}
					/>

					<Title text="Short Summary (English)" />
					<Input
						value={data?.shortSummary}
						onChangeText={(shortSummary) =>
							onNewData({ shortSummary })
						}
						multiline
						style={style.inputArea}
						placeholder={infoNote[infoType.description]}
					/>

					<Title text="Storyline (English)" />
					<Input
						value={data?.storyline}
						onChangeText={(storyline) =>
							onNewData({ storyline })
						}
						multiline
						style={style.inputArea}
						placeholder={infoNote[infoType.storyline]}
					/>					

					<View style={style.checkboxCover}>
						<Checkbox
							label="My Project also has a non-English Title and Synopsis"
							checked={data?.hasNonEnglishTitle}
							cardStyle={style.checkboxInput}
							textStyle={style.checkboxText}
							onChange={(hasNonEnglishTitle) => {
								onNewData({
									hasNonEnglishTitle,
								});
							}}
						/>
					</View>

					{data?.hasNonEnglishTitle ? (
						<>
							<Title text="Film Title (Orignal)" />
							<Input
								style={style.input}
								value={data?.nativeTitle}
								onChangeText={(nativeTitle) => onNewData({ nativeTitle })}
							/>

							<Title text="Short Summary (Orignal)" />
							<Input
								value={data?.nativeShortSummary}
								onChangeText={(nativeShortSummary) =>
									onNewData({ nativeShortSummary })
								}
								multiline
								style={style.inputArea}
								placeholder={infoNote[infoType.nativeShortSummary]}
							/>

							<Title text="Storyline (English)" />
							<Input
								value={data?.nativeStoryLine}
								onChangeText={(nativeStoryLine) =>
									onNewData({ nativeStoryLine })
								}
								multiline
								style={style.inputArea}
								placeholder={infoNote[infoType.storyline]}
							/>	
						</>
					) : null}

					<View style={style.inputRow}>
						<View style={{ marginRight: 20 }}>
							<Title text="Facebook" />
							<Input
								style={style.inputHalf}
								value={data?.facebook}
								onChangeText={(facebook) =>
									onNewData({ facebook })
								}
							/>
						</View>
						<View style={{ marginRight: 20 }}>
							<Title text="Instagram" />
							<Input
								style={style.inputHalf}
								value={data?.instagram}
								onChangeText={(instagram) =>
									onNewData({ instagram })
								}
							/>
						</View>
					</View>
					<View style={style.inputRow}>
						<View style={{ marginRight: 20 }}>
							<Title text="Twitter" />
							<Input
								style={style.inputHalf}
								value={data?.twitter}
								onChangeText={(twitter) =>
									onNewData({ twitter })
								}
							/>
						</View>
						<View style={{ marginRight: 20 }}>
							<Title text="Linkedin" />
							<Input
								style={style.inputHalf}
								value={data?.linkedin}
								onChangeText={(linkedin) =>
									onNewData({ linkedin })
								}
							/>
						</View>
					</View>
					<Button
						onPress={this.handleSave}
						textStyle={style.buttonTxt}
						style={style.button}
						text="Save & Continue"
					/>
				</View>
			</>
		);
	}
}