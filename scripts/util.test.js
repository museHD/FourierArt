// const { default: test } = require('node:test');
// const { describe } = require('yargs');
const util = require('./util');

var xyPoints_50 = [{"x":451,"y":581},{"x":489,"y":438},{"x":125,"y":630},{"x":151,"y":320},{"x":592,"y":214},{"x":179,"y":462},{"x":745,"y":214},{"x":1,"y":461},{"x":760,"y":364},{"x":272,"y":127},{"x":230,"y":542},{"x":182,"y":759},{"x":795,"y":56},{"x":795,"y":788},{"x":509,"y":337},{"x":275,"y":115},{"x":375,"y":758},{"x":661,"y":465},{"x":708,"y":297},{"x":523,"y":270},{"x":279,"y":355},{"x":321,"y":11},{"x":291,"y":402},{"x":798,"y":416},{"x":332,"y":182},{"x":687,"y":230},{"x":482,"y":61},{"x":683,"y":707},{"x":778,"y":585},{"x":511,"y":23},{"x":46,"y":386},{"x":596,"y":748},{"x":424,"y":274},{"x":103,"y":219},{"x":709,"y":192},{"x":502,"y":344},{"x":373,"y":128},{"x":654,"y":505},{"x":446,"y":455},{"x":269,"y":569},{"x":686,"y":788},{"x":780,"y":578},{"x":561,"y":658},{"x":526,"y":48},{"x":581,"y":606},{"x":407,"y":739},{"x":103,"y":198},{"x":320,"y":272},{"x":470,"y":456},{"x":793,"y":57}]
var pointsArray_50 = [[773,383],[216,251],[519,568],[219,143],[629,435],[292,403],[167,232],[514,331],[581,199],[393,706],[672,592],[646,39],[303,327],[702,437],[420,468],[213,297],[115,198],[130,520],[141,155],[259,592],[791,316],[792,387],[747,460],[660,691],[38,270],[485,610],[81,44],[465,612],[208,520],[451,314],[537,270],[381,734],[557,454],[599,24],[405,317],[579,600],[254,563],[99,603],[179,694],[484,586],[240,523],[677,5],[672,542],[150,382],[585,576],[225,163],[259,396],[452,74],[218,271],[75,713]]

describe('arrToXY: Converts 2D array into array of objects with x and y components', () =>{
    test("given 2D array of length 3, returns array of 3 points", () => {
        let testin = [[0,0],[456,76],[154,680]];
        expect(util.arrToXY(testin)).toEqual([{x:0,y:0},{x:456,y:76},{x:154,y:680}]);
    });
    test("given empty array, throws error", () => {
        expect(() => {util.arrToXY([]);}).toThrow();
    });
    test("given single-dimensional array, throws error", () => {
        expect(() => {util.arrToXY([0,0,456,76,154,680]);}).toThrow();
    });

});


describe('containsObject: Check if array contains a certain object', () =>{
    test("given array of 50 points and object from array, returns index of object in array", () => {
        expect(util.containsObject({"x":151,"y":320}, xyPoints_50)).toBe(3);
    });
    test("given array of 50 points and object not in the array, returns false", () => {
        expect(util.containsObject({"x":972,"y":320}, xyPoints_50)).toBeFalsy();
    });
    test("given array of 50 points and empty object, returns false", () => {
        expect(util.containsObject({}, xyPoints_50)).toBeFalsy();
    });
    test("given empty array and an object, returns false", () => {
        expect(util.containsObject({"x":151,"y":320},[])).toBeFalsy();
    });

});
