/* ==========================================================================
   Thompson Medical Logistics — main.js
   Vanilla JS: nav, scroll reveal, counters, FAQ, tracking demo, forms.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      var iconOpen = menuBtn.querySelector('.icon-open');
      var iconClose = menuBtn.querySelector('.icon-close');
      if (iconOpen && iconClose) {
        iconOpen.classList.toggle('hidden', isOpen);
        iconClose.classList.toggle('hidden', !isOpen);
      }
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el, i) {
      el.style.setProperty('--i', i % 8);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-counter]');
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var counterIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* ---------- Live tracking demo (hero + technology section) ---------- */
  var trackers = document.querySelectorAll('[data-tracker]');
  trackers.forEach(function (tracker) {
    var steps = tracker.querySelectorAll('[data-tracker-step]');
    var label = tracker.querySelector('[data-tracker-label]');
    var labels = ['Order received', 'Courier en route to pickup', 'Specimen in transit', 'Arriving at destination', 'Delivered — signed'];
    if (!steps.length) return;
    var idx = 0;
    function activate(i) {
      steps.forEach(function (s, si) {
        s.classList.toggle('is-active', si <= i);
        s.classList.toggle('is-current', si === i);
      });
      if (label) label.textContent = labels[i] || labels[labels.length - 1];
    }
    activate(0);
    setInterval(function () {
      idx = (idx + 1) % steps.length;
      activate(idx);
    }, 2200);
  });

  /* ---------- FAQ: only allow reasonable multi-open (native <details>) ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        item.querySelector('.faq-answer') && item.querySelector('.faq-answer').setAttribute('data-open', 'true');
      }
    });
  });

  /* FAQ search filter (Services/FAQ pages) */
  var faqSearch = document.getElementById('faq-search');
  if (faqSearch) {
    faqSearch.addEventListener('input', function () {
      var q = faqSearch.value.trim().toLowerCase();
      document.querySelectorAll('[data-faq-wrap] .faq-item').forEach(function (item) {
        var text = item.textContent.toLowerCase();
        item.style.display = text.indexOf(q) !== -1 ? '' : 'none';
      });
    });
  }

  /* ---------- Service area tab filter ---------- */
  var countyButtons = document.querySelectorAll('[data-county-filter]');
  if (countyButtons.length) {
    countyButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var county = btn.getAttribute('data-county-filter');
        countyButtons.forEach(function (b) {
          b.classList.remove('btn-navy');
          b.classList.add('btn-ghost');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('btn-navy');
        btn.classList.remove('btn-ghost');
        btn.setAttribute('aria-pressed', 'true');
        document.querySelectorAll('[data-county-card]').forEach(function (card) {
          var show = county === 'all' || card.getAttribute('data-county-card') === county;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Generic form validation + fake-submit success state ---------- */
  function validateField(field) {
    var errorEl = field.parentElement.querySelector('.field-error-msg');
    var valid = field.checkValidity();
    field.classList.toggle('field-error', !valid);
    if (errorEl) errorEl.classList.toggle('show', !valid);
    return valid;
  }

  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    var fields = form.querySelectorAll('input[required], textarea[required], select[required], input[type=email]');
    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });
      if (!allValid) {
        var firstInvalid = form.querySelector('.field-error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      var successEl = form.parentElement.querySelector('[data-form-success]');
      form.classList.add('hidden');
      if (successEl) {
        successEl.classList.remove('hidden');
        successEl.setAttribute('tabindex', '-1');
        successEl.focus();
      }
    });
  });

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById('to-top');
  if (toTop) {
    document.addEventListener('scroll', function () {
      toTop.classList.toggle('opacity-0', window.scrollY < 500);
      toTop.classList.toggle('pointer-events-none', window.scrollY < 500);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
