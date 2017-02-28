/**
 * Created by DrTone on 21/02/2017.
 */


//Init this app from base
function AnimationApp() {
    BaseApp.call(this);
}

AnimationApp.prototype = new BaseApp();

AnimationApp.prototype.init = function(container) {
    BaseApp.prototype.init.call(this, container);
};

AnimationApp.prototype.createScene = function() {
    //Init base createsScene
    BaseApp.prototype.createScene.call(this);

    var _this = this;

    this.loader = new THREE.JSONLoader();
    this.loader.load("./models/Alien_Rigged1.json", function(geometry, materials) {
        for(var k in materials) {
            materials[k].skinning = true;
        }

        _this.skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MultiMaterial(materials));
        //_this.skinnedMesh.scale.set(1, 1, 1);
        _this.scenes[_this.currentScene].add(_this.skinnedMesh);

        //DEBUG
        //console.log("Skinned mesh = ", _this.skinnedMesh);

        //DEBUG
        _this.bone = _this.scenes[_this.currentScene].getObjectByName("Bone.011");
    });

    this.loader.load("./models/Alien_Rigged_EyesRight.json", function(geometry, materials) {
        var eyeMesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
        _this.scenes[_this.currentScene].add(eyeMesh);
    });

    this.loader.load("./models/Alien_Rigged_EyesLeft.json", function(geometry, materials) {
        var eyeMesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
        _this.scenes[_this.currentScene].add(eyeMesh);
    });

    //Objects to control movement
    var sphereConfig = {
        radius: 0.125,
        widthSegments: 16,
        heightSegments: 16,
        colour: 0xff0000
    };
    var spherePositions = [
        new THREE.Vector3(5, -1, 0)
    ];
    var movementSpheres = [];
    var sphereGeom = new THREE.SphereBufferGeometry(sphereConfig.radius, sphereConfig.widthSegments, sphereConfig.heightSegments);
    var sphereMat = new THREE.MeshLambertMaterial( {color: sphereConfig.colour});
    var sphere = new THREE.Mesh(sphereGeom, sphereMat);
    sphere.position.copy(spherePositions[0]);
    this.scenes[this.currentScene].add(sphere);
    this.addDraggableObject(sphere);
};

AnimationApp.prototype.update = function() {
    BaseApp.prototype.update.call(this);

    //Check for dragged objects
    if(this.draggedObject !== null) {
        var scale = this.draggableObjects[0].position.x - 5;
        this.bone.rotation.y = Math.PI * scale;
    }
};

$(document).ready(function() {
    //Make sure we support WebGL
    if ( ! Detector.webgl ) {
        $('#notSupported').show();
        return;
    }

    //Initialise app
    var container = document.getElementById("WebGL-output");
    var app = new AnimationApp();
    app.init(container);
    //app.createGUI();
    app.createScene();

    app.run();
});

