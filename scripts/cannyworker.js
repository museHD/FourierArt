importScripts("canny-min.js");
var window;
onmessage = function(e){
    const imgdata = CannyJS.canny(e.data[0]);
    this.postMessage(imgdata);
}