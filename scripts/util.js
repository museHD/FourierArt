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
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
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
