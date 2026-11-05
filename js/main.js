// Tenaro Capital: menu no celular e envio do formulário de contato.

// ---------- Barra do topo: mais transparente enquanto está sobre a foto ----------
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  function update() { header.classList.toggle('is-top', window.scrollY < 40); }
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// ---------- Conteúdo surge ao entrar na tela ----------
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (item) { item.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (item) { observer.observe(item); });
})();

// ---------- Menu ----------
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  links.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
})();

// ---------- Formulário ----------
// O destino do envio é o atributo action do <form> em index.html.
// Enquanto não houver um endereço https configurado, o formulário não envia
// e mostra ao visitante o e-mail e o WhatsApp.
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var submit = form.querySelector('.form-submit');
  var consentLabel = form.querySelector('.consent__label');
  var FALLBACK = 'Escreva para <a href="mailto:lucas@tenarocapital.com">lucas@tenarocapital.com</a> ' +
    'ou chame no <a href="https://wa.me/5511993228666" target="_blank" rel="noopener">WhatsApp</a>.';
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, message) {
    var box = document.getElementById(field.id + '-erro');
    box.textContent = message;
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    if (field.type === 'checkbox') consentLabel.setAttribute('data-invalid', String(Boolean(message)));
  }

  function validate() {
    var nome = form.elements.nome;
    var email = form.elements.email;
    var tel = form.elements.telefone;
    var consent = form.elements.consentimento;
    var emailValue = email.value.trim();
    var telDigits = tel.value.replace(/\D/g, '');

    setError(nome, nome.value.trim() ? '' : 'Informe o seu nome.');

    var emailError = '';
    if (emailValue && !EMAIL.test(emailValue)) emailError = 'Confira o e-mail informado.';
    else if (!emailValue && !telDigits) emailError = 'Informe um e-mail ou um telefone para o retorno.';
    setError(email, emailError);

    setError(tel, tel.value.trim() && telDigits.length < 10 ? 'Confira o telefone, com DDD.' : '');
    setError(consent, consent.checked ? '' : 'Para enviar, é preciso concordar com a Política de Privacidade.');

    return form.querySelector('[aria-invalid="true"]');
  }

  function showStatus(kind, html) {
    status.className = 'form-status form-status--' + kind;
    status.innerHTML = html;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    status.innerHTML = '';

    var firstInvalid = validate();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Campo-armadilha preenchido: é robô. Finge sucesso e não envia nada.
    if (form.elements._gotcha.value) {
      form.reset();
      showStatus('ok', 'Mensagem enviada. Obrigado pelo contato. O Lucas retorna pessoalmente.');
      return;
    }

    var endpoint = form.getAttribute('action');
    if (!/^https:\/\//.test(endpoint)) {
      showStatus('error', 'O envio pelo formulário ainda não está disponível. ' + FALLBACK);
      return;
    }

    submit.disabled = true;
    fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      form.reset();
      showStatus('ok', 'Mensagem enviada. Obrigado pelo contato. O Lucas retorna pessoalmente.');
    }).catch(function () {
      showStatus('error', 'Não foi possível enviar a mensagem agora. Tente de novo em instantes. ' + FALLBACK);
    }).finally(function () {
      submit.disabled = false;
    });
  });
})();
