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

        this.shadowObjects = [];

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

        //Shadows
        /*
        let planeConstant = 0.01;
        let normalVector = new THREE.Vector3(0, 1, 0);
        this.groundPlane = new THREE.Plane(normalVector, planeConstant);
        this.lightPosition = new THREE.Vector4();
        let sunlight = this.getObjectByName("sunlight");
        if(!sunlight) {
            console.log("Couldn't get light!");
        }
        this.lightPosition.x = sunlight.position.x;
        this.lightPosition.y = sunlight.position.y;
        this.lightPosition.z = sunlight.position.z;
        this.lightPosition.w = 0.001;
        */

        this.loader = new THREE.JSONLoader();
        this.loader.load("./models/Alien_Rigged9.json", (geometry, materials) => {

            for(let k in materials) {
                materials[k].skinning = true;
            }

            this.skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MultiMaterial(materials));
            this.skinnedMesh.castShadow = true;
            this.skinnedMesh.receiveShadow = false;

            let parent = new THREE.Object3D();
            //parent.add(this.skinnedMesh);
            parent.rotation.y = Math.PI/8;
            this.addToScene(parent);
            this.parent = parent;

            //DEBUG
            let cubeGeom = new THREE.BoxBufferGeometry(5, 5, 5);
            let cubeMat = new THREE.MeshPhongMaterial( {color: 0xff0000});
            let cube = new THREE.Mesh(cubeGeom, cubeMat);
            cube.position.y = 2.51;
            cube.castShadow = true;
            cube.receiveShadow = false;
            parent.add(cube);
            //let cubeShadow = new THREE.ShadowMesh(cube);
            //parent.add(cubeShadow);
            //this.cubeShadow = cubeShadow;

            //Shadows
            /*
            let meshShadow = new THREE.ShadowMesh(this.skinnedMesh);
            parent.add(meshShadow);
            this.shadowObjects.push(meshShadow);
            */

            //DEBUG
            //console.log("Skinned mesh = ", this.skinnedMesh);

            //DEBUG
            /*
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
            */
        });

        this.addGround();
    }

    addGround() {
        //Ground plane
        const GROUND_WIDTH = 1000, GROUND_HEIGHT = 640, SEGMENTS = 16;
        let groundGeom = new THREE.PlaneBufferGeometry(GROUND_WIDTH, GROUND_HEIGHT, SEGMENTS, SEGMENTS);
        let groundMat = new THREE.MeshPhongMaterial( {color: 0x7d818c} );
        let ground = new THREE.Mesh(groundGeom, groundMat);
        ground.name = "Ground";
        ground.rotation.x = -Math.PI/2;
        ground.castShadow = false;
        ground.receiveShadow = true;
        this.addToScene(ground);
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

