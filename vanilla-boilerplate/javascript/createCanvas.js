export function createCanvas() {
	const canvas = document.createElement("canvas");
	canvas.setAttribute("id", "canvas");
	const container = document.getElementById("app");
	container.appendChild(canvas);

	return canvas;
}
