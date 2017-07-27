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
        let sliderInfo = [
            { name: "#hips",
              axis: "x",
              scale: 1},
            { name: "#chest",
              axis: "z",
              scale: 1},
            { name: "#rightLeg",
              axis: "x",
              scale: 1},
            { name: "#rightKnee",
              axis: "y",
              scale: 1},
            { name: "#leftLeg",
              axis: "x",
              scale: 1},
            { name: "#leftKnee",
              axis: "y",
              scale: -1},
            { name: "#leftArm",
                axis: "z",
                scale: 1},
            { name: "#leftShoulder",
                axis: "x",
                scale: 1},
            { name: "#leftElbow",
                axis: "y",
                scale: 1},
            { name: "#rightArm",
                axis: "z",
                scale: 1},
            { name: "#rightShoulder",
                axis: "x",
                scale: 1},
            { name: "#rightElbow",
                axis: "y",
                scale: 1}
        ];
        let currentSlider;
        for(let slider=0, numSliders=sliderInfo.length; slider<numSliders; ++slider) {
            currentSlider = sliderInfo[slider];
            $(currentSlider.name).slider();
            $(currentSlider.name).on("slide", slideEvt => {
                this.updateAnimation(slider, slideEvt.value);
            });
        }
        this.sliderInfo = sliderInfo;
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
            this.addToScene(this.skinnedMesh);

            //DEBUG
            //console.log("Skinned mesh = ", this.skinnedMesh);

            //DEBUG
            this.bones = [];
            const NUM_BONES = 12;
            let boneName, currentBone;
            for(let bone=1; bone<=NUM_BONES; ++bone) {
                boneName = bone > 9 ? "Bone.0" : "Bone.00";
                currentBone = this.getObjectByName(boneName + bone);
                if(currentBone) {
                    this.bones.push(currentBone);
                } else {
                    console.log("Couldn't find bone", currentBone);
                }
            }
        });
    }

    update() {
        super.update();
    }

    updateAnimation(slider, value) {
        //DEBUG
        //console.log("Slider = ", slider);
        //console.log("Value = ", value);
        let axis = this.sliderInfo[slider].axis;
        let scale = this.sliderInfo[slider].scale;
        this.bones[slider].rotation[axis] = Math.PI * value * scale;
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

