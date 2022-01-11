function setup(){
	// Create Canvas
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


/////////////
// Fourier //
/////////////

function FourierTransform(vectorPath) {
	// Generate data for epicycles using path
	// Return complex values?
}


// Output

function generateEpicycles(complex_vals, n_epicycles) {
	// create circles and epicycle data
	// Return epicycle data
}

function displayAnimation(epicycle_data) {
	// Draw circles onto canvas and create animation
}