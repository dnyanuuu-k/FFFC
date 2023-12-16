import colors from "themes/colors";

export const HomeIcon = ({ filled }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
		width="28px"
		height="28px"
	>
		<path
			style={{
				fill: filled ? colors.textBlack : "none",
				stroke: colors.textBlack,
				strokeWidth: 3,
				strokeLineJoin: "round",
				strokeMiterLimit: 10,
			}}
			d="M8.5,41.5h10
	c0.552,0,1-0.448,1-1v-10c0-1.105,0.895-2,2-2h5c1.105,0,2,0.895,2,2v10c0,0.552,0.448,1,1,1h10c0.552,0,1-0.448,1-1V21.411
	c0-1.838-0.843-3.575-2.287-4.713L24,5.5L9.787,16.698C8.343,17.836,7.5,19.573,7.5,21.411V40.5C7.5,41.052,7.948,41.5,8.5,41.5z"
		/>
	</svg>
);

export const MessageIcon = ({ filled }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
		width="28px"
		height="28px"
	>
		<path
			style={{
				fill: filled ? colors.textBlack : "none",
				stroke: colors.textBlack,
				strokeWidth: 3,
				strokeLineJoin: "round",
				strokeMiterLimit: 10,
			}}
			d="M24,5.5
			C13.783,5.5,5.5,13.783,5.5,24c0,3.266,0.854,6.33,2.34,8.994l-2.301,8.238c-0.21,0.75,0.481,1.442,1.232,1.232l8.242-2.3
			C17.675,41.648,20.736,42.5,24,42.5c10.217,0,18.5-8.283,18.5-18.5C42.5,13.783,34.217,5.5,24,5.5z"
		/>
	</svg>
);

export const CartIcon = ({ filled }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
		width="28px"
		height="28px"
	>
		{filled ? (
			<path style={{ fill: colors.textBlack }} d="M 3.5 6 A 1.50015 1.50015 0 1 0 3.5 9 L 6.2558594 9 C 6.9837923 9 7.5905865 9.5029243 7.7285156 10.21875 L 8.0234375 11.763672 C 8.0244746 11.769537 8.0242827 11.77539 8.0253906 11.78125 L 11.251953 28.716797 C 11.835953 31.778797 14.521672 34 17.638672 34 L 36.361328 34 C 39.478328 34 42.165047 31.778797 42.748047 28.716797 L 45.974609 11.779297 C 46.057609 11.340297 45.94125 10.887969 45.65625 10.542969 C 45.37125 10.198969 44.947 10 44.5 10 L 10.740234 10 L 10.675781 9.6582031 C 10.272657 7.5455321 8.4069705 6 6.2558594 6 L 3.5 6 z M 20 36 A 3 3 0 0 0 20 42 A 3 3 0 0 0 20 36 z M 34 36 A 3 3 0 0 0 34 42 A 3 3 0 0 0 34 36 z" />
		) : (
			<path style={{ fill: colors.textBlack }} d="M 3.5 6 A 1.50015 1.50015 0 1 0 3.5 9 L 6.2558594 9 C 6.9837923 9 7.5905865 9.5029243 7.7285156 10.21875 L 8.0273438 11.78125 L 11.251953 28.716797 C 11.835068 31.772321 14.527135 34 17.638672 34 L 36.361328 34 C 39.472865 34 42.166064 31.773177 42.748047 28.716797 L 45.972656 11.78125 A 1.50015 1.50015 0 0 0 44.5 10 L 10.740234 10 L 10.675781 9.6582031 C 10.272657 7.5455321 8.4069705 6 6.2558594 6 L 3.5 6 z M 11.3125 13 L 42.6875 13 L 39.800781 28.15625 C 39.484764 29.81587 38.051791 31 36.361328 31 L 17.638672 31 C 15.948808 31 14.516781 29.8158 14.199219 28.15625 L 14.199219 28.154297 L 11.3125 13 z M 20 36 A 3 3 0 0 0 20 42 A 3 3 0 0 0 20 36 z M 34 36 A 3 3 0 0 0 34 42 A 3 3 0 0 0 34 36 z" />
		)}
	</svg>
);

export const BellIcon = ({ filled }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
		width="28px"
		height="28px"
	>
		{filled ? (
			<path
				style={{ fill: colors.textBlack }} d="M38.498 36H9.502c-1.205 0-2.31-.607-2.955-1.625S5.822 32.1 6.335 31.01L9 25.648v-6.267c0-8.239 6.271-14.987 14.277-15.364l0 0c4.151-.188 8.08 1.271 11.075 4.128C37.35 11.004 39 14.859 39 19v6.648l2.65 5.333c.527 1.119.448 2.377-.197 3.395S39.703 36 38.498 36zM23.348 5.516h.01H23.348zM18.09 38c.478 2.833 2.942 5 5.91 5s5.431-2.167 5.91-5H18.09z" />
		) : (
			<path
				style={{ fill: colors.textBlack }}
				xmlns="http://www.w3.org/2000/svg"
				d="M 23.277344 4.0175781 C 15.193866 4.3983176 9 11.343391 9 19.380859 L 9 26.648438 L 6.3496094 31.980469 A 1.50015 1.50015 0 0 0 6.3359375 32.009766 C 5.2696804 34.277268 6.9957076 37 9.5019531 37 L 18 37 C 18 40.295865 20.704135 43 24 43 C 27.295865 43 30 40.295865 30 37 L 38.496094 37 C 41.002339 37 42.730582 34.277829 41.664062 32.009766 A 1.50015 1.50015 0 0 0 41.650391 31.980469 L 39 26.648438 L 39 19 C 39 10.493798 31.863289 3.6133643 23.277344 4.0175781 z M 23.417969 7.0136719 C 30.338024 6.6878857 36 12.162202 36 19 L 36 27 A 1.50015 1.50015 0 0 0 36.15625 27.667969 L 38.949219 33.289062 C 39.128826 33.674017 38.921017 34 38.496094 34 L 9.5019531 34 C 9.077027 34 8.8709034 33.674574 9.0507812 33.289062 C 9.0507812 33.289062 9.0507812 33.287109 9.0507812 33.287109 L 11.84375 27.667969 A 1.50015 1.50015 0 0 0 12 27 L 12 19.380859 C 12 12.880328 16.979446 7.3169324 23.417969 7.0136719 z M 21 37 L 27 37 C 27 38.674135 25.674135 40 24 40 C 22.325865 40 21 38.674135 21 37 z"
			/>
		)}
	</svg>
);

export const FilmIcon = ({ filled }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
		width="28px"
		height="28px"
	>
		<path
			style={{ fill: colors.textBlack }}
			xmlns="http://www.w3.org/2000/svg"
			d="M 10.5 6 C 7.4802259 6 5 8.4802259 5 11.5 L 5 36.5 C 5 39.519774 7.4802259 42 10.5 42 L 38.5 42 C 41.519774 42 44 39.519774 44 36.5 L 44 11.5 C 44 8.4802259 41.519774 6 38.5 6 L 10.5 6 z M 10.5 9 L 38.5 9 C 39.898226 9 41 10.101774 41 11.5 L 41 36.5 C 41 37.898226 39.898226 39 38.5 39 L 10.5 39 C 9.1017741 39 8 37.898226 8 36.5 L 8 11.5 C 8 10.101774 9.1017741 9 10.5 9 z M 11 10.5 C 10.448 10.5 10 10.948 10 11.5 L 10 12.5 C 10 13.052 10.448 13.5 11 13.5 L 12 13.5 C 12.552 13.5 13 13.052 13 12.5 L 13 11.5 C 13 10.948 12.552 10.5 12 10.5 L 11 10.5 z M 37 10.5 C 36.448 10.5 36 10.948 36 11.5 L 36 12.5 C 36 13.052 36.448 13.5 37 13.5 L 38 13.5 C 38.552 13.5 39 13.052 39 12.5 L 39 11.5 C 39 10.948 38.552 10.5 38 10.5 L 37 10.5 z M 11 16.5 C 10.448 16.5 10 16.948 10 17.5 L 10 18.5 C 10 19.052 10.448 19.5 11 19.5 L 12 19.5 C 12.552 19.5 13 19.052 13 18.5 L 13 17.5 C 13 16.948 12.552 16.5 12 16.5 L 11 16.5 z M 37 16.5 C 36.448 16.5 36 16.948 36 17.5 L 36 18.5 C 36 19.052 36.448 19.5 37 19.5 L 38 19.5 C 38.552 19.5 39 19.052 39 18.5 L 39 17.5 C 39 16.948 38.552 16.5 38 16.5 L 37 16.5 z M 11 22.5 C 10.448 22.5 10 22.948 10 23.5 L 10 24.5 C 10 25.052 10.448 25.5 11 25.5 L 12 25.5 C 12.552 25.5 13 25.052 13 24.5 L 13 23.5 C 13 22.948 12.552 22.5 12 22.5 L 11 22.5 z M 37 22.5 C 36.448 22.5 36 22.948 36 23.5 L 36 24.5 C 36 25.052 36.448 25.5 37 25.5 L 38 25.5 C 38.552 25.5 39 25.052 39 24.5 L 39 23.5 C 39 22.948 38.552 22.5 38 22.5 L 37 22.5 z M 11 28.5 C 10.448 28.5 10 28.948 10 29.5 L 10 30.5 C 10 31.052 10.448 31.5 11 31.5 L 12 31.5 C 12.552 31.5 13 31.052 13 30.5 L 13 29.5 C 13 28.948 12.552 28.5 12 28.5 L 11 28.5 z M 37 28.5 C 36.448 28.5 36 28.948 36 29.5 L 36 30.5 C 36 31.052 36.448 31.5 37 31.5 L 38 31.5 C 38.552 31.5 39 31.052 39 30.5 L 39 29.5 C 39 28.948 38.552 28.5 38 28.5 L 37 28.5 z M 11 34.5 C 10.448 34.5 10 34.948 10 35.5 L 10 36.5 C 10 37.052 10.448 37.5 11 37.5 L 12 37.5 C 12.552 37.5 13 37.052 13 36.5 L 13 35.5 C 13 34.948 12.552 34.5 12 34.5 L 11 34.5 z M 37 34.5 C 36.448 34.5 36 34.948 36 35.5 L 36 36.5 C 36 37.052 36.448 37.5 37 37.5 L 38 37.5 C 38.552 37.5 39 37.052 39 36.5 L 39 35.5 C 39 34.948 38.552 34.5 38 34.5 L 37 34.5 z"
		/>
	</svg>
);

export const FestivalIcon = () => (
	<svg
		style={{ fill: colors.textBlack }}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
		width="28px"
		height="28px"
	>
		<path
			xmlns="http://www.w3.org/2000/svg"
			d="M 12.5 6 C 8.9280619 6 6 8.9280619 6 12.5 L 6 35.5 C 6 39.071938 8.9280619 42 12.5 42 L 35.5 42 C 39.071938 42 42 39.071938 42 35.5 L 42 12.5 C 42 8.9280619 39.071938 6 35.5 6 L 12.5 6 z M 12.5 9 L 35.5 9 C 37.450062 9 39 10.549938 39 12.5 L 39 14 L 9 14 L 9 12.5 C 9 10.549938 10.549938 9 12.5 9 z M 9 17 L 39 17 L 39 35.5 C 39 37.450062 37.450062 39 35.5 39 L 12.5 39 C 10.549938 39 9 37.450062 9 35.5 L 9 17 z M 17.5 20 A 1.5 1.5 0 0 0 17.5 23 A 1.5 1.5 0 0 0 17.5 20 z M 30.5 20 A 1.5 1.5 0 0 0 30.5 23 A 1.5 1.5 0 0 0 30.5 20 z M 24.001953 22.003906 C 23.430953 22.003906 22.90925 22.327844 22.65625 22.839844 L 21.21875 25.751953 L 18.005859 26.21875 C 17.440859 26.30075 16.970922 26.697234 16.794922 27.240234 C 16.618922 27.784234 16.764828 28.379344 17.173828 28.777344 L 19.5 31.044922 L 18.949219 34.246094 C 18.852219 34.808094 19.084875 35.378844 19.546875 35.714844 C 20.007875 36.049844 20.620953 36.093125 21.126953 35.828125 L 24 34.314453 L 26.875 35.828125 C 27.095 35.943125 27.333266 36 27.572266 36 C 27.883266 36 28.194078 35.903844 28.455078 35.714844 C 28.917078 35.378844 29.148734 34.809094 29.052734 34.246094 L 28.501953 31.044922 L 30.828125 28.777344 C 31.237125 28.379344 31.383031 27.784234 31.207031 27.240234 C 31.031031 26.697234 30.561094 26.30175 29.996094 26.21875 L 26.783203 25.751953 L 25.345703 22.839844 C 25.092703 22.327844 24.572953 22.003906 24.001953 22.003906 z M 12.5 26 A 1.5 1.5 0 0 0 12.5 29 A 1.5 1.5 0 0 0 12.5 26 z M 35.5 26 A 1.5 1.5 0 0 0 35.5 29 A 1.5 1.5 0 0 0 35.5 26 z M 14.5 33 A 1.5 1.5 0 0 0 14.5 36 A 1.5 1.5 0 0 0 14.5 33 z M 33.5 33 A 1.5 1.5 0 0 0 33.5 36 A 1.5 1.5 0 0 0 33.5 33 z"
		/>
	</svg>
);

export const PhoneIcon = () => (
	<svg
		style={{ fill: colors.textBlack }}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
		width="30px"
		height="30px"
	>
		<path d="M 16.5 4 C 14.032499 4 12 6.0324991 12 8.5 L 12 39.5 C 12 41.967501 14.032499 44 16.5 44 L 31.5 44 C 33.967501 44 36 41.967501 36 39.5 L 36 8.5 C 36 6.0324991 33.967501 4 31.5 4 L 16.5 4 z M 16.5 7 L 31.5 7 C 32.346499 7 33 7.6535009 33 8.5 L 33 39.5 C 33 40.346499 32.346499 41 31.5 41 L 16.5 41 C 15.653501 41 15 40.346499 15 39.5 L 15 8.5 C 15 7.6535009 15.653501 7 16.5 7 z M 24 10 A 1.5 1.5 0 0 0 24 13 A 1.5 1.5 0 0 0 24 10 z M 21.5 35 A 1.50015 1.50015 0 1 0 21.5 38 L 26.5 38 A 1.50015 1.50015 0 1 0 26.5 35 L 21.5 35 z" />
	</svg>
);

export const SupportIcon = () => (
	<svg
		style={{ fill: colors.textBlack }}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
		width="30px"
		height="30px"
	>
		<path
			xmlns="http://www.w3.org/2000/svg"
			d="M 23 4 C 17.754444 4 12.622885 5.9409508 8.9277344 10.419922 C 5.2325833 14.898893 3 21.770395 3 31.5 L 3 36.5 C 3 39.519774 5.4802259 42 8.5 42 L 17.880859 42 C 19.709774 43.253653 21.779113 44 24 44 A 1.50015 1.50015 0 1 0 24 41 C 22.393431 41 20.851679 40.453957 19.4375 39.449219 A 1.50015 1.50015 0 0 0 19.042969 39.160156 C 18.201403 38.498119 17.40764 37.673206 16.683594 36.681641 C 14.652825 33.900548 13.244769 29.913317 12.998047 25.417969 A 1.50015 1.50015 0 0 0 11.544922 23.978516 A 1.50015 1.50015 0 0 0 10.001953 25.582031 C 10.277231 30.597683 11.821988 35.110015 14.261719 38.451172 C 14.401629 38.642776 14.556788 38.816054 14.703125 39 L 8.5 39 C 7.1017741 39 6 37.898226 6 36.5 L 6 31.5 C 6 22.229605 8.131088 16.101107 11.242188 12.330078 C 14.353286 8.5590492 18.470556 7 23 7 C 25.25 7 26.727654 7.5500853 27.646484 8.0605469 C 28.565315 8.5710084 28.828125 8.9375 28.828125 8.9375 A 1.50015 1.50015 0 0 0 30 9.5 C 32.201383 9.5 36.95975 11.137823 39.789062 18.066406 A 1.50015 1.50015 0 1 0 42.566406 16.933594 C 39.507128 9.4418556 34.227288 6.8388637 30.582031 6.5996094 C 30.28995 6.2987951 30.055057 5.9680872 29.103516 5.4394531 C 27.772346 4.6999147 25.75 4 23 4 z M 28.537109 14 A 1.50015 1.50015 0 0 0 27.503906 14.378906 C 25.645652 16.030688 22.366199 17.043927 19.560547 17.521484 C 16.754894 17.999042 14.5 18 14.5 18 A 1.50015 1.50015 0 1 0 14.5 21 C 14.5 21 16.995106 21.000958 20.064453 20.478516 C 22.887905 19.997928 26.225694 19.072175 28.804688 17.107422 C 29.332223 17.216038 30.364164 17.477047 31.650391 18.361328 C 33.335637 19.519935 35 21.444444 35 25.5 L 35 30.5 C 35 33.003499 33.003499 35 30.5 35 L 28.660156 35 A 3.5 3.5 0 0 0 25.5 33 A 3.5 3.5 0 1 0 25.5 40 A 3.5 3.5 0 0 0 28.658203 38 L 30.5 38 C 34.455727 38 37.713881 34.892719 37.974609 31 L 38 31 C 40.209 31 42 29.209 42 27 L 42 25 C 42 22.791 40.209 21 38 21 L 37.234375 21 C 36.359776 18.60127 34.85598 16.924302 33.349609 15.888672 C 31.034856 14.297279 28.685547 14.011719 28.685547 14.011719 A 1.50015 1.50015 0 0 0 28.537109 14 z M 19 25 A 2 2 0 0 0 19 29 A 2 2 0 0 0 19 25 z M 29 25 A 2 2 0 0 0 29 29 A 2 2 0 0 0 29 25 z M 43.476562 30.978516 A 1.50015 1.50015 0 0 0 42 32.5 L 42 36.5 C 42 37.898226 40.898226 39 39.5 39 L 36 39 A 1.50015 1.50015 0 1 0 36 42 L 39.5 42 C 42.519774 42 45 39.519774 45 36.5 L 45 32.5 A 1.50015 1.50015 0 0 0 43.476562 30.978516 z"
		/>
	</svg>
);