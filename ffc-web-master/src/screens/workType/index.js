import React, { Component } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from "react-native";

//Custom Components
import Header from "components/header/header2";
import Footer from "components/footer/footer1";
import Button from "components/button";

//Utils
import withRouter from "utils/withRouter";
import Backend from "backend";
import { ERROR_TEXT } from "utils/constants";
import toast from "react-hot-toast";
//Styles
import style from "./style";
import colors from "themes/colors";

class WorkType extends Component {
	constructor(props) {
		super(props);
		this.state = {
			busy: false,
			updating: false,
			selectedId: 0,
			workTypes: [],
		};
	}

	componentDidMount(){
		this.loadWorkTypes();
	}

	loadWorkTypes = async () => {
		try {
			this.setState({ busy: true });
			const response = await Backend.Account.getWorkTypes();
			if (response?.success) {
				this.setState({ workTypes: response.data, selectedId: response.data?.[0]?.id });
				// this.props.navigation.navigate("/home");
			} else if (response?.success === false) {
				throw new Error(response.message);
			} else {
				throw new Error(ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			this.setState({ busy: false });
		}
	}

	updateWorkType = async () => {
		try {
			this.setState({ updating: true });
			const response = await Backend.Account.updateWorkType(this.state.selectedId);
			if (response?.success) {
				toast.success("Work Preference Updated!");
				this.props.navigation.navigate("/home");
			} else if (response?.success === false) {
				throw new Error(response.message);
			} else {
				throw new Error(ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			this.setState({ updating: false });
		}
	}

	renderWorkType = (data) => {
		const selected = data.id === this.state.selectedId;
		const borderWidth = selected ? 2 : 1;
		const borderColor = selected ? colors.primaryBlue : colors.borderColor;
		const backgroundColor = selected ? colors.primaryLight : colors.popupBg;
		const tintColor = selected ? colors.primaryBlue : colors.textBlack;
		const cardStyle = { borderWidth, borderColor, backgroundColor };
		return (
			<TouchableOpacity style={{ outline: "none" }} disabled={data.status === 0} key={data.id} onPress={() => this.setState({ selectedId: data.id })}>
				<View style={[style.card, cardStyle]}>
					<Image
						resizeMode="contain"
						style={[style.imageStyle, { tintColor, opacity: data.status ? 1 : 0.5 }]}
						source={{ uri: data.image }}
					/>
				</View>
				<Text numberOfLines={1} style={style.typeText}>
					{data.title}
				</Text>
			</TouchableOpacity>
		);
	};

	render() {
		const { workTypes, updating, busy } = this.state;
		return (
			<View style={style.main}>
				<Header />
				<View style={style.content}>
					{busy ? <ActivityIndicator color={colors.primaryBlue} size={26} /> : <View style={style.mainContent}>
						<Text style={style.title}>Select Work Preference</Text>
						<Text style={style.subTitle}>
							It will allow us to show you personalised content.
						</Text>
						<View style={style.typeCover}>
							{workTypes.map(this.renderWorkType)}
						</View>
						<Button
							busy={updating}
							text="SUBMIT"
							style={style.btnStyle}
							onPress={this.updateWorkType}
						/>
					</View>}
				</View>
				<Footer style={style.footer} />
			</View>
		);
	}
}

export default withRouter(WorkType);