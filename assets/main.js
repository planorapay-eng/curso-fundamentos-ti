/* ===== Curso Fundamentos de TI — lógica (quiz + progresso) ===== */
(function () {
  var TOTAL_MODULES = 16;
  var LS_KEY = 'curso-ti-progresso';

  function getProgress() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch (e) {}
  }

  /* ---- Barra de progresso global ---- */
  function updateCourseBar() {
    var bar = document.querySelector('.course-progress .bar i');
    var label = document.getElementById('progress-label');
    if (!bar) return;
    var p = getProgress();
    var done = Object.keys(p).filter(function (k) { return p[k]; }).length;
    bar.style.width = Math.round((done / TOTAL_MODULES) * 100) + '%';
    if (label) label.textContent = done + '/' + TOTAL_MODULES + ' módulos concluídos';
  }

  /* ---- Cartões da home: marcar concluídos ---- */
  function markHomeCards() {
    var p = getProgress();
    document.querySelectorAll('.module-card').forEach(function (card) {
      var n = card.getAttribute('data-module');
      if (n && p[n]) card.classList.add('completed');
    });
  }

  /* ---- Botão "concluir módulo" ---- */
  function initCompleteButton() {
    var btn = document.getElementById('btn-complete');
    if (!btn) return;
    var n = btn.getAttribute('data-module');
    var msg = document.querySelector('.complete-msg');
    var p = getProgress();
    if (p[n]) {
      btn.classList.add('btn-green');
      btn.textContent = '✓ Módulo concluído';
      if (msg) msg.classList.add('show');
    }
    btn.addEventListener('click', function () {
      var p = getProgress();
      p[n] = true;
      saveProgress(p);
      btn.classList.add('btn-green');
      btn.textContent = '✓ Módulo concluído';
      if (msg) { msg.textContent = 'Ótimo trabalho! Progresso salvo neste navegador.'; msg.classList.add('show'); }
      updateCourseBar();
    });
  }

  /* ---- Quiz ---- */
  function initQuiz() {
    var holder = document.getElementById('quiz');
    if (!holder) return;
    var data;
    try { data = JSON.parse(holder.getAttribute('data-quiz')); }
    catch (e) { return; }

    data.forEach(function (q, qi) {
      var item = document.createElement('div');
      item.className = 'q-item';

      var text = document.createElement('div');
      text.className = 'q-text';
      text.textContent = (qi + 1) + '. ' + q.q;
      item.appendChild(text);

      var feedback = document.createElement('div');
      feedback.className = 'q-feedback';

      q.options.forEach(function (opt, oi) {
        var label = document.createElement('label');
        label.className = 'q-opt';
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'q' + qi;
        input.value = oi;
        var span = document.createElement('span');
        span.textContent = opt;
        label.appendChild(input);
        label.appendChild(span);

        input.addEventListener('change', function () {
          // limpa marcações anteriores
          item.querySelectorAll('.q-opt').forEach(function (o) { o.classList.remove('correct', 'wrong'); });
          if (oi === q.answer) {
            label.classList.add('correct');
            feedback.textContent = '✓ Correto! ' + (q.explain || '');
            feedback.className = 'q-feedback show ok';
          } else {
            label.classList.add('wrong');
            // mostra a certa
            item.querySelectorAll('.q-opt')[q.answer].classList.add('correct');
            feedback.textContent = '✗ Não foi dessa vez. ' + (q.explain || '');
            feedback.className = 'q-feedback show err';
          }
          updateResult();
        });
        item.appendChild(label);
      });

      item.appendChild(feedback);
      holder.appendChild(item);
    });

    var result = document.getElementById('quiz-result');
    function updateResult() {
      var answered = 0, correct = 0;
      data.forEach(function (q, qi) {
        var sel = holder.querySelector('input[name="q' + qi + '"]:checked');
        if (sel) {
          answered++;
          if (parseInt(sel.value, 10) === q.answer) correct++;
        }
      });
      if (answered === data.length && result) {
        var pct = Math.round((correct / data.length) * 100);
        var txt = 'Resultado: ' + correct + '/' + data.length + ' (' + pct + '%). ';
        txt += pct >= 70 ? '🎉 Excelente! Você pode seguir para o próximo módulo.' :
                           '📖 Revise o conteúdo e tente entender os erros — você consegue!';
        result.textContent = txt;
        result.classList.add('show');
      } else if (result) {
        result.classList.remove('show');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateCourseBar();
    markHomeCards();
    initCompleteButton();
    initQuiz();
  });
})();
