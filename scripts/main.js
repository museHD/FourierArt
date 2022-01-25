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

function setup(){
	
	// Initialise API
}


////////////////////////////////
// User Drawing functionality //
////////////////////////////////

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
		ctx.clearRect(0,0,canvas.width,canvas.height);
		canvas.addEventListener("mousemove", trace);
		inputpath = [];
	});

	canvas.addEventListener("mouseup", function(){
		canvas.removeEventListener("mousemove", trace);
		
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

function generateEpicycles(complex_vals, n_epicycles) {
	// create circles and epicycle data
	// Return epicycle data
}

function displayAnimation(epicycle_data) {
	// Draw circles onto canvas and create animation
}

///////////
// Main	 //
///////////

function main(){
	setup();
	getCanvas();
}

main();