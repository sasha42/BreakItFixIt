import { getDatabase, onValue, ref } from "firebase/database";
import { fireBaseApp } from "./firebaseConfig";
import { angle, dist, lerp, map, mapValueOnCanvasSize } from "./utils";
import lottie from "lottie-web";

class App {
	constructor() {
		this.container = document.getElementById("app");
		this.animContainer = document.getElementById("anim-container");
		this.firstInput = true;
		this.scale = this.w / 10;
		this.lerpedScale = this.scale;
		this.animationArray = [];
		this.numberOfAnimations = 20;
		this.scaleArray = [];
		this.setup();
	}

	setup() {
		for (let i = 0; i < this.numberOfAnimations; i++) {
			this.animationArray.push(
				lottie.loadAnimation({
					container: this.animContainer,
					renderer: "svg",
					loop: true,
					path: "./json/typography.json",
				})
			);
		}

		for (let i = 0; i < this.animationArray.length; i++) {
			this.animationArray[i].renderer.svgElement.style.transform = "scale(2)";
			this.animationArray[i].goToAndPlay(i * 2, true);
		}

		this.setupFirebase();
		this.loadFirstInput();
	}
	// On Value change in the Firebase interface
	onValueChange() {
		if (!this.val.isPressed) {
			for (let i = 0; i < this.numberOfAnimations; i++) {
				this.animationArray[i].pause();
			}
		} else {
			for (let i = 0; i < this.numberOfAnimations; i++) {
				this.animationArray[i].play();
			}
		}
	}

	draw() {
		// console.log(this.angle);
		const speed = map(this.val.x, 0, 1, -1, 1);
		for (let i = 0; i < this.numberOfAnimations; i++) {
			this.animationArray[i].setSpeed(speed);
		}
		this.lerpedVal.x = lerp(this.lerpedVal.x, this.mappedVal.x, 0.05);
		this.lerpedVal.y = lerp(this.lerpedVal.y, this.mappedVal.y, 0.05);
		requestAnimationFrame(this.draw.bind(this));
	}

	/*DO NOT TOUCH*/
	canvasSetup() {
		this.w = window.innerHeight / 1.77;
		this.h = window.innerHeight;
	}
	setupFirebase() {
		const params = new URLSearchParams(window.location.search);
		const db = getDatabase(fireBaseApp);
		const dbName = params.get("pres") ? "poster0" : "poster" + params.get("id");
		const dbVal = ref(db, dbName);
		console.log(dbName);
		onValue(dbVal, (e) => {
			if (this.firstInput) {
				this.initValues(e.val());
				this.firstInput = false;
			}
			this.val = e.val();
			this.mappedVal.x = mapValueOnCanvasSize(this.val.x, this.w); // to remap value on canvas size
			this.mappedVal.y = mapValueOnCanvasSize(this.val.y, this.h);
			//to remap value on canvas size
			//to remap value on canvas size
			this.onValueChange();
		});
	}
	initValues(e) {
		this.mappedVal = e;
		this.lerpedVal = { x: 1, y: 1 };
	}
	loadFirstInput() {
		if (typeof this.val == "undefined") {
			console.log("canvas is loading");
			requestAnimationFrame(this.loadFirstInput.bind(this));
		} else {
			this.draw();
		}
	}
}

export default App;
