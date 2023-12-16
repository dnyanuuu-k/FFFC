import * as React from "react";
import ReactDOM from "react-dom";
const canUseDOM =
	typeof window !== "undefined" &&
	window.document &&
	window.document.createElement;

const OverlayPortal = (props) => {
	var elementRef = React.useRef(null);
	if (canUseDOM && !elementRef.current) {
		var element = document.createElement("div");
		if (element && document.body) {
			document.body.appendChild(element);
			elementRef.current = element;
		}
	}
	React.useEffect(() => {
		if (canUseDOM) {
			return () => {
				if (document.body && elementRef.current) {
					document.body.removeChild(elementRef.current);
					elementRef.current = null;
				}
			};
		}
	}, []);
	return ReactDOM.createPortal(props.children, elementRef.current);
}

export default OverlayPortal;