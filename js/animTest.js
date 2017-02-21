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

    var boxGeom = new THREE.BoxBufferGeometry(10, 10, 10);
    var boxMat = new THREE.MeshLambertMaterial( {color: 0xff0000} );
    var boxMesh = new THREE.Mesh(boxGeom, boxMat);

    this.scenes[this.currentScene].add(boxMesh);
};

AnimationApp.prototype.update = function() {
    BaseApp.prototype.update.call(this);
};

$(document).ready(function() {
    //Make sure we support WebGL

    //Initialise app
    var container = document.getElementById("WebGL-output");
    var app = new AnimationApp();
    app.init(container);
    //app.createGUI();
    app.createScene();

    app.run();
});

