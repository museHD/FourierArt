// Create Canvas
const canvasplaceholder = document.getElementById("canvas-placeholder");
const canvas = document.createElement("canvas");
canvasplaceholder.replaceWith(canvas);
const ctx = canvas.getContext("2d");
const cw = 800;
const ch = 800;
canvas.width = cw;
canvas.height = ch;
canvas.classList.add("canvas-container");
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
		canvas.removeEventListener("mousemove", trace);
		fourier_path = dft(convertToComplex(inputpath));
		slider.max = fourier_path.length;
		fourier_path.sort((a,b) => {return b.amp - a.amp});
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
	constructor(x,y,radius,phase){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.phase = phase;
	}
}

class EpicycleController{
	constructor(){
		this.epicycles = [];
	}

	generateEpicycles(x, y, fourier_vals, f_size) {
	// create circles and epicycle data
	// Return epicycle data
	for (var i = 1; i < f_size; i++) {
		let prevx = x;
		let prevy = y;
		let freq = fourier_vals[i].freq;
		let radius = fourier_vals[i].amp;
		let phase = fourier_vals[i].phase;
		x += radius * Math.cos(freq * time + phase);
		y += radius * Math.sin(freq * time + phase);
		this.epicycles.push(new Epicycle(x,y,radius,phase));

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
}

function generateEpicycles(x, y, fourier_vals, f_size) {
	// create circles and epicycle data
	// Return epicycle data
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

var trail = [];
function displayAnimation() {
	// Draw circles onto canvas and create animation
	ctx.clearRect(0,0,cw,ch);
	var point = generateEpicycles(cw/2, ch/2, fourier_path, slider.value);




	trail.push(point);
	let prevx = trail[0].x;
	let prevy = trail[0].y;


	for (let x = 1; x < trail.length; x++){

		ctx.moveTo(prevx,prevy);
		ctx.lineTo(trail[x].x, trail[x].y);
		ctx.stroke();
		prevx = trail[x-1].x;
		prevy = trail[x-1].y;

	
	// trail.push(point);
	// for (let x = 0; x < trail.length; x++){
	// 	ctx.beginPath();
	// 	ctx.arc(trail[x].x, trail[x].y, 1, 0, 2 * Math.PI);
	// 	ctx.stroke();
	}
	const dt = Math.PI*2 / inputpath.length;
	time += dt;
	if (time > Math.PI*2){
		time = 0;
		path = [];
		trail = [];
	}
	requestID = requestAnimationFrame(displayAnimation);

}

///////////
// Main	 //
///////////

function main(){
	setup();
	getCanvas();
}

main();



