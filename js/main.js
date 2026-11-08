// Theme toggle, navigation, contact options, tagline typing and scroll reveals.
// The page works without JS (dark is the default and all content is visible).
(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Theme toggle ----
  var themeBtn = document.querySelector('.theme-toggle');
  function isDark() { return root.getAttribute('data-theme') === 'dark'; }
  function syncTheme() {
    if (themeBtn) themeBtn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark() ? '#121417' : '#fbfbfc');
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      if (next === 'dark') root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncTheme();
    });
  }
  syncTheme();

  // ---- Mobile menu + dropdown ----
  var burger = document.querySelector('.nav-burger');
  var links = document.getElementById('nav-links');
  var dropdown = document.querySelector('.dropdown');
  var ddToggle = document.querySelector('.dropdown-toggle');

  function closeMenu() {
    if (!links) return;
    links.classList.remove('open');
    if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); }
  }
  function closeDropdown() {
    if (dropdown) { dropdown.classList.remove('open'); ddToggle.setAttribute('aria-expanded', 'false'); }
  }
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeMenu(); closeDropdown(); }
    });
  }
  if (ddToggle) {
    ddToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dropdown.classList.toggle('open');
      ddToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) { if (!dropdown.contains(e.target)) closeDropdown(); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); closeDropdown(); } });

  // ---- Contact: Gmail / email-app drafts and copy-to-clipboard ----
  var EMAIL = 'naveennavy219@gmail.com';
  function gmailUrl(subject, body) {
    return 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(EMAIL) +
      (subject ? '&su=' + encodeURIComponent(subject) : '') + (body ? '&body=' + encodeURIComponent(body) : '');
  }
  function mailtoUrl(subject, body) {
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      function done() {
        btn.textContent = 'Copied';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy my email:', text); });
      } else {
        window.prompt('Copy my email:', text);
      }
    });
  });

  var form = document.querySelector('.contact-form');
  if (form) {
    var err = form.querySelector('.form-error');
    var via = 'gmail';
    form.querySelectorAll('button[type="submit"]').forEach(function (b) {
      b.addEventListener('click', function () { via = b.getAttribute('data-via') || 'gmail'; });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (e.submitter && e.submitter.getAttribute('data-via')) via = e.submitter.getAttribute('data-via');
      var f = form.elements;
      var name = f.name.value.trim(), email = f.email.value.trim();
      var subject = f.subject.value.trim(), msg = f.message.value.trim();
      var bad = [];
      form.querySelectorAll('.form-row').forEach(function (r) { r.classList.remove('invalid'); });
      if (!name) bad.push(f.name);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad.push(f.email);
      if (!msg) bad.push(f.message);
      if (bad.length) {
        bad.forEach(function (el) { el.parentNode.classList.add('invalid'); });
        err.textContent = 'Please fill in your name, a valid email and a message.';
        err.hidden = false;
        bad[0].focus();
        return;
      }
      err.hidden = true;
      var subj = subject || ('Hello from ' + name + ' (via your portfolio)');
      var body = msg + '\n\n' + name + '\n' + email;
      if (via === 'gmail') {
        var w = window.open(gmailUrl(subj, body), '_blank');
        if (w) { try { w.opener = null; } catch (x) {} }
        else window.location.href = gmailUrl(subj, body);
      } else {
        window.location.href = mailtoUrl(subj, body);
      }
    });
  }

  // ---- Active nav link ----
  if ('IntersectionObserver' in window) {
    var navLinks = {};
    document.querySelectorAll('.nav-links > a[href^="#"]').forEach(function (a) { navLinks[a.getAttribute('href').slice(1)] = a; });
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        if (['publications', 'certifications', 'education', 'achievements'].indexOf(id) > -1) id = '';
        Object.keys(navLinks).forEach(function (k) { navLinks[k].classList.toggle('active', k === id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { secObs.observe(s); });
  }

  if (reduceMotion) return;

  // ---- Type out the tagline under the name ----
  var typed = document.querySelector('.tagline .typed');
  if (typed) {
    var text = typed.textContent;
    typed.textContent = '';
    var i = 0;
    setTimeout(function step() {
      typed.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(step, 40 + Math.random() * 50);
    }, 900);
  }

  // ---- Reveal content as it scrolls into view ----
  if (!('IntersectionObserver' in window)) return;
  root.classList.add('js');
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      obs.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });

  // Stagger cards that sit side by side
  ['.ach-grid', '.skill-grid', '.cert-grid', '.contact-info'].forEach(function (sel) {
    document.querySelectorAll(sel + ' > .reveal').forEach(function (el, n) {
      el.style.transitionDelay = (n % 3) * 90 + 'ms';
    });
  });
})();
