// Convert image into path of points
// Convert edges to [x,y]
const divmod = (x, y) => [(x % y)/4, Math.floor(x / y)];
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
                // console.log(cords)
            }
        }
        // if (val != 0){cannyarray.push({x});}
    }
	return out;
    // cannyarray = [...new Set(out)];
}


// Input array of coordinates and draw on canvas
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


// Check if array contains provided object 
function containsObject(obj, list) {
    var i;
    var obx = obj.x;
    var oby = obj.y;
    for (i = 0; i < list.length; i++) {
		// console.log(list[i].x, obj);
        if ((list[i].x == obx) && (list[i].y == oby)) {
			// console.log(list[i][0]);
            return i;
        }
    }

    return false;
}

// Convert array to x and y coordinates and output to provided array
function arrToXY (data){
	var out = [];
	if(data[0][0] == undefined || data[0][1] == undefined){throw("Invalid Array for Conversion");}
	for (let i = 0; i < data.length; i++) {
		let pos = {x:data[i][0],y:data[i][1]};
		out.push(pos);
	}
	return out;
}

function displayLoadingMsg(on) {
	var loading_el = document.getElementById("loading");
	if (on == 1){loading_el.style.display = "block";}
	else{loading_el.style.display = "none";}
	
}

function hideAllSettings() {
    const settings = document.getElementsByClassName("settings");
    for (let index = 0; index < settings.length; index++) {
        settings[index].style.display = "none"
    }

	document.getElementById("draw-btn").classList.remove("btn-pressed");
	document.getElementById("file-btn").classList.remove("btn-pressed");
	document.getElementById("api-btn").classList.remove("btn-pressed");

	canvas.removeEventListener("mousemove", window.mouseMoveHandler);
	canvas.removeEventListener("mousedown", window.mouseDownHandler);
	canvas.removeEventListener("mouseup", window.mouseUpHandler);
	ctx3.clearRect(0,0,300,300);

}

function reduce(arr){
	out = [];
	n = Math.ceil(arr.length/4000);
	if (n<1){return arr;}
	for (let i = 0; i < arr.length; i+=n) {
		out.push(arr[i]);
		
	}
	return out;
}

function receiveImage(e) {
	var reader = new FileReader();
	reader.onload = function(event){
		var img = new Image();
		img.onload = function(){

			displayLoadingMsg(1);
			const cannyworker = new Worker('./scripts/canny/dist/worker.js')
			cannyworker.postMessage({
				cmd: 'appData',
				data: {
					width: ch,
					height: cw,
					// ut: 0.9,
					// lt: 0.85
				} 
			});
			
			ctx.drawImage(img,0,0,cw,ch);

			var pixels = ctx.getImageData(0, 0, cw, ch).data;

			// cannyworker.postMessage({
			// 	cmd: 'imgData',
			// 	data: pixels
			//   });
			// ctx.clearRect(0,0,canvas.width,canvas.height);
			
			// OLD EDGE DETECTION CODE
			// canvas_obj = JSON.parse(JSON.stringify(canvas));
			
			var imgdata = CannyJS.canny(canvas);
			// cannyworker.onmessage = function(e){
				// console.log(e.data.data);
				// var messagearray = new Uint8ClampedArray(e.data.data)
				// var imgdata = new ImageData(messagearray, cw, ch);
				// ctx.putImageData(imgdata,0,0);
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
				
				// }
			}
			// console.log(imgdata);
		img.src = event.target.result;
		console.log(e.target.files[0]);
		
	}
	reader.readAsDataURL(e.target.files[0]);     
}
// https://gist.github.com/mauriciomassaia
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

const gpu = new GPU();


const gpuComplexAdd = gpu.createKernel(function(a, b){

}).setOutput(2);


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

// Obsolete path solving function 

// /**
//  * @private
//  */
//  function Path(points) {
//     this.points = points;
//     this.order = new Array(points.length);
//     for(var i=0; i<points.length; i++) this.order[i] = i;
//     this.distances = new Array(points.length * points.length);
//     for(var i=0; i<points.length; i++)
//       for(var j=0; j<points.length; j++)
//         this.distances[j + i*points.length] = distance(points[i], points[j]);
//   }
//   Path.prototype.change = function(temp) {
//     var i = this.randomPos(), j = this.randomPos();
//     var delta = this.delta_distance(i, j);
//     if (delta < 0 || Math.random() < Math.exp(-delta / temp)) {
//       this.swap(i,j);
//     }
//   };
//   Path.prototype.size = function() {
//     var s = 0;
//     for (var i=0; i<this.points.length; i++) {
//       s += this.distance(i, ((i+1)%this.points.length));
//     }
//     return s;
//   };
//   Path.prototype.swap = function(i,j) {
//     var tmp = this.order[i];
//     this.order[i] = this.order[j];
//     this.order[j] = tmp;
//   };
//   Path.prototype.delta_distance = function(i, j) {
//     var jm1 = this.index(j-1),
//         jp1 = this.index(j+1),
//         im1 = this.index(i-1),
//         ip1 = this.index(i+1);
//     var s = 
//         this.distance(jm1, i  )
//       + this.distance(i  , jp1)
//       + this.distance(im1, j  )
//       + this.distance(j  , ip1)
//       - this.distance(im1, i  )
//       - this.distance(i  , ip1)
//       - this.distance(jm1, j  )
//       - this.distance(j  , jp1);
//     if (jm1 === i || jp1 === i)
//       s += 2*this.distance(i,j); 
//     return s;
//   };
//   Path.prototype.index = function(i) {
//     return (i + this.points.length) % this.points.length;
//   };
//   Path.prototype.access = function(i) {
//     return this.points[this.order[this.index(i)]];
//   };
//   Path.prototype.distance = function(i, j) {
//     return this.distances[this.order[i] * this.points.length + this.order[j]];
//   };
//   // Random index between 1 and the last position in the array of points
//   Path.prototype.randomPos = function() {
//     return 1 + Math.floor(Math.random() * (this.points.length - 1));
//   };
  
//   /**
//    * Solves the following problem:
//    *  Given a list of points and the distances between each pair of points,
//    *  what is the shortest possible route that visits each point exactly
//    *  once and returns to the origin point?
//    *
//    * @param {Point[]} points The points that the path will have to visit.
//    * @param {Number} [temp_coeff=0.999] changes the convergence speed of the algorithm: the closer to 1, the slower the algorithm and the better the solutions.
//    * @param {Function} [callback=] An optional callback to be called after each iteration.
//    *
//    * @returns {Number[]} An array of indexes in the original array. Indicates in which order the different points are visited.
//    *
//    * @example
//    * var points = [
//    *       new salesman.Point(2,3)
//    *       //other points
//    *     ];
//    * var solution = salesman.solve(points);
//    * var ordered_points = solution.map(i => points[i]);
//    * // ordered_points now contains the points, in the order they ought to be visited.
//    **/
//   function solve(points, temp_coeff, callback) {
//     var path = new Path(points);
//     if (points.length < 2) return path.order; // There is nothing to optimize
//     if (!temp_coeff)
//       temp_coeff = 1 - Math.exp(-10 - Math.min(points.length,1e6)/1e5);
//     var has_callback = typeof(callback) === "function";
  
//     for (var temperature = 100 * distance(path.access(0), path.access(1));
//              temperature > 1e-6;
//              temperature *= temp_coeff) {
//       path.change(temperature);
//       if (has_callback) callback(path.order);
//     }
//     return path.order;
//   };
  
//   /**
//    * Represents a point in two dimensions.
//    * @class
//    * @param {Number} x abscissa
//    * @param {Number} y ordinate
//    */
//   function Point(x, y) {
//     this.x = x;
//     this.y = y;
//   };
  
//   function distance(p, q) {
//     var dx = p.x - q.x, dy = p.y - q.y;
//     return Math.sqrt(dx*dx + dy*dy);
//   }

