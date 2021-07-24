let form0;
let form1;

let form0CurvePoints;
let form1CurvePoints;

function loadPoints(table){
    let formPoints =  [];
    let curve = {id:0,points:[]};
    let curvePoint = {x:0,y:0,z:0};
    let curveKey = -1;
    let xCoord = -1;

    //store table/CSV to 2D array or something
    // console.log(table.getRowCount());
    //each row
    for(let i = 0; i<table.getRowCount();i++){
        let row = table.getRow(i);

        curvePoint.x = row.get(0);
        curvePoint.y = row.get(1);
        curvePoint.z = row.get(2);
        
        //if xCoord changed, add a new curveKey and empty array of points
        if(xCoord != curvePoint.x)
        {
            curveKey++;
            curve.id = curveKey;
            curve.points = [];
            xCoord = curvePoint.x;
            formPoints.push(curve);
        }

        //append latest point to formPoints at the latest curveKey
        formPoints[curveKey].points.push(curvePoint);

    }
    
    return formPoints;
}

function preload(){
    //load points from CSV files
    form0 = loadTable('static/forms/form_0.csv');
    form1 = loadTable('static/forms/form_1.csv');
}

function setup(){
    // console.log(form0.getRowCount());
    form0CurvePoints = loadPoints(form0);
    console.log(form0CurvePoints);
    form1CurvePoints = loadPoints(form1);
    console.log(form1CurvePoints);
}
function main() {

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
    function makeSphere(position) {
        const radius = 7;
        const widthSegments = 12;
        const heightSegments = 8;
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const color = 0x49ef4;
        const material = new THREE.MeshPhongMaterial({color});

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        sphere.position.x = position.x;
        sphere.position.y = position.y;
        sphere.position.z = position.z;

        return sphere;
    }
    const pos = {x:0,y:0,z:0};
    makeSphere(pos);
    
    // const radius = 7;
    // const widthSegments = 12;
    // const heightSegments = 8;
    // const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    // const color = 0x49ef4;
    // const material2 = new THREE.MeshPhongMaterial({color});
    // console.log('purple?')
    // const ball = new THREE.Mesh(geometry, material2);
    // scene.add(ball);

    
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