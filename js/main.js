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
// Sem um endereço https, ou se o serviço falhar, a mensagem abre pronta no WhatsApp ou no e-mail.
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var el = form.elements;
  var step1 = document.getElementById('step-1');
  var step2 = document.getElementById('step-2');
  var progress2 = document.getElementById('progress-2');
  var send = document.getElementById('form-send');
  var success = document.getElementById('form-success');
  var handoff = document.getElementById('form-handoff');
  var live = document.getElementById('form-live');
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var WHATSAPP = 'https://wa.me/5511993228666';
  var MAIL = 'lucas@tenarocapital.com';

  function setError(field, message) {
    document.getElementById(field.id + '-erro').textContent = message;
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function checkName() {
    setError(el.nome, el.nome.value.trim() ? '' : 'Informe o seu nome.');
  }

  // O contato obrigatório acompanha a preferência escolhida; sem preferência, basta um dos dois.
  function checkContact() {
    var email = el.email.value.trim();
    var phone = el.telefone.value.trim();
    var digits = phone.replace(/\D/g, '');
    var pref = el.pref.value;
    var emailError = '';
    var phoneError = '';

    if (email && !EMAIL.test(email)) emailError = 'Confira o e-mail informado.';
    if (phone && digits.length < 10) phoneError = 'Confira o telefone, com DDD.';

    if (pref === 'email' && !email) emailError = 'Informe o e-mail para o retorno.';
    else if ((pref === 'whatsapp' || pref === 'telefone') && !phone) phoneError = 'Informe o telefone, com DDD, para o retorno.';
    else if (!pref && !email && !phone) emailError = 'Informe um e-mail ou um telefone para o retorno.';

    setError(el.email, emailError);
    setError(el.telefone, phoneError);
  }

  function checkConsent() {
    setError(el.consentimento, el.consentimento.checked ? '' : 'Para enviar, é preciso concordar com a Política de Privacidade.');
  }

  function firstInvalid(scope) {
    return scope.querySelector('[aria-invalid="true"]');
  }

  function showStep(step) {
    step1.classList.toggle('is-active', step === 1);
    step2.classList.toggle('is-active', step === 2);
    progress2.classList.toggle('is-on', step === 2);
    var current = step === 1 ? step1 : step2;
    form.scrollIntoView({ block: 'nearest' });
    current.querySelector('.form-step__title').focus({ preventScroll: true });
    live.textContent = 'Etapa ' + step + ' de 2';
  }

  function showPanel(panel) {
    success.hidden = panel !== success;
    handoff.hidden = panel !== handoff;
    form.classList.toggle('is-done', Boolean(panel));
    if (panel) {
      panel.focus({ preventScroll: true });
      form.scrollIntoView({ block: 'nearest' });
      live.textContent = panel.querySelector('.form-panel__title').textContent;
    }
  }

  function buildMessage() {
    var select = el.faturamento;
    var pref = form.querySelector('input[name="pref"]:checked');
    var rows = [
      ['Nome', el.nome.value], ['Telefone', el.telefone.value], ['E-mail', el.email.value],
      ['Prefere contato por', pref ? pref.parentNode.textContent : ''],
      ['Empresa', el.empresa.value], ['Cargo', el.cargo.value], ['Setor', el.setor.value], ['Cidade / Estado', el.cidade.value],
      ['Faturamento anual aproximado', select.value ? select.options[select.selectedIndex].text : ''],
      ['Mensagem', el.mensagem.value]
    ];
    var lines = rows.filter(function (row) { return row[1].trim(); })
      .map(function (row) { return row[0] + ': ' + row[1].trim(); });
    return 'Olá, Lucas. Vim pelo site da Tenaro Capital.\n\n' + lines.join('\n');
  }

  function showHandoff(title) {
    var text = buildMessage();
    document.getElementById('handoff-title').textContent = title;
    document.getElementById('handoff-wa').href = WHATSAPP + '?text=' + encodeURIComponent(text);
    document.getElementById('handoff-mail').href = 'mailto:' + MAIL +
      '?subject=' + encodeURIComponent('Contato pelo site da Tenaro Capital') + '&body=' + encodeURIComponent(text);
    showPanel(handoff);
  }

  function setSending(sending) {
    send.disabled = sending;
    send.textContent = sending ? 'Enviando...' : 'Enviar mensagem';
    form.setAttribute('aria-busy', String(sending));
  }

  // Formata o telefone brasileiro enquanto a pessoa digita no fim do campo.
  el.telefone.addEventListener('input', function () {
    var field = el.telefone;
    if (field.value.charAt(0) === '+' || field.selectionStart !== field.value.length) return;
    var digits = field.value.replace(/\D/g, '').slice(0, 11);
    var cut = digits.length > 10 ? 7 : 6;
    if (digits.length > cut) field.value = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, cut) + '-' + digits.slice(cut);
    else if (digits.length > 2) field.value = '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
    else field.value = digits;
  });

  // Valida ao sair do campo e limpa o erro assim que ele for corrigido.
  el.nome.addEventListener('blur', function () { if (el.nome.value) checkName(); });
  [el.email, el.telefone].forEach(function (field) {
    field.addEventListener('blur', function () { if (field.value) checkContact(); });
    field.addEventListener('input', function () { if (field.getAttribute('aria-invalid')) checkContact(); });
  });
  el.nome.addEventListener('input', function () { if (el.nome.getAttribute('aria-invalid')) checkName(); });
  el.consentimento.addEventListener('change', checkConsent);
  form.querySelectorAll('input[name="pref"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (el.email.getAttribute('aria-invalid') || el.telefone.getAttribute('aria-invalid')) checkContact();
    });
  });

  document.getElementById('form-back').addEventListener('click', function () { showStep(1); });
  document.getElementById('handoff-back').addEventListener('click', function () {
    showPanel(null);
    showStep(2);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (step1.classList.contains('is-active')) {
      checkName();
      checkContact();
      var invalid = firstInvalid(step1);
      if (invalid) invalid.focus();
      else showStep(2);
      return;
    }

    checkConsent();
    if (firstInvalid(step2)) {
      el.consentimento.focus();
      return;
    }

    // Campo-armadilha preenchido: é robô. Finge sucesso e não envia nada.
    if (el._gotcha.value) {
      showPanel(success);
      return;
    }

    var endpoint = form.getAttribute('action');
    if (!/^https:\/\//.test(endpoint)) {
      showHandoff('Falta só escolher por onde enviar');
      return;
    }

    setSending(true);
    fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      form.reset();
      showPanel(success);
    }).catch(function () {
      showHandoff('Não foi possível enviar pelo formulário');
    }).finally(function () {
      setSending(false);
    });
  });
})();
