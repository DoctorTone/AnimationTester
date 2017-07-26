/**
 * Created by DrTone on 21/02/2017.
 */


//Extend app from base
class AnimationApp extends BaseApp {
    constructor() {
        super();
    }

    init(container) {
        super.init(container);

        //Set up sliders
        let sliders = ['#leftArm', '#rightArm'];
        for(let slider=0, numSliders=sliders.length; slider<numSliders; ++slider) {
            $(sliders[slider]).slider();
            $(sliders[slider]).on("slide", slideEvt => {
                this.updateAnimation(slider, slideEvt.value);
            });
        }
    }
    createScene() {
        //Init base createsScene
        super.createScene();

        this.loader = new THREE.JSONLoader();
        this.loader.load("./models/Alien_Rigged2.json", (geometry, materials) => {

            for(let k in materials) {
                materials[k].skinning = true;
            }

            this.skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MultiMaterial(materials));
            this.scenes[this.currentScene].add(this.skinnedMesh);

            //DEBUG
            //console.log("Skinned mesh = ", this.skinnedMesh);

            //DEBUG
            this.bone = this.scenes[this.currentScene].getObjectByName("Bone");

        });
    }

    update() {
        super.update();
    }

    updateAnimation(slider, value) {
        //DEBUG
        console.log("Slider = ", slider);
        console.log("Value = ", value);
        this.bone.rotation.y = Math.PI * -value;
    }
}

$(document).ready(function() {
    //Make sure we support WebGL
    if ( ! Detector.webgl ) {
        $('#notSupported').show();
        return;
    }

    //Initialise app
    let container = document.getElementById("WebGL-output");
    let app = new AnimationApp();
    app.init(container);
    //app.createGUI();
    app.createScene();

    app.run();
});

