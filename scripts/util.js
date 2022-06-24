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
                cannyarray.push({x:cords[0],y:cords[1]});
            }
            else{
                // console.log(cords)
            }
        }
        // if (val != 0){cannyarray.push({x});}
    }
    // cannyarray = [...new Set(out)];
}


// Input array of coordinates and draw on canvas
function draw(ar, dot=false){
	let prevx = ar[0].x;
	let prevy = ar[0].y;
	for (let i = 0; i < ar.length; i++) {
		var x = ar[i].x;
		var y = ar[i].y;
		ctx.beginPath();
        if (dot){
            ctx.arc(x, y, 1, 0, 2 * Math.PI);
        }
        else{
            ctx.moveTo(prevx,prevy);
            ctx.lineTo(x, y);
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
function arrToXY (data,out){
	for (let i = 0; i < data.length; i++) {
		let pos = {x:data[i][0],y:data[i][1]};
		out.push(pos);
	}
}


function hideAllSettings() {
    const settings = document.getElementsByClassName("settings");
    for (let index = 0; index < settings.length; index++) {
        settings[index].style.display = "none"
    }

	canvas.removeEventListener("mousemove", window.mouseMoveHandler);
	canvas.removeEventListener("mousedown", window.mouseDownHandler);
	canvas.removeEventListener("mouseup", window.mouseUpHandler);

}


function receiveImage(e) {
	var reader = new FileReader();
	reader.onload = function(event){
		var img = new Image();
		img.onload = function(){

			ctx.drawImage(img,0,0,cw,ch);
			var imgdata = CannyJS.canny(canvas);
			ctx.clearRect(0,0,canvas.width,canvas.height);
			imgdata.drawOn(canvas);
			const newdata = ctx.getImageData(0, 0, cw, ch);
			console.log(imgdata)
			ctx.clearRect(0,0,canvas.width,canvas.height);

			// Convert EdgeDetected ImageData into x and y coordinates
			imgToArray(newdata);
			// var svgstr = ImageTracer.imagedataToSVG( newdata, { ltres:0.1, qtres:1} );
			// console.log(svgstr);
			// var sol = solve(cannyarray,0.79);
			// cannyarray = sol.map(i => cannyarray[i]);
			// createPath(cannyarray);
			// Test if cannyarray has valid x,y coordinates
			startAnim(cannyarray);
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
}


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

