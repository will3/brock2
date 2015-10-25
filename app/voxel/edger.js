module.exports = function(ndarray) {
  var shape = ndarray.shape;

  var w = shape[0];
  var h = shape[1];
  var d = shape[2];

  var edges = {
    x: {},
    y: {},
    z: {}
  };

  var addEdge = function(a, b, map) {
    //existing origin
    // var o = map[a];
    // if (!!o) {
    //   map[b] = o;
    //   //remove last
    //   map[a] = null;
    //   return;
    // }

    //store in reverse order
    map[b] = a;
  }

  var getId = function(i, j, k) {
    return [i, j, k].join(',');
  };

  var getCoord = function(id) {
    return id.split(',').map(function(num) {
      return parseInt(num);
    });
  };

  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      for (var k = 0; k < d; k++) {

        var b = ndarray.get(i, j, k);
        if (b === 0) {
          continue;
        }

        var left = i === 0 ? false : ndarray.get(i - 1, j, k) === 1;
        var right = i === (w - 1) ? false : ndarray.get(i + 1, j, k) === 1;
        var bottom = j === 0 ? false : ndarray.get(i, j - 1, k) === 1;
        var top = j === (h - 1) ? false : ndarray.get(i, j + 1, k) === 1;
        var back = k === 0 ? false : ndarray.get(i, j, k - 1) === 1;
        var front = k === (d - 1) ? false : ndarray.get(i, j, k + 1) === 1;

        // console.log(left, right, bottom, top, back, front);
        // left = right = bottom = top = 
        back = front = false;

        //x edges
        if (!bottom && !back) {
          addEdge(getId(i, j, k), getId(i + 1, j, k), edges.x);
        }

        if (!bottom && !front) {
          addEdge(getId(i, j, k + 1), getId(i + 1, j, k + 1), edges.x);
        }

        if (!top && !back) {
          addEdge(getId(i, j + 1, k), getId(i + 1, j + 1, k), edges.x);
        }

        if (!top && !front) {
          addEdge(getId(i, j + 1, k + 1), getId(i + 1, j + 1, k + 1), edges.x);
        }

        //y edges
        if (!left && !back) {
          addEdge(getId(i, j, k), getId(i, j + 1, k), edges.y);
        }

        if (!left && !front) {
          addEdge(getId(i, j, k + 1), getId(i, j + 1, k + 1), edges.y);
        }

        if (!right && !back) {
          addEdge(getId(i + 1, j, k), getId(i + 1, j + 1, k), edges.y);
        }

        if (!right && !front) {
          addEdge(getId(i + 1, j, k + 1), getId(i + 1, j + 1, k + 1), edges.y);
        }

        //z edges
        if (!left && !bottom) {
          addEdge(getId(i, j, k), getId(i, j, k + 1), edges.z);
        }

        if (!left && !top) {
          addEdge(getId(i, j + 1, k), getId(i, j + 1, k + 1), edges.z);
        }

        if (!right && !bottom) {
          addEdge(getId(i + 1, j, k), getId(i + 1, j, k + 1), edges.z);
        }

        if (!right && !top) {
          addEdge(getId(i + 1, j + 1, k), getId(i + 1, j + 1, k + 1), edges.z);
        }
      }
    }
  }

  var list = [];
  [edges.x, edges.y, edges.z].forEach(function(edges) {
    for (var a in edges) {
      var b = edges[a];
      if (b !== null) {
        list.push(
          getCoord(a),
          getCoord(b)
        );
      }
    }
  });

  return {
    vertices: list
  };
};