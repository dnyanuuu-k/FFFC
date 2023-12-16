import React, { Component } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

//Custom Components
import FestivalDeatils from "./festivalDetails";
import ContactVenue from "./contactVenue";
import DateDeadline from "./dateDeadline";
import CategoryDetails from "./categoryDetails";
import ListingSettings from "./listingSettings";

import Header from "components/header/header1";
import Page from "components/page";
import Loading from "components/modal/loading";

//Third Party Components
import FeatherIcon from "feather-icons-react";

//Utils
import withRouter from "utils/withRouter";
import toast from "react-hot-toast";
import Backend from "backend";

//Constants
import { ERROR_TEXT } from "utils/constants";

//Modals
import OrganizerModal from "modals/organizer";
import VenueModal from "modals/venue";
import DeadlineModal from "modals/deadline";
import CategoryModal from "modals/category";
//Styles
import colors from "themes/colors";
import style from "./style";
import tabList from "./tabs";

class CreateFestival extends Component {
	static FESTIVAL_DETAILS = 1;
	static CONTACT_DETAILS = 2;
	static DATES_DETAILS = 3;
	static CATEGORY_DETAILS = 4;
	static LISTING_DETAILS = 5;
	constructor(props) {
		super(props);
		this.state = {
			isBusy: false,
			currentTab: CreateFestival.FESTIVAL_DETAILS,
			tabs: tabList,
			formData: {},
			visibleBackToTop: false,
		};
	}

	componentDidMount() {
		const festivalId = 1;
		this.initData(festivalId);
	}

	initData = async (festivalId) => {
		try {
			this.setState({ isBusy: false });
			const response = await Backend.Festival.festivalData(festivalId);
			if (response.success) {
				this.setFormData(response.data);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			//TODO: Handle Error Modal
			toast.error(err.message);
		} finally {
			this.setState({ isBusy: false });
		}
	};

	setFormData = (festival) => {
		const festivalDate = festival.festivalDate || {};
		const festivalOrganizers =
			OrganizerModal.createAllOrganizerTableStructure(
				festival.festivalOrganizers
			);
		const festivalVenues = VenueModal.createAllVenueTableStructure(
			festival.festivalVenues
		);
		const festivalDateDeadlines =
			DeadlineModal.createAllDeadlineTableStructure(
				festivalDate?.festivalDateDeadlines
			);
		const festivalCategories =
			CategoryModal.createAllCategoryTableStructure(
				festival?.festivalCategories
			);
		const formData = {
			...festival,
			...festivalDate,
			festivalDateDeadlines,
			festivalVenues,
			festivalOrganizers,
			festivalCategories,
		};
		this.setState({ formData });
	};

	handleScroll = ({
		nativeEvent: {
			contentOffset: { y },
		},
	}) => {
		const vbtt = this.state.visibleBackToTop;
		const visibleBackToTop = y > 100;
		if (visibleBackToTop !== vbtt) {
			this.setState({
				visibleBackToTop,
			});
		}
	};

	scrollToTop = () => {
		const top = this.state.visibleBackToTop;
		if (top) {
			this.scrollView.scrollTo({ y: 0, animated: true });
		} else {
			this.scrollView.scrollToEnd({ animated: true });
		}
	};

	handleChangeTab = (currentTab) => {
		this.setState({ currentTab });
	};

	newData = (newData) => {
		this.setState({
			formData: {
				...this.state.formData,
				...newData,
			},
		});
	};

	nextSection = () => {
		let currentTab = this.state.currentTab;
		currentTab = currentTab === tabList.length - 1 ? 0 : currentTab + 1;
		this.setState({ currentTab });
	};

	onBusy = (isBusy) => {
		this.setState({ isBusy });
	};

	renderForm = () => {
		const { currentTab, formData } = this.state;
		const props = {
			data: formData,
			onNewData: this.newData,
			nextSection: this.nextSection,
			onBusy: this.onBusy,
		};
		switch (currentTab) {
			case CreateFestival.FESTIVAL_DETAILS:
				return <FestivalDeatils {...props} />;
			case CreateFestival.CONTACT_DETAILS:
				return <ContactVenue {...props} />;
			case CreateFestival.DATES_DETAILS:
				return <DateDeadline {...props} />;
			case CreateFestival.CATEGORY_DETAILS:
				return <CategoryDetails {...props} />;
			case CreateFestival.LISTING_DETAILS:
				return <ListingSettings {...props} />;
			default:
				return null;
		}
	};

	renderTab = ({ completed, title, sr }) => {
		const selected = sr === this.state.currentTab;
		const backgroundColor = selected
			? colors.primaryLight
			: completed
			? colors.greenLight
			: colors.popupBg;
		const borderColor = selected
			? colors.primaryBlue
			: completed
			? colors.green
			: colors.borderColor;
		const color = selected
			? colors.primaryBlue
			: completed
			? colors.greenDark
			: colors.holderColor;
		const color2 = selected ? colors.buttonTxt : colors.holderColor;
		return (
			<TouchableOpacity
				key={sr}
				style={style.tabCard}
				onPress={() => this.handleChangeTab(sr)}
			>
				<View style={[style.tabSr, { backgroundColor: borderColor }]}>
					{completed ? (
						<FeatherIcon
							icon="check"
							color={colors.buttonTxt}
							size={22}
						/>
					) : (
						<Text style={[style.tabSRText, { color: color2 }]}>
							{sr}
						</Text>
					)}
				</View>
				<View
					style={[style.tabButton, { backgroundColor, borderColor }]}
				>
					<Text numberOfLines={1} style={[style.tabText, { color }]}>
						{title}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	render() {
		const { tabs, isBusy, visibleBackToTop } = this.state;
		return (
			<>
				<Page headerComponent={<Header />} contentStyle={style.row}>
					<View style={style.sectionHolder}>
						<Text style={style.title}>Create New Festival</Text>
						<Text style={style.subTitle}>
							In just five simple steps get you festival listed
							for free
						</Text>
						{tabs.map(this.renderTab)}
						<View style={style.footerButton}>
							<Text style={style.footerButtonText}>
								Request Festival Listing
							</Text>
						</View>
					</View>
					<View style={style.contentHolder}>
						<ScrollView
							onScroll={this.handleScroll}
							ref={(ref) => (this.scrollView = ref)}
							showsVerticalScrollIndicator={false}
							scrollEventThrottle={16}
						>
							<View style={style.formHolder}>
								{this.renderForm()}
							</View>
						</ScrollView>
					</View>
					<TouchableOpacity
						onPress={this.scrollToTop}
						style={style.backTopCover}
					>
						<FeatherIcon
							color={colors.holderColor}
							icon={
								visibleBackToTop
									? "arrow-up-circle"
									: "arrow-down-circle"
							}
							size={25}
						/>
						<Text style={style.backTopText}>
							Back to {visibleBackToTop ? "Top" : "Bottom"}
						</Text>
					</TouchableOpacity>
				</Page>
				<Loading busy={isBusy} />
			</>
		);
	}
}

export default withRouter(CreateFestival);