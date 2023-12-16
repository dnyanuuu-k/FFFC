import React, { Component } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import style from "./style";
import Header from "components/header/header3";
import Image from "components/image";
import Button from "components/button";
import LinearGradient from "react-native-web-linear-gradient";
import colors from "themes/colors";
import tabs from "./tabs";
import Section from "./section";
import Timeline from "./timeline";
import CategoryFee from "./categoryFee";
import PhotoRow from "./photoRow";
import Photos from "./photos";
import dummyData from "./dummy";
import Organizers from "./organizers";
import Contact from "./contact";
import Venue from "./venue";
import Reviews from "./reviews";
import LoadingModal from "components/modal/loading";
import FilmSubmission from "components/modal/filmSubmission";
import PhotoViewer from "components/photoViewer";
import StickyUploader from "components/uploader/sticky";
import withRouter from "utils/withRouter";
import { UploaderInstance } from "utils/simpleUploader";

const FESTIVAL_TAB = 1;
const PHOTO_TAB = 2;
const CONTACT_TAB = 3;
const REVIEW_TAB = 4;

class FestivalView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			coverImage: "festivalimages/1-cover.jpeg?t=1686581583",
			logoImage: "festivalimages/1-logo.png?t=1686581590",
			coverHash: "U62t#.MIrnaJcIoga$bcMdx^R.kXt:V@kBof",
			logoHash: "U46l_%tn8wtU.Aj]RPaz00V@%#R*9Hafx]fl",
			name: "Mumba Short Film Festival",
			currentDeadline: "July 13, 2023 Extended Deadline",
			selectedTab: REVIEW_TAB,
			id: 1,
			isBusy: false,
			...dummyData,
		};
	}

	updateBusy = (isBusy) => {
		this.setState({
			isBusy,
		});
	};

	handleChangeTab = (selectedTab) => {
		this.setState({ selectedTab });
	};

	startFilmSubmission = () => {
		const { id, name } = this.state;
		this.filmSubmission.show(id, name, () => {
			this.props.navigation.navigate("/cart");
		});
	};

	renderTabs = ({ sr, title }) => {
		const selected = this.state.selectedTab === sr;
		const color = selected ? colors.primaryBlue : colors.textBlack;
		const fontWeight = selected ? "bold" : "600";
		return (
			<TouchableOpacity
				onPress={() => this.handleChangeTab(sr)}
				style={style.tab}
				key={sr}
			>
				<Text style={[style.tabText, { color, fontWeight }]}>
					{title}
				</Text>
				{selected ? <View style={style.tabSelected} /> : null}
			</TouchableOpacity>
		);
	};

	showPhotosOnViewer = (photos, photoIndex = 0, photoTypeTitle) => {
		this.currentPhotoViewer.showPhotos(photos, photoIndex, {
			title: this.state.name,
			subTitle: photoTypeTitle,
		});
	};

	renderSection = () => {
		const {
			festivalOrganizers,
			selectedTab,
			festivalContact,
			festivalVenues,
			photoData,
			about,
			awards,
			terms,
			name,
			id,
		} = this.state;
		if (selectedTab === FESTIVAL_TAB) {
			return (
				<>
					<Section title="About">
						<PhotoRow data={photoData} />
						<Text style={style.contentText}>{about}</Text>
					</Section>
					<Section title="Awards & Prizes">
						<Text style={style.contentText}>{awards}</Text>
					</Section>
					<Section title="Rules & Terms">
						<Text style={style.contentText}>{terms}</Text>
					</Section>
					{festivalOrganizers?.length ? (
						<Section title="Organizers">
							<Organizers list={festivalOrganizers} />
						</Section>
					) : null}
				</>
			);
		} else if (selectedTab === CONTACT_TAB) {
			return (
				<>
					<Section title="Contact" showOverflow={false}>
						<Contact data={festivalContact} />
					</Section>
					<Section title="Venues" showOverflow={false}>
						<Venue list={festivalVenues} />
					</Section>
				</>
			);
		} else if (selectedTab === PHOTO_TAB) {
			return (
				<Photos
					festivalId={id}
					onPhotoViewerRequest={this.showPhotosOnViewer}
					onBusy={this.updateBusy}
				/>
			);
		} else if (selectedTab === REVIEW_TAB) {
			return (
				<Reviews
					onBusy={this.updateBusy}
					festivalName={name}
					festivalId={id}
				/>
			);
		}
	};

	render() {
		const {
			festivalTimeline,
			currentDeadline,
			festivalFees,
			coverImage,
			logoImage,
			logoHash,
			coverHash,
			name,
			isBusy,
		} = this.state;
		return (
			<>
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={style.main}
				>
					<View style={style.headerBody}>
						<Image
							style={style.headerBody}
							hash={coverHash}
							url={coverImage}
						/>
						<LinearGradient
							colors={[
								colors.transparent,
								colors.transparent,
								colors.blk,
							]}
							style={style.headerContent}
						></LinearGradient>
					</View>
					<View style={style.profileContent}>
						<Image
							style={style.profileImage}
							hash={logoHash}
							url={logoImage}
						/>
						<Text style={style.name}>{name}</Text>
						<View style={style.tabContent}>
							{tabs.map(this.renderTabs)}
						</View>

						<View style={style.endOptions}>
							<Button
								text="Message"
								icon="message-circle"
								iconSize={20}
								type={Button.OUTLINE_ICON_PRIMARY}
								style={style.tabButton}
							/>
							<Button
								text="Submit Film"
								type={Button.SUCCESS}
								style={style.tabButton}
								onPress={this.startFilmSubmission}
							/>
						</View>
					</View>
					<View style={style.content}>
						<View
							style={[
								style.contentSmall,
								{
									top: "5rem",
									alignSelf: "start",
									position: "sticky",
								},
							]}
							ref={(ref) => (this.sideBar = ref)}
						>
							<Section
								showOverflow={false}
								title="Dates & Deadlines"
							>
								<Timeline events={festivalTimeline} />
							</Section>
							<Section
								showOverflow={false}
								title="Category & Fees"
							>
								<CategoryFee data={festivalFees} />
							</Section>
						</View>
						<View
							style={style.contentLarge}
							ref={(ref) => (this.content = ref)}
						>
							{this.renderSection()}
						</View>
					</View>
				</ScrollView>
				<StickyUploader
					ref={(ref) => (this.stickyUploader = ref)}
					onLoad={() => {
						UploaderInstance.setCurrentUploader(
							this.stickyUploader
						);
					}}
				/>
				<Header title={name} subTitle={currentDeadline} />
				<LoadingModal busy={isBusy} />
				<PhotoViewer ref={(ref) => (this.currentPhotoViewer = ref)} />
				<FilmSubmission ref={(ref) => (this.filmSubmission = ref)} />
			</>
		);
	}
}

export default withRouter(FestivalView);