(function(){
  'use strict';
  var boards = document.querySelectorAll('.split-flap-text');
  var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var shuffleLoop = 0;

  function randomChar(){ return charset[Math.floor(Math.random() * charset.length)]; }
  function setFinalText(board, text){
    board.querySelectorAll('.split-flap-text__char').forEach(function(char, index){
      char.textContent = text[index] === ' ' ? '\u00a0' : text[index];
    });
  }
  function animateBoard(board, text){
    var tiles = board.querySelectorAll('.split-flap-text__tile');
    text.split('').forEach(function(character, index){
      var tile = tiles[index];
      if (!tile) return;
      var char = tile.querySelector('.split-flap-text__char');
      var step = 0;
      function flip(){
        if (step < 7) {
          char.textContent = randomChar();
          char.classList.remove('is-flipping');
          void char.offsetWidth;
          char.classList.add('is-flipping');
          step += 1;
          window.setTimeout(flip, 80 + index * 18);
        } else char.textContent = character === ' ' ? '\u00a0' : character;
      }
      window.setTimeout(flip, index * 32);
    });
  }

  boards.forEach(function(board){
    var text = board.getAttribute('aria-label') || board.textContent.trim();
    board.dataset.splitFlapText = text;
    board.innerHTML = '';
    text.split('').forEach(function(character){
      var tile = document.createElement('span');
      var char = document.createElement('span');
      tile.className = 'split-flap-text__tile';
      char.className = 'split-flap-text__char';
      char.textContent = randomChar();
      tile.appendChild(char);
      board.appendChild(tile);
    });
    if (reducedMotion || typeof window.gsap === 'undefined') setFinalText(board, text);
  });

  window.playSplitFlap = function(){
    if (reducedMotion) return;
    boards.forEach(function(board){ animateBoard(board, board.dataset.splitFlapText); });
    if (!shuffleLoop) {
      shuffleLoop = window.setInterval(function(){
        boards.forEach(function(board){ animateBoard(board, board.dataset.splitFlapText); });
      }, 5000);
    }
  };
})();
