// data
var running;
var canvas;
var playpausebtn;
var ctx;
var raf;
var logpane;
var world = {};
var ball = {};
var LOGGING;

// utilities
function el( id ) {
  return document.getElementById( id );
}

// logging
function d( msg ) {
  if( LOGGING ) {
    logpane.value += '[' + msg + ']' + '\n';
    logpane.scrollTop = logpane.scrollHeight;
  }
}

function clearlogs() {
  document.getElementById( 'logpane' ).value = '';
}

// drawing
function draw() {
  clear();
  ball.draw();
  if( !running ) return;
  world.iter = ( world.iter + 1 ) % 360;
  d( 'i: ' + world.iter + ', ( ' + ball.x + ', ' + ball.y + ' )' );

  if( world.iter == 0 ) {
    world.xfield = -world.xfield;
    world.yfield = -world.yfield;
  }

  // field simulation
  ball.vy += world.yfield;
  ball.vx += world.xfield;

  // apply velocity limits
  if( ball.vy > world.vylim || ball.vy < -world.vylim ) {
    world.yfield = 0;
    ball.vy = 1;
  }
  if( ball.vx > world.vxlim || ball.vx < -world.vxlim ) {
    world.xfield = 0;
    ball.vx = 4;
  }

  // boundary reflections 95% efficiency for ground
  if( ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0 ) {
    ball.vx = -world.xwalleff * ball.vx;
  }
  if( ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0 ) {
    ball.vy = -world.ywalleff * ball.vy;
  }

  // position recompute
  ball.x += ball.vx;
  ball.y += ball.vy;

  raf = window.requestAnimationFrame( draw );
}

function clear() {
  ctx.clearRect( 0, 0, canvas.width, canvas.height );
  // ctx.fillStyle = 'rgba( 255, 255, 255, 0.3 )';
  // ctx.fillRect( 0, 0, canvas.width, canvas.height );
}

// UI handlers
function gametoggle() {
  d( 'play/pause' );
  if( running ) {
    window.cancelAnimationFrame( raf );
    running = false;
  } else {
    raf = window.requestAnimationFrame( draw );
    running = true;
  }
}

function updateyfield() {
  world.yfield = el( 'yfield' ).value;
}

function updatexfield() {
  world.xfield = el( 'xfield' ).value;
}

function updatecolor() {
  ball.color = el( 'bcolor' ).value;
}

//
function init() {
  // initialization
  LOGGING = true;
  running = true;
  canvas = document.getElementById( 'canvas' );
  playpausebtn = document.getElementById( 'playpause' );
  ctx = canvas.getContext( '2d' );
  logpane = document.getElementById( 'logpane' );
  
  world = {
    grav: 0.5,
    iter: 0,
    xfield: 0.1,
    yfield: 0.4,
    vylim: 70,
    vxlim: 50,
    xwalleff: 0.9,
    ywalleff: 0.9
  };

  ball = {
    x: 100,
    y: 100,
    vx: 4,
    vy: 1,
    radius: 15,
    color: 'green',
    draw: function() {
      ctx.beginPath();
      ctx.arc( this.x, this.y, this.radius, 0, Math.PI*2, true );
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  };
  
  // drawing
  ball.draw();
  raf = window.requestAnimationFrame( draw );
}
