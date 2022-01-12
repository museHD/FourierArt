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



/////////////////////////////////
// Discrete Fourier Transform  //
/////////////////////////////////


function dft(vals) {
	// Generate data for epicycles using path
	// Return complex values?
	
	const N = vals.length;
	var output = [];

	// Iterate through each val
	for (var k = 0; k < N; k++) {

		var re = 0;
		var im = 0;

		for (n=0; n < N; n++) {

			let angle = 2*Math.PI*k*n/N
			re += vals[n] * Math.cos(angle);
			im -= vals[n] * Math.sin(angle);
		}

		let amp = Math.sqrt(re*re + im*im);
		let phase = Math.atan2(im, re);
		let freq = k;

		output[k] = {re, im, freq, amp, phase};
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