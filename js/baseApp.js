/**
 * Created by atg on 14/05/2014.
 */
//Common baseline for visualisation app

class BaseApp {
    constructor() {
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
        this.draggedObject = null;
        this.hoverObjects = [];
        this.startTime = 0;
        this.elapsedTime = 0;
        this.clock = new THREE.Clock();
        this.clock.start();
        this.raycaster = new THREE.Raycaster();
        this.objectsPicked = false;
    }

    init(container) {
        this.container = container;
        this.createRenderer();
        this.createCamera();
        this.createControls();
        //this.stats = initStats();
        this.statsShowing = false;
        //$("#Stats-output").hide();
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer( {antialias : true, alpha: true});
        this.renderer.setClearColor(0x7d818c, 1.0);
        this.renderer.shadowMap.enabled = true;

        this.renderer.setSize(this.container.clientWidth, window.innerHeight);
        this.container.appendChild( this.renderer.domElement );

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        window.addEventListener('keydown', event => {
            this.keyDown(event);
        }, false);

        window.addEventListener('resize', event => {
            this.windowResize(event);
        }, false);
    }

    keyDown(event) {
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
    }

    mouseClicked(event) {
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
        let intersects = this.raycaster.intersectObjects( this.scenes[this.currentScene].children, true );
        if(intersects.length > 0) {
            this.selectedObject = intersects[0].object;
            //DEBUG
            console.log("Picked = ", this.selectedObject);
        }
    }

    mouseMoved(event) {
        //Update mouse state
        this.mouse.endX = event.clientX;
        this.mouse.endY = event.clientY;
    }

    windowResize(event) {
        //Handle window resize
        this.camera.aspect = this.container.clientWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( this.container.clientWidth, window.innerHeight);
    }

    createScene() {
        let scene = new THREE.Scene();
        this.scenes.push(scene);

        let ambientLight = new THREE.AmbientLight(0x383838);
        scene.add(ambientLight);


        const SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;

        let spotLight = new THREE.SpotLight(0xffffff, 1, 0, Math.PI/2);
        spotLight.position.set(0, 1500, 1000);
        spotLight.target.position.set(0, 0, 0);

        spotLight.castShadow = true;

        spotLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
        spotLight.shadow.bias = 0.0001;

        spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
        spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

        scene.add(spotLight);

        /*
         let directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
         directionalLight.position.set( 20, 20, 20 );
         directionalLight.name = "sunlight";
         scene.add( directionalLight );
         */


        /*
        let pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(0,100,100);
        pointLight.name = 'PointLight';
        scene.add(pointLight);
        */

        return this.scenes.length-1;
    }

    addToScene(object) {
        this.scenes[this.currentScene].add(object);
    }

    getObjectByName(name) {
        return this.scenes[this.currentScene].getObjectByName(name);
    }

    addDraggableObject(object) {
        this.draggableObjects.push(object);
    }

    setDraggedObject(object) {
        this.draggedObject = object;
    }

    clearDraggedObject() {
        this.draggedObject = null;
    }

    createCamera() {
        const CAM_X = 225, CAM_Y = 520, CAM_Z = 930;
        const NEAR_PLANE = 10.0, FAR_PLANE = 3000;
        this.defaultCamPos = new THREE.Vector3(CAM_X, CAM_Y, CAM_Z);
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / window.innerHeight, NEAR_PLANE, FAR_PLANE );
        this.camera.position.copy(this.defaultCamPos);
    }

    createControls() {
        this.controls = new THREE.TrackballControls(this.camera, this.container);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.0;
        this.controls.panSpeed = 1.0;

        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.controls.keys = [ 65, 83, 68 ];

        const LOOK_X = -10, LOOK_Y = 90, LOOK_Z = -30;
        let lookAt = new THREE.Vector3(LOOK_X, LOOK_Y, LOOK_Z);
        this.controls.setLookAt(lookAt);
    }

    setCamera(cameraProp) {
        this.camera.position.set(cameraProp[0].x, cameraProp[0].y, cameraProp[0].z);
        this.controls.setLookAt(cameraProp[1]);
    }

    update() {
        //Do any updates
        this.controls.update();
    }

    run() {
        this.renderer.render( this.scenes[this.currentScene], this.camera );
        this.update();
        if(this.stats) this.stats.update();
        requestAnimationFrame(() => {
            this.run();
        });
    }

    initStats() {
        let stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        $("#Stats-output").append( stats.domElement );

        return stats;
    }
}
