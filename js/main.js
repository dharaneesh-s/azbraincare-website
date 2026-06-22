document.addEventListener('DOMContentLoaded', function () {

  var header = document.querySelector('.header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  var toggle = document.querySelector('.mobile-toggle');
  var navLinks = document.querySelector('.nav-links');

  toggle.addEventListener('click', function () {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  var sections = document.querySelectorAll('section[id]');
  var navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY + 100;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(function (item) {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + id) {
            item.classList.add('active');
          }
        });
      }
    });
  });

  // Accordion for services
  document.querySelectorAll('.service-header').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.service-item');
      var isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.service-item').forEach(function (el) {
        el.classList.remove('open');
        el.querySelector('.service-header').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Open first service by default
  var firstService = document.querySelector('.service-item');
  if (firstService) {
    firstService.classList.add('open');
    firstService.querySelector('.service-header').setAttribute('aria-expanded', 'true');
  }

  // Tabs
  document.querySelectorAll('.cn-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.cn-tab').forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.cn-tab-panel').forEach(function (p) {
        p.classList.remove('active');
        p.hidden = true;
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      panel.classList.add('active');
      panel.hidden = false;
    });
  });

  // Scroll-reveal
  var fadeElements = document.querySelectorAll('.fade-in');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });

});
