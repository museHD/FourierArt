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
    obx = obj.x;
    oby = obj.y;
    for (i = 0; i < list.length; i++) {
        if ((list[i][0] == obj.x) && (list[i][1] == obj.y)) {
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

    
}


function receiveImage(e) {
	var reader = new FileReader();
	reader.onload = function(event){
		var img = new Image();
		img.onload = function(){

			ctx.drawImage(img,0,0,cw,ch);
			var imgdata = CannyJS.canny(canvas);
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