import colors from "themes/colors";
import { razorpayAPIKey } from "./constants";

let scriptLoaded = false;
let SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const loadScript = (src) => {
    return new Promise((resolve) => {
        if(scriptLoaded){
            resolve(true);
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            scriptLoaded = true;
            resolve(true);
        };
        script.onerror = () => {
            scriptLoaded = false;
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

const displayRazorpay = async ({ email, phoneNo, gatewayOrderId }, handler) => {
    const res = await loadScript(SCRIPT_URL);

    if (!res) {
        throw new Error("Payment failed to load. Are you online?");
    }

    const options = {
        key: razorpayAPIKey,
        amount: "1",
        currency: "INR",
        order_id: gatewayOrderId,
        handler,
        prefill: {
            email,
            contact: phoneNo,
        },
        theme: {
            color: colors.primaryBlue,
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
};

const razorpay = {
    open: displayRazorpay
};

export default razorpay;