var testpath = [];

// Setting up Canvases
const canvas = document.getElementById("layer1");
const ctx = canvas.getContext("2d");
const cw = 800;
const ch = 800;
canvas.width = cw;
canvas.height = ch;
canvas.classList.add("canvas-container");

const canvas2 = document.getElementById("layer2");
const ctx2 = canvas2.getContext("2d");
canvas2.width = cw;
canvas2.height = ch;
canvas2.classList.add("canvas-container");

const target_canv = document.getElementById("target-canvas");
const ctx3 = target_canv.getContext("2d");

const drawmethod_el = document.getElementById("drawmethod");
var drawmethod = 0;

var requestID;
var slider = document.getElementById("myRange");

function setup(){
	
	// Initialise API
}

// Setting up file upload
// Receive uploaded file --> draw image on canvas --> EdgeDetection --> Draw EdgeDetection onto canvas --> read canvas as ImageData --> Clear canvas
// Fix to automatically get ImageData later
const image_input = document.getElementById("image-input");
image_input.addEventListener("change", receiveImage);


////////////////////////////////
// User Drawing functionality //
////////////////////////////////


var fourier_path = [];
var inputpath = [];

function activateUserDrawing(){
	stopAnim();
	var x,y,prevx,prevy = 0;
	fourier_path = [];
	user_drawing = [];
	// drawmethod = 0; //Draw connecting lines b/w points
	setDrawMethod(0);
	hideAllSettings();

	ctx.clearRect(0,0,800,800);
	ctx2.clearRect(0,0,800,800);

	// Trace handler for user drawing
	function trace(){
		ctx.lineWidth = 3;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.strokeStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(prevx,prevy);
		ctx.lineTo(x,y);
		ctx.closePath();
		ctx.stroke();
		user_drawing.push({x,y})
	}

	/**
	 * Canvas Interaction Handlers
	 */

	window.mouseMoveHandler = function(e){
		prevx = x;
		prevy = y;
		x = e.pageX - this.offsetLeft;
		y = e.pageY - this.offsetTop;
	}

	window.mouseDownHandler = function(e){
		cancelAnimationFrame(requestID);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		canvas.addEventListener("mousemove", trace);
		user_drawing = [];
	}

	window.mouseUpHandler = function(e){
		canvas.removeEventListener("mousemove", trace);
		if (user_drawing.length<3) {
			activateUserDrawing();
		}else{
		startAnim(user_drawing);}
	}

	canvas.addEventListener("mousemove", mouseMoveHandler);
	canvas.addEventListener("mousedown", mouseDownHandler);
	canvas.addEventListener("mouseup", mouseUpHandler);
	document.getElementById("draw-btn").classList.add("btn-pressed");

}

/**
 * Processes and Starts animation using inputpath
 * @param {array} inputpath 
 */
function startAnim(inputpath) {
	alert('Loading... Please wait. Processing larger files/drawings can take quite some time');
	ctx3.clearRect(0,0,300,300);
	draw(inputpath,true,target_canv);

	console.log(inputpath.length);
	const input_set = inputpath.reduce((acc, current) => {
		const x = acc.find(item => item.x === current.x && item.y === current.y);
		if (!x) {
		  return acc.concat([current]);
		} else {
		  return acc;
		}
	  }, []);

	ctx.lineWidth = 0.5;
	ctx2.lineWidth = 2;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx2.clearRect(0,0,canvas.width,canvas.height);
	stopAnim();
	fourier_path = dft(convertToComplex(input_set));
	slider.max = fourier_path.length-1;
	slider.value = slider.max-1;
	slider.min = 1;
	fourier_path.sort((a,b) => {return b.amp - a.amp});
	Controller.clearData();
	Controller.generateEpicycles(cw/2, ch/2, fourier_path, fourier_path.length);
	displayLoadingMsg(0);
	displayAnimation(fourier_path);
}

/**
 * Stops current running animation and clears canvases
 */
function stopAnim() {
	cancelAnimationFrame(requestID);
	time = 0;
	Controller.clearData();
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx2.clearRect(0,0,canvas.width,canvas.height);
	
}


////////////////////////////////
// File Drawing Functionality //
////////////////////////////////

function activateFileDrawing(){
	stopAnim();
	// drawmethod = 1; //Set draw method to points
	setDrawMethod(1);
	hideAllSettings();
	ctx.clearRect(0,0,800,800);
	ctx2.clearRect(0,0,800,800);
	image_input.value = '';
	document.getElementById("img-settings").style.display = "block";
	document.getElementById("file-btn").classList.add("btn-pressed");
}

/**
 * Unimplemented API Code
 */

///////////////////////////////
// API Drawing Functionality //
///////////////////////////////

// function activateAPIDrawing() {
// 	stopAnim();
// 	drawmethod = 0; //Set draw method to lines
// 	hideAllSettings();
// 	ctx.clearRect(0,0,800,800);
// 	ctx2.clearRect(0,0,800,800);
// 	document.getElementById("api-settings").style.display = "block";
// 	document.getElementById("api-btn").classList.add("btn-pressed");
	
// const bucketName = 'quickdraw_dataset/full/simplified';

// // The ID of your GCS file
// const fileName = 'triangle.ndjson';

// // Imports the Google Cloud client library
// // const {Storage} = require('@google-cloud/storage');

// // Creates a client
// const storage = new Storage();

// async function downloadIntoMemory() {
//   // Downloads the file into a buffer in memory.
//   const contents = await storage.bucket(bucketName).file(fileName).download();

//   console.log(
//     `Contents of gs://${bucketName}/${fileName} are ${contents.toString()}.`
//   );
// }

// downloadIntoMemory().catch(console.error);
// }

/**
 * Functions for examples
 */

function rabbitExample() {
	setDrawMethod(1);
	console.log("rabbit");
	let path = [];
	fetch("./examples/rabbit.json")
	.then(response => {
	return response.json();
	}).then(function(data){
	path=arrToXY(data);
	startAnim(path);
	});

}
function controllerExample() {
	setDrawMethod(1);
	let path = [];
	fetch("./examples/controller.json")
	.then(response => {
	return response.json();
	}).then(function(data){
	path=arrToXY(data);
	startAnim(path);
	});


}

function catExample() {
	setDrawMethod(1);
	let path = [];
	fetch("./examples/cat.json")
	.then(response => {
	return response.json();
	}).then(function(data){
	path=arrToXY(data);
	startAnim(path);
	});


}

function pidgeonExample() {
	setDrawMethod(1);
	let path = [];
	fetch("./examples/pidgeon.json")
	.then(response => {
	return response.json();
	}).then(function(data){
	path=arrToXY(data);
	startAnim(path);
	});


}

function banjoExample() {
	setDrawMethod(1);
	let path = [];
	fetch("./examples/banjo.json")
	.then(response => {
	return response.json();
	}).then(function(data){
	path=arrToXY(data);
	startAnim(path);
	});


}


/**
 * Unimplemented Path Sort
 */

// function sortPath(points) {
// 	var out = [];
// 	const r = 10;
// 	for (let i = 0; i < points.length; i++) {
// 		var point = points[i];
// 		for (var scout = 1; scout < r; scout++) {
// 			// Ensure point is not already in outarray
// 			if (containsObject(point, out) == false){
// 				var positions = {
// 					up:{x:point.x, y:point.y - scout},
// 					top_right:{x:point.x + scout, y:point.y - scout},
// 					right:{x:point.x + scout, y:point.y},
// 					bottom_right:{x:point.x + scout, y:point.y + scout},
// 					bottom:{x:point.x, y:point.y + scout},
// 					bottom_left:{x:point.x - scout, y:point.y + scout},
// 					left:{x:point.x - scout, y:point.y},
// 					top_left:{x:point.x - scout, y:point.y - scout}
// 				}

// 				// OBJECTS PASSED BY REF so doesn't check with given points
// 				for (const position in positions) {
// 					// console.log(positions[position].x);
// 					// console.log(containsObject(position, points));
// 					var nextindex = containsObject(positions[position], points);
// 					// console.log(nextindex);
// 					if (nextindex > 0){
// 						// console.log(points[nextindex]);
// 						out.push(points[nextindex]);
// 						points.splice(i+1,0,points[nextindex]);
// 					}
// 				}
// 			}
// 		}
// 	}
// 	return out;
	
// }


// function createPath(points){

// 	// var p0 = points[0];
// 	var size = points.length;

// 	// Swap points in an array based on index
// 	function swap_points(a, b, array){
// 		var temp = array[a];
// 		array[a] = array[b];
// 		array[b] = temp;
// 	}

// 	// Squared Dist b/w a & b
// 	function dist(a,b){
// 		return ((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
// 	}

// 	// Orientation of points (0=colinear/1=clockwise/2=anticlockwise)
// 	function orientation(p, q, r){
// 		var val = ((q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y));
// 		if (val == 0){return 0;}
// 		// if (val > 0){return 1;}
// 		// if (val < 0){return 2;}
// 		return (val > 0)? 1: 2;
// 	}

// 	function sortCompare(p1, p2){

// 		var o = orientation(p0, p1, p2);
// 		if (o == 0){
// 			return (dist(p0, p2) >= dist(p0, p1))? -1:1;
// 		}
// 		return (o == 2)? -1:1;

// 	}


// 	var ymin = points[0].y;
// 	var min = 0;
// 	for (let i = 1; i < size; i++) {
// 		var y = points[i].y;

// 		if ((y > ymin) || ((ymin == y) && (points[i].x < points[min].x))){
// 			ymin = points[i].y;
// 			min = i;
// 		}
		
// 	}

// 	// swap_points(0, min, points);
// 	p0 = points[0];
// 	points.sort(sortCompare);
// 	// draw(points);
	
// }
/////////////////
// Processing  //
/////////////////

/**
 * Converts array of points into an array of complex numbers
 * @param {array} path 
 * @returns Complex Array
 */
function convertToComplex(path=[]){
	var c_path = [];
	for (let i = 0; i < path.length; i++) {
		var x = new complex(path[i].x, path[i].y);
		c_path.push(x);
		
	}
	return c_path;
}


/////////////////////////////////
// Discrete Fourier Transform  //
/////////////////////////////////

/**
 * Class for complex numbers
 */
class complex{
	constructor(a, b){
		this.re = a;
		this.im = b;
	}

	static add(a, b){
		const re = a.re + b.re;
		const im = a.im + b.im;
		return new complex(re, im);
	}

	static multiply(a, b){
		const re = a.re * b.re - a.im * b.im;
		const im = a.re * b.im + a.im * b.re;
		return new complex(re, im);
	}
}
/**
 * Generate data for epicycles using path
 * @param {array} vals Array of complex numbers
 * @returns Epicycle data 
 */
function dft(vals) {

	const N = vals.length;
	var output = [];

	// Iterate through each val
	for (var k = 0; k < N; k++) {
		// var t0 = performance.now();
		var sum = new complex(0,0);
		let N_angle = 2*Math.PI*k/N
		for (let n=0; n < N; n++) {

			let angle = N_angle*n
			let c = new complex(Math.cos(angle), -Math.sin(angle));
			let eachval = complex.multiply(c, vals[n]);
			sum = complex.add(eachval, sum);

		}
		sum.re = sum.re / N;
		sum.im = sum.im / N;

		let amp = Math.sqrt(sum.re*sum.re + sum.im*sum.im);
		let phase = Math.atan2(sum.im, sum.re);
		let freq = k;

		output[k] = {re:sum.re, im:sum.im, freq, amp, phase};
		// var t1 = performance.now();
		// console.log(`outer takes ${(t1-t0).toFixed(3)}`);
	}
	return output;
}


////////////
// Output //
////////////

/**
 * Setting Global variables for control
 */
var time = 0;
var dt = 0;
var n_epicycles = 10;


class Epicycle{
	constructor(x,y,freq,radius,phase){
		this.x = x;
		this.y = y;
		this.freq = freq;
		this.radius = radius;
		this.phase = phase;
		this.cache = [];
		this.cachepos = 0;
	}
	
	/**
	 * Loads next x and y from cache
	 */
	loadNextCache(){

			
		if (this.cachepos < this.cache.length - 2) {
			this.cachepos += 1;
		}
		else {
			this.cachepos = 0;
		}
		this.x = this.cache[this.cachepos].x;
		this.y = this.cache[this.cachepos].y;
	}

	updateEpicycle(timenow){
		this.x = Controller.epicycles[this.freq-1].x + this.radius * Math.cos(this.freq * timenow + this.phase);
		this.y = Controller.epicycles[this.freq-1].y + this.radius * Math.sin(this.freq * timenow + this.phase);
	}

	/**
	 * Pusehes current position to cache
	 */
	updateCache(){
		var pos = {x:this.x, y:this.y};
		// console.log(pos);
		this.cache.push(pos);
	}
}

class EpicycleController{
	constructor(){
		this.epicycles = [];
	}

	// Testing GPU acceleration - Don't Use
	generateGpuEpicycles(x, y, f_vals, f_size){
		const settings = {
			output: {x:f_size}
		};

		dt = Math.PI*2 / f_vals.length;
		const gpu = new GPU();
		var inarray = [];
		var gpuarray = []
		var cpuarray = [];

		for (let i = 0; i < f_size; i++) {
			let freq = f_vals[i].freq;
			let radius = f_vals[i].amp;
			let phase = f_vals[i].phase;
			inarray.push([freq,radius,phase]);
		}
		// console.log(inarray)
	


		var t0 = performance.now();
		var cpux = x;
		var cpuy = y;
		for (var i = 1; i < f_size; i++) {
			let prevx = cpux;
			let prevy = cpuy;
			let freq = f_vals[i].freq;
			let radius = f_vals[i].amp;
			let phase = f_vals[i].phase;
			// console.log( radius * Math.cos(freq * time + phase));
			cpux += radius * Math.cos(freq * time + phase);
			cpuy += radius * Math.sin(freq * time + phase);
			cpuarray.push(/*new Epicycle*/[cpux,cpuy,freq,radius,phase]);
		}
		console.log(cpuarray);
		var t1 = performance.now();
		console.log(`cpu takes ${(t1-t0).toFixed(3)}`);


		
		var t0 = performance.now();
		// gpuarray = gpucord(inarray,time);
		// var output = cpuarray.map(function(obj) {
		// 	return Object.keys(obj).sort().map(function(key) { 
		// 	  return obj[key];
		// 	});
		//   });
		// console.log(output);

		// For any given time, compute x and y coordinates of all epicycles
		const gpuGenerate = gpu.createKernel(function(eps,t,n){
			var x = 400;
			var y = 400;
			const array2 = [[0.08,5], [2,1]];
			let ep = eps[this.thread.x];

			if (this.thread.y == 0) {
				x += eps[this.thread.x][3] * Math.cos( eps[this.thread.x][2] * t +  eps[this.thread.x][4]);
				return x;
			}
			else{
				y += eps[this.thread.x][3] * Math.sin( eps[this.thread.x][2] * t +  eps[this.thread.x][4]);
				return y;
			}
			// x += ep[3] * Math.cos(ep[2] * this.thread.x * dt + ep[4]);
			// y += ep[3] * Math.sin(ep[2] * this.thread.x * dt + ep[4]);
			return eps[this.thread.x][0];
		}).setOutput([f_size,2])
		gpuarray = gpuGenerate(cpuarray, time,cpuarray.length);

		console.log(gpuarray);
		var t1 = performance.now();
		console.log(`gpu cos takes ${(t1-t0).toFixed(3)}`);
		
		const gpuCache = gpu.createKernel(function(eps,t,n){
			var x = 400;
			var y = 400;
			const array2 = [[0.08,5], [2,1]];
			let ep = eps[this.thread.y];

			if (this.thread.x == 0) {
				x += eps[this.thread.y][3] * Math.cos( eps[this.thread.y][2] * this.thread.y * t +  eps[this.thread.y][4]);
				return x;
			}
			else{
				y += eps[this.thread.y][3] * Math.sin( eps[this.thread.y][2] * this.thread.y * t +  eps[this.thread.y][4]);
				return y;
			}
			// x += ep[3] * Math.cos(ep[2] * this.thread.x * dt + ep[4]);
			// y += ep[3] * Math.sin(ep[2] * this.thread.x * dt + ep[4]);
			return eps[this.thread.y][0];
		}).setOutput([2, f_size])

	}

	/**
	 * Create Epicycles and Generate cache
	 * @param {number} x x-coordinate of start
	 * @param {number} y y-coordinate of start
	 * @param {array} fourier_vals array of Fourier vals
	 * @param {number} f_size size of fourier array
	 * @returns x and y coordinates of the last epicycle
	 */
	generateEpicycles(x, y, fourier_vals, f_size) {

		// Generate initial positions of epicycles
		this.epicycles = [];
		dt = Math.PI*2 / fourier_vals.length;
		for (var i = 1; i < f_size; i++) {
			let prevx = x;
			let prevy = y;
			let freq = fourier_vals[i].freq;
			let radius = fourier_vals[i].amp;
			let phase = fourier_vals[i].phase;
			x += radius * Math.cos(freq * time + phase);
			y += radius * Math.sin(freq * time + phase);
			this.epicycles.push(new Epicycle(x,y,freq,radius,phase));
			
		}
		this.epicycles.sort((a,b) => {return b.radius - a.radius});

		// Generate Cache
		for (var cachetime = 0; cachetime < Math.PI*2; cachetime += dt){
			var x = cw/2;
			var y = ch/2;
				for (var ep = 0; ep < this.epicycles.length-1; ep++){
					var currentepicycle = this.epicycles[ep];
					x += currentepicycle.radius * Math.cos(currentepicycle.freq * cachetime + currentepicycle.phase);
					y += currentepicycle.radius * Math.sin(currentepicycle.freq * cachetime + currentepicycle.phase);
					var pos = {x:x, y:y};
					currentepicycle.cache.push(pos);
			}
			
		}
		// Remove undefined objects from epicycle caches
		for (var ep = 0; ep < this.epicycles.length-1; ep++){
			this.epicycles[ep].cache = this.epicycles[ep].cache.filter(element => {
				if (Object.keys(element).length !== 0) {
				return true;
				}
				return false;
			})
		}


	return {x,y};
	}

	/**
	 * Draw epicycles and trail on canvas1 and canvas2 respectively
	 */
	drawEpicycles(){
		var prevx = this.epicycles[0].x;
		var prevy = this.epicycles[0].y;
		var currentepicycle = this.epicycles[0];
		slider.previousElementSibling.innerHTML = slider.value + '<br>';
		
		
		for (var ep = 0; ep < slider.value-1; ep++){
			currentepicycle = this.epicycles[ep];
			ctx.beginPath();
			ctx.arc(currentepicycle.x, currentepicycle.y, currentepicycle.radius, 0, 2 * Math.PI);
			// ctx.stroke();
			// Don't stroke for each iteration - better performance
			// ctx.beginPath();
			ctx.moveTo(prevx,prevy);
			ctx.lineTo(currentepicycle.x, currentepicycle.y);
			ctx.stroke();
			prevx = currentepicycle.x;
			prevy = currentepicycle.y;
		}
		
		
		for (let i = 0; i < this.epicycles.length-1; i++) {
			this.epicycles[i].loadNextCache();
		}
		
		// Draws points vs lines depending on drawing method
		ctx2.beginPath();
		if (drawmethod_el.checked == false) {
			ctx2.moveTo(prevx,prevy);
			ctx2.lineTo(currentepicycle.x, currentepicycle.y);		
		}
		else{
			ctx2.arc(currentepicycle.x, currentepicycle.y, 1, 0, 2 * Math.PI);
		}
		ctx2.stroke();
		      
	}

	clearData(){
		this.epicycles = [];
	}
}

/**
 * Deprecated function to generate and draw epicycles for given time
 */

// function generateEpicycles(x, y, fourier_vals, f_size) {
// 	// create circles and epicycle data
// 	// Return epicycle data
// 	dt = Math.PI*2 / inputpath.length;
// 	for (var i = 1; i < f_size; i++) {
// 		let prevx = x;
// 		let prevy = y;
// 		let freq = fourier_vals[i].freq;
// 		let radius = fourier_vals[i].amp;
// 		let phase = fourier_vals[i].phase;
// 		x += radius * Math.cos(freq * time + phase);
// 		y += radius * Math.sin(freq * time + phase);

// 		ctx.beginPath();
// 		ctx.arc(x, y, radius, 0, 2 * Math.PI);
// 		ctx.stroke();

// 		ctx.beginPath();
// 		ctx.moveTo(prevx,prevy);
// 		ctx.lineTo(x, y);
// 		ctx.stroke();
// 	}
// 	return {x,y};
// 	}


const perf = document.getElementById('performance');

var Controller = new EpicycleController();
var trail = [];

/**
 * Displays animation
 */
function displayAnimation() {
	t0 = performance.now();

	ctx.clearRect(0,0,cw,ch);
	Controller.drawEpicycles();

	time += dt;
	if (time > Math.PI*2){
		time = 0;
		path = [];
		trail = [];
		ctx2.clearRect(0,0,cw,ch);
		for (let i = 0; i < Controller.epicycles.length-1; i++) {
			Controller.epicycles[i].cachepos = 0;
		}
	}
	//Frame Time Info
	
	var framesPerSecond = 60;
	// setTimeout(function() {
		t1 = performance.now();
		perf.innerHTML = `${(t1-t0).toFixed(3)}`;
	// requestAnimationFrame(displayAnimation);

	// }, 1000/framesPerSecond);
	requestID = requestAnimationFrame(displayAnimation);

}

///////////
// Main  //
///////////

function main(){
	setup();
}

main();



