if (!Caman && typeof exports == "object") {
  var Caman = {manip:{}};
  exports.plugins = Caman.manip;
}

(function (Caman) {

//adjust must be [2...255]
// works best with smaller input values
Caman.manip.posterize = function (adjust) {
  var numOfAreas = 256 / adjust;
  var numOfValues = 255 / (adjust - 1);
  
  return this.process( [numOfAreas, numOfValues], function posterize (adjust, rgba) {
    rgba.r = Math.floor(Math.floor( rgba.r / adjust[0] ) * adjust[1]);
    rgba.g = Math.floor(Math.floor( rgba.g / adjust[0] ) * adjust[1]);
    rgba.b = Math.floor(Math.floor( rgba.b / adjust[0] ) * adjust[1]);

    return rgba;
  });
};

}(Caman));