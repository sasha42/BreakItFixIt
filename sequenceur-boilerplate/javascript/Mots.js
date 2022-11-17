export default class Mots {
  constructor(src, x, y, scale, ctx) {
  this.src = src;
  this.x = x;
  this.y = y;
  this.scale = scale;
  this.ctx = ctx; 

  this.Stamp()
  }

  Stamp() {
    const myImage = new Image(500, 500);
    this.src = myImage.src;
    myImage.src = "javascript/img/scan.png";

    drawImage(myImage, this.x, this.y, this.scale, this.ctx);

    console.log(drawImage)

    this.Stamp()
  }

}