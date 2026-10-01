/* Saint Michael Web Services Limited — site interactions */
(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sticky header state + back to top ---------- */
  var header = document.getElementById('siteHeader');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 480);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('visible'); }, Math.min(i, 5) * 90);
        observer.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach(function (el) { observer.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      panel.style.maxHeight = isOpen ? panel.scrollHeight + 'px' : '0px';
    });
  });

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('contactForm');

  if (form) {
    var status = document.getElementById('formStatus');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setInvalid(field, invalid) {
      field.closest('.field').classList.toggle('invalid', invalid);
    }

    function validate(field) {
      var value = field.value.trim();
      var ok = value.length > 0;
      if (ok && field.type === 'email') ok = emailPattern.test(value);
      if (ok && field.name === 'message') ok = value.length >= 10;
      setInvalid(field, !ok);
      return ok;
    }

    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('blur', function () { validate(field); });
      field.addEventListener('input', function () {
        if (field.closest('.field').classList.contains('invalid')) validate(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll('[required]').forEach(function (field) {
        if (!validate(field)) valid = false;
      });

      if (!valid) {
        var firstBad = form.querySelector('.field.invalid input, .field.invalid textarea, .field.invalid select');
        if (firstBad) firstBad.focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      function finish(message, failed) {
        btn.disabled = false;
        btn.textContent = original;
        if (!status) return;
        status.textContent = message;
        status.classList.toggle('error', Boolean(failed));
        status.classList.add('show');
      }

      // FormSubmit mirrors the form's action under /ajax/, where it answers with JSON
      // instead of redirecting away from the page. A cached copy of the page from
      // before this form had an action would otherwise strand the visitor on
      // "Sending…", so bail out with the fallback contact details instead.
      var action = form.getAttribute('action') || '';

      if (action.indexOf('https://formsubmit.co/') !== 0) {
        finish('Sorry — the enquiry form is temporarily unavailable. Please email us directly at duarte@saintmichaelwebservices.com or call +44 7561 622086.', true);
        return;
      }

      var endpoint = action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');

      var payload = {};
      new FormData(form).forEach(function (value, key) { payload[key] = value; });

      // Makes "Reply" in the notification email answer the enquirer directly.
      if (payload.email) payload._replyto = payload.email;

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () { return null; });
        })
        .then(function (data) {
          // FormSubmit replies 200 even when it rejects a submission, so the only
          // trustworthy signal that the enquiry was accepted is `success`.
          if (data && String(data.success) === 'true') {
            form.reset();
            finish('Thank you — your enquiry has been received. We will be in touch soon.', false);
          } else {
            finish('Sorry — we could not send your enquiry just now. Please email us directly at duarte@saintmichaelwebservices.com or call +44 7561 622086.', true);
          }
        })
        .catch(function () {
          // Network-level failure: keep what the visitor typed so they can retry.
          finish('Sorry — your enquiry could not be sent. Please check your connection and try again, or email us directly at duarte@saintmichaelwebservices.com.', true);
        });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
