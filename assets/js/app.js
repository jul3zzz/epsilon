/* =======================================================================
   app.js — ecran de connexion et demarrage de l application
   ======================================================================= */
(function () {
  'use strict';
  var $ = U.$, $$ = U.$$, esc = U.esc;
  var avatarChoisi = 'av-renard';

  /* ---------- Choix de l avatar a l inscription ---------- */
  function remplirAvatars() {
    var zone = $('#signup-avatars');
    var libres = SHOP.byCat('avatar').filter(function (a) { return a.price === 0; });
    zone.innerHTML = libres.map(function (a) {
      return '<button type="button" data-av="' + a.id + '" class="' + (a.id === avatarChoisi ? 'sel' : '') +
        '" title="' + esc(a.name) + '">' + a.val + '</button>';
    }).join('');
    zone.addEventListener('click', function (e) {
      var b = e.target.closest('[data-av]');
      if (!b) return;
      avatarChoisi = b.dataset.av;
      $$('#signup-avatars button').forEach(function (x) { x.classList.toggle('sel', x === b); });
    });
  }

  /* ---------- Comptes deja crees sur cet ordinateur ---------- */
  function remplirComptes() {
    var zone = $('#known-users');
    var noms = Store.pseudos();
    if (!noms.length) { zone.innerHTML = ''; return; }
    zone.innerHTML = '<span style="font-size:12px;color:var(--muted);width:100%;text-align:center">Comptes sur cet ordinateur :</span>' +
      noms.map(function (n) { return '<button type="button" data-user="' + esc(n) + '">' + esc(n) + '</button>'; }).join('');
    zone.onclick = function (e) {
      var b = e.target.closest('[data-user]');
      if (!b) return;
      $('#login-user').value = b.dataset.user;
      $('#login-pass').focus();
    };
  }

  /* ---------- Onglets connexion / inscription ---------- */
  function onglets() {
    $$('[data-authtab]').forEach(function (t) {
      t.addEventListener('click', function () {
        var cible = t.dataset.authtab;
        $$('[data-authtab]').forEach(function (x) { x.classList.toggle('active', x === t); });
        $('#form-login').classList.toggle('hidden', cible !== 'login');
        $('#form-signup').classList.toggle('hidden', cible !== 'signup');
        $('#login-msg').textContent = '';
        $('#signup-msg').textContent = '';
      });
    });
  }

  /* ---------- Entree dans l application ---------- */
  function entrer() {
    $('#auth').classList.add('hidden');
    $('#app').classList.remove('hidden');
    UI.init();
  }

  function init() {
    remplirAvatars();
    remplirComptes();
    onglets();

    var dernier = Store.dernier();
    if (dernier) $('#login-user').value = dernier;

    if (!Store.dispo) {
      $('#login-msg').innerHTML = '⚠️ Ce navigateur bloque la sauvegarde locale : ta progression ne sera pas conservee.';
    }

    $('#form-login').addEventListener('submit', function (e) {
      e.preventDefault();
      var r = Store.connecter($('#login-user').value, $('#login-pass').value);
      var msg = $('#login-msg');
      msg.className = 'form-msg' + (r.ok ? ' ok' : '');
      msg.textContent = r.msg;
      if (r.ok) { $('#login-pass').value = ''; entrer(); }
    });

    $('#form-signup').addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('#signup-msg');
      msg.className = 'form-msg';
      if ($('#signup-pass').value !== $('#signup-pass2').value) {
        msg.textContent = 'Les deux mots de passe ne sont pas identiques.';
        return;
      }
      var r = Store.creer($('#signup-user').value, $('#signup-pass').value, avatarChoisi);
      msg.className = 'form-msg' + (r.ok ? ' ok' : '');
      msg.textContent = r.msg;
      if (r.ok) {
        $('#signup-pass').value = ''; $('#signup-pass2').value = '';
        entrer();
        UI.toast('👋 Bienvenue ! Tu commences avec 150 pieces.', 'gold', 4000);
      }
    });

    // le premier ecran affiche l inscription s il n y a encore aucun compte
    if (!Store.pseudos().length) {
      $$('[data-authtab]')[1].click();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
