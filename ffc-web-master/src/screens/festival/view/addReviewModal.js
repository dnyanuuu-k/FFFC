import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Input from "components/input";
import ReviewInput from "components/input/reviewInput";
import { WINDOW_WIDTH, FORM_FONT_SIZE, ERROR_TEXT } from "utils/constants";
import SheetButtonModal from "components/modal/sheetButtonModal";
import validation from "utils/validation";
import colors from "themes/colors";
import toast from "react-hot-toast";
import Backend from "backend";
import Preloader from "components/preloader/basic";

const modalWidth = WINDOW_WIDTH * 0.45;
const categoryRowWidth = modalWidth - 20;
const categoryWidth = categoryRowWidth / 2.2;
const defaultData = {
	categoryRatings: [],
	overallRating: 0,
	review: "",
	isBusy: true
};
class AddReviewModal extends Component {
	constructor(props) {
		super(props);
		this.state = defaultData;
		this.callback = null;
	}

	show = (previousData = null, festivalId, cb) => {
		let data = {};
		if (previousData) {
			data = previousData;
		} else {
			data = defaultData;
		}
		this.setState({
			festivalId,
			...data
		});
		this.callback = cb;
		this.modal.open();
		setTimeout(() => {
			this.loadReviewData();
		}, 500);
	};

	close = () => {
		this.callback = null;
	};

	handleRatingChange = (rating, index) => {
		const categoryRatings = this.state.categoryRatings;
		categoryRatings[index].rating = rating;
		this.setState({
			categoryRatings
		})
	}

	loadReviewData = async () => {
		try {
			this.setState({ isBusy: true, hasError: false });
			const { id, festivalId } = this.state;
			const response = await Backend.Reviews.reivewSubmissionData(
				{
					festivalReviewId: id,
					festivalId
				}
			);
			if (response.success) {
				const { festivalReviewCategories, reviewData } = response.data;
				this.setState({
					categoryRatings: festivalReviewCategories,
					...reviewData,
				});
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			this.setState({ hasError: true });
		} finally {
			this.setState({
				isBusy: false,
			});
		}
	};

	handleSubmit = () => {
		const { isBusy, overallRating, categoryRatings, hasError, id, review } = this.state;
		if (isBusy || hasError) {
			return;
		}
		if (review?.length > 0 && !validation.validName(review)) {
			this.reviewInput.setError("Review too short");
			return;
		}
		if(overallRating === 0){
			this.reviewInput.setError("Overall rating is required!");
			return;	
		}
		if (this.callback) {
			this.callback({ id, review, overallRating, categoryRatings });
		}
		this.modal.close();
	};

	renderReviewCategory = ({ name, rating, id }, index) => {
		return (
			<View style={style.reviewCategory} key={id}>
				<Text style={style.reivewTitle}>{name}</Text>
				<ReviewInput onChange={(r) => this.handleRatingChange(r, index)} starSize={25} selected={rating} />
			</View>
		);
	};

	render() {
		const {
			id,
			isBusy,
			review,
			hasError,	
			categoryRatings,
			overallRating,
		} = this.state;
		return (
			<SheetButtonModal
				title={`${id ? "Edit" : "Add"} review`}
				onClose={this.close}
				width={modalWidth}
				onSubmit={this.handleSubmit}
				minHeight={320}
				ref={(ref) => (this.modal = ref)}
			>
				<Preloader isBusy={isBusy} hasError={hasError} isEmpty={false}>
					<View style={style.reviewCategoryRow}>
						<View style={style.reviewCategory} key={id}>
							<Text style={style.reivewTitle}>
								Overall Rating
							</Text>
							<ReviewInput
								onChange={(or) =>
									this.setState({
										overallRating: or,
									})
								}
								starSize={25}
								selected={overallRating}
							/>
						</View>
						{categoryRatings.map(
							this.renderReviewCategory
						)}
					</View>
					<Input
						style={style.modalInput}
						multiline
						value={review}
						placeholder="Write about your experience"
						ref={(ref) => (this.reviewInput = ref)}
						onChangeText={(review) => this.setState({ review })}
					/>
				</Preloader>
			</SheetButtonModal>
		);
	}
}

const style = StyleSheet.create({
	modalInput: {
		width: "100%",
		height: 150,
		paddingTop: 10,
		marginTop: 10,
		fontSize: FORM_FONT_SIZE,
	},
	reivewTitle: {
		fontSize: 15,
		color: colors.textBlack,
		fontWeight: "500",
		marginRight: 5,
	},
	reviewCategory: {
		flexDirection: "row",
		alignItems: "center",
		width: categoryWidth,
		justifyContent: "space-between",
		marginVertical: 6,
	},
	reviewCategoryRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		width: categoryRowWidth,
	},
});

export default AddReviewModal;