import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Avatar from './Avatar';
import colors from 'themes/colors';
import { weights } from 'themes/topography';
import FeatherIcon from 'react-native-vector-icons/Feather';

const myArrow = require('assets/arrow.png');
const otherArrow = require('assets/arrowOther.png');

interface TextBubbleProps {
  text: string;
  avatar?: string;
  name: string;
  bgColor: string;
  textColor?: string;
  delivery?: string;
}

export const MineTextBubble = ({
  text,
  avatar,
  name,
  bgColor,
  textColor,
  delivery,
}: TextBubbleProps) => {
  const renderDeliveryState = (state) => {
    let icon = '';
    let color = '';
    switch (state) {
      case 'pending':
        color = colors.holderColor;
        icon = 'clock';
        break;
      case 'warn':
        color = colors.rubyRed;
        icon = 'info';
        break;
      case 'sent_read':
        color = colors.primaryBlue;
        icon = 'chevrons-right';
        break;
      case 'sent_got':
        color = colors.holderColor;
        icon = 'chevrons-right';
        break;
      case 'sent':
        color = colors.holderColor;
        icon = 'chevron-right';
        break;
    }
    return (
      <FeatherIcon
        style={styles.deliveryIcon}
        name={icon}
        color={color}
        size={14}
      />
    );
  };

  return (
    <View>
      <View style={styles.mineInfo}>
        <Text
          style={[
            styles.mineBubble,
            { backgroundColor: bgColor, color: textColor },
          ]}
        >
          {text}
          {renderDeliveryState(delivery)}
        </Text>        
      </View>
      <Image
        style={[styles.mineArrow, { tintColor: bgColor }]}
        source={myArrow}
      />
    </View>
  );
};

export const OtherTextBubble = ({ text, avatar, name }: TextBubbleProps) => {
  return (
    <View style={styles.otherBubbleWrapper}>
      <View style={styles.otherInfo}>
        <Text style={styles.otherBubble}>{text}</Text>
      </View>
      <Image style={styles.otherArrow} source={otherArrow} />
    </View>
  );
};

const styles = StyleSheet.create({
  otherBubbleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mineInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  otherInfo: {
    display: 'flex',
  },
  name: {
    color: colors.holderColor,
    fontWeight: '400',
    fontSize: 13,
    marginLeft: 8,
    marginBottom: 0,
  },
  none: {
    display: 'none',
    width: 0,
  },
  mineBubble: {
    borderRadius: 16,
    margin: 8,
    padding: 12,
    overflow: 'hidden',
    marginLeft: 60,
    marginRight: 15,
  },
  otherBubble: {
    marginLeft: 15,
    borderRadius: 16,
    color: colors.buttonTxt,
    backgroundColor: colors.primaryBlue,
    margin: 8,
    marginTop: 4,
    padding: 12,
    overflow: 'hidden',
  },
  mineArrow: {
    position: 'absolute',
    right: 9,
    bottom: 7,
    width: 21,
    height: 16,
  },
  otherArrow: {
    tintColor: colors.primaryBlue,
    position: 'absolute',
    left: 9,
    bottom: 7,
    width: 21,
    height: 16,
  },
  deliveryIcon: {
    fontWeight: weights.semibold,
    paddingTop: 30
  },
});