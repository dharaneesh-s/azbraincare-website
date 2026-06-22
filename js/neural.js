(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var w, h;
  var mouse = { x: null, y: null, radius: 140 };
  var isMobile = window.innerWidth < 768;
  var count = isMobile ? 35 : 70;
  var maxDist = isMobile ? 100 : 130;

  function resize() {
    w = canvas.width = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.8,
      o: Math.random() * 0.3 + 0.1,
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
      p.pulse += 0.006;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      if (mouse.x !== null) {
        var mdx = p.x - mouse.x;
        var mdy = p.y - mouse.y;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          var force = (mouse.radius - mdist) / mouse.radius * 0.01;
          p.vx += mdx / mdist * force;
          p.vy += mdy / mdist * force;
        }
      }

      var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.5) {
        p.vx *= 0.97;
        p.vy *= 0.97;
      }
    }

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          var opacity = (1 - d / maxDist) * 0.1;
          ctx.strokeStyle = 'rgba(42,157,143,' + opacity + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    for (var k = 0; k < particles.length; k++) {
      var pt = particles[k];
      var glow = Math.sin(pt.pulse) * 0.1 + 0.9;
      var alpha = pt.o * glow;

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r + 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(42,157,143,' + (alpha * 0.1) + ')';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(224,245,240,' + alpha + ')';
      ctx.fill();
    }

    requestAnimationFrame(animate);
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
    count = isMobile ? 35 : 70;
    maxDist = isMobile ? 100 : 130;
    init();
  });

  resize();
  init();
  animate();
})();
