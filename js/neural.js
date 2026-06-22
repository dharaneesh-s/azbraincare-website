(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var w, h;
  var mouse = { x: null, y: null, radius: 150 };
  var isMobile = window.innerWidth < 768;
  var count = isMobile ? 45 : 90;
  var maxDist = isMobile ? 100 : 140;
  var raf;

  function resize() {
    var hero = canvas.parentElement;
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.8,
      o: Math.random() * 0.4 + 0.15,
      pulse: Math.random() * Math.PI * 2
    };
  }

  function init() {
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.pulse += 0.008;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      if (mouse.x !== null) {
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          var force = (mouse.radius - dist) / mouse.radius * 0.015;
          p.vx += dx / dist * force;
          p.vy += dy / dist * force;
        }
      }

      var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.8) {
        p.vx *= 0.98;
        p.vy *= 0.98;
      }

      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var ddx = p.x - q.x;
        var ddy = p.y - q.y;
        var d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < maxDist) {
          var opacity = (1 - d / maxDist) * 0.18;
          ctx.strokeStyle = 'rgba(42,157,143,' + opacity + ')';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    for (var k = 0; k < particles.length; k++) {
      var pt = particles[k];
      var glow = Math.sin(pt.pulse) * 0.15 + 0.85;
      var alpha = pt.o * glow;

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(42,157,143,' + (alpha * 0.2) + ')';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(224,245,240,' + alpha + ')';
      ctx.fill();
    }

    raf = requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', function () {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', function () {
    resize();
    isMobile = window.innerWidth < 768;
    count = isMobile ? 45 : 90;
    maxDist = isMobile ? 100 : 140;
    init();
  });

  resize();
  init();
  animate();
})();
