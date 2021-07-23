function loadPoints(fileName) {
    var table = loadTable(fileName, 'csv');
    const curvePoints = {};
    const curveKey = 0;
    const xCoord = -1;

    //read CSV file and store to 2D array or something
    // console.log(table.getRowCount());

    //each row
    //if xCoord changed, add a new curveKey with empty array of points
    //append latest point to curvePoints at the latest curveKey



    return curvePoints;
}

function setup(){
    var form0CurvePoints = loadPoints('static/forms/form_0.csv');
    var form1CurvePoints = loadPoints('static/forms/form_1.csv');
}

function main() {
    
    //load points from CSV files
    

    //RENDERER
    const canvas = document.querySelector('#c'); //make sure canvas is defined before this script
    const renderer = new THREE.WebGLRenderer({canvas}); //sets renderer's DOM element
    renderer.setClearColor(0x8f8f8f);
    
    //TODO: Set camera to perspective matching Rhino
    //Lens length = 50 ...?
    //Position = 3282, 2530, 1125
    //NOTE: Above should already be converted
    //Lookat (1148,-66,-678)

    //CAMERA
    const fov = 40;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 40;

    //SCENE
    const scene = new THREE.Scene();

    //LIGHTS
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    
    //POINTS
    function makeInstance(geometry, position) {
        const color = 0x49ef4;
        const material = new THREE.MeshPhongMaterial({color});

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        sphere.position.x = position.x;
        sphere.position.y = position.y;
        sphere.position.z = position.z;

        return sphere;
    }

    const radius = 7;
    const widthSegments = 12;
    const heightSegments = 8;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const color = 0x49ef4;
    const material2 = new THREE.MeshPhongMaterial({color});
    console.log('purple?')
    const ball = new THREE.Mesh(geometry, material2);
    scene.add(ball);

    
    //TODO: for each point in curvePoints create a sphere
    const spheres = [];


    //canvas' "external resolution" / size on the webpage is set by CSS
    //this function sets the canvas' "internal resolution"
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false); //sets size of renderer / canvas' drawingbuffer size / canvas's "internal resolution"
                                            //IMPORTANT: false tells setSize() to set the internal resolution and NOT CSS
        }
        return needResize; //used for updating other thing if canvas is resized
    }
    
    //RENDER LOOP
    function render(time) {
        time *= 0.001;  // convert time to seconds

        // check if renderer resolution needs to change based on canvas/window size
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        // update camera aspect ratio to the canvas' aspect ratio
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        

        //TODO: interpolate between curves

        //TODO: set sphere positions based on interpolations


        renderer.render(scene, camera);
        
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();