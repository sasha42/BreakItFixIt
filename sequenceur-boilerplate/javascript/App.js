import { getDatabase, onValue, ref } from "firebase/database";
import { createCanvas } from "./createCanvas";
import { fireBaseApp, initFirebase } from "./firebaseConfig";
import { lerp, map, mapValueOnCanvasSize } from "./utils";
import Word from "./Word";

class App {
	constructor() {
		this.canvas = createCanvas();
		this.pixelDensity = window.devicePixelRatio;
		this.canvasSetup();
		this.backgroundColor = "rgb(255,255,255)";
		this.ctx = this.canvas.getContext("2d");
		this.firstInput = true;
		this.scale = this.w / 10;
		this.lerpedScale = this.scale;
		this.frameArray = [];
		this.fps = 1;
		this.numOfFrames = 481;
		this.setup();
	}

	setup() {
		this.setupFirebase();
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, this.w, this.h);
		for (let i = 0; i < this.numOfFrames; i++) {
			this.frameArray.push(new Word(this.ctx, i));
		}
		window.onresize = () => {
			this.canvasSetup();
		};
		this.loadFirstInput();

		const start = Date.now();

		console.log("starting timer...");
		// expected output: starting timer...

		setTimeout(() => {
			const millis = Date.now() - start;

			console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);
			// expected output: seconds elapsed = 2
		}, 4000);
	}
	// On Value change in the Firebase interface
	onValueChange() {
		this.val.isPressed
			? (this.backgroundColor = "green")
			: (this.backgroundColor = "red");
	}

	draw() {
		this.velocity = Math.floor(map(this.lerpedVal.x, 0, 1, -10, 10));

		if (this.velocity >= 0) {
			this.direction = 1;
		} else {
			this.direction = -1;
		}
		this.fps += this.velocity;

		if (this.fps >= this.numOfFrames && this.direction == 1) {
			this.fps = 0;
		}
		if (this.fps <= 0 && this.direction == -1) {
			this.fps = this.numOfFrames - 1;
		}

		console.log(this.fps);

		this.frameArray[this.fps].draw();

		this.lerpedScale = lerp(
			this.lerpedScale,
			this.val.isPressed ? this.scale : this.scale - this.w / 20,
			0.05
		);

		this.lerpedVal.x = lerp(this.lerpedVal.x, this.val.x, 0.01);
		this.lerpedVal.y = lerp(this.lerpedVal.y, this.val.y, 0.05);

		requestAnimationFrame(this.draw.bind(this));
	}

	/*DO NOT TOUCH*/
	canvasSetup() {
		this.canvas.width = (window.innerHeight / 1.77) * this.pixelDensity;
		this.canvas.height = window.innerHeight * this.pixelDensity;
		this.canvas.width = this.w =
			(window.innerHeight / 1.77) * this.pixelDensity;
		this.canvas.height = this.h = window.innerHeight * this.pixelDensity;
		this.canvas.style.width = this.w / this.pixelDensity + "px";
		this.canvas.style.height = this.h / this.pixelDensity + "px";
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
		console.log("init");
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
