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

export const angle = (cx, cy, ex, ey) => {
	const dy = ey - cy;
	const dx = ex - cx;
	const rad = Math.atan2(dy, dx);
	const deg = (rad * 180) / Math.PI;
	return deg;
};

export const dist = (x1, y1, x2, y2) => {
	return Math.hypot(x1 - x2, y1 - y2);
};
