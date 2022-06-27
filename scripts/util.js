// Convert image into path of points
// Convert edges to [x,y]

const divmod = (x, y) => [(x % y)/4, Math.floor(x / y)];
/**
 * Converts Image data into array of points {x,y}
 * @param {ImageData} imdata ImageData from canvas
 * @returns Array of bright points
 */
function imgToArray(imdata){
    var out = [];
    const data = imdata.data;
    var numpix = data.length/4;
    for (var x = 0; x < data.length; x+=4) {
        var val = data[x+1];
        if (val>50){
            var cords = divmod(x,4*cw);
            // Ensure x and y are within canvas bounds
            if ((1 < cords[0]) && (cords[0] < 790) && (1 < cords[1]) && (cords[1] < 790)){
                out.push({x:cords[0],y:cords[1]});
            }
            else{
            }
        }
    }
	return out;
}

/**
 * Input array of points and draw onto specified canvas
 * @param {array} ar array of points
 * @param {boolean} dot whether to use dots or not
 * @param {Canvas} canv canvas object to draw onto
 * @returns null
 */
function draw(ar, dot=false,canv){
	if (ar.length==0) {
		return;
	}
	let ctx = canv.getContext("2d");
	let prevx = ar[0].x;
	let prevy = ar[0].y;
	for (let i = 0; i < ar.length; i++) {
		var x = ar[i].x;
		var y = ar[i].y;
		ctx.beginPath();
        if (dot){
            ctx.arc(x/4, y/4, 1, 0, 2 * Math.PI);
        }
        else{
            ctx.moveTo(prevx/4,prevy/4);
            ctx.lineTo(x/4, y/4);
        }
		ctx.stroke();
		prevx = x;
		prevy = y;
	}
}


/**
 * Check if an array contains the provided object
 * @param {object} obj object to check in array
 * @param {array} list array to be searched
 * @returns index of object, or false
 */
function containsObject(obj, list) {
    var i;
    var obx = obj.x;
    var oby = obj.y;
    for (i = 0; i < list.length; i++) {
        if ((list[i].x == obx) && (list[i].y == oby)) {
            return i;
        }
    }
    return false;
}


/**
 * Convert array to x and y coordinates and output to provided array
 * @param {Array} data 2D array of coordinates
 * @returns array of points
 */
function arrToXY (data){
	var out = [];
	if(data[0][0] == undefined || data[0][1] == undefined){throw("Invalid Array for Conversion");}
	for (let i = 0; i < data.length; i++) {
		let pos = {x:data[i][0],y:data[i][1]};
		out.push(pos);
	}
	return out;
}

/**
 * Displays loading message depending on paramter
 * @param {number} on 1 or 0
 */
function displayLoadingMsg(on) {
	var loading_el = document.getElementById("loading");
	if (on == 1){loading_el.style.display = "block";}
	else{loading_el.style.display = "none";}
	
}

/**
 * Changes draw method between lines and dots
 * @param {boolean} val 1 or 0
 */
function setDrawMethod(val) {
	let btn = document.getElementById("drawmethod");
	if (val == 1){
		btn.value == 1;
		btn.checked = true;
	}
	else{
		btn.value == 0;
		btn.checked = false;
	}
	
}

/**
 * Hides all settings from Control Panel
 */
function hideAllSettings() {
    const settings = document.getElementsByClassName("settings");
    for (let index = 0; index < settings.length; index++) {
        settings[index].style.display = "none"
    }

	document.getElementById("draw-btn").classList.remove("btn-pressed");
	document.getElementById("file-btn").classList.remove("btn-pressed");
	// document.getElementById("api-btn").classList.remove("btn-pressed");

	canvas.removeEventListener("mousemove", window.mouseMoveHandler);
	canvas.removeEventListener("mousedown", window.mouseDownHandler);
	canvas.removeEventListener("mouseup", window.mouseUpHandler);
	ctx3.clearRect(0,0,300,300);

}

/**
 * Reduces array by skipping over elements. Ensures array size is below 4000
 * @param {array} arr array to be reduced
 * @returns reduced array
 */
function reduce(arr){
	out = [];
	n = Math.ceil(arr.length/4000);
	if (n<1){return arr;}
	for (let i = 0; i < arr.length; i+=n) {
		out.push(arr[i]);
		
	}
	return out;
}
/**
 * Receive, process and start animation for uploaded image
 * @param {event} e 
 */
function receiveImage(e) {
	var reader = new FileReader();
	reader.onload = function(event){
		var img = new Image();
		img.onload = function(){

			displayLoadingMsg(1);		
			ctx.drawImage(img,0,0,cw,ch);

			var pixels = ctx.getImageData(0, 0, cw, ch).data;

			
			var imgdata = CannyJS.canny(canvas);
			
				ctx.clearRect(0,0,canvas.width,canvas.height);
				imgdata.drawOn(canvas);
				const newdata = ctx.getImageData(0, 0, cw, ch);
				ctx.clearRect(0,0,canvas.width,canvas.height);

				// Convert EdgeDetected ImageData into x and y coordinates
				cannyarray = imgToArray(newdata);

					// OLD PATH CHECKING CODE
					// var svgstr = ImageTracer.imagedataToSVG( newdata, { ltres:0.1, qtres:1} );
					// console.log(svgstr);
					// var sol = solve(cannyarray,0.79);
					// cannyarray = sol.map(i => cannyarray[i]);
					// createPath(cannyarray);
					// Test if cannyarray has valid x,y coordinates
				cannyarray = reduce(cannyarray);
				
				startAnim(cannyarray);
				

			}

		img.src = event.target.result;
		console.log(e.target.files[0]);
		
	}
	reader.readAsDataURL(e.target.files[0]);     
}
// https://gist.github.com/mauriciomassaia
/**
 * Resizes imageData according to provided width and height
 * @param {imageData} imageData 
 * @param {number} width 
 * @param {number} height 
 * @returns Resized imageData
 */
function resizeImageData (imageData, width, height) {
	const resizeWidth = width >> 0
	const resizeHeight = height >> 0
	const ibm = window.createImageBitmap(imageData, 0, 0, imageData.width, imageData.height, {
	  resizeWidth, resizeHeight
	})
	const canvas = document.createElement('canvas')
	canvas.width = resizeWidth
	canvas.height = resizeHeight
	const ctx = canvas.getContext('2d')
	ctx.scale(resizeWidth / imageData.width, resizeHeight / imageData.height)
	ctx.drawImage(ibm, 0, 0)
	return ctx.getImageData(0, 0, resizeWidth, resizeHeight)
  }


// module.exports = {arrToXY, containsObject};

// Testing GPU function

// const gpu = new GPU();


// const gpuComplexAdd = gpu.createKernel(function(a, b){

// }).setOutput(2);


// // dft on gpu --> array of k length, 5 values each
// const gpuGenerate = gpu.createKernel(function(eps,t,n){
// 	var x = 400;
// 	var y = 400;
// 	const array2 = [[0.08,5], [2,1]];
// 	let ep = eps[this.thread.x];

// 	if (this.thread.y == 0) {
// 		x += eps[this.thread.x][3] * Math.cos( eps[this.thread.x][2] * t +  eps[this.thread.x][4]);
// 		return x;
// 	}
// 	else{
// 		y += eps[this.thread.x][3] * Math.sin( eps[this.thread.x][2] * t +  eps[this.thread.x][4]);
// 		return y;
// 	}
// 	// x += ep[3] * Math.cos(ep[2] * this.thread.x * dt + ep[4]);
// 	// y += ep[3] * Math.sin(ep[2] * this.thread.x * dt + ep[4]);
// 	return eps[this.thread.x][0];
// }).setOutput([f_size,2])

