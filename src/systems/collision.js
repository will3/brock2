var Collision = function() {
  //grouped by collision group
  this.bodyMap = {};
};

Collision.prototype = {
  constructor: Collision,
  addBody: function(body) {
    if (!body.group) {
      return;
    }
    var group = this.bodyMap[body.group];
    if (group === undefined) {
      group = this.bodyMap[body.group] = {};
    }
    group[body.id] = body;
  },

  removeBody: function(body) {
    var group = this.bodyMap[body.group];
    if (group === undefined) {
      return;
    }
    delete group[body.id];
  },

  tick: function() {
    // -> n * n / 2
    //subdivide regions
    //only test neighbouring regions
    // -> n ???
    var resolved = {};
    for (var key in this.bodyMap) {
      var group = this.bodyMap[key];
      for (var id in group) {
        var body = group[id];
        for (var i = 0; i < body.mask.length; i++) {
          var key2 = body.mask[i];
          var group2 = this.bodyMap[key2];
          if (group2 === undefined) {
            continue;
          }
          for (var id2 in group2) {
            var body2 = group2[id2];
            if (body === body2) {
              continue;
            }

            if ((resolved[body2.id] || []).indexOf(body.group) !== -1) {
              continue;
            }

            var result = this.hitTest(body, body2);

            if (!result) {
              continue;
            }

            body._onCollision(body2, result);
            body2._onCollision(body, result);
          }
        }
        resolved[body.id] = [body.mask];
      }
    }
  },

  hitTest: function(a, b) {
    var minDis = a.radius + b.radius;
    if (isNaN(minDis)) {
      return false;
    }

    var distance = a.object.position
      .distanceTo(b.object.position);
    if (distance > minDis) {
      return false;
    }

    //collision
    return {
      distance: distance
    };
  }
};

module.exports = Collision;