(function(){
    'use strict';

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.body.classList.add('no-anim');

      var fallbackNavToggle = document.getElementById('navToggle');
      var fallbackNavLinks = document.getElementById('navLinks');
      if (fallbackNavToggle && fallbackNavLinks) {
        fallbackNavToggle.addEventListener('click', function(){
          var isOpen = fallbackNavLinks.classList.toggle('is-open');
          fallbackNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          fallbackNavToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        });
        fallbackNavLinks.querySelectorAll('a').forEach(function(link){
          link.addEventListener('click', function(){
            fallbackNavLinks.classList.remove('is-open');
            fallbackNavToggle.setAttribute('aria-expanded', 'false');
            fallbackNavToggle.setAttribute('aria-label', 'Abrir menu');
          });
        });
      }

      var fallbackTabs = document.getElementById('skillsTabs');
      if (fallbackTabs) {
        fallbackTabs.querySelectorAll('.skills__tab').forEach(function(tab){
          tab.addEventListener('click', function(){
            var name = tab.dataset.tab;
            fallbackTabs.dataset.active = name;
            fallbackTabs.querySelectorAll('.skills__tab').forEach(function(item){
              item.classList.toggle('is-active', item === tab);
            });
            document.querySelectorAll('.skills__panel').forEach(function(panel){
              panel.classList.toggle('is-active', panel.dataset.panel === name);
            });
          });
        });
      }
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    /* ---------------- smooth scroll ---------------- */
    var lenis = null;
    if (typeof Lenis !== 'undefined' && !prefersReduced) {
      lenis = new Lenis({
        autoRaf: false,
        lerp: .12,
        smoothWheel: true,
        wheelMultiplier: .85,
        touchMultiplier: 1.1
      });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(1000, 16);
      window.addEventListener('resize', function(){
        if (typeof lenis.resize === 'function') lenis.resize();
        ScrollTrigger.refresh();
      });

      document.querySelectorAll('a[href^="#"]').forEach(function(link){
        link.addEventListener('click', function(e){
          var target = document.querySelector(link.getAttribute('href'));
          if(!target) return;
          e.preventDefault();
          lenis.scrollTo(target, { offset: -60, duration: 1.3 });
          closeMobileMenu();
        });
      });
    }

    /* ---------------- mobile nav ---------------- */
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    var navHighlight = navLinks && navLinks.querySelector('.nav__highlight');
    var navItems = navLinks ? navLinks.querySelectorAll('[data-nav-link]') : [];
    function moveNavHighlight(link){
      if(!navHighlight || !link || window.matchMedia('(max-width: 940px)').matches) return;
      var linksRect = navLinks.getBoundingClientRect();
      var linkRect = link.getBoundingClientRect();
      navHighlight.style.left = (linkRect.left - linksRect.left) + 'px';
      navHighlight.style.width = linkRect.width + 'px';
      navHighlight.style.setProperty('--highlight-x', (linkRect.width / 2) + 'px');
      navHighlight.style.opacity = '1';
    }
    navItems.forEach(function(link){
      link.addEventListener('mouseenter', function(){ moveNavHighlight(link); });
      link.addEventListener('focus', function(){ moveNavHighlight(link); });
    });
    if(navLinks){
      navLinks.addEventListener('pointermove', function(event){
        var rect = navLinks.getBoundingClientRect();
        navLinks.style.setProperty('--glass-x', (event.clientX - rect.left) + 'px');
        navLinks.style.setProperty('--glass-y', (event.clientY - rect.top) + 'px');
      });
      navLinks.addEventListener('mouseleave', function(){
        if(navHighlight) navHighlight.style.opacity = '0';
      });
    }
    function closeMobileMenu(){
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu');
    }
    if(navToggle){
      navToggle.addEventListener('click', function(){
        var open = navLinks.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      });
    }

    /* ---------------- helper: split words for reveal ---------------- */
    function splitWords(el){
      var text = el.textContent;
      var parts = text.split(' ');
      el.innerHTML = parts.map(function(w){ return '<span class="word" style="display:inline-block;overflow:hidden;"><span style="display:inline-block;">'+w+'&nbsp;</span></span>'; }).join('');
      return el.querySelectorAll('.word > span');
    }

    /* ---------------- preloader ---------------- */
    var preloader = document.getElementById('preloader');
    var countEl = document.getElementById('preloader-count');
    var slider = document.getElementById('preloaderSlider');
    var bars = slider ? slider.querySelectorAll('.wake-slider__bar') : [];

    function heroIntro(){
      var tl = gsap.timeline({ defaults:{ ease:'power4.out' } });
      var heroWords = document.querySelectorAll('.hero__title [data-reveal="words"]');
      heroWords.forEach(function(el){ splitWords(el); });
      if (typeof window.playSplitFlap === 'function') window.playSplitFlap();
      tl.fromTo('.hero__title .word > span', { yPercent:110 }, { yPercent:0, duration:1, stagger:.05 })
        .fromTo('.hero__role', { y:16, opacity:0 }, { y:0, opacity:1, duration:.7 }, '-=.5')
        .fromTo('.hero__text-p', { y:16, opacity:0 }, { y:0, opacity:1, duration:.7 }, '-=.5')
        .fromTo('.hero__actions', { y:16, opacity:0 }, { y:0, opacity:1, duration:.7 }, '-=.5')
        .fromTo('.hero__scroll', { opacity:0 }, { opacity:1, duration:.6 }, '-=.4');
      return tl;
    }

    function hidePreloader(){
      var tl = gsap.timeline();
      tl.to('.wake-slider', { opacity:0, y:8, duration:.2 })
        .to('.preloader__label', { opacity:0, duration:.15 }, '<')
        .call(function(){
          preloader.remove();
          ScrollTrigger.refresh();
          if (lenis) lenis.start();
        }, [], '-=.05')
        .add(heroIntro(), '-=.25');
    }

    if (preloader && !prefersReduced) {
      if (lenis) lenis.stop();
      var completed = false;
      var progress = 0;
      var resourcesReady = false;
      var windowLoaded = false;
      var preloaderStartedAt = performance.now();
      var minimumPreloaderTime = 2200;
      var setProgress = function(value){
        progress = Math.max(progress, Math.min(100, Math.round(value)));
        var lit = Math.round((progress / 100) * bars.length);
        bars.forEach(function(bar, index){
          bar.dataset.on = index < lit ? 'true' : 'false';
          bar.style.transform = 'scaleY(' + (index < lit ? '.72' : '.21') + ')';
        });
        slider.setAttribute('aria-valuenow', progress);
        countEl.textContent = progress + '%';
      };
      var finish = function(){
        if (completed || !resourcesReady) return;
        completed = true;
        var remaining = Math.max(0, minimumPreloaderTime - (performance.now() - preloaderStartedAt));
        window.setTimeout(function(){
          gsap.to({ value:progress }, { value:100, duration:.5, ease:'power2.out', onUpdate:function(){ setProgress(this.targets()[0].value); }, onComplete:hidePreloader });
        }, remaining);
      };
      var images = Array.prototype.slice.call(document.images);
      var total = images.length + 1;
      var ready = 0;
      var markReady = function(){
        ready += 1;
        setProgress(Math.min(99, 8 + (ready / total) * 91));
        if (ready >= total && windowLoaded) { resourcesReady = true; finish(); }
      };
      images.forEach(function(image){
        if (image.complete) markReady();
        else { image.addEventListener('load', markReady, { once:true }); image.addEventListener('error', markReady, { once:true }); }
      });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(markReady);
      else markReady();
      window.addEventListener('load', function(){ windowLoaded = true; if (ready >= total) { resourcesReady = true; finish(); } }, { once:true });
      setProgress(4);
    } else if (preloader) {
      preloader.remove();
      document.querySelectorAll('.hero__title [data-reveal="words"]').forEach(function(el){ el.style.opacity = 1; });
    }

    /* ---------------- scroll reveals ---------------- */
    if (!prefersReduced) {
      document.querySelectorAll('[data-reveal]').forEach(function(el){
        if (el.closest('.hero, main')) return; // hero and main text have their own animations
        var type = el.dataset.reveal;
        var trigger = { trigger: el, start:'top 88%', once:true };
        if (type === 'words') {
          var spans = splitWords(el);
          gsap.from(spans, { yPercent:110, duration:.9, stagger:.03, ease:'power4.out', scrollTrigger:trigger });
        } else if (type === 'fade') {
          gsap.from(el, { opacity:0, duration:1.1, ease:'power2.out', scrollTrigger:trigger });
        } else {
          gsap.from(el, { y:40, opacity:0, duration:.9, ease:'power4.out', scrollTrigger:trigger });
        }
      });

      var scrollFloatTargets = document.querySelectorAll(
        'main h2, main h3, main p, main .kicker, main .about__copy .btn, main .projects__toggle-label, main .project-card__tags span, main .project-card__link, main .skills__tab, main .stat strong, main .stat span, main .ability-card__num, main .skill-chips span, main .contact__links a, main .footer-bar a, main .footer-bar p'
      );

      scrollFloatTargets.forEach(function(target){
        if (target.closest('.skills__panel')) return;
        if (target.dataset.scrollFloatReady) return;
        target.dataset.scrollFloatReady = 'true';
        var walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
        var textNodes = [];
        while (walker.nextNode()) {
          if (walker.currentNode.nodeValue.trim()) textNodes.push(walker.currentNode);
        }

        var chars = [];
        textNodes.forEach(function(textNode){
          var run = document.createElement('span');
          run.className = 'scroll-float-run';
          var tokens = textNode.nodeValue.match(/\s+|[^\s]+/g) || [];
          tokens.forEach(function(token){
            if (/^\s+$/.test(token)) {
              run.appendChild(document.createTextNode(token));
              return;
            }

            var word = document.createElement('span');
            word.className = 'scroll-float-word';
            Array.from(token).forEach(function(character){
              var char = document.createElement('span');
              char.className = 'scroll-float-char';
              char.textContent = character;
              word.appendChild(char);
              chars.push(char);
            });
            run.appendChild(word);
          });
          textNode.parentNode.replaceChild(run, textNode);
        });

        if (chars.length) {
          gsap.fromTo(chars,
            {
              willChange:'opacity, transform',
              opacity:0,
              yPercent:120,
              scaleY:2.3,
              scaleX:.7,
              transformOrigin:'50% 0%'
            },
            {
              opacity:1,
              yPercent:0,
              scaleY:1,
              scaleX:1,
              duration:.48,
              stagger:.004,
              ease:'back.inOut(2)',
              scrollTrigger:{
                trigger:target,
                start:'top 94%',
                once:true
              }
            }
          );
        }
      });
    }

    /* ---------------- card swap dos projetos ---------------- */
    function initProjectCardSwap(){
      var root = document.getElementById('projectCardSwap');
      if (!root) return;
      var stage = root.querySelector('.card-swap__stage');
      var cards = Array.prototype.slice.call(root.querySelectorAll('[data-project-card]'));
      var nextButton = root.querySelector('.card-swap__control--next');
      var prevButton = root.querySelector('.card-swap__control--prev');
      var count = root.querySelector('.card-swap__count');
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var order = cards.map(function(_, index){ return index; });
      var timer = 0;
      var dragging = null;
      var dragged = false;

      function render(){
        order.forEach(function(index, position){
          var card = cards[index];
          var visible = position < 4;
          var scale = 1 - position * .055;
          var x = position * 28;
          var y = position * -24;
          card.dataset.cardState = visible ? 'visible' : 'hidden';
          card.style.zIndex = String(cards.length - position);
          card.style.opacity = visible ? String(1 - position * .12) : '0';
          card.style.filter = position ? 'brightness(' + (1 - position * .1) + ')' : 'none';
          card.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) scale(' + scale + ')';
        });
        if (count) count.textContent = String(order[0] + 1).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
      }

      function schedule(){
        clearTimeout(timer);
        if (reduced || document.hidden || root.matches(':hover') || dragging) return;
        timer = window.setTimeout(function(){ shift(1); }, 4800);
      }

      function shift(direction){
        if (cards.length < 2 || dragging) return;
        var front = cards[order[0]];
        front.style.transform = direction > 0 ? 'translate3d(0,120%,0) rotate(5deg)' : 'translate3d(0,-120%,0) rotate(-5deg)';
        front.style.opacity = '0';
        window.setTimeout(function(){
          order = direction > 0
            ? order.slice(1).concat(order[0])
            : [order[order.length - 1]].concat(order.slice(0, -1));
          render();
          schedule();
        }, reduced ? 0 : 420);
      }

      function onDown(event){
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (event.target.closest('button')) return;
        var front = cards[order[0]];
        if (!event.target.closest('[data-project-card]') || event.target.closest('[data-project-card]') !== front) return;
        dragging = { id:event.pointerId, startX:event.clientX, startY:event.clientY, dx:0, dy:0 };
        dragged = false;
        root.classList.add('is-dragging');
        front.style.transition = 'none';
      }

      function onMove(event){
        if (!dragging || dragging.id !== event.pointerId) return;
        event.preventDefault();
        dragging.dx = event.clientX - dragging.startX;
        dragging.dy = event.clientY - dragging.startY;
        if (Math.hypot(dragging.dx, dragging.dy) > 5) dragged = true;
        var front = cards[order[0]];
        front.style.transform = 'translate3d(' + dragging.dx + 'px,' + dragging.dy + 'px,0) rotate(' + (dragging.dx * .025) + 'deg)';
      }

      function onUp(event){
        if (!dragging || (event && typeof event.pointerId === 'number' && dragging.id !== event.pointerId)) return;
        var drag = dragging;
        var front = cards[order[0]];
        dragging = null;
        root.classList.remove('is-dragging');
        front.style.transition = '';
        if (Math.hypot(drag.dx, drag.dy) > 70) shift(drag.dx < 0 || drag.dy < 0 ? 1 : -1);
        else render();
        schedule();
        window.setTimeout(function(){ dragged = false; }, 0);
      }

      root.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
      root.addEventListener('click', function(event){
        if (!dragged) return;
        if (event.target.closest('[data-project-card]')) {
          event.preventDefault();
          event.stopPropagation();
        }
        dragged = false;
      }, true);
      nextButton?.addEventListener('click', function(){ shift(1); });
      prevButton?.addEventListener('click', function(){ shift(-1); });
      root.addEventListener('keydown', function(event){
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') { event.preventDefault(); shift(1); }
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') { event.preventDefault(); shift(-1); }
      });
      document.addEventListener('visibilitychange', schedule);
      root.addEventListener('mouseleave', schedule);
      render();
      schedule();
    }
    initProjectCardSwap();

    /* ---------------- skills tabs ---------------- */
    var tabsWrap = document.getElementById('skillsTabs');
    var tabs = tabsWrap.querySelectorAll('.skills__tab');
    var tabBg = tabsWrap.querySelector('.skills__tab-bg');
    var panels = document.querySelectorAll('.skills__panel');
    var initialTab = tabsWrap.dataset.active || tabs[0].dataset.tab;
    tabs.forEach(function(tab){
      tab.classList.toggle('is-active', tab.dataset.tab === initialTab);
    });
    panels.forEach(function(panel){
      panel.classList.toggle('is-active', panel.dataset.panel === initialTab);
    });
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        var name = tab.dataset.tab;
        tabsWrap.dataset.active = name;
        tabs.forEach(function(t){ t.classList.toggle('is-active', t === tab); });
        tabBg.style.transform = name === 'habilidades' ? 'translateX(100%)' : 'translateX(0)';
        panels.forEach(function(p){
          var show = p.dataset.panel === name;
          if (show) {
            p.classList.add('is-active');
            gsap.fromTo(p, { opacity:0, y:10 }, { opacity:1, y:0, duration:.4, ease:'power2.out' });
          } else {
            p.classList.remove('is-active');
          }
        });
      });
    });

  })();
