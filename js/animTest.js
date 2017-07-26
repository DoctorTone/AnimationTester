/**
 * Created by DrTone on 21/02/2017.
 */


//Extend app from base
class AnimationApp extends BaseApp {
    constructor() {
        super();
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
            //_this.skinnedMesh.scale.set(1, 1, 1);
            this.scenes[this.currentScene].add(this.skinnedMesh);


            //DEBUG
            //console.log("Skinned mesh = ", _this.skinnedMesh);

            //DEBUG
            this.bone = this.scenes[this.currentScene].getObjectByName("Bone.009");

            /*
             _this.bodyMesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
             _this.scenes[_this.currentScene].add(_this.bodyMesh);
             */
        });
    }

    update() {
        super.update();
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

    //Controls
    $('#leftArm').slider();

    app.run();
});

