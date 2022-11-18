class playerApp {
    /**
     *    1. charger le dosssier d'image
     * 2. mettre les images dans une memoire, un tableau
     * 3.affiche chaque image l'une apres l'autre en boucle
     */
    /**
     * 1. sauvegarder les dimmmension des images
     * 2.isoler les function _ fusion des codes
     * 3.initialiser PIXIJS + ajouter le canva webgl
     * 4. utlisier les info du raster pour animer des particules
     */
    constructor() {
        this.folder = "./assets/vertical-smaller/";
        this.imageName = "ezgif-frame-000";
        // this.imageName = "MAIN";
        this.max = 39;
        this.allImages = [];
        this.dimensions = { width: 520, height: 800 };
        this.counter = 0;

        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        //document.body.appendChild(canvas);
        this.ctx = canvas.getContext("2d");

        this.initPIXI();

        window.firebaseData = {"lerpedVal": ""}

        this.loadedNum = 0;
    }


    initPIXI() {
        const PX = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: false,
            antialias: true,
            resizeTo: window, 
        });

        // --> Ajouter le canvas WEBGL dans notre page HTML
        console.log(document.body)
        document.body.appendChild(PX.view);

        //Création des particules
        const textureLib = new PIXI.Texture.from("./assets/texture.png");
        console.log(textureLib);
        this.dot = new PIXI.Texture(
            textureLib.baseTexture,
            new PIXI.Rectangle(0, 0, 50, 50)
        );
        this.yellow = new PIXI.Texture(
            textureLib.baseTexture,
            new PIXI.Rectangle(0, 20, 20, 20)
        );
        //

        const nombre_de_particules = 1000;
        const c_options = {
            scale: true,
            uvs: true,
            position: true,
            alpha: true,
        };
        const container = new PIXI.ParticleContainer(
            nombre_de_particules,
            c_options
        );

        this.allParticles = [];
        for (let i = 0; i < nombre_de_particules; i++) {
            const particle = new PIXI.Sprite(this.dot);
            particle.x = -60;
            particle.y = -60;
            particle.anchor.set(0.5, 0.5);
            this.allParticles.push(particle);
            container.addChild(particle);
        }
        PX.stage.addChild(container);
        //this.loadImage(0);
        this.loadImages();

    }

    async loadImages() {
        // Get image URLs
        const urls = this.generateImageUrls();

        // Map async fetch of images
        await Promise.all(
            urls.map(async (url) => {
                await this.loadImage(url);
                //console.log('ok')
            })
        );
    }

    generateImageUrls() {
        /* Create list of image URLs for us to fetch later */

        // Define vars
        let nbr = 0;
        let urls = [];

        // Create URLs up to the point we get to the max
        while (nbr < this.max) {
            // Generate URL
            let finalNumber = nbr < 10 ? "0" + nbr : nbr;

            // Remove first character if there are 4 characters (e.g. 0123)
            //console.log(finalNumber)
            //if (finalNumber.length > 3) {
           //     console.log('asf')
             //   finalNumber = finalNumber.substring(1);
            //if (nbr > 100) {
            //    const imgUrl = this.folder + this.imageName.slice(0, -1) + finalNumber + ".jpg";
            //} else {
                const imgUrl = this.folder + this.imageName + finalNumber + ".jpg";
            //}

            //} else {
            //    const imgUrl = this.folder + this.imageName + finalNumber + ".jpg";
           // }
            // Push it to array of URLs
            urls.push({ number: finalNumber, url: imgUrl });
            nbr++;
        }

        // Return all URLs
        return urls;
    }

    loadImage(url) {
        // Create new images
        const image = new Image();

        // Once image is loaded, push it to array
        image.onload = () => {
            // Increase counter
            this.loadedNum += (this.max / 100);
            document.getElementById("loadingNumber").innerHTML = String(parseInt(this.loadedNum)).padStart(2, '0');;

            // Add image to specific number
            this.allImages[parseInt(url.number)] = image;
            if (this.allImages.length == this.max) {
                //console.log(this.allImages);
                console.log('ALL LOADED')
                document.getElementById("loadingNumber").innerHTML = 100;

                // Add play button
                const playButton = document.getElementById("playButton");

                // Set display to block
                // playButton.style.display = "block";
                playButton.classList.add("buttonLoaded");

                // Add event listener to play button
                playButton.addEventListener("click", () => {
                    // Hide play button
                    playButton.style.display = "none";

                    // Remove loading animation
                    let loading = document.getElementById("loading");
                    loading.remove();
                });
                // window.document.querySelector(".loading").remove();

                this.draw();
            }
        };

        image.src = url.url;
    }

    PlayStopMotion() {
        const shiftedImage = this.allImages.shift();
        this.ctx.drawImage(shiftedImage, 0, 0);
        this.allImages.push(shiftedImage);
        // console.log(shiftedImage);
    }

    getRaster() {
        // Get image data
        const datas = this.ctx.getImageData(
            0,
            0,
            this.dimensions.width,
            this.dimensions.height
        ).data;
        //this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Set scale
        let scale = 1;

        // Get center value of page
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Iterate over each pixel
        for (let j = 0; j < this.dimensions.height; j += 10) {
            for (let i = 0; i < this.dimensions.width; i += 10) {

                // Get color and luminance data for each pixel
                const index = 4 * (j * this.dimensions.width + i);
                const r = datas[index];
                const g = datas[index + 1];
                const b = datas[index + 2];
                const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

                // If luminance is over threshold, do something
                if (luminance > 0.15) {

                    // Create particle
                    const particle = this.allParticles[this.counter];

                    // Set it to the center of the page
                    const offsetX = window.innerWidth / 2 - this.dimensions.width / 2;
                    const offsetY = window.innerHeight / 2 - this.dimensions.height / 2;
                    const x = i * scale + offsetX;
                    const y = j * scale + offsetY;
                    particle.position.set(x, y);

                    // Measure vertex of pixel from center of page
                    const vertexX = centerX-x; 
                    const vertexY = centerY-y;
                    //console.log(vertexY, vertexY)

                    // Set scale
                    const now = Date.now();
                    // particle.scale.set(0.3 * Math.abs(Math.sin(now * 0.1)));
                    particle.scale.set(0.0003)

                    // Add texture
                    particle.texture = this.dot;

                    // noise
                    //let xOffset = Random.noise2D(
                    //    x / particle.random,
                    //    y / particle.random
                    //  );

                    // Wut
                    //const direction = 0;
                    //particle.speedX = direction;
                    //particle.speedX = direction;
                    particle.speedX = vertexX;
                    particle.speedY = vertexY;

                    // Particle state for alternating animations
                    particle.state = 1;

                    // Figure out where we are with the counter
                    this.counter++;
                    if (this.counter >= this.allParticles.length) {
                        this.counter = 0;
                    }
                }
            }
        }
    }

    moveParticles() {
        // const now = Date.now();



        // console.log(window.positionX, window.positionY)

        // console.log(window.firebaseData.lerpedVal)

        for (let i = 0; i < this.allParticles.length; i++) {
            const particle = this.allParticles[i];
            // particle.position.x += particle.speedX * Math.abs(Math.sin(now * 0.01));
            // particle.position.y += particle.speedY * Math.abs(Math.cos(now * 0.01));
            // particle.scale.set(0.00001)
            particle.state -= 1;
            if (particle.state < 4) {
                particle.scale.set(0.0001);

                // calc distance to mouse
                const distanceX = particle.position.x - window.firebaseData.lerpedVal.x;
                const distanceY = particle.position.y - window.firebaseData.lerpedVal.y;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                // if distance is less than 100, move particle
                if (distance < 400) {
                    particle.scale.set(0.00045*(400-distance));
                }



                //particle.scale.set(0.001 * i);
                particle.texture = this.dot;
            }
        }
    }

    draw() {
        // Draw the next frame, limit to 25 fps
        setTimeout(() => {
            this.PlayStopMotion();
            this.getRaster();
            this.moveParticles();
            requestAnimationFrame(this.draw.bind(this));
        }, 1000 / 15); // change fps here
    }
}

export default playerApp;