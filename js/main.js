document.addEventListener('DOMContentLoaded', function () {

  var header = document.querySelector('.header');
  var lastScrollY = 0;

  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 30);
    lastScrollY = scrollY;
  });

  // Mobile menu toggle with animation
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

  // ScrollSpy with IntersectionObserver
  var sections = document.querySelectorAll('section[id]');
  var navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navItems.forEach(function (item) {
          item.classList.toggle('active', item.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (section) {
    spyObserver.observe(section);
  });

  // Accordion — uses CSS grid-template-rows for smooth animation
  document.querySelectorAll('.service-header').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.service-item');
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.service-item').forEach(function (el) {
        el.classList.remove('open');
        el.querySelector('.service-header').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  var firstService = document.querySelector('.service-item');
  if (firstService) {
    firstService.classList.add('open');
    firstService.querySelector('.service-header').setAttribute('aria-expanded', 'true');
  }

  // Tabs with crossfade
  document.querySelectorAll('.cn-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var currentPanel = document.querySelector('.cn-tab-panel.active');
      var nextPanel = document.getElementById(tab.getAttribute('aria-controls'));

      if (currentPanel === nextPanel) return;

      document.querySelectorAll('.cn-tab').forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      if (currentPanel) currentPanel.classList.remove('active');
      nextPanel.classList.add('active');
    });
  });

  // Scroll-reveal with stagger support
  var fadeElements = document.querySelectorAll('.fade-in');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  fadeElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // Stagger containers: observe children individually
  document.querySelectorAll('.stagger').forEach(function (container) {
    var children = container.children;
    for (var i = 0; i < children.length; i++) {
      if (!children[i].classList.contains('fade-in')) {
        children[i].classList.add('fade-in');
      }
      revealObserver.observe(children[i]);
    }
  });

});
