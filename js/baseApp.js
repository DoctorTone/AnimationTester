/**
 * Created by atg on 14/05/2014.
 */
//Common baseline for visualisation app

function BaseApp() {
    this.renderer = null;
    this.scenes = [];
    this.currentScene = 0;
    this.camera = null;
    this.controls = null;
    this.stats = null;
    this.container = null;
    this.objectList = [];
    this.root = null;
    this.mouse = new THREE.Vector2();
    this.pickedObjects = [];
    this.selectedObject = null;
    this.draggableObjects = [];
    this.hoverObjects = [];
    this.startTime = 0;
    this.elapsedTime = 0;
    this.clock = new THREE.Clock();
    this.clock.start();
    this.raycaster = new THREE.Raycaster();
    this.objectsPicked = false;
}

BaseApp.prototype.init = function(container) {
    this.container = container;
    this.createRenderer();
    this.createCamera();
    this.createControls();
    //this.stats = initStats();
    this.statsShowing = false;
    //$("#Stats-output").hide();
};

BaseApp.prototype.createRenderer = function() {
    this.renderer = new THREE.WebGLRenderer( {antialias : true, alpha: true});
    this.renderer.setClearColor(0x5c5f64, 1.0);
    this.renderer.shadowMapEnabled = true;
    var isMSIE = /*@cc_on!@*/0;

    var width = this.container.clientWidth;
    if (isMSIE) {
        // do IE-specific things
        width = window.innerWidth;
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild( this.renderer.domElement );
    var _this = this;

    /*
    this.container.addEventListener('mousedown', function(event) {
        _this.mouseClicked(event);
    }, false);
    this.container.addEventListener('mouseup', function(event) {
        _this.mouseClicked(event);
    }, false);
    this.container.addEventListener('mousemove', function(event) {
        _this.mouseMoved(event);
    }, false);
    */

    window.addEventListener('keydown', function(event) {
        _this.keydown(event);
    }, false);

    window.addEventListener('resize', function(event) {
        _this.windowResize(event);
    }, false);
};

BaseApp.prototype.keydown = function(event) {
    //Key press functionality
    switch(event.keyCode) {
        case 83: //'S'
            if (this.stats) {
                if (this.statsShowing) {
                    $("#Stats-output").hide();
                    this.statsShowing = false;
                } else {
                    $("#Stats-output").show();
                    this.statsShowing = true;
                }
            }
            break;
        case 80: //'P'
            console.log('Cam =', this.camera.position);
            console.log('Look =', this.controls.getLookAt());
    }
};

BaseApp.prototype.mouseClicked = function(event) {
    //Update mouse state
    event.preventDefault();
    this.pickedObjects.length = 0;

    if(event.type == 'mouseup') {
        this.mouse.endX = event.clientX;
        this.mouse.endY = event.clientY;
        this.mouse.down = false;
        this.objectsPicked = false;
        return;
    }
    this.mouse.set((event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1);
    this.mouse.down = true;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    var intersects = this.raycaster.intersectObjects( this.scenes[this.currentScene].children, true );
    if(intersects.length > 0) {
        this.selectedObject = intersects[0].object;
        //DEBUG
        console.log("Picked = ", this.selectedObject);
    }
};

BaseApp.prototype.mouseMoved = function(event) {
    //Update mouse state
    this.mouse.endX = event.clientX;
    this.mouse.endY = event.clientY;
};

BaseApp.prototype.windowResize = function(event) {
    //Handle window resize
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight);
    //console.log('Size =', )
};

BaseApp.prototype.createScene = function() {

    var scene = new THREE.Scene();
    this.scenes.push(scene);

    var ambientLight = new THREE.AmbientLight(0x383838);
    scene.add(ambientLight);

    /*
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 100, 200);
    spotLight.intensity = 1;
    this.scene.add(spotLight);
    */

    /*
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
    directionalLight.position.set( 1, 1, 1 );
    this.scene.add( directionalLight );
    */


    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0,100,100);
    pointLight.name = 'PointLight';
    scene.add(pointLight);

    return this.scenes.length-1;
};

BaseApp.prototype.addDraggableObject = function(object) {
    this.draggableObjects.push(object);
};

BaseApp.prototype.createCamera = function() {

    this.defaultCamPos = new THREE.Vector3(-3, 4, 7);
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / window.innerHeight, 0.1, 5000 );
    this.camera.position.copy(this.defaultCamPos);

    console.log('dom =', this.renderer.domElement);
};

BaseApp.prototype.createControls = function() {
    this.controls = new THREE.TrackballControls(this.camera, this.container);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.0;
    this.controls.panSpeed = 1.0;

    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;

    this.controls.keys = [ 65, 83, 68 ];

    var lookAt = new THREE.Vector3(2, 2, 1);
    this.controls.setLookAt(lookAt);

    //Draggable
    var _this = this;
    this.dragControls = new THREE.DragControls(this.draggableObjects, this.camera, this.renderer.domElement);
    this.dragControls.addEventListener( 'dragstart', function ( event ) {
        //DEBUG
        console.log("Object = ", event.object);
        _this.controls.enabled = false;
    } );

    this.dragControls.addEventListener( 'dragend', function ( event ) { _this.controls.enabled = true; } );
};

BaseApp.prototype.setCamera = function(cameraProp) {
    this.camera.position.set(cameraProp[0].x, cameraProp[0].y, cameraProp[0].z);
    this.controls.setLookAt(cameraProp[1]);
};

BaseApp.prototype.update = function() {
    //Do any updates
    this.controls.update();
};

BaseApp.prototype.run = function() {
    this.renderer.render( this.scenes[this.currentScene], this.camera );
    var _this = this;
    this.update();
    if(this.stats) this.stats.update();
    requestAnimationFrame(function() {
        _this.run();
    });
};

function initStats() {

    var stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    $("#Stats-output").append( stats.domElement );

    return stats;
}