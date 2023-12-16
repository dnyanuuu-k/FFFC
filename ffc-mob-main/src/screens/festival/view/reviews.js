import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Rating from 'components/rating';
import Image from 'components/image';
import Button from 'components/button';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Preloader from 'components/preloader/basic';
import { fonts, weights } from 'themes/topography';
import Paginator, { defaultElementCount } from 'components/paginator';
import { ERROR_TEXT } from 'utils/constants';
import { RNSelectionMenu } from 'libs/Menu';
// import Section from './section';
import Backend from 'backend';
import AddReviewModal from './addReviewModal';
import AddReplyModal from './addReplyModal';
import toast from 'libs/toast';
import SureModal from 'components/modal/sureModal';

const emptyText =
	'All Reviews of festival appear here,\nbecome first to add review';

const Reviews = ({ festivalId, festivalName, isOwner }) => {
	const { colors, dark } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					paddingHorizontal: 10,
				},
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
					justifyContent: 'center',
					alignItems: 'flex-end',
				},
				avatar: {
					height: 35,
					width: 35,
					borderRadius: 100,
					overflow: 'hidden',
					backgroundColor: colors.vectorBaseDip,
				},
				gapLeft: {
					marginLeft: 10,
				},
				reviewUserRow: {
					height: 50,
					marginBottom: 10,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				},
				reviewProfileRow: {
					flexDirection: 'row',
					alignItems: 'center',
					flex: 1,
				},
				reviewUserName: {
					fontSize: fonts.xsmall,
					color: colors.text,
					fontWeight: weights.semibold,
				},
				reviewDate: {
					fontSize: fonts.xsmall,
					color: colors.holderColor,
					fontWeight: weights.light,
				},

				reviewText: {
					fontSize: fonts.small,
					marginTop: 10,
					fontWeight: weights.light,
					color: colors.text,
				},

				replyCover: {
					backgroundColor: colors.border,
					padding: 10,
					marginTop: 10,
					alignSelf: 'flex-end',
					width: '90%',
				},
				replyRow: {
					flexDirection: 'row',
					height: 25,
					alignItems: 'center',
					justifyContent: 'space-between',
				},
				replyTitle: {
					fontSize: 14,
					color: colors.text,
					fontWeight: weights.semibold,
				},
				replyDate: {
					fontSize: 13,
					color: colors.holderColor,
				},
				replyText: {
					fontSize: 13,
					marginTop: 5,
					fontWeight: weights.light,
					color: colors.text,
				},

				btnStyle: {
					width: 90,
					height: 30,
					marginTop: 10,
					alignSelf: 'flex-end',
				},
				btnStyle2: {
					width: 130,
					height: 30,
					marginTop: 10,
					alignSelf: 'flex-end',
				},
				buttonTxt: {
					fontSize: 14,
				},

				reviewRow: {
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				},
				overall: {
					alignItems: 'center',
				},
				seprate: {
					width: '66%',
					paddingTop: 10,
					height: 160,
					alignItems: 'center',
				},
				overallRating: {
					fontSize: 50,
					fontWeight: weights.semibold,
					textAlign: 'center',
					color: colors.text,
				},
				seprateRow: {
					flexDirection: 'row',
					justifyContent: 'space-between',
					width: '100%',
					alignItems: 'center',
				},
				seperateText: {
					fontSize: fonts.small,
					marginTop: 5,
					color: colors.holderColor,
				},

				actionText: {
					fontSize: fonts.small,
					color: colors.primary,
					position: 'absolute',
					fontWeight: weights.bold,
					top: 10,
					right: 10,
				},
			}),
		[colors]
	);
	const addReplyModal = useRef();
	const sureModal = useRef();
	const addReviewModal = useRef();
	const [festivalReviews, setFestivalReviews] = useState([]);
	const [festivalCategoryRatings, setFestivalCategoryRatings] = useState([]);
	const [overallRating, setOverallRating] = useState('2.0');
	const [totalReviews, setTotalReviews] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [hasError, setHasError] = useState(false);
	const [isBusy, setIsBusy] = useState(false);

	const setRatings = (ratings) => {
		setOverallRating(Number(ratings[0].rating).toFixed(1));
		setTotalReviews(ratings[0].count);
		setFestivalCategoryRatings(festivalCategoryRatings);
	};

	const loadReviews = async (page) => {
		try {
			setIsBusy(true);
			setHasError(false);
			setFestivalReviews([]);
			setFestivalCategoryRatings([]);
			const offset = (page - 1) * defaultElementCount;
			let response = await Backend.Reviews.festivalReviews({
				offset,
				festivalId,
				limit: defaultElementCount,
			});
			if (response?.success) {
				const data = response.data;
				setFestivalReviews(data.festivalReviews);
				setCurrentPage(page);
				if (offset === 0) {
					setRatings(data.festivalCategoryRatings);
				}
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			console.log(tryErr);
			setHasError(true);
		} finally {
			setIsBusy(false);
		}
	};

	useEffect(() => {
		loadReviews(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addNewReview = () => {
		if (isOwner) {
			toast.error('Owner of festival cannot add review');
			return;
		}
		addReviewModal.current.show(null, festivalId, (review) => {
			addReviewToFestival(review);
		});
	};

	const addNewReply = (data) => {
		addReplyModal.current.show(data, (reply) => {
			addReplyToReview(reply);
		});
	};

	const addReviewToFestival = async (review) => {
		try {
			setIsBusy(true);
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
				setFestivalReviews(festivalReviews);
				setRatings(ratings);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			setIsBusy(false);
		}
	};

	const addReplyToReview = async (replyData) => {
		try {
			setIsBusy(true);
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
				setFestivalReviews(festivalReviews);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			setIsBusy(false);
		}
	};

	const deleteReview = async (festivalReviewId, index) => {
		try {
			setIsBusy(true);
			const response = await Backend.Reviews.deleteFestivalReview(
				festivalReviewId
			);
			if (response?.success) {
				festivalReviews.splice(index, 1);
				setFestivalReviews(festivalReviews);
				setRatings(response.data.ratings);
				toast.success('Review deleted successfully!');
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			setIsBusy(false);
		}
	};

	const handleReviewAction = (festivalReviewId, reviewIndex) => {
		const values = [
			{
				type: 0,
				value: 'Edit',
			},
			{
				type: 0,
				value: 'Delete',
			},
		];
		RNSelectionMenu.Show({
			values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Select Option',
			onSelection: (value) => {
				const index = values.findIndex((v) => v.value === value);
				if (index === 0) {
					addNewReview();
				} else {
					sureModal.current.show(
						'Review will be deleted permanently',
						(action) => {
							if (action) {
								deleteReview(festivalReviewId, reviewIndex);
							}
						}
					);
				}
			},
		});
	};

	const renderReview = (item, index) => {
		const { user, date, id, ratingPercent, review, festivalOrganizerReply } =
			item;
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
								{user.firstName || 'Anonymous'}
							</Text>
							<Text style={style.reviewDate}>{date}</Text>
						</View>
					</View>
					{item.isReviewOwner ? (
						<TouchableOpacity
							onPress={() => handleReviewAction(id, index)}
							style={style.reportIcon}
						>
							<FeatherIcon
								name="more-vertical"
								size={20}
								color={colors.holderColor}
							/>
						</TouchableOpacity>
					) : null}
				</View>
				<Rating progress={ratingPercent} size={14} />
				<Text style={style.reviewText}>{review}</Text>

				{festivalOrganizerReply ? (
					<>
						<View style={style.replyCover}>
							<View style={style.replyRow}>
								<Text style={style.replyTitle}>{festivalName}</Text>
								{/*<Text style={style.replyDate}>
									{reply.date}
								</Text>*/}
							</View>
							<Text style={style.replyText}>{festivalOrganizerReply}</Text>
						</View>
						{isOwner ? (
							<Button
								text="Delete reply"
								iconSize={14}
								icon="trash"
								onPress={() => {
									addReplyToReview({
										festivalReviewId: id,
										festivalOrganizerReply: null,
									});
								}}
								textStyle={style.buttonTxt}
								type={Button.OUTLINE_ICON_DANGER}
								style={style.btnStyle2}
							/>
						) : null}
					</>
				) : isOwner ? (
					<Button
						text="Reply"
						iconSize={14}
						icon="corner-up-left"
						textStyle={style.buttonTxt}
						type={Button.OUTLINE_ICON_PRIMARY}
						style={style.btnStyle}
						onPress={() =>
							addNewReply({
								festivalReviewId: id,
								review,
							})
						}
					/>
				) : null}
			</View>
		);
	};

	// const renderHeaderButtons = () => {
	// 	return (
	// 		<Button
	// 			icon={'thumbs-up'}
	// 			type={Button.OUTLINE_ICON_PRIMARY}
	// 			style={style.sectionTabButton}
	// 			text={'Add Review'}
	// 			onPress={this.addNewReview}
	// 			iconSize={16}
	// 			textStyle={{ fontSize: 14, fontWeight: 400 }}
	// 		/>
	// 	);
	// };

	return (
		<>
			<View style={style.main}>
				{/*
			<Section
				renderButtons={renderHeaderButtons}
				title="Reviews"
				showOverflow={false}
			>
			*/}
				<Preloader
					isBusy={isBusy}
					emptyIcon={'thumbs-up'}
					onRetry={loadReviews}
					emptyText={emptyText}
					emptyButtonText={'Add Review'}
					hasError={hasError}
					onEmptyPress={addNewReview}
					isEmpty={festivalReviews.length === 0}
				>
					{festivalCategoryRatings.length > 0 ? (
						<View style={style.reviewRow}>
							<View style={style.overall}>
								<Text style={style.overallRating}>{overallRating}</Text>
								<Rating
									progress={festivalCategoryRatings[0].ratingPercent}
									size={18}
								/>
							</View>
							<View style={style.seprate}>
								{festivalCategoryRatings.map((ratingCategory, index) => (
									<View style={style.seprateRow} key={index}>
										<Text style={style.seperateText}>
											{ratingCategory.categoryName}
										</Text>
										<Rating progress={ratingCategory.ratingPercent} size={15} />
									</View>
								))}
							</View>
						</View>
					) : null}
					{festivalReviews.map(renderReview)}
					<Paginator
						totalElementCount={totalReviews}
						currentPage={currentPage}
						onPageChange={loadReviews}
					/>
				</Preloader>
				<AddReviewModal ref={addReviewModal} colors={colors} />
				<AddReplyModal ref={addReplyModal} textColor={colors.text} />
				<SureModal ref={sureModal} />
			</View>
			<Text onPress={addNewReview} style={style.actionText}>
				Add New Review
			</Text>
		</>
	);
};

export default React.memo(Reviews);