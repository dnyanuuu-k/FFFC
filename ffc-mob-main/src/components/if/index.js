import React from 'react';

const If = (props = {}) => {
	if (props.condition) {
		return props.children;
	}
	return props.else;
};

export default React.memo(If);
