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

    var reviewsTrack = document.getElementById('reviewsTrack');
    if (reviewsTrack) {
      var reviewsStorageKey = 'orionReviews';
      var maxReviews = 10;

      var loadReviews = function () {
        try {
          var raw = window.localStorage.getItem(reviewsStorageKey);
          return raw ? JSON.parse(raw) : [];
        } catch (err) {
          return [];
        }
      };

      var saveReviews = function (list) {
        try { window.localStorage.setItem(reviewsStorageKey, JSON.stringify(list)); } catch (err) {}
      };

      var escapeHtml = function (str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      };

      var reviews = loadReviews();

      var renderReviews = function () {
        if (reviews.length === 0) {
          reviewsTrack.style.animation = 'none';
          reviewsTrack.style.width = '100%';
          reviewsTrack.innerHTML = '<p class="reviews-empty">Aún no hay reseñas — ¡sé el primero en compartir tu experiencia!</p>';
          return;
        }
        reviewsTrack.style.animation = '';
        reviewsTrack.style.width = '';
        var html = reviews.map(function (r) {
          return '<blockquote class="review-bubble"><p>“' + escapeHtml(r.comentario) + '”</p><cite class="review-name">' + escapeHtml(r.nombre) + '</cite></blockquote>';
        }).join('');
        reviewsTrack.innerHTML = html + html;
        reviewsTrack.style.animationDuration = Math.max(18, reviews.length * 6) + 's';
      };

      renderReviews();

      var openReviewBtn = document.getElementById('openReviewBtn');
      var reviewOverlay = document.getElementById('reviewOverlay');
      var reviewClose = document.getElementById('reviewClose');
      var reviewForm = document.getElementById('reviewForm');
      var reviewSuccess = document.getElementById('reviewSuccess');
      var reviewSuccessClose = document.getElementById('reviewSuccessClose');

      if (openReviewBtn && reviewOverlay && reviewForm) {
        var openReviewModal = function () {
          reviewForm.hidden = false;
          reviewSuccess.hidden = true;
          reviewOverlay.hidden = false;
          document.body.style.overflow = 'hidden';
          var firstField = reviewForm.querySelector('input');
          if (firstField) firstField.focus();
        };

        var closeReviewModal = function () {
          reviewOverlay.hidden = true;
          document.body.style.overflow = '';
        };

        openReviewBtn.addEventListener('click', openReviewModal);
        reviewClose.addEventListener('click', closeReviewModal);
        reviewSuccessClose.addEventListener('click', closeReviewModal);
        reviewOverlay.addEventListener('click', function (e) {
          if (e.target === reviewOverlay) closeReviewModal();
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && !reviewOverlay.hidden) closeReviewModal();
        });

        reviewForm.addEventListener('submit', function (e) {
          e.preventDefault();
          if (!reviewForm.reportValidity()) return;
          var data = new FormData(reviewForm);
          var nombre = (data.get('nombre') || '').toString().trim();
          var comentario = (data.get('comentario') || '').toString().trim();
          if (!nombre || !comentario) return;
          reviews.push({ nombre: nombre, comentario: comentario });
          if (reviews.length > maxReviews) reviews.shift();
          saveReviews(reviews);
          renderReviews();
          reviewForm.hidden = true;
          reviewSuccess.hidden = false;
          reviewForm.reset();
        });
      }
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
