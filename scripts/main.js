function setup(){

	// Create Canvas
	const canvasplaceholder = document.getElementById("canvas-placeholder");
	const canvas = document.createElement("canvas");
	canvasplaceholder.replaceWith(canvas);
	const ctx = canvas.getContext("2d");
	const cw = 800;
	const ch = 800;
	canvas.width = cw;
	canvas.height = ch;
	
	// Initialise API
}


////////////////////////////////
// User Drawing functionality //
////////////////////////////////
function getCanvas(){
	// Get convas drawing points
	// Return Path
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
			
			let angle = 2*pi*k*n/N
			re += vals[n] * cos(angle);
			im -= vals[n] * sin(angle);
		}

		output[k] = {re, im};
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
}