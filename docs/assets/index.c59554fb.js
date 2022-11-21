(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerpolicy&&(s.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?s.credentials="include":i.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();class I{constructor(){this.folder="./assets/vertical-smaller/",this.imageName="ezgif-frame-000",this.max=39,this.allImages=[],this.dimensions=this.calculateDimensions(),this.counter=0;const e=document.createElement("canvas");e.width=this.dimensions.width,e.height=this.dimensions.height,this.ctx=e.getContext("2d"),this.initPIXI(),window.firebaseData={lerpedVal:""},this.loadedNum=0}calculateDimensions(){let e={};return e.height=800,e.width=520,e}initPIXI(){const e=new PIXI.Application({width:window.innerWidth,height:window.innerHeight,transparent:!1,antialias:!0,resizeTo:window});console.log(document.body),document.body.appendChild(e.view);const t=new PIXI.Texture.from("./assets/texture.png");console.log(t),this.dot=new PIXI.Texture(t.baseTexture,new PIXI.Rectangle(0,0,50,50)),this.yellow=new PIXI.Texture(t.baseTexture,new PIXI.Rectangle(0,20,20,20));const n=1e3,i={scale:!0,uvs:!0,position:!0,alpha:!0},s=new PIXI.ParticleContainer(n,i);this.allParticles=[];for(let o=0;o<n;o++){const a=new PIXI.Sprite(this.dot);a.x=-60,a.y=-60,a.anchor.set(.5,.5),this.allParticles.push(a),s.addChild(a)}e.stage.addChild(s),this.loadImages()}async loadImages(){const e=this.generateImageUrls();await Promise.all(e.map(async t=>{await this.loadImage(t)}))}generateImageUrls(){let e=0,t=[];for(;e<this.max;){let n=e<10?"0"+e:e;const i=this.folder+this.imageName+n+".jpg";t.push({number:n,url:i}),e++}return t}loadImage(e){const t=new Image;t.onload=()=>{if(this.loadedNum+=100/this.max,document.getElementById("loadingNumber").innerHTML=String(parseInt(this.loadedNum)).padStart(2,"0"),this.allImages[parseInt(e.number)]=t,this.allImages.length==this.max){console.log("ALL LOADED"),document.getElementById("loadingNumber").innerHTML=100;const n=document.getElementById("playButton");n.classList.add("buttonLoaded"),n.addEventListener("click",()=>{n.style.display="none",document.getElementById("loading").remove()}),this.draw()}},t.src=e.url}PlayStopMotion(){const e=this.allImages.shift();this.ctx.drawImage(e,0,0),this.allImages.push(e)}getRaster(){const e=this.ctx.getImageData(0,0,this.dimensions.width,this.dimensions.height).data;let t=1;const n=window.innerWidth/2,i=window.innerHeight/2;for(let s=0;s<this.dimensions.height;s+=10)for(let o=0;o<this.dimensions.width;o+=10){const a=4*(s*this.dimensions.width+o),h=e[a],m=e[a+1],u=e[a+2];if((.2126*h+.7152*m+.0722*u)/255>.15){const r=this.allParticles[this.counter],g=window.innerWidth/2-this.dimensions.width/2,p=window.innerHeight/2-this.dimensions.height/2,l=o*t+g,c=s*t+p;r.position.set(l,c);const w=n-l,f=i-c;r.scale.set(3e-4),r.texture=this.dot,r.speedX=w,r.speedY=f,r.state=1,this.counter++,this.counter>=this.allParticles.length&&(this.counter=0)}}}moveParticles(){for(let e=0;e<this.allParticles.length;e++){const t=this.allParticles[e];if(t.state-=1,t.state<4){t.scale.set(1e-4);const n=t.position.x-window.positionX,i=t.position.y-window.positionY,s=Math.sqrt(n*n+i*i);s<400&&t.scale.set(45e-5*(400-s)),t.texture=this.dot}}}draw(){setTimeout(()=>{this.PlayStopMotion(),this.getRaster(),this.moveParticles(),requestAnimationFrame(this.draw.bind(this))},1e3/15)}}window.onload=()=>{new I};
