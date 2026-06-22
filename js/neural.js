(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var signals = [];
  var w, h;
  var mouse = { x: null, y: null, radius: 160 };
  var isMobile = window.innerWidth < 768;
  var count = isMobile ? 50 : 100;
  var maxDist = isMobile ? 110 : 150;
  var signalTimer = 0;
  var signalInterval = isMobile ? 90 : 50;

  function resize() {
    w = canvas.width = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 1.2,
      o: Math.random() * 0.35 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      burst: 0
    };
  }

  function init() {
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function fireSignal() {
    var pairs = [];
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist * 0.85) {
          pairs.push([i, j, d]);
        }
      }
    }
    if (pairs.length === 0) return;

    var chain = [];
    var start = pairs[Math.floor(Math.random() * pairs.length)];
    var current = Math.random() < 0.5 ? start[0] : start[1];
    chain.push(current);

    for (var step = 0; step < 4; step++) {
      var neighbors = [];
      for (var k = 0; k < pairs.length; k++) {
        if (pairs[k][0] === current && chain.indexOf(pairs[k][1]) === -1) {
          neighbors.push(pairs[k][1]);
        } else if (pairs[k][1] === current && chain.indexOf(pairs[k][0]) === -1) {
          neighbors.push(pairs[k][0]);
        }
      }
      if (neighbors.length === 0) break;
      current = neighbors[Math.floor(Math.random() * neighbors.length)];
      chain.push(current);
    }

    if (chain.length < 2) return;

    for (var s = 0; s < chain.length - 1; s++) {
      signals.push({
        from: chain[s],
        to: chain[s + 1],
        progress: 0,
        delay: s * 12,
        speed: 0.035 + Math.random() * 0.015,
        alive: true
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    signalTimer++;
    if (signalTimer >= signalInterval) {
      fireSignal();
      signalTimer = 0;
    }

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.pulse += 0.01;
      p.x += p.vx;
      p.y += p.vy;
      if (p.burst > 0) p.burst *= 0.92;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      if (mouse.x !== null) {
        var mdx = p.x - mouse.x;
        var mdy = p.y - mouse.y;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          var force = (mouse.radius - mdist) / mouse.radius * 0.02;
          p.vx += mdx / mdist * force;
          p.vy += mdy / mdist * force;
        }
      }

      var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.7) {
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
          var opacity = (1 - d / maxDist) * 0.12;
          ctx.strokeStyle = 'rgba(42,157,143,' + opacity + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    for (var s = signals.length - 1; s >= 0; s--) {
      var sig = signals[s];
      if (sig.delay > 0) {
        sig.delay--;
        continue;
      }
      sig.progress += sig.speed;
      if (sig.progress >= 1) {
        particles[sig.to].burst = 1;
        sig.alive = false;
      }

      if (sig.alive) {
        var a = particles[sig.from];
        var b = particles[sig.to];
        var sx = a.x + (b.x - a.x) * sig.progress;
        var sy = a.y + (b.y - a.y) * sig.progress;

        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(42,157,143,0.9)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sx, sy, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(42,157,143,0.15)';
        ctx.fill();

        var lineProgress = Math.max(0, sig.progress - 0.3);
        if (lineProgress > 0) {
          var trailX = a.x + (b.x - a.x) * lineProgress;
          var trailY = a.y + (b.y - a.y) * lineProgress;
          ctx.strokeStyle = 'rgba(42,157,143,0.35)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(trailX, trailY);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }
      }

      if (!sig.alive) {
        signals.splice(s, 1);
      }
    }

    for (var k = 0; k < particles.length; k++) {
      var pt = particles[k];
      var glow = Math.sin(pt.pulse) * 0.12 + 0.88;
      var alpha = pt.o * glow;
      var burstExtra = pt.burst * 8;

      if (pt.burst > 0.1) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r + 6 + burstExtra, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(42,157,143,' + (pt.burst * 0.2) + ')';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r + 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(42,157,143,' + (alpha * 0.15) + ')';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      var grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.r);
      grad.addColorStop(0, 'rgba(255,255,255,' + (alpha + pt.burst * 0.5) + ')');
      grad.addColorStop(1, 'rgba(42,157,143,' + (alpha * 0.6) + ')');
      ctx.fillStyle = grad;
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
    count = isMobile ? 50 : 100;
    maxDist = isMobile ? 110 : 150;
    signalInterval = isMobile ? 90 : 50;
    init();
    signals = [];
  });

  resize();
  init();
  animate();
})();
