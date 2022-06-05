// Create Canvas
// const canvasplaceholder = document.getElementById("canvas-placeholder");
// var jsfeat = require(["./scripts/jsfeat/build/jsfeat-min.js"]);
// const cannyEdgeDetector = require(["../node_modules/canny-edge-detector/src/index"]);
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
const canvas = document.getElementById("layer1");
// canvasplaceholder.replaceWith(canvas);
const ctx = canvas.getContext("2d");
const cw = 800;
const ch = 800;
canvas.width = cw;
canvas.height = ch;
canvas.classList.add("canvas-container");

const canvas2 = document.getElementById("layer2");
// canvasplaceholder.replaceWith(canvas);
const ctx2 = canvas2.getContext("2d");
canvas2.width = cw;
canvas2.height = ch;
canvas2.classList.add("canvas-container");


var requestID;
var slider = document.getElementById("myRange");


function setup(){
	
	// Initialise API
}


////////////////////////////////
// User Drawing functionality //
////////////////////////////////
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
		inputpath = testpath;
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
	// 	canvas.removeEventListener("mousemove", trace);
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
function getImage(){
	// Receive image from user
	processImage()
	// Return Path
}

function processImage(){
	// Convert image into path of points
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



/////////////////
// Processing  //
/////////////////

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

time = 0;
dt = 0;
var n_epicycles = 10;

// for safety (undefiend val)
// fourier_vals = arr.filter(element => {
// 	if (Object.keys(element).length !== 0) {
// 	return true;
// 	}

// 	return false;
// 	});
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
		ctx2.beginPath();
		ctx2.moveTo(prevx,prevy);
		ctx2.lineTo(currentepicycle.x, currentepicycle.y);
		
		// ctx2.arc(currentepicycle.x, currentepicycle.y, 1, 0, 2 * Math.PI);
		ctx2.stroke();
		// if (currentepicycle.cachepos == 0){debugger;}		
	}

	// intital updatepicycles with real time calcs and cache saving (maybe)
	// updateEpicycles(){
	// 	time += dt;
	// 	for (var ep = 0; ep < this.epicycles; ep++){
	// 		this.epicycles[ep].updateEpicycle();
	// 	}
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

Controller = new EpicycleController();
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

	// 	ctx.moveTo(prevx,prevy);
	// 	ctx.lineTo(trail[x].x, trail[x].y);
	// 	ctx.stroke();
	// 	prevx = trail[x-1].x;
	// 	prevy = trail[x-1].y;

	
	// // trail.push(point);
	// // for (let x = 0; x < trail.length; x++){
	// // 	ctx.beginPath();
	// // 	ctx.arc(trail[x].x, trail[x].y, 1, 0, 2 * Math.PI);
	// // 	ctx.stroke();
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
// Main	 //
///////////

function main(){
	setup();
	getCanvas();
}

main();



