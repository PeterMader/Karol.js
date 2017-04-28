(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

window.Karol = {
  Robot: require('./lib/robot.js'),
  World: require('./lib/world.js'),
  WorldTile: require('./lib/world-tile.js'),
  Error: require('./lib/error.js')
};

},{"./lib/error.js":2,"./lib/robot.js":3,"./lib/world-tile.js":4,"./lib/world.js":5}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Error = module.exports = function () {
  function _class(message, position, stack) {
    _classCallCheck(this, _class);

    this.message = message;
    this.position = position || {
      line: 0,
      column: 0
    };
    this.stack = stack || [];
  }

  _createClass(_class, [{
    key: 'toString',
    value: function toString() {
      return 'Error: ' + this.message;
    }
  }]);

  return _class;
}();

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Error = require('./error.js');

var Robot = module.exports = function () {
  function _class(world, x, y) {
    _classCallCheck(this, _class);

    this.world = world;
    world.addRobot(this);
    this.x = x || 0;
    this.z = y || 0;
    this.direction = Robot.SOUTH;
  }

  _createClass(_class, [{
    key: 'step',
    value: function step(steps) {
      var max = typeof steps === 'number' && steps >= 0 ? steps : 1;
      var i = void 0;
      for (i = 0; i < max; i += 1) {
        var position = this.getPositionBefore();
        if (this.world.isOutOfBounds(position.x, position.z)) {
          throw new Error('Cannot step outside of world.');
        } else {
          this.x = position.x;
          this.z = position.z;
        }
      }
    }
  }, {
    key: 'getPosition',
    value: function getPosition() {
      return {
        x: this.x,
        z: this.z
      };
    }
  }, {
    key: 'getPositionBefore',
    value: function getPositionBefore() {
      if (this.direction === Robot.NORTH) {
        return {
          x: this.x,
          z: this.z - 1
        };
      } else if (this.direction === Robot.EAST) {
        return {
          x: this.x + 1,
          z: this.z
        };
      } else if (this.direction === Robot.SOUTH) {
        return {
          x: this.x,
          z: this.z + 1
        };
      } else if (this.direction === Robot.WEST) {
        return {
          x: this.x - 1,
          z: this.z
        };
      }
    }
  }, {
    key: 'turnLeft',
    value: function turnLeft() {
      if (this.direction === Robot.NORTH) {
        this.direction = Robot.WEST;
      } else if (this.direction === Robot.EAST) {
        this.direction = Robot.NORTH;
      } else if (this.direction === Robot.SOUTH) {
        this.direction = Robot.EAST;
      } else if (this.direction === Robot.WEST) {
        this.direction = Robot.SOUTH;
      }
    }
  }, {
    key: 'turnRight',
    value: function turnRight() {
      if (this.direction === Robot.NORTH) {
        this.direction = Robot.EAST;
      } else if (this.direction === Robot.EAST) {
        this.direction = Robot.SOUTH;
      } else if (this.direction === Robot.SOUTH) {
        this.direction = Robot.WEST;
      } else if (this.direction === Robot.WEST) {
        this.direction = Robot.NORTH;
      }
    }
  }, {
    key: 'layDown',
    value: function layDown(amount) {
      var position = this.getPositionBefore();
      var tile = this.world.getTileAt(position.x, position.z);
      if (!tile) {
        throw new Error('Cannot lay down a block outside of world.');
      }
      tile.blocks += typeof amount === 'number' && amount > 0 ? amount : 1;
      if (tile.blocks > this.world.height) {
        throw new Error('Reached maximum height of world.');
        tile.blocks = this.world.height;
      }
    }
  }, {
    key: 'pickUp',
    value: function pickUp(amount) {
      var position = this.getPositionBefore();
      var tile = this.world.getTileAt(position.x, position.z);
      if (!tile) {
        throw new Error('Cannot pick up a block outside of world.');
      }
      tile.blocks -= typeof amount === 'number' && amount > 0 ? amount : 1;
      if (tile.blocks < 0) {
        throw new Error('No more blocks to pick up.');
        tile.blocks = 0;
      }
    }
  }, {
    key: 'setMark',
    value: function setMark() {
      var position = this.getPosition();
      this.world.getTileAt(position.x, position.z).hasMark = true;
    }
  }, {
    key: 'deleteMark',
    value: function deleteMark() {
      var position = this.getPosition();
      this.world.getTileAt(position.x, position.z).hasMark = false;
    }
  }]);

  return _class;
}();

Robot.NORTH = Symbol('North');
Robot.EAST = Symbol('East');
Robot.SOUTH = Symbol('South');
Robot.WEST = Symbol('West');

},{"./error.js":2}],4:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WorldTile = module.exports = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.blocks = 0;
    this.hasMark = false;
    this.hasBarrier = false;
  }

  return _class;
}();

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Robot = require('./robot.js');
var WorldTile = require('./world-tile.js');

var World = module.exports = function () {
  function _class(canvas, width, depth, height) {
    _classCallCheck(this, _class);

    this.ctx = canvas.getContext('2d');
    this.width = typeof width === 'number' && width > 0 ? width : 10;
    this.depth = typeof depth === 'number' && depth > 0 ? depth : 10;
    this.height = typeof height === 'number' && height > 0 ? height : 10;
    this.data = [];
    this.robots = [];
    this.reset();
  }

  _createClass(_class, [{
    key: 'addRobot',
    value: function addRobot(robot) {
      this.robots.push(robot);
    }
  }, {
    key: 'isOutOfBounds',
    value: function isOutOfBounds(x, z) {
      return x < 0 || z < 0 || x >= this.width || z >= this.depth;
    }
  }, {
    key: 'getTileAt',
    value: function getTileAt(x, z) {
      return this.data[x][z] || null;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.data = [];
      var x = void 0,
          z = void 0;
      for (x = 0; x < this.width; x += 1) {
        this.data[x] = [];
        for (z = 0; z < this.depth; z += 1) {
          this.data[x][z] = new WorldTile();
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var ctx = this.ctx,
          robots = this.robots;
      var _ctx$canvas = ctx.canvas,
          width = _ctx$canvas.width,
          height = _ctx$canvas.height;

      // clear the canvas from the previous image

      ctx.clearRect(0, 0, width, height);

      // render the world
      var tileWidth = width / this.width;
      var tileHeight = height / this.depth;
      var x = void 0,
          z = void 0;
      for (x = 0; x < this.width; x += 1) {
        for (z = 0; z < this.depth; z += 1) {
          var tile = this.getTileAt(x, z);
          ctx.fillStyle = tile.hasMark ? 'yellow' : 'red';
          ctx.fillRect(x * tileWidth, z * tileHeight, tileWidth - 2, tileHeight - 2);
          ctx.fillStyle = 'white';
          ctx.fillText(tile.blocks.toString(), x * tileWidth + 10, z * tileHeight + 25);
        }
      }

      // render the robots
      var index = void 0;
      for (index in robots) {
        var robot = robots[index];
        ctx.fillStyle = 'blue';
        var tipX = void 0,
            tipY = void 0,
            base1X = void 0,
            base1Y = void 0,
            base2X = void 0,
            base2Y = void 0;
        if (robot.direction === Robot.NORTH) {
          tipX = robot.x * tileWidth + tileWidth / 2;
          tipY = robot.z * tileHeight + 4;
          base1X = robot.x * tileWidth + 4;
          base1Y = (robot.z + 1) * tileHeight - 4;
          base2X = (robot.x + 1) * tileWidth - 4;
          base2Y = base1Y;
        } else if (robot.direction === Robot.EAST) {
          tipX = (robot.x + 1) * tileWidth - 4;
          tipY = robot.z * tileHeight + tileHeight / 2;
          base1X = robot.x * tileWidth + 4;
          base1Y = robot.z * tileHeight + 4;
          base2X = base1X;
          base2Y = (robot.z + 1) * tileHeight - 4;
        } else if (robot.direction === Robot.SOUTH) {
          tipX = robot.x * tileWidth + tileWidth / 2;
          tipY = (robot.z + 1) * tileHeight - 4;
          base1X = robot.x * tileWidth + 4;
          base1Y = robot.z * tileHeight + 4;
          base2X = (robot.x + 1) * tileWidth - 4;
          base2Y = base1Y;
        } else if (robot.direction === Robot.WEST) {
          tipX = robot.x * tileWidth + 4;
          tipY = robot.z * tileHeight + tileHeight / 2;
          base1X = (robot.x + 1) * tileWidth - 4;
          base1Y = robot.z * tileHeight + 4;
          base2X = base1X;
          base2Y = (robot.z + 1) * tileHeight - 4;
        }
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(base1X, base1Y);
        ctx.lineTo(base2X, base2Y);
        ctx.closePath();
        ctx.fill();
      }
    }
  }, {
    key: 'createImage',
    value: function createImage(openDialog, imageType) {
      var dataURL = this.ctx.canvas.toDataURL(imageType || 'image/png');
      return dataURL;
    }
  }]);

  return _class;
}();

},{"./robot.js":3,"./world-tile.js":4}]},{},[1]);
