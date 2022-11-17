export default class Word {
	constructor(ctx, numFrame) {
		this.ctx = ctx;
		this.numFrame = numFrame;
		this.isLoaded = false;
		this.loadImage();
	}

	loadImage() {
		this.numFrame = "0000000" + this.numFrame;
		this.myImage = new Image(500, 500);
		this.myImage.src =
			"javascript/img/PosterAnim_01" + this.numFrame.slice(-3) + ".png";
		this.myImage.onload = () => {
			// console.log(this.numFrame);
			this.setup();
			this.isLoaded = true;
		};
	}
	setup() {}

	draw(x, y, drawWord) {
		if (this.isLoaded) {
			this.ctx.drawImage(this.myImage, 0, 0, 1080, 1920);
		}
	}
}
