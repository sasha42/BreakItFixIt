export const mapValueOnCanvasSize = (val, maxSize) => {
	return Math.floor(map(val, 0, 1, 0, maxSize));
};

export const map = (n, start1, stop1, start2, stop2) => {
	const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
	return newval;
};

export const lerp = (start, stop, amount) => {
	return amount * (stop - start) + start;
};
