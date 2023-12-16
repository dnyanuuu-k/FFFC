import React, { Component } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
} from "react-native";
import colors from "themes/colors";
import Rating from "components/rating";
import Image from "components/image";
import Button from "components/button";
import FeatherIcon from "feather-icons-react";
import Preloader from "components/preloader/basic";
import Paginator, { defaultElementCount } from "components/paginator";
import { ERROR_TEXT } from "utils/constants";
import Section from "./section";
import Backend from "backend";
import AddReviewModal from "./addReviewModal";
import AddReplyModal from "./addReplyModal";
import toast from "react-hot-toast";
import ContextMenu from "components/menu/contextMenu";
import SureModal from "components/modal/sureModal";

const emptyText =
	"All Reviews of festival appear here,\nbecome first to add review";

export default class Reviews extends Component {
	constructor(props) {
		super(props);
		this.state = {
			festivalReviews: [],
			festivalCategoryRatings: [],
			overallRating: 0,
			totalReviews: 0,
			currentPage: 1,
			hasError: false,
			refreshList: false,
			isBusy: false,
		};
	}

	componentDidMount() {
		this.loadReviews(this.state.currentPage);
	}

	setRatings = (ratings) => {
		const totalReviews = ratings[0].count;
		const overallRating = Number(ratings[0].rating).toFixed(1);
		this.setState({
			totalReviews,
			overallRating,
			festivalCategoryRatings: ratings,
		})
	}

	loadReviews = async (currentPage) => {
		const { festivalId } = this.props;
		try {
			this.setState({
				isBusy: true,
				hasError: false,
				festivalCategoryRatings: [],
				festivalReviews: [],
			});
			const offset = (currentPage - 1) * defaultElementCount;
			let response = await Backend.Reviews.festivalReviews({
				offset,
				festivalId,
				limit: defaultElementCount,
			});
			if (response?.success) {
				const { festivalReviews, festivalCategoryRatings } =
					response.data;
				if (offset > 0) {
					this.setState({
						festivalReviews,
						currentPage,
					});
				} else {
					this.setState({
						festivalReviews,						
						currentPage,
					}, () => {
						this.setRatings(festivalCategoryRatings);
					});
				}
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			this.setState({
				hasError: true,
			});
		} finally {
			this.setState({ isBusy: false });
		}
	};

	addNewReview = () => {
		this.addReviewModal.show(null, this.props.festivalId, (review) => {
			this.addReviewToFestival(review);
		});
	};

	addNewReply = (data) => {
		this.addReplyModal.show(data, (reply) => {
			this.addReplyToReview(reply);
		});
	};

	addReviewToFestival = async (review) => {
		const { onBusy, festivalId } = this.props;
		const { festivalReviews, refreshList } = this.state;
		try {
			onBusy(true);
			review.festivalId = festivalId;
			const response = await Backend.Reviews.createFestivalReview(review);
			if (response.success) {
				const { festivalReview, ratings } = response.data;
				const index = festivalReviews.findIndex(
					(fr) => fr.id === festivalReview.id
				);
				if (index !== -1) {
					festivalReviews[index] = {
						...festivalReviews[index],
						...festivalReview,
					};
				} else {
					festivalReviews.unshift(festivalReview);
				}
				this.setState({
					festivalReviews,
					refreshList: !refreshList,
				}, () => {
					this.setRatings(ratings);
				});
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			onBusy(false);
		}
	};

	addReplyToReview = async (replyData) => {
		const { onBusy } = this.props;
		const { festivalReviews } = this.state;
		try {
			onBusy(true);
			const { festivalReviewId, festivalOrganizerReply } = replyData;
			const response = await Backend.Reviews.updateFestivalReviewReply({
				festivalOrganizerReply,
				festivalReviewId,
			});
			if (response.success) {
				const index = festivalReviews.findIndex(
					(fr) => fr.id === festivalReviewId
				);
				if (index !== -1) {
					festivalReviews[index].festivalOrganizerReply =
						festivalOrganizerReply;
				}
				this.setState({ festivalReviews });
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			onBusy(false);
		}
	};

	deleteReview = async (festivalReviewId, index) => {
		const { onBusy } = this.props;
		try {
			onBusy(true);
			const { festivalReviews } = this.state;
			const response = await Backend.Reviews.deleteFestivalReview(
				festivalReviewId
			);
			if (response?.success) {
				festivalReviews.splice(index, 1);
				this.setState(
					{
						festivalReviews,
					},
					() => {
						this.setRatings(response.data.ratings)
						toast.success("Review deleted successfully!");
					}
				);
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			onBusy(false);
		}
	};

	handleReviewAction = (event, festivalReviewId, reviewIndex) => {
		const options = [
			{
				icon: "edit",
				label: "Edit",
			},
			{
				icon: "trash",
				label: "Delete",
			},
		];
		const element = ContextMenu.transfromView(event);
		this.contextMenu.show(options, element, (option, index) => {
			if (index === 0) {
				// As only viewer can edit its own review
				// so it can be done with same add function
				this.addNewReview();
			} else if (index) {
				this.sureModal.show(
					`Review will be deleted permanently`,
					(action) => {
						if (action) {
							this.deleteReview(festivalReviewId, reviewIndex);
						}
					}
				);
			}
		});
	};

	renderReview = ({
		item: { user, date, id, ratingPercent, review, festivalOrganizerReply },
		index,
	}) => {
		return (
			<View style={style.reviewCard} key={id}>
				<View style={style.reviewUserRow}>
					<View style={style.reviewProfileRow}>
						<Image
							url={user.avatarUrl}
							hash={user.avatarHash}
							style={style.avatar}
						/>
						<View style={style.gapLeft}>
							<Text style={style.reviewUserName}>
								{user.firstName || "Anonymous"}
							</Text>
							<Text style={style.reviewDate}>{date}</Text>
						</View>
					</View>
					<TouchableOpacity
						onPress={(e) => this.handleReviewAction(e, id, index)}
						style={style.reportIcon}
					>
						<FeatherIcon
							icon="more-vertical"
							size={20}
							color={colors.holderColor}
						/>
					</TouchableOpacity>
				</View>
				<Rating progress={ratingPercent} size={14} />
				<Text style={style.reviewText}>{review}</Text>

				{festivalOrganizerReply ? (
					<>
						<View style={style.replyCover}>
							<View style={style.replyRow}>
								<Text style={style.replyTitle}>
									{this.props.festivalName}
								</Text>
								{/*<Text style={style.replyDate}>
									{reply.date}
								</Text>*/}
							</View>
							<Text style={style.replyText}>
								{festivalOrganizerReply}
							</Text>
						</View>
						<Button
							text="Delete reply"
							iconSize={14}
							icon="trash"
							onPress={() => {
								this.addReplyToReview({
									festivalReviewId: id,
									festivalOrganizerReply: null,
								});
							}}
							textStyle={style.buttonTxt}
							type={Button.OUTLINE_ICON_DANGER}
							style={style.btnStyle2}
						/>
					</>
				) : (
					<Button
						text="Reply"
						iconSize={14}
						icon="corner-up-left"
						textStyle={style.buttonTxt}
						type={Button.OUTLINE_ICON_PRIMARY}
						style={style.btnStyle}
						onPress={() =>
							this.addNewReply({
								festivalReviewId: id,
								review,
							})
						}
					/>
				)}
			</View>
		);
	};

	renderHeaderButtons = () => {
		return (
			<Button
				icon={"thumbs-up"}
				type={Button.OUTLINE_ICON_PRIMARY}
				style={style.sectionTabButton}
				text={"Add Review"}
				onPress={this.addNewReview}
				iconSize={16}
				textStyle={{ fontSize: 14, fontWeight: 400 }}
			/>
		);
	};

	render() {
		const {
			festivalCategoryRatings,
			overallRating,
			festivalReviews,
			totalReviews,
			currentPage,
			refreshList,
			hasError,
			isBusy,
		} = this.state;
		return (
			<>
				<Section
					renderButtons={this.renderHeaderButtons}
					title="Reviews"
					showOverflow={false}
				>
					<Preloader
						isBusy={isBusy}
						emptyIcon={"thumbs-up"}
						emptyText={emptyText}
						emptyButtonText={"Add Review"}
						hasError={hasError}
						onEmptyPress={this.addNewReview}
						isEmpty={festivalReviews.length === 0}
					/>
					{festivalCategoryRatings.length > 0 ? (
						<View style={style.reviewRow}>
							<View style={style.overall}>
								<Text style={style.overallRating}>
									{overallRating}
								</Text>
								<Rating
									progress={
										festivalCategoryRatings[0].ratingPercent
									}
									size={20}
								/>
							</View>
							<View style={style.seprate}>
								{festivalCategoryRatings.map(
									(ratingCategory, index) => (
										<View
											style={style.seprateRow}
											key={index}
										>
											<Text style={style.seprateText}>
												{ratingCategory.categoryName}
											</Text>
											<Rating
												progress={
													ratingCategory.ratingPercent
												}
												size={15}
											/>
										</View>
									)
								)}
							</View>
						</View>
					) : null}
					<FlatList
						extraData={refreshList}
						data={festivalReviews}
						renderItem={this.renderReview}
						keyExtractor={(item) => item.id}
					/>
					<Paginator
						totalElementCount={totalReviews}
						currentPage={currentPage}
						onPageChange={this.loadReviews}
					/>
				</Section>
				<AddReviewModal ref={(ref) => (this.addReviewModal = ref)} />
				<AddReplyModal ref={(ref) => (this.addReplyModal = ref)} />
				<ContextMenu ref={(ref) => (this.contextMenu = ref)} />
				<SureModal ref={(ref) => (this.sureModal = ref)} />
			</>
		);
	}
}

const style = StyleSheet.create({
	sectionTabButton: {
		width: 130,
		height: 26,
		marginBottom: 8,
	},
	reviewCard: {
		marginVertical: 20,
	},
	reportIcon: {
		width: 50,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	avatar: {
		height: 40,
		width: 40,
		borderRadius: 100,
		overflow: "hidden",
		backgroundColor: colors.vectorBaseDip,
	},
	gapLeft: {
		marginLeft: 10,
	},
	reviewUserRow: {
		height: 50,
		marginBottom: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	reviewProfileRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	reviewUserName: {
		fontSize: 14,
		color: colors.textBlack,
		fontWeight: "500",
	},
	reviewDate: {
		fontSize: 12,
		color: colors.holderColor,
		fontWeight: "300",
	},

	reviewText: {
		fontSize: 14,
		marginTop: 10,
		fontWeight: "300",
		color: colors.textBlack,
	},

	replyCover: {
		backgroundColor: colors.vectorBase,
		padding: 10,
		marginTop: 10,
		alignSelf: "flex-end",
		width: "90%",
	},
	replyRow: {
		flexDirection: "row",
		height: 25,
		alignItems: "center",
		justifyContent: "space-between",
	},
	replyTitle: {
		fontSize: 14,
		color: colors.textBlack,
		fontWeight: "500",
	},
	replyDate: {
		fontSize: 13,
		fontWeight: "400",
		color: colors.holderColor,
	},
	replyText: {
		fontSize: 13,
		marginTop: 5,
		fontWeight: "300",
		color: colors.textBlack,
	},

	btnStyle: {
		width: 90,
		height: 30,
		marginTop: 10,
		alignSelf: "flex-end",
	},
	btnStyle2: {
		width: 130,
		height: 30,
		marginTop: 10,
		alignSelf: "flex-end",
	},
	buttonTxt: {
		fontSize: 14,
	},

	reviewRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	overall: {
		width: "30%",
		justifyContent: "center",
	},
	seprate: {
		width: "70%",
		height: 120,
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		flexWrap: "wrap",
	},
	overallRating: {
		fontSize: 67,
		fontWeight: "500",
		colors: colors.textBlack,
	},
	seprateRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "45%",
		alignItems: "center",
	},
	seperateText: {
		fontSize: 18,
		fontWeight: "400",
		colors: colors.holderColor,
	},
});