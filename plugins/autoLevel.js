/*
* AutoLevel - Plugin for automatic leveling of darkest and ligthest pixel in CamanJs.
* Knut Schade 2011 - knut@solitud.de
*
* Takes mode as optional argument.
* 'rgb': autoLevels every channel, might change tonality of the image (default)
* 'avg': calculates average levels, more subtile, tonality is untouched.
*
* Usage: 
* Caman("path/to/image.jpg", "#canvas-id", function () {
* 	this.autoLevel({mode: 'rgb'}).render();
* });
*
*/
if (!Caman && typeof exports == "object") {
	var Caman = {manip:{}};
	exports.plugins = Caman.manip;
}

(function (Caman) {
	Caman.plugin.autoLevel = function (options) {
		var pixelBrightnessAvg;

		var level = {
			max : {r : 0, g : 0, b: 0, avg : 0},
			min : {r : 255, g : 255, b: 255, avg : 255},
			scalar : {r : 1, g : 1, b: 1, avg : 1}
		};

		var pixels = this.pixel_data;
		var config = {
			mode : 'rgb' //'avg'
		}
		$.extend(config, options);		

		if(config.mode == 'rgb') { //RGB Mode
			for (var i = 0; i < pixels.length; i += 4) {
				if(pixels[i] > level.max.r) {
					level.max.r = pixels[i];
				}
				if(pixels[i+1] > level.max.g) {
					level.max.g = pixels[i+1];
				}
				if(pixels[i+2] > level.max.b) {
					level.max.b = pixels[i+2];
				}
				if(pixels[i] < level.min.r) {
					level.min.r = pixels[i];
				}
				if(pixels[i+1] < level.min.g) {
					level.min.g = pixels[i+1];
				}
				if(pixels[i+2] < level.min.b) {
					level.min.b = pixels[i+2];
				}
			}

			level.scalar.r = 255 / (level.max.r - level.min.r);
			level.scalar.g = 255 / (level.max.g - level.min.g);
			level.scalar.b = 255 / (level.max.b - level.min.b);
			
			return this.process( level,  function autoLevelPerChannel(level, rgba) {
				rgba.r = (rgba.r - level.min.r) * level.scalar.r;
				rgba.g = (rgba.g - level.min.g) * level.scalar.g;
				rgba.b = (rgba.b - level.min.b) * level.scalar.b;

				return rgba;
			});
		} else { //AVG Mode
			for (var i = 0; i < pixels.length; i += 4) {
				pixelBrightnessAvg = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
				if(pixelBrightnessAvg > level.max.avg) {
					level.max.avg = pixelBrightnessAvg;
				}
				if(pixelBrightnessAvg < level.min.avg) {
					level.min.avg = pixelBrightnessAvg;
				}
			}
			
			level.scalar.avg = 255 / (level.max.avg - level.min.avg);
			
			return this.process( level,  function autoLevelAverage(level, rgba) {
				rgba.r = (rgba.r - level.min.avg) * level.scalar.avg;
				rgba.g = (rgba.g - level.min.avg) * level.scalar.avg;
				rgba.b = (rgba.b - level.min.avg) * level.scalar.avg;

				return rgba;
			});
		}
	};

	Caman.manip.autoLevel = function (options) {
		return this.processPlugin("autoLevel", [options]);
	};
}(Caman));