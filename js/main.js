/* =====================================================================
   Seagö — Homepage v1 — interaction layer
   ===================================================================== */
(function(){
  "use strict";

  /* ---------- staggered reveal-on-scroll (with no-JS / failsafe fallback) ---------- */
  var groups = document.querySelectorAll('[data-stagger]');
  groups.forEach(function(group){
    var items = group.querySelectorAll('.reveal');
    items.forEach(function(el, i){ el.style.setProperty('--d', (i * 90) + 'ms'); });
  });

  var els = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.add('in'); });
  }
  // failsafe: guarantee every section is visible even if the observer misses one
  setTimeout(function(){ els.forEach(function(el){ el.classList.add('in'); }); }, 2500);

  /* ---------- scroll progress bar + nav shadow ---------- */
  var bar = document.getElementById('progressBar');
  var nav = document.querySelector('header.nav');
  window.addEventListener('scroll', function(){
    var h = document.documentElement;
    var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if(bar) bar.style.width = pct + '%';
    if(nav) nav.style.boxShadow = h.scrollTop > 12 ? '0 8px 24px -12px rgba(0,0,0,.5)' : 'none';
  }, { passive:true });

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if(burger && menu){
    burger.addEventListener('click', function(){
      burger.classList.toggle('open');
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ burger.classList.remove('open'); menu.classList.remove('open'); });
    });
  }

  /* ---------- count-up stats ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var counted = false;
  function runCount(){
    if(counted) return; counted = true;
    counters.forEach(function(el){
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1300, t0 = null;
      function step(ts){
        if(!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if(p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var statsWrap = document.querySelector('.hero-stats');
  if(statsWrap){
    if('IntersectionObserver' in window){
      var statsIo = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ runCount(); statsIo.disconnect(); } });
      }, { threshold: 0.4 });
      statsIo.observe(statsWrap);
    } else { runCount(); }
  }

  /* ---------- desktop-only motion: magnetic buttons, hero parallax, cursor glow, card tilt ---------- */
  if(window.matchMedia('(hover:hover)').matches){

    document.querySelectorAll('.magnetic').forEach(function(btn){
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.18) + 'px,' + (y * 0.35) + 'px)';
      });
      btn.addEventListener('mouseleave', function(){ btn.style.transform = 'translate(0,0)'; });
    });

    var hero = document.querySelector('.hero');
    var glow = document.querySelector('.cursor-glow');
    if(hero){
      hero.addEventListener('mousemove', function(e){
        var r = hero.getBoundingClientRect();
        var mx = (e.clientX - r.left) / r.width - 0.5, my = (e.clientY - r.top) / r.height - 0.5;
        document.querySelectorAll('[data-depth]').forEach(function(el){
          var d = parseFloat(el.getAttribute('data-depth'));
          el.style.transform = 'translate(' + (mx * d) + 'px,' + (my * d) + 'px)';
        });
        if(glow){ glow.style.left = (e.clientX - r.left) + 'px'; glow.style.top = (e.clientY - r.top) + 'px'; }
      });
    }

    document.querySelectorAll('.tilt').forEach(function(wrap){
      var card = wrap.querySelector('.card, .case-card');
      if(!card) return;
      wrap.addEventListener('mousemove', function(e){
        var r = wrap.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'translateY(-6px) rotateX(' + (py * -6) + 'deg) rotateY(' + (px * 8) + 'deg)';
      });
      wrap.addEventListener('mouseleave', function(){ card.style.transform = 'translateY(0) rotateX(0) rotateY(0)'; });
    });
  }
})();
