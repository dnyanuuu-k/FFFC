const uniqueId = () => {
  const uid = Math.random().toString(36).substr(2, 9);
  return uid;
};

const insertAtIndex = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index),
];

/**
 * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth width of source image
 * @param {Number} srcHeight height of source image
 * @param {Number} maxWidth maximum available width
 * @param {Number} maxHeight maximum available height
 * @return {Object} { width, height }
 */
const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: parseInt(srcWidth * ratio),
    height: parseInt(srcHeight * ratio),
  };
};

const arrowPressListner = (listener) => {
  if (listener) {
    document.onkeyup = (e) => {
      e = e || window.event;
      e.preventDefault();
      switch (e.keyCode) {
        case 38:
          listener("+");
          break;
        case 40:
          listener("-");
          break;
        case 37:
          listener("<");
          break;
        case 39:
          listener(">");
          break;
        default:
          return null;
      }
    };
  } else {
    document.onkeyup = null;
  }
};

const bytesToMB = (bytes) => {
  return parseFloat(Number(bytes / 1048576).toFixed(2));
};

const getFileInfo = (file, chunkSize = 10) => {
  //10  MB
  const info = {
    mimetype: file.type,
    sizeInMb: bytesToMB(file.size),
    totalChunks: Math.ceil(file.size / (chunkSize * 1000 * 1000)),
  };
  return info;
};

const createPaymentMethods = ({ razorpay, paypal }) => {
  const UPIAsset =
    "https://static-assets-web.flixcart.com/fk-p-linchpin-web/batman-returns/logos/UPI.gif";
  const methods = [];
  if (razorpay) {
    methods.push({
      id: "upi",
      name: "UPI Payment",
      image: UPIAsset,
      razorpay: true,
    });

    methods.push({
      id: "wallet",
      name: "Wallet Payment",
    });
  }

  if (paypal) {
    methods.push({
      id: "paypal",
      name: "Paypal",
      paypal: true,
    });
  }
  
  methods.push({
    id: "cards",
    name: "Credit or Debit Card",
    paypal,
    razorpay,
    card: true
  });

  return methods;
};

const createPaymentSummary = ({ currency, total, goldSaving = 10 }) => {
  const summary = [
    {
      key: "Sumbmission Protection",
      value: "FREE",
      isFree: true,
    },
    {
      key: "Service Fee",
      value: "FREE",
      isFree: true,
    },
  ];
  summary.push({
    key: "Gold Member Savings",
    value: `-${currency}${Number(goldSaving).toFixed(2)}`,
  });
  summary.push({
    key: "Total",
    value: `${currency}${Number(total).toFixed(2)}`,
  });
  return summary;
};

const helper = {
  createPaymentMethods,
  arrowPressListner,
  calculateAspectRatioFit,
  insertAtIndex,
  uniqueId,
  bytesToMB,
  getFileInfo,
  createPaymentSummary
};

export default helper;