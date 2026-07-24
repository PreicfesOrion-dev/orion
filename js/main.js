(function () {
    var nav = document.getElementById('siteNav');
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');

    window.addEventListener('scroll', function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 4);
    }, { passive: true });

    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var teamGrid = document.getElementById('teamGrid');
    var teamToggle = document.getElementById('teamToggle');
    if (teamGrid && teamToggle) {
      teamToggle.addEventListener('click', function () {
        var expanded = teamGrid.classList.toggle('is-expanded');
        teamToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        teamToggle.textContent = expanded ? 'Ver menos' : 'Ver todo el equipo (16)';
      });
    }

    var items = document.querySelectorAll('.fade');
    if ('IntersectionObserver' in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('is-visible'); });
    }
  })();
