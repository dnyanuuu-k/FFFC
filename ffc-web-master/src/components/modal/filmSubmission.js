import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

// Custom Components
import Loading from "components/overlay/loading";
import Preloader from "components/preloader/basic";
import Checkbox from "../checkbox";
import ModalBase from "./base";
import ModalHeader from "../header/modal";
import FilmCard from "../film/card";
import Button from "../button";

// Constants
import colors from "../../themes/colors";
import {
	WINDOW_HEIGHT,
	WINDOW_WIDTH,
	HEADER_HEIGHT,
	THUMB_IMAGE_AR,
	ERROR_TEXT,
} from "utils/constants";

// Helper functions
import Backend from "backend";

// Third Party Components
import { Scrollbars } from "react-custom-scrollbars";
import FeatherIcon from "feather-icons-react";

const contentHeight = WINDOW_HEIGHT * 0.8;
const contentWidth = WINDOW_WIDTH * 0.7;
const filmContentWidth = contentWidth * 0.35;
const filmCardHeight = contentHeight - (HEADER_HEIGHT + 200);
const imageWidth = 120;
const imageHeight = imageWidth / THUMB_IMAGE_AR;
const mainContentHeight = contentHeight - HEADER_HEIGHT;
const feeContentWidth = contentWidth - filmContentWidth;
const feeScrollHeight = mainContentHeight - HEADER_HEIGHT * 2;

const STANDARD_FEE = 1;
const GOLD_FEE = 2;

class FilmSubmission extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isBusy: false,

			loadingFilms: false,
			filmError: false,

			loadingCategories: false,
			categoryError: false,

			visible: false,
			festivalName: "",
			currentFilm: false,
			films: [],
			festivalCategoryFees: [],
			selectedFee: new Map(),
		};
		this.callback = null;
	}

	show = (festivalId, festivalName, cb) => {
		this.setState(
			{
				visible: true,
				festivalId,
				festivalName,
				selectedFee: new Map()
			},
			this.loadFilms
		);
		this.callback = cb;
	};

	loadFilms = async () => {
		try {
			this.setState({
				films: [],
				filmLoading: true,
			});
			const response = await Backend.Film.getFilms({
				isPublished: true,
				isActive: true,
				categoryError: false,
			});
			if (response.success) {
				if (response.data.length === 0) {
					if (this.props?.onNoFilms) {
						this.props.onNoFilms();
					}
					this.closeModal();
					return;
				}
				const currentFilm = this.state.currentFilm;
				this.setState(
					{
						films: response.data,
					},
					() => {
						if (!currentFilm) {
							this.selectFilm(response.data[0]);
						}
					}
				);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			this.setState(
				{
					filmError: true,
				},
				() => {
					this.baseModal.error(err.message);
				}
			);
		} finally {
			this.setState({
				filmLoading: false,
			});
		}
	};

	selectFilm = async (currentFilm) => {
		this.setState(
			{
				currentFilm,
			},
			this.loadCategories
		);
	};

	selectFee = (feeCategoryId, feeType) => {
		const { selectedFee } = this.state;
		const currentSelected = selectedFee.get(feeCategoryId);
		if (feeType === currentSelected) {
			selectedFee.set(feeCategoryId, false);
		} else {
			selectedFee.set(feeCategoryId, feeType);
		}
		this.setState({
			selectedFee,
		});
	};

	loadCategories = async () => {
		try {
			this.setState({
				festivalCategoryFees: [],
				loadingCategories: true,
				categoryError: false,
			});
			const { currentFilm, festivalId } = this.state;
			const response = await Backend.Festival.submissionCategories({
				filmId: currentFilm.id,
				festivalId,
			});
			if (response.success) {
				this.setState({
					festivalCategoryFees: response.data,
				});
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			this.setState(
				{
					categoryError: true,
				},
				() => {
					this.baseModal.error(err.message);
				}
			);
		} finally {
			this.setState({
				loadingCategories: false,
			});
		}
	};

	addToCart = async (checkout = true) => {
		try {
			this.setState({
				isBusy: true
			});
			const { currentFilm, selectedFee } = this.state;
			const festivalCategoryFeeIds = Array.from(selectedFee.keys());
			if(festivalCategoryFeeIds.length === 0){
				throw new Error("Please select atleast one category");
			}
			const response = await Backend.Cart.addFilmToCartMulti({
				filmId: currentFilm.id,
				festivalCategoryFeeIds
			});
			if (response.success) {
				if(this.callback){
					this.callback(checkout);
				}
				this.closeModal();
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			this.baseModal.error(err.message);
		} finally {
			this.setState({
				isBusy: false,
			});
		}
	};

	closeModal = () => {
		this.setState({
			visible: false,
			currentFilm: false,
			films: [],
			festivalCategoryFees: [],
		});
		this.callback = null;
	};

	renderFee = (category, index) => {
		const feeType = this.state.selectedFee.get(category.id);
		const standardFeeSelected = feeType === STANDARD_FEE;
		const goldFeeSelected = feeType === GOLD_FEE;
		return (
			<View style={style.feeCard} key={category.id}>
				<Text style={style.categoryName}>{category.name}</Text>

				<View>
					<FeeCard
						onChange={() => this.selectFee(category.id, STANDARD_FEE)}
						amount={category.standardFee}
						category={category}
						name="Standard Fee"
						isGold={false}
						checked={standardFeeSelected}
					/>
					<FeeCard
						onChange={() => this.selectFee(category.id, GOLD_FEE)}
						amount={category.goldFee}
						category={category}
						name="Gold Fee"
						isGold
						checked={goldFeeSelected}
					/>					
				</View>
			</View>
		);
	};

	renderFilm = ({ title, id }) => {
		const selected = id === this.state.currentFilm?.id;
		const borderColor = selected ? colors.primaryBlue : colors.borderColor;
		const backgroundColor = selected ? colors.primaryLight : colors.wht;
		const color = selected ? colors.primaryBlue : colors.textBlack;
		return (
			<View style={[style.filmRow, { borderColor, backgroundColor }]}>
				<Text style={[style.filmTitle, { color }]}>{title}</Text>
				{selected ? (
					<FeatherIcon
						color={colors.primaryBlue}
						icon="check"
						size={25}
					/>
				) : null}
			</View>
		);
	};

	render() {
		const {
			visible,
			festivalName,
			currentFilm,
			festivalCategoryFees,
			films,
			filmError,
			filmLoading,
			categoryError,
			loadingCategories,
			isBusy
		} = this.state;
		return (
			<ModalBase
				ref={(ref) => (this.baseModal = ref)}
				onClose={this.closeModal}
				visible={visible}
				height={contentHeight}
				width={contentWidth}
			>
				<ModalHeader title={festivalName} />
				<View style={style.row}>
					<View style={style.filmContent}>
						<Preloader
							isBusy={filmLoading}
							onRetry={this.loadFilms}
							hasError={filmError}
							isEmpty={false}
						/>
						<FilmCard
							data={currentFilm}
							width={filmContentWidth}
							height={filmCardHeight}
							imageWidth={imageWidth}
							imageHeight={imageHeight}
						/>
						<Scrollbars autoHide style={style.filmScroll}>
							{films.map(this.renderFilm)}
						</Scrollbars>
					</View>
					<View style={style.feeContent}>
						<View style={style.feeHeader}>
							<Text style={style.feeHeaderText}>Category</Text>
							<Text style={style.feeHeaderText}>Fee</Text>
						</View>
						<Preloader
							isBusy={loadingCategories}
							onRetry={this.loadCategories}
							hasError={categoryError}
							isEmpty={false}
						/>
						<Scrollbars autoHide style={style.scrollContent}>
							{festivalCategoryFees.map(this.renderFee)}
						</Scrollbars>
						<View style={style.feeFooter}>
							<Button
								text="Add to cart"
								icon="shopping-cart"
								iconSize={18}
								type={Button.OUTLINE_ICON_PRIMARY}
								style={style.tabButton}
								textStyle={style.buttonText}
							/>
							<Button
								text="Checkout"
								icon="zap"
								iconSize={18}
								type={Button.ICON_PRIMARY}
								style={style.tabButton}
								textStyle={style.buttonText}
								onPress={() => {
									this.addToCart(true);
								}}
							/>
						</View>
					</View>
				</View>

				<Loading busy={isBusy} />
			</ModalBase>
		);
	}
}

const FeeCard = ({ category, amount, isGold, checked, name, onChange }) => {
	let disabled = false;
	// eslint-disable-next-line eqeqeq
	if(amount == 0 || !category.enabled || (category.isGoldMember && !isGold)){
		disabled = true;
	}
	return (
		<View style={[style.feeRow, { opacity: disabled ? 0.4 : 1}]} pointerEvents={disabled ? 'none' : 'default'}>
			<Text style={style.feeType}>{name}</Text>
			<Text style={style.feeColon}>:</Text>
			<Text style={style.feeAmount}>
				{category.currency.symbol}
				{amount}
			</Text>

			<Checkbox
				onChange={onChange}
				checked={checked}
				cardStyle={style.checkBox}
				width={30}
			/>
		</View>
	);
};

const style = StyleSheet.create({
	row: {
		flexDirection: "row",
	},
	filmContent: {
		borderRightWidth: 1,
		borderColor: colors.borderColor,
		height: mainContentHeight,
		width: filmContentWidth,
	},
	feeContent: {
		width: feeContentWidth,
		height: mainContentHeight,
	},
	feeHeader: {
		paddingLeft: 10,
		paddingRight: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderColor: colors.borderColor,
		height: HEADER_HEIGHT,
		alignItems: "center",
	},
	feeHeaderText: {
		fontSize: 16,
		color: colors.textBlack,
		fontWeight: "600",
	},
	scrollContent: {
		height: feeScrollHeight,
		width: feeContentWidth,
	},
	feeCard: {
		height: 75,
		width: feeContentWidth,
		padding: 10,
		borderBottomWidth: 1,
		borderColor: colors.borderColor,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	categoryName: {
		fontSize: 15,
		color: colors.textBlack,
		fontWeight: "500",
		flex: 1,
	},
	feeRow: {
		flexDirection: "row",
		marginBottom: 15,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	feeType: {
		width: 130,
		fontSize: 15,
		color: colors.textBlack,
		fontWeight: "500",
	},
	feeColon: {
		fontSize: 15,
		color: colors.textBlack,
		fontWeight: "500",
		marginRight: 5,
	},
	feeAmount: {
		fontSize: 15,
		width: 60,
		textAlign: "right",
		color: colors.textBlack,
		fontWeight: "bold",
	},
	checkBox: {
		paddingHorizontal: 0,
		marginLeft: 20,
	},
	feeFooter: {
		paddingRight: 10,
		flexDirection: "row",
		justifyContent: "flex-end",
		borderTopWidth: 1,
		borderColor: colors.borderColor,
		height: HEADER_HEIGHT,
		alignItems: "center",
	},
	tabButton: {
		height: 35,
		width: 150,
		marginLeft: 20,
	},
	buttonText: {
		fontSize: 16,
	},
	filmRow: {
		height: 50,
		width: filmContentWidth,
		borderBottomWidth: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		alignItems: "center",
	},
	filmTitle: {
		color: colors.primaryBlue,
		fontSize: 16,
		fontWeight: "600",
	},
	filmScroll: {
		width: filmContentWidth,
		height: 200,
	},
});

export default FilmSubmission;