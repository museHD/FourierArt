// Create Canvas
// const canvasplaceholder = document.getElementById("canvas-placeholder");
var testpath = [];
fetch("./test.json")
.then(response => {
   return response.json();
})
.then(function(data){
	for (let i = 0; i < data.length; i++) {
		let pos = {x:data[i][0],y:data[i][1]};
		testpath.push(pos);
		
	}
});

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

var drawmethod = 0;

var requestID;
var slider = document.getElementById("myRange");
var cannyarray = []
function setup(){
	
	// Initialise API
}

// Setting up file upload
// Receive uploaded file --> draw image on canvas --> EdgeDetection --> Draw EdgeDetection onto canvas --> read canvas as ImageData --> Clear canvas
// Fix to automatically get ImageData later
const image_input = document.getElementById("image-input");

image_input.addEventListener("change", function(e) {
	var reader = new FileReader();
	reader.onload = function(event){
		var img = new Image();
		img.onload = function(){

			ctx.drawImage(img,0,0,cw,ch);
			var imgdata = CannyJS.canny(canvas);
			imgdata.drawOn(canvas);
			const newdata = ctx.getImageData(0, 0, cw, ch);
			ctx.clearRect(0,0,canvas.width,canvas.height);

			// Convert EdgeDetected ImageData into x and y coordinates
			imgToArray(newdata);
			var svgstr = ImageTracer.imagedataToSVG( newdata, { ltres:0.1, qtres:1} );
			console.log(svgstr);
			var sol = solve(cannyarray,0.79);
			cannyarray = sol.map(i => cannyarray[i]);
			// createPath(cannyarray);
			// Test if cannyarray has valid x,y coordinates
			var prevx = cannyarray[0].x;
			var prevy = cannyarray[0].y;
			for (var i = 0; i < cannyarray.length; i++) {
				var x = cannyarray[i].x;
				var y = cannyarray[i].y;
				// ctx.beginPath();
				// ctx.arc(,, 1, 0, 2 * Math.PI);
				// ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(prevx,prevy);
				ctx.lineTo(x, y);
				ctx.stroke();
				prevx = x;
				prevy = y;
	
				// console.log('dar');

			}
			// console.log(imgdata);
		}
		img.src = event.target.result;
		console.log(e.target.files[0]);
		
	}
	reader.readAsDataURL(e.target.files[0]);     
});



const image_output = document.getElementById("display-image");
// image_output.src = img_to_process;


////////////////////////////////
// User Drawing functionality //
////////////////////////////////

function activateUserDrawing(){
	fourier_path = [];
	inputpath = [];
	drawmethod = 0; //Draw connecting lines b/w points

	ctx.clearRect(0,0,800,800);
	ctx2.clearRect(0,0,800,800);
}

var fourier_path = [];
var inputpath = [];
function getCanvas(){
	// Get convas drawing points
	// Return Path
	
	inputpath = [];

	var x,y,prevx,prevy = 0;


	canvas.addEventListener("mousemove", function(e){
		prevx = x;
		prevy = y;
		x = e.pageX - this.offsetLeft;
		y = e.pageY - this.offsetTop;
	})

	canvas.addEventListener("mousedown", function(e){
		cancelAnimationFrame(requestID);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		canvas.addEventListener("mousemove", trace);
		inputpath = [];
	});

	canvas.addEventListener("mouseup", function(){
		// inputpath = cannyarray;
		canvas.removeEventListener("mousemove", trace);
		fourier_path = dft(convertToComplex(inputpath));
		slider.max = fourier_path.length-1;
		slider.value = slider.max-1;
		slider.min = 1;
		fourier_path.sort((a,b) => {return b.amp - a.amp});
		Controller.generateEpicycles(cw/2, ch/2, fourier_path, fourier_path.length);
		displayAnimation(fourier_path);
		
	});

	// canvas.addEventListener("mouseout", function(){
	//  canvas.removeEventListener("mousemove", trace);
	// });

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
		inputpath.push({x,y})
	}

	return inputpath;
}


////////////////////////////////
// File Drawing Functionality //
////////////////////////////////

function activateFileDrawing(){
	drawmethod = 1; //Set draw method to points

	ctx.clearRect(0,0,800,800);
	ctx2.clearRect(0,0,800,800);

	cannyarray = [];


}

function getImage(){
	// Receive image from user
	processImage()
	// Return Path
}

///////////////////////////////
// API Drawing Functionality //
///////////////////////////////

function getRandomDrawing(){
	// Get user selected category
	getCategory()
	retrieveAPIImage()
	// Return Path
}

function retrieveAPIImage(category){
	// Get image from API according to category
}

function sortPath(points) {
	var out = [];
	const r = 5;
	for (let i = 0; i < points.length; i++) {
		var point = points[i];
		for (var scout = 1; scout < r; scout++) {
			// Ensure point is not already in outarray
			if (out.indexOf(point) == -1){
				var positions = {
					up:{x:point.x, y:point.y - scout},
					top_right:{x:point.x + scout, y:point.y - scout},
					right:{x:point.x + scout, y:point.y},
					bottom_right:{x:point.x + scout, y:point.y + scout},
					bottom:{x:point.x, y:point.y + scout},
					bottom_left:{x:point.x - scout, y:point.y + scout},
					left:{x:point.x - scout, y:point.y},
					top_left:{x:point.x - scout, y:point.y - scout}
				}

				// OBJECTS PASSED BY REF so doesn't check with given points
				for (const position in positions) {
					// console.log(position);
					// console.log(containsObject(position, points));
					var nextindex = containsObject(position, points);
					if (nextindex > 0){
						out.push(points[nextindex]);
						points.splice(i+1,0,points[nextindex]);
					}
				}
			}
		}
	}
	return out;
	
}


function createPath(points){

	// var p0 = points[0];
	var size = points.length;

	// Swap points in an array based on index
	function swap_points(a, b, array){
		var temp = array[a];
		array[a] = array[b];
		array[b] = temp;
	}

	// Squared Dist b/w a & b
	function dist(a,b){
		return ((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
	}

	// Orientation of points (0=colinear/1=clockwise/2=anticlockwise)
	function orientation(p, q, r){
		var val = ((q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y));
		if (val == 0){return 0;}
		// if (val > 0){return 1;}
		// if (val < 0){return 2;}
		return (val > 0)? 1: 2;
	}

	function sortCompare(p1, p2){

		var o = orientation(p0, p1, p2);
		if (o == 0){
			return (dist(p0, p2) >= dist(p0, p1))? -1:1;
		}
		return (o == 2)? -1:1;

	}


	var ymin = points[0].y;
	var min = 0;
	for (let i = 1; i < size; i++) {
		var y = points[i].y;

		if ((y > ymin) || ((ymin == y) && (points[i].x < points[min].x))){
			ymin = points[i].y;
			min = i;
		}
		
	}

	// swap_points(0, min, points);
	p0 = points[0];
	points.sort(sortCompare);
	// draw(points);
	
}
/////////////////
// Processing  //
/////////////////

/**
 * @private
 */
 function Path(points) {
    this.points = points;
    this.order = new Array(points.length);
    for(var i=0; i<points.length; i++) this.order[i] = i;
    this.distances = new Array(points.length * points.length);
    for(var i=0; i<points.length; i++)
      for(var j=0; j<points.length; j++)
        this.distances[j + i*points.length] = distance(points[i], points[j]);
  }
  Path.prototype.change = function(temp) {
    var i = this.randomPos(), j = this.randomPos();
    var delta = this.delta_distance(i, j);
    if (delta < 0 || Math.random() < Math.exp(-delta / temp)) {
      this.swap(i,j);
    }
  };
  Path.prototype.size = function() {
    var s = 0;
    for (var i=0; i<this.points.length; i++) {
      s += this.distance(i, ((i+1)%this.points.length));
    }
    return s;
  };
  Path.prototype.swap = function(i,j) {
    var tmp = this.order[i];
    this.order[i] = this.order[j];
    this.order[j] = tmp;
  };
  Path.prototype.delta_distance = function(i, j) {
    var jm1 = this.index(j-1),
        jp1 = this.index(j+1),
        im1 = this.index(i-1),
        ip1 = this.index(i+1);
    var s = 
        this.distance(jm1, i  )
      + this.distance(i  , jp1)
      + this.distance(im1, j  )
      + this.distance(j  , ip1)
      - this.distance(im1, i  )
      - this.distance(i  , ip1)
      - this.distance(jm1, j  )
      - this.distance(j  , jp1);
    if (jm1 === i || jp1 === i)
      s += 2*this.distance(i,j); 
    return s;
  };
  Path.prototype.index = function(i) {
    return (i + this.points.length) % this.points.length;
  };
  Path.prototype.access = function(i) {
    return this.points[this.order[this.index(i)]];
  };
  Path.prototype.distance = function(i, j) {
    return this.distances[this.order[i] * this.points.length + this.order[j]];
  };
  // Random index between 1 and the last position in the array of points
  Path.prototype.randomPos = function() {
    return 1 + Math.floor(Math.random() * (this.points.length - 1));
  };
  
  /**
   * Solves the following problem:
   *  Given a list of points and the distances between each pair of points,
   *  what is the shortest possible route that visits each point exactly
   *  once and returns to the origin point?
   *
   * @param {Point[]} points The points that the path will have to visit.
   * @param {Number} [temp_coeff=0.999] changes the convergence speed of the algorithm: the closer to 1, the slower the algorithm and the better the solutions.
   * @param {Function} [callback=] An optional callback to be called after each iteration.
   *
   * @returns {Number[]} An array of indexes in the original array. Indicates in which order the different points are visited.
   *
   * @example
   * var points = [
   *       new salesman.Point(2,3)
   *       //other points
   *     ];
   * var solution = salesman.solve(points);
   * var ordered_points = solution.map(i => points[i]);
   * // ordered_points now contains the points, in the order they ought to be visited.
   **/
  function solve(points, temp_coeff, callback) {
    var path = new Path(points);
    if (points.length < 2) return path.order; // There is nothing to optimize
    if (!temp_coeff)
      temp_coeff = 1 - Math.exp(-10 - Math.min(points.length,1e6)/1e5);
    var has_callback = typeof(callback) === "function";
  
    for (var temperature = 100 * distance(path.access(0), path.access(1));
             temperature > 1e-6;
             temperature *= temp_coeff) {
      path.change(temperature);
      if (has_callback) callback(path.order);
    }
    return path.order;
  };
  
  /**
   * Represents a point in two dimensions.
   * @class
   * @param {Number} x abscissa
   * @param {Number} y ordinate
   */
  function Point(x, y) {
    this.x = x;
    this.y = y;
  };
  
  function distance(p, q) {
    var dx = p.x - q.x, dy = p.y - q.y;
    return Math.sqrt(dx*dx + dy*dy);
  }


function vectorise(drawingPath){
	tracepath()
	createSVG()
	// Return SVG
}

function tracepath(drawingPath) {
	// convert image to path
	// Return path
}

function createSVG(path) {
	// create SVG from path
}

function convertToComplex(path){
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

class complex{
	constructor(a, b){
		this.re = a;
		this.im = b;
	}

	add(x){
		const re = this.re + x.re;
		const im = this.im + x.im;
		return new complex(re, im);
	}

	multiply(x){
		const re = this.re * x.re - this.im * x.im;
		const im = this.re * x.im + this.im * x.re;
		return new complex(re, im);
	}
}

function dft(vals) {
	// Generate data for epicycles using path
	// Return complex values?
	
	const N = vals.length;
	var output = [];

	// Iterate through each val
	for (var k = 0; k < N; k++) {

		var sum = new complex(0,0);

		for (n=0; n < N; n++) {

			let angle = 2*Math.PI*k*n/N
			let c = new complex(Math.cos(angle), -Math.sin(angle));
			sum = sum.add(vals[n].multiply(c));
		}
		sum.re = sum.re / N;
		sum.im = sum.im / N;

		let amp = Math.sqrt(sum.re*sum.re + sum.im*sum.im);
		let phase = Math.atan2(sum.im, sum.re);
		let freq = k;

		output[k] = {re:sum.re, im:sum.im, freq, amp, phase};
	}
	return output;
}


////////////
// Output //
////////////

var time = 0;
var dt = 0;
var n_epicycles = 10;

// for safety (undefiend val)
// fourier_vals = arr.filter(element => {
//  if (Object.keys(element).length !== 0) {
//  return true;
//  }

//  return false;
//  });
// // 

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

	generateEpicycles(x, y, fourier_vals, f_size) {
		// create circles and epicycle data
		// Return epicycle data
		this.epicycles = [];
		dt = Math.PI*2 / inputpath.length;
		for (var i = 1; i < f_size; i++) {
			let prevx = x;
			let prevy = y;
			let freq = fourier_vals[i].freq;
			let radius = fourier_vals[i].amp;
			let phase = fourier_vals[i].phase;
			x += radius * Math.cos(freq * time + phase);
			y += radius * Math.sin(freq * time + phase);
			this.epicycles.push(new Epicycle(x,y,freq,radius,phase));
			
			// this.epicycles[i-1].updateCache();
		}
		this.epicycles.sort((a,b) => {return b.radius - a.radius});

		// var cachetime = 0;

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
		for (var ep = 0; ep < this.epicycles.length-1; ep++){
			this.epicycles[ep].cache = this.epicycles[ep].cache.filter(element => {
				if (Object.keys(element).length !== 0) {
				return true;
				}
				return false;
			})
		}
		ctx.lineWidth = 0.5;
		ctx2.lineWidth = 2;


	return {x,y};
	}

	drawEpicycles(){
		var prevx = this.epicycles[0].x;
		var prevy = this.epicycles[0].y;
		var currentepicycle = this.epicycles[0];
		for (var ep = 0; ep < slider.value-1; ep++){
			currentepicycle = this.epicycles[ep];
			ctx.beginPath();
			ctx.arc(currentepicycle.x, currentepicycle.y, currentepicycle.radius, 0, 2 * Math.PI);
			ctx.stroke();

			ctx.beginPath();
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
		if (drawmethod == 0) {
			ctx2.moveTo(prevx,prevy);
			ctx2.lineTo(currentepicycle.x, currentepicycle.y);		
		}
		else{
			ctx2.arc(currentepicycle.x, currentepicycle.y, 1, 0, 2 * Math.PI);
		}
		ctx2.stroke();
		// if (currentepicycle.cachepos == 0){debugger;}        
	}

	// intital updatepicycles with real time calcs and cache saving (maybe)
	// updateEpicycles(){
	//  time += dt;
	//  for (var ep = 0; ep < this.epicycles; ep++){
	//      this.epicycles[ep].updateEpicycle();
	//  }
	// }
}

function generateEpicycles(x, y, fourier_vals, f_size) {
	// create circles and epicycle data
	// Return epicycle data
	dt = Math.PI*2 / inputpath.length;
	for (var i = 1; i < f_size; i++) {
		let prevx = x;
		let prevy = y;
		let freq = fourier_vals[i].freq;
		let radius = fourier_vals[i].amp;
		let phase = fourier_vals[i].phase;
		x += radius * Math.cos(freq * time + phase);
		y += radius * Math.sin(freq * time + phase);

		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(prevx,prevy);
		ctx.lineTo(x, y);
		ctx.stroke();
	}
	return {x,y};
	}


const perf = document.getElementById('performance');

var Controller = new EpicycleController();
var trail = [];
function displayAnimation() {
	t0 = performance.now();

	// Draw circles onto canvas and create animation
	ctx.clearRect(0,0,cw,ch);
	// var point = Controller.epicycles[slider.value];
	// console.log(point);
	// var point = generateEpicycles(cw/2, ch/2, fourier_path, slider.value);
	//
	// ctx2.beginPath();
	// ctx2.arc(point.x, point.y, 1, 0, 2 * Math.PI);
	// ctx2.stroke();

	Controller.drawEpicycles();


	// trail.push(point);
	// let prevx = trail[0].x;
	// let prevy = trail[0].y;


	// for (let x = 1; x < trail.length; x++){

	//  ctx.moveTo(prevx,prevy);
	//  ctx.lineTo(trail[x].x, trail[x].y);
	//  ctx.stroke();
	//  prevx = trail[x-1].x;
	//  prevy = trail[x-1].y;

	
	// // trail.push(point);
	// // for (let x = 0; x < trail.length; x++){
	// //   ctx.beginPath();
	// //   ctx.arc(trail[x].x, trail[x].y, 1, 0, 2 * Math.PI);
	// //   ctx.stroke();
	// } 
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
	setTimeout(function() {
		t1 = performance.now();
		perf.innerHTML = `${(t1-t0).toFixed(3)}`;
	requestAnimationFrame(displayAnimation);

	}, 1000 / framesPerSecond);
	// requestID = requestAnimationFrame(displayAnimation);

}

///////////
// Main  //
///////////

function main(){
	setup();
	getCanvas();
}

main();



