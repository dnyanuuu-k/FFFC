import { useLocation, useNavigate, useParams } from "react-router-dom";

const withRouter = (Component) => {
	function ComponentWithRouterProp(props) {
		let location = useLocation();
		let navigate = useNavigate();
		let params = useParams();
		return <Component {...props} route={{ params }} navigation={{ location, navigate }} />;
	}
	return ComponentWithRouterProp;
};

export default withRouter;