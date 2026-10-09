/* Sección Halloween independiente. Personaliza los textos de los arrays. */
(() => {
  'use strict';
  const root = document.querySelector('#halloween');
  if (!root) return;
  const $ = (selector) => root.querySelector(selector);
  const trickTexts = [
    'BUUU 👻 Has sido condenada a un abrazo de 47 minutos.',
    'Un fantasma te persigue… porque también quiere besarte.',
    'Maldición: deberás soportar mis bromas hasta el próximo Halloween.',
    'La bruja dice que hoy toca elegir peli de miedo (y esconderse juntos).'
  ];
  const kissTexts = [
    '💋 Premio: 100 besitos. Canjeables en cualquier momento.',
    '🎃 Has ganado una noche de mantita, peli y mimitos.',
    '🦇 El vampiro ha pedido permiso para morderte a besos.',
    '🍭 Caramelo no hay, pero hay un abrazo premium sin caducidad.'
  ];
  const pumpkinTexts = [
    '🎟️ Vale por una cita de Halloween contigo.',
    '🍕 Vale por elegir la cena sin que yo proteste.',
    '💘 Vale por un ataque de besitos sorpresa.'
  ];
  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const show = (selector, value) => { const el = $(selector); if (el) el.textContent = value; };
  function burst() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i = 0; i < 13; i++) {
      const item = document.createElement('span'); item.className = 'halloween-burst';
      item.textContent = random(['💗','🎃','🦇','✨','💋']);
      item.style.left = `${30 + Math.random() * 40}vw`;
      item.style.top = `${35 + Math.random() * 30}vh`;
      item.style.setProperty('--dx', `${Math.round((Math.random()-.5)*260)}px`);
      item.style.setProperty('--dy', `${Math.round((Math.random()-.5)*320)}px`);
      document.body.append(item);
      item.addEventListener('animationend', () => item.remove(), {once:true});
      setTimeout(() => item.remove(), 1800);
    }
  }
  $('#halloween-trick')?.addEventListener('click', () => {show('#halloween-fate',random(trickTexts));burst();});
  $('#halloween-kiss')?.addEventListener('click', () => {show('#halloween-fate',random(kissTexts));burst();});
  const pumpkins = [...root.querySelectorAll('[data-pumpkin]')];
  let prizes = [...pumpkinTexts];
  pumpkins.forEach((btn, index) => btn.addEventListener('click', () => {
    pumpkins.forEach(p => p.classList.remove('chosen'));
    btn.classList.add('chosen');
    show('#halloween-pumpkin-result', prizes[index]); burst();
  }));
  $('#halloween-reset')?.addEventListener('click', () => {
    prizes = [...pumpkinTexts].sort(() => Math.random()-.5);
    pumpkins.forEach(p => p.classList.remove('chosen'));
    show('#halloween-pumpkin-result', 'Calabazas mezcladas. Elige de nuevo ✨');
  });
  $('#halloween-spell')?.addEventListener('click', () => {
    show('#halloween-spell-result', '✨ HECHIZO COMPLETADO: te quiero en esta vida, en la siguiente y hasta siendo dos gatitos vampiros. 🦇💗');burst();
  });
})();
