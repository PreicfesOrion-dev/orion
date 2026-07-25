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

    var inscribeBtn = document.getElementById('navInscribeBtn');
    var enrollOverlay = document.getElementById('enrollOverlay');
    var enrollClose = document.getElementById('enrollClose');
    var enrollForm = document.getElementById('enrollForm');
    var enrollSuccess = document.getElementById('enrollSuccess');
    var enrollSuccessMsg = document.getElementById('enrollSuccessMsg');
    var enrollSuccessClose = document.getElementById('enrollSuccessClose');
    var enrollCohortSelect = document.getElementById('enrollCohortSelect');

    if (inscribeBtn && enrollOverlay && enrollForm) {
      var populateCohorts = function () {
        enrollCohortSelect.innerHTML = '';
        document.querySelectorAll('.program-option').forEach(function (program) {
          var includes = program.querySelector('.program-includes');
          if (!includes || includes.classList.contains('program-includes--soon')) return;
          var name = program.querySelector('.program-name');
          var meta = program.querySelector('.program-meta');
          if (!name) return;
          var option = document.createElement('option');
          option.value = name.textContent.trim();
          option.textContent = meta ? (name.textContent.trim() + ' — ' + meta.textContent.trim()) : name.textContent.trim();
          enrollCohortSelect.appendChild(option);
        });
      };

      var openModal = function () {
        populateCohorts();
        enrollForm.hidden = false;
        enrollSuccess.hidden = true;
        enrollOverlay.hidden = false;
        document.body.style.overflow = 'hidden';
        var firstField = enrollForm.querySelector('input');
        if (firstField) firstField.focus();
      };

      var closeModal = function () {
        enrollOverlay.hidden = true;
        document.body.style.overflow = '';
      };

      inscribeBtn.addEventListener('click', openModal);
      enrollClose.addEventListener('click', closeModal);
      enrollSuccessClose.addEventListener('click', closeModal);
      enrollOverlay.addEventListener('click', function (e) {
        if (e.target === enrollOverlay) closeModal();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !enrollOverlay.hidden) closeModal();
      });

      enrollForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!enrollForm.reportValidity()) return;
        var data = new FormData(enrollForm);
        var nombre = data.get('nombre');
        var telefono = data.get('telefono');
        enrollSuccessMsg.textContent = 'Gracias, ' + nombre + '. Uno de nuestros asesores te ayudará en la decisión al número ' + telefono + '.';
        enrollForm.hidden = true;
        enrollSuccess.hidden = false;
        enrollForm.reset();
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
