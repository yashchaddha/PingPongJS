// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/index.js":[function(require,module,exports) {
var ball = document.getElementById('ball');
var rod1 = document.getElementById('rod1');
var rod2 = document.getElementById('rod2');
var storeName = "PPName";
var storeScore = "PPMaxScore";
var rod1Name = "Rod 1";
var rod2Name = "Rod 2";
var score,
  maxScore,
  movement,
  rod,
  ballSpeedX = 2,
  ballSpeedY = 2;
var gameOn = false;
var windowWidth = window.innerWidth,
  windowHeight = window.innerHeight;
(function () {
  rod = localStorage.getItem(storeName);
  maxScore = localStorage.getItem(storeScore);
  if (rod === "null" || maxScore === "null") {
    alert("This is the first time you are playing this game. LET'S START");
    maxScore = 0;
    rod = "Rod1";
  } else {
    alert(rod + " has maximum score of " + maxScore * 100);
  }
  resetBoard(rod);
})();
function resetBoard(rodName) {
  rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
  rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + 'px';
  ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';

  // Lossing player gets the ball
  if (rodName === rod2Name) {
    ball.style.top = rod1.offsetTop + rod1.offsetHeight + 'px';
    ballSpeedY = 2;
  } else if (rodName === rod1Name) {
    ball.style.top = rod2.offsetTop - rod2.offsetHeight + 'px';
    ballSpeedY = -2;
  }
  score = 0;
  gameOn = false;
}
function storeWin(rod, score) {
  if (score > maxScore) {
    maxScore = score;
    localStorage.setItem(storeName, rod);
    localStorage.setItem(storeScore, maxScore);
  }
  clearInterval(movement);
  resetBoard(rod);
  alert(rod + " wins with a score of " + score * 100 + ". Max score is: " + maxScore * 100);
}
window.addEventListener('keypress', function () {
  var rodSpeed = 20;
  var rodRect = rod1.getBoundingClientRect();
  if (event.code === "KeyD" && rodRect.x + rodRect.width < window.innerWidth) {
    rod1.style.left = rodRect.x + rodSpeed + 'px';
    rod2.style.left = rod1.style.left;
  } else if (event.code === "KeyA" && rodRect.x > 0) {
    rod1.style.left = rodRect.x - rodSpeed + 'px';
    rod2.style.left = rod1.style.left;
  }
  if (event.code === "Enter") {
    if (!gameOn) {
      gameOn = true;
      var ballRect = ball.getBoundingClientRect();
      var ballX = ballRect.x;
      var ballY = ballRect.y;
      var ballDia = ballRect.width;
      var rod1Height = rod1.offsetHeight;
      var rod2Height = rod2.offsetHeight;
      var rod1Width = rod1.offsetWidth;
      var rod2Width = rod2.offsetWidth;
      movement = setInterval(function () {
        // Move ball 
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        rod1X = rod1.getBoundingClientRect().x;
        rod2X = rod2.getBoundingClientRect().x;
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
        if (ballX + ballDia > windowWidth || ballX < 0) {
          ballSpeedX = -ballSpeedX; // Reverses the direction
        }

        // It specifies the center of the ball on the viewport
        var ballPos = ballX + ballDia / 2;

        // Check for Rod 1
        if (ballY <= rod1Height) {
          ballSpeedY = -ballSpeedY; // Reverses the direction
          score++;

          // Check if the game ends
          if (ballPos < rod1X || ballPos > rod1X + rod1Width) {
            storeWin(rod2Name, score);
          }
        }

        // Check for Rod 2
        else if (ballY + ballDia >= windowHeight - rod2Height) {
          ballSpeedY = -ballSpeedY; // Reverses the direction
          score++;

          // Check if the game ends
          if (ballPos < rod2X || ballPos > rod2X + rod2Width) {
            storeWin(rod1Name, score);
          }
        }
      }, 10);
    }
  }
});
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44583" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map