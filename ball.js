function init() {
  var canvas = document.getElementById( 'canvas' );
  var ctx = canvas.getContext( '2d' );
  var raf;

  var world = {
    grav: 0.5,
    iter: 0,
    xfield: 0,
    yfield: 0.5,
    vylim: 70,
    vxlim: 50
  };
  
  var ball = {
    x: 100,
    y: 100,
    vx: 4,
    vy: 1,
    radius: 20,
    color: 'blue',
    draw: function() {
      ctx.beginPath();
      ctx.arc( this.x, this.y, this.radius, 0, Math.PI*2, true );
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  };

  function clear() {
    // ctx.clearRect( 0, 0, canvas.width, canvas.height );
    ctx.fillStyle = 'rgba( 255, 255, 255, 0.3 )';
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
  }
  
  function draw() {
    clear();
    ball.draw();
    world.iter = ( world.iter + 1 ) % 360;

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

    // boundary reflections 95% efficiency
    if( ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0 ) {
      ball.vx = -ball.vx;
    }
    if( ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0 ) {
      ball.vy = -0.95 * ball.vy;
    }

    // position recompute
    ball.x += ball.vx;
    ball.y += ball.vy;

    raf = window.requestAnimationFrame( draw );
  }

  canvas.addEventListener( 'mouseover', function( e ) {
    raf = window.requestAnimationFrame( draw );
  } );

  canvas.addEventListener( 'mouseout', function( e ) {
    window.cancelAnimationFrame( raf );
  } );

  ball.draw();
}
