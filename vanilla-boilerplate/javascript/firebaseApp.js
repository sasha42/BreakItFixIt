import { getDatabase, onValue, ref } from "firebase/database";
import { createCanvas } from "./createCanvas";
import { fireBaseApp, initFirebase } from "./firebaseConfig";
import { lerp, mapValueOnCanvasSize } from "./utils";

const shuffleMode = false;

class firebaseApp {
  constructor() {
    // this.canvas = createCanvas();
    // this.pixelDensity = window.devicePixelRatio;
    // this.canvasSetup();
    // this.backgroundColor = "rgb(255,255,255)";
    // this.ctx = this.canvas.getContext("2d");
    this.firstInput = true;
    this.scale = this.w / 10;
    this.lerpedScale = this.scale;
    this.val = { x: 0, y: 0, isPressed: false };
    this.mappedVal = { x: 0, y: 0 };
    this.lerpedVal = { x: 0, y: 0 };
    this.setup();
    this.port = parseInt(
      location.host.substr(location.host.indexOf(":")).replaceAll(":", "")
    );
  }

  setup() {
    this.setupFirebase();
    // this.ctx.fillStyle = "white";
    // this.ctx.fillRect(0, 0, this.w, this.h);
    // window.onresize = () => {
    //   this.canvasSetup();
    //   this.ctx.fillStyle = "white";
    //   this.ctx.fillRect(0, 0, this.w, this.h);
    // };
    this.loadFirstInput();
  }
  // On Value change in the Firebase interface
  onValueChange() {
    // this.val.isPressed
    //   ? (this.backgroundColor = "green")
    //   : (this.backgroundColor = "red");
  }

  draw() {
    // this.lerpedScale = lerp(
    //   this.lerpedScale,
    //   this.val.isPressed ? this.scale : this.scale - this.w / 20,
    //   0.05
    // );

    //this.val.isPressed
    //this.val
    //this.mappedValue
    //this.lerpedValue

    // Inject mapped values based on window size
    // this.mappedVal = { x: 0, y: 0 };
    this.mappedVal.x = mapValueOnCanvasSize(this.val.x, window.innerWidth); // to remap value on canvas size
    this.mappedVal.y = mapValueOnCanvasSize(this.val.y, window.innerHeight);

    this.lerpedVal.x = lerp(this.lerpedVal.x, this.mappedVal.x, 0.05);
    this.lerpedVal.y = lerp(this.lerpedVal.y, this.mappedVal.y, 0.05);
    // window.lerpedVal = this.lerpedVal;

    // Send mapped values to window
    window.firebaseData = {'pressed': this.val.isPressed, 'lerpedVal': this.lerpedVal};

    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // this.ctx.fillStyle = "rgb(0,0,0)";
    // this.ctx.beginPath();
    // this.ctx.arc(
    //   this.lerpedVal.x,
    //   this.lerpedVal.y,
    //   this.lerpedScale,
    //   0,
    //   2 * Math.PI
    // );
    // this.ctx.fill();
    // this.ctx.closePath();
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
    // const id = params.get("id");
    const id = '16';
    const dbName = params.get("pres") ? "poster0" : "poster" + id;
    const dbVal = ref(db, dbName);
    onValue(dbVal, (e) => {
      if (this.firstInput) {
        this.initValues(e.val());
        this.firstInput = false;
      }
      this.val = e.val();

      this.mappedVal.x = mapValueOnCanvasSize(this.val.x, this.w); // to remap value on canvas size
      this.mappedVal.y = mapValueOnCanvasSize(this.val.y, this.h);

      // Check for changing port value
      // If port is different go to this location
      //console.log("Current port: " + this.port);
      //console.log(this.val.ports[id]);

      const updatedPort = this.val.ports[id];

      //   console.log(updatedPort);
      //   console.log(this.port);
      console.log(e);

      if (shuffleMode && updatedPort && updatedPort != this.port)
        window.location.replace(
          "http://localhost:" + updatedPort + "/?id=" + id
        );

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

export default firebaseApp;
