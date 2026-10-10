/**
 * Numerical Methods and Analysis (MATH 2211)
 * Interactive 5-Hour Crash Course Learning System
 * Tailored exclusively for Taught Topics (Excluding Secant Method & Weddell's Rule)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initTimer();
  initProgressTracker();
  initTabs();
  initSolvers();
  initQuiz();
  renderMathFormulas();
});

function initMobileNav() {
  const toggleBtn = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }
}

/* ==========================================================================
   1. 5-HOUR COUNTDOWN / STUDY TIMER
   ========================================================================== */
let timerDuration = 5 * 60 * 60; // 5 hours in seconds
let timerRemaining = timerDuration;
let timerInterval = null;
let isTimerRunning = false;

function initTimer() {
  const savedRemaining = localStorage.getItem('num_study_timer');
  if (savedRemaining !== null) {
    timerRemaining = parseInt(savedRemaining, 10);
  }
  updateTimerDisplay();

  const btnToggle = document.getElementById('btn-timer-toggle');
  const btnReset = document.getElementById('btn-timer-reset');
  const btnAdd30 = document.getElementById('btn-timer-add30');
  const pillTimer = document.getElementById('nav-timer-pill');

  if (btnToggle) {
    btnToggle.addEventListener('click', toggleTimer);
  }
  if (btnReset) {
    btnReset.addEventListener('click', resetTimer);
  }
  if (btnAdd30) {
    btnAdd30.addEventListener('click', () => {
      timerRemaining += 30 * 60;
      updateTimerDisplay();
      saveTimer();
    });
  }
  if (pillTimer) {
    pillTimer.addEventListener('click', () => {
      const el = document.getElementById('timer-widget');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

function toggleTimer() {
  const btnToggle = document.getElementById('btn-timer-toggle');
  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    if (btnToggle) btnToggle.innerHTML = '<i class="fas fa-play"></i> স্টাডি শুরু করুন (Start Study)';
  } else {
    isTimerRunning = true;
    if (btnToggle) btnToggle.innerHTML = '<i class="fas fa-pause"></i> বিরতি (Pause)';
    timerInterval = setInterval(() => {
      if (timerRemaining > 0) {
        timerRemaining--;
        updateTimerDisplay();
        saveTimer();
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        alert('🎉 অভিনন্দন! আপনার ৫ ঘণ্টার পূর্ণাঙ্গ রিভিশন সেশন সফলভাবে সম্পন্ন হয়েছে!');
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timerRemaining = timerDuration;
  updateTimerDisplay();
  saveTimer();
  const btnToggle = document.getElementById('btn-timer-toggle');
  if (btnToggle) btnToggle.innerHTML = '<i class="fas fa-play"></i> স্টাডি শুরু করুন (Start Study)';
}

function updateTimerDisplay() {
  const hours = Math.floor(timerRemaining / 3600);
  const minutes = Math.floor((timerRemaining % 3600) / 60);
  const seconds = timerRemaining % 60;

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  const displayEl = document.getElementById('timer-digits');
  if (displayEl) {
    displayEl.textContent = `${hStr}:${mStr}:${sStr}`;
  }

  const navTimerText = document.getElementById('nav-timer-text');
  if (navTimerText) {
    navTimerText.textContent = `${hStr}:${mStr}:${sStr}`;
  }
}

function saveTimer() {
  localStorage.setItem('num_study_timer', timerRemaining);
}

/* ==========================================================================
   2. PROGRESS TRACKER & CHECKBOXES
   ========================================================================== */
function initProgressTracker() {
  const checkboxes = document.querySelectorAll('.topic-check-input');
  const savedChecks = JSON.parse(localStorage.getItem('num_completed_topics_taught') || '{}');

  checkboxes.forEach(cb => {
    const id = cb.dataset.topicId;
    if (savedChecks[id]) {
      cb.checked = true;
      markTopicCardCompleted(cb, true);
    }

    cb.addEventListener('change', () => {
      savedChecks[id] = cb.checked;
      localStorage.setItem('num_completed_topics_taught', JSON.stringify(savedChecks));
      markTopicCardCompleted(cb, cb.checked);
      updateOverallProgress();
    });
  });

  updateOverallProgress();
}

function markTopicCardCompleted(cb, isCompleted) {
  const card = cb.closest('.topic-card') || cb.closest('.timeline-card');
  if (card) {
    if (isCompleted) card.classList.add('completed');
    else card.classList.remove('completed');
  }
}

function updateOverallProgress() {
  const checkboxes = document.querySelectorAll('.topic-check-input');
  if (!checkboxes.length) return;

  const total = checkboxes.length;
  let checked = 0;
  checkboxes.forEach(cb => {
    if (cb.checked) checked++;
  });

  const percentage = Math.round((checked / total) * 100);
  const fillEl = document.getElementById('progress-bar-fill');
  const textEl = document.getElementById('progress-bar-text');

  if (fillEl) fillEl.style.width = `${percentage}%`;
  if (textEl) textEl.textContent = `${percentage}% সম্পন্ন (${checked}/${total})`;
}

/* ==========================================================================
   3. TABS SWITCHING
   ========================================================================== */
function initTabs() {
  const tabBtns = document.querySelectorAll('.module-tab-btn');
  const panes = document.querySelectorAll('.module-content-pane');
  const timelineCards = document.querySelectorAll('.timeline-card');

  function switchTab(targetId) {
    tabBtns.forEach(btn => {
      if (btn.dataset.target === targetId) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    panes.forEach(pane => {
      if (pane.id === targetId) pane.classList.add('active');
      else pane.classList.remove('active');
    });

    timelineCards.forEach(card => {
      if (card.dataset.target === targetId) card.classList.add('active');
      else card.classList.remove('active');
    });

    renderMathFormulas();
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.target);
    });
  });

  timelineCards.forEach(card => {
    card.addEventListener('click', () => {
      switchTab(card.dataset.target);
      const tabWrap = document.querySelector('.modules-nav-wrap');
      if (tabWrap) tabWrap.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE SOLVERS (IN-BROWSER NUMERICAL ENGINE)
   ========================================================================== */
function initSolvers() {
  initBisectionSolver();
  initNewtonSolver();
  initGaussSolver();
  initIntegrationSolver();
  initDiffTableSolver();
}

// 4.1 Bisection Method Solver
function initBisectionSolver() {
  const btn = document.getElementById('btn-run-bisection');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const fnStr = document.getElementById('bis-func').value;
    let a = parseFloat(document.getElementById('bis-a').value);
    let b = parseFloat(document.getElementById('bis-b').value);
    const maxIter = parseInt(document.getElementById('bis-iter').value, 10) || 10;
    const output = document.getElementById('bis-output');

    let f;
    try {
      f = new Function('x', `return ${mathExprToJs(fnStr)};`);
      f(a); f(b);
    } catch (e) {
      output.innerHTML = `<span style="color:#f43f5e">ফাংশনটি সঠিকভাবে লিখুন! যেমন: Math.pow(x, 3) - 2*Math.pow(x, 2) - 4</span>`;
      return;
    }

    const fa = f(a);
    const fb = f(b);

    if (fa * fb >= 0) {
      output.innerHTML = `<span style="color:#f43f5e">❌ f(a)*f(b) >= 0! Intermediate Value Theorem অনুসারে a ও b এর মধ্যে বিপরীত চিহ্ন থাকতে হবে। f(${a}) = ${fa.toFixed(4)}, f(${b}) = ${fb.toFixed(4)}</span>`;
      return;
    }

    let rowsHtml = `
      <div style="font-weight:bold; color:#fff; margin-bottom:10px;">
        f(${a}) = ${fa.toFixed(4)}, f(${b}) = ${fb.toFixed(4)} (বিপরীত চিহ্নযুক্ত — বাস্তব মূল বিদ্যমান)
      </div>
      <table class="custom-table" style="font-size:0.85rem;">
        <thead>
          <tr>
            <th>ধাপ (n)</th>
            <th>a</th>
            <th>b</th>
            <th>x_r = (a+b)/2</th>
            <th>f(x_r)</th>
            <th>চিহ্ন (Sign)</th>
            <th>পরবর্তী ব্যবধি</th>
          </tr>
        </thead>
        <tbody>
    `;

    let xr = 0;
    for (let i = 1; i <= maxIter; i++) {
      xr = (a + b) / 2;
      const fxr = f(xr);
      const sign = fxr < 0 ? '< 0 (-)' : '> 0 (+)';
      let nextInterval = '';

      if (f(a) * fxr < 0) {
        nextInterval = `[${a.toFixed(4)}, ${xr.toFixed(4)}]`;
        rowsHtml += `
          <tr>
            <td>${i}</td>
            <td>${a.toFixed(6)}</td>
            <td>${b.toFixed(6)}</td>
            <td style="color:#38bdf8; font-weight:bold;">${xr.toFixed(6)}</td>
            <td>${fxr.toFixed(6)}</td>
            <td>${sign}</td>
            <td>${nextInterval}</td>
          </tr>
        `;
        b = xr;
      } else {
        nextInterval = `[${xr.toFixed(4)}, ${b.toFixed(4)}]`;
        rowsHtml += `
          <tr>
            <td>${i}</td>
            <td>${a.toFixed(6)}</td>
            <td>${b.toFixed(6)}</td>
            <td style="color:#38bdf8; font-weight:bold;">${xr.toFixed(6)}</td>
            <td>${fxr.toFixed(6)}</td>
            <td>${sign}</td>
            <td>${nextInterval}</td>
          </tr>
        `;
        a = xr;
      }

      if (Math.abs(fxr) < 1e-7) break;
    }

    rowsHtml += `</tbody></table>`;
    rowsHtml += `<div style="margin-top:12px; color:#10b981; font-weight:bold; font-size:1rem;">
      🎯 ${maxIter} ধাপ পর আনুমানিক মূল x ≈ ${xr.toFixed(6)} (পরীক্ষার খাতায় এই টেবিলটি লিখবেন)
    </div>`;

    output.innerHTML = rowsHtml;
  });
}

// 4.2 Newton-Raphson Solver
function initNewtonSolver() {
  const btn = document.getElementById('btn-run-newton');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const fnStr = document.getElementById('newt-func').value;
    const dfnStr = document.getElementById('newt-dfunc').value;
    let x0 = parseFloat(document.getElementById('newt-x0').value);
    const maxIter = parseInt(document.getElementById('newt-iter').value, 10) || 6;
    const output = document.getElementById('newt-output');

    let f, df;
    try {
      f = new Function('x', `return ${mathExprToJs(fnStr)};`);
      df = new Function('x', `return ${mathExprToJs(dfnStr)};`);
      f(x0); df(x0);
    } catch (e) {
      output.innerHTML = `<span style="color:#f43f5e">ফাংশন বা ডেরিভেটিভ লিখতে ভুল হয়েছে!</span>`;
      return;
    }

    let rowsHtml = `
      <table class="custom-table" style="font-size:0.85rem;">
        <thead>
          <tr>
            <th>ধাপ (n)</th>
            <th>x_n</th>
            <th>f(x_n)</th>
            <th>f'(x_n)</th>
            <th>x_{n+1} = x_n - f(x_n)/f'(x_n)</th>
            <th>ত্রুটি |x_{n+1} - x_n|</th>
          </tr>
        </thead>
        <tbody>
    `;

    let xCurr = x0;
    for (let i = 0; i < maxIter; i++) {
      const fx = f(xCurr);
      const dfx = df(xCurr);
      if (Math.abs(dfx) < 1e-12) {
        rowsHtml += `<tr><td colspan="6" style="color:#f43f5e">ত্রুটি: f'(x) = 0 হয়ে গিয়েছে! স্পর্শক অনুভূমিক।</td></tr>`;
        break;
      }
      const xNext = xCurr - (fx / dfx);
      const diff = Math.abs(xNext - xCurr);

      rowsHtml += `
        <tr>
          <td>${i}</td>
          <td>${xCurr.toFixed(8)}</td>
          <td>${fx.toFixed(8)}</td>
          <td>${dfx.toFixed(8)}</td>
          <td style="color:#38bdf8; font-weight:bold;">${xNext.toFixed(8)}</td>
          <td style="color:#10b981;">${diff.toExponential(4)}</td>
        </tr>
      `;

      xCurr = xNext;
      if (diff < 1e-9) break;
    }

    rowsHtml += `</tbody></table>`;
    rowsHtml += `<div style="margin-top:12px; color:#10b981; font-weight:bold; font-size:1rem;">
      🎯 অভিসারী মূল x ≈ ${xCurr.toFixed(8)}
    </div>`;

    output.innerHTML = rowsHtml;
  });
}

// 4.3 Gauss & Gauss-Jordan Solver (3x3 Matrix with Row Operations)
function initGaussSolver() {
  const btnGauss = document.getElementById('btn-run-gauss');
  const btnJordan = document.getElementById('btn-run-jordan');
  if (!btnGauss && !btnJordan) return;

  function getMatrix() {
    return [
      [parseFloat(document.getElementById('m00').value), parseFloat(document.getElementById('m01').value), parseFloat(document.getElementById('m02').value), parseFloat(document.getElementById('m03').value)],
      [parseFloat(document.getElementById('m10').value), parseFloat(document.getElementById('m11').value), parseFloat(document.getElementById('m12').value), parseFloat(document.getElementById('m13').value)],
      [parseFloat(document.getElementById('m20').value), parseFloat(document.getElementById('m21').value), parseFloat(document.getElementById('m22').value), parseFloat(document.getElementById('m23').value)]
    ];
  }

  function matrixToHtml(M, title = '') {
    let html = `<div style="margin:8px 0; font-family:monospace; color:#e2e8f0;">`;
    if (title) html += `<strong style="color:#38bdf8;">${title}</strong><br>`;
    html += `[ <br>`;
    for (let i = 0; i < 3; i++) {
      html += `&nbsp;&nbsp;[ `;
      for (let j = 0; j < 3; j++) {
        html += `${M[i][j].toFixed(2).padStart(6, ' ')} `;
      }
      html += `| <span style="color:#fbbf24">${M[i][3].toFixed(2).padStart(6, ' ')}</span> ]<br>`;
    }
    html += `]</div>`;
    return html;
  }

  if (btnGauss) {
    btnGauss.addEventListener('click', () => {
      const M = getMatrix();
      const output = document.getElementById('matrix-output');
      let log = `<h4 style="color:#10b981;">গাউস অপনয়ন পদ্ধতি (Forward Elimination + Back Substitution):</h4>`;
      log += matrixToHtml(M, 'প্রাথমিক অগমেন্টেড ম্যাট্রিক্স [A | B]:');

      // Forward elimination
      let factor1 = M[1][0] / M[0][0];
      let factor2 = M[2][0] / M[0][0];

      log += `<p style="color:#94a3b8; margin:4px 0;">সারি রূপান্তর: R₂ ← R₂ - (${factor1.toFixed(2)})R₁, &nbsp; R₃ ← R₃ - (${factor2.toFixed(2)})R₁</p>`;
      for (let j = 0; j < 4; j++) {
        M[1][j] -= factor1 * M[0][j];
        M[2][j] -= factor2 * M[0][j];
      }
      log += matrixToHtml(M, '১ম কলাম পরিষ্কার করার পর:');

      let factor3 = M[2][1] / M[1][1];
      log += `<p style="color:#94a3b8; margin:4px 0;">সারি রূপান্তর: R₃ ← R₃ - (${factor3.toFixed(2)})R₂</p>`;
      for (let j = 0; j < 4; j++) {
        M[2][j] -= factor3 * M[1][j];
      }
      log += matrixToHtml(M, 'Upper Triangular Matrix এ রূপান্তরের পর:');

      // Back substitution
      let x3 = M[2][3] / M[2][2];
      let x2 = (M[1][3] - M[1][2] * x3) / M[1][1];
      let x1 = (M[0][3] - M[0][1] * x2 - M[0][2] * x3) / M[0][0];

      log += `
        <div style="background:rgba(16,185,129,0.15); border:1px solid #10b981; border-radius:8px; padding:12px; margin-top:12px;">
          <h5 style="color:#10b981; margin-bottom:6px;">✅ Back Substitution ফলাফল:</h5>
          x₃ = ${M[2][3].toFixed(2)} / ${M[2][2].toFixed(2)} = <strong>${Math.round(x3 * 1000) / 1000}</strong><br>
          x₂ = (${M[1][3].toFixed(2)} - ${M[1][2].toFixed(2)} × ${x3.toFixed(2)}) / ${M[1][1].toFixed(2)} = <strong>${Math.round(x2 * 1000) / 1000}</strong><br>
          x₁ = (${M[0][3].toFixed(2)} - ${M[0][1].toFixed(2)} × ${x2.toFixed(2)} - ${M[0][2].toFixed(2)} × ${x3.toFixed(2)}) / ${M[0][0].toFixed(2)} = <strong>${Math.round(x1 * 1000) / 1000}</strong><br>
          <strong style="color:#fff; font-size:1.1rem; display:block; margin-top:6px;">👉 চূড়ান্ত সমাধান: [x₁, x₂, x₃] = [${Math.round(x1)}, ${Math.round(x2)}, ${Math.round(x3)}]</strong>
        </div>
      `;
      output.innerHTML = log;
    });
  }

  if (btnJordan) {
    btnJordan.addEventListener('click', () => {
      const M = getMatrix();
      const output = document.getElementById('matrix-output');
      let log = `<h4 style="color:#38bdf8;">গাউস-জর্ডান অপনয়ন পদ্ধতি (Reduced Row Echelon Form):</h4>`;
      log += matrixToHtml(M, 'প্রাথমিক অগমেন্টেড ম্যাট্রিক্স [A | B]:');

      // Pivot 1
      let p0 = M[0][0];
      for (let j = 0; j < 4; j++) M[0][j] /= p0;
      for (let i = 1; i < 3; i++) {
        let f = M[i][0];
        for (let j = 0; j < 4; j++) M[i][j] -= f * M[0][j];
      }
      log += matrixToHtml(M, 'Pivot 1 সেট করার পর (কলাম ১ পরিষ্কার):');

      // Pivot 2
      let p1 = M[1][1];
      for (let j = 0; j < 4; j++) M[1][j] /= p1;
      for (let i = 0; i < 3; i++) {
        if (i !== 1) {
          let f = M[i][1];
          for (let j = 0; j < 4; j++) M[i][j] -= f * M[1][j];
        }
      }
      log += matrixToHtml(M, 'Pivot 2 সেট করার পর (কলাম ২ পরিষ্কার):');

      // Pivot 3
      let p2 = M[2][2];
      for (let j = 0; j < 4; j++) M[2][j] /= p2;
      for (let i = 0; i < 2; i++) {
        let f = M[i][2];
        for (let j = 0; j < 4; j++) M[i][j] -= f * M[2][j];
      }
      log += matrixToHtml(M, 'Reduced Row Echelon Form [I | X]:');

      log += `
        <div style="background:rgba(6,182,212,0.15); border:1px solid #06b6d4; border-radius:8px; padding:12px; margin-top:12px;">
          <h5 style="color:#38bdf8; margin-bottom:6px;">✅ সরাসরি আইডেন্টিটি ম্যাট্রিক্স থেকে সমাধান:</h5>
          x₁ = <strong>${Math.round(M[0][3] * 1000) / 1000}</strong><br>
          x₂ = <strong>${Math.round(M[1][3] * 1000) / 1000}</strong><br>
          x₃ = <strong>${Math.round(M[2][3] * 1000) / 1000}</strong><br>
          <strong style="color:#fff; font-size:1.1rem; display:block; margin-top:6px;">👉 চূড়ান্ত সমাধান: [x₁, x₂, x₃] = [${Math.round(M[0][3])}, ${Math.round(M[1][3])}, ${Math.round(M[2][3])}]</strong>
        </div>
      `;
      output.innerHTML = log;
    });
  }
}

// 4.4 Numerical Integration Live Solver (Trapezoidal, Simpson's 1/3, Simpson's 3/8)
function initIntegrationSolver() {
  const btn = document.getElementById('btn-run-integ');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const fnStr = document.getElementById('integ-func').value;
    const a = parseFloat(document.getElementById('integ-a').value);
    const b = parseFloat(document.getElementById('integ-b').value);
    const n = parseInt(document.getElementById('integ-n').value, 10);
    const output = document.getElementById('integ-output');

    let f;
    try {
      f = new Function('x', `return ${mathExprToJs(fnStr)};`);
      f(a); f(b);
    } catch (e) {
      output.innerHTML = `<span style="color:#f43f5e">ফাংশনটি সঠিকভাবে লিখুন! যেমন: Math.sqrt(x*x + 2*x + 1)</span>`;
      return;
    }

    const h = (b - a) / n;
    const xVals = [];
    const yVals = [];

    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      const y = f(x);
      xVals.push(x);
      yVals.push(y);
    }

    // Build Table
    let tableHtml = `
      <div style="color:#fff; font-weight:bold; margin-bottom:10px;">
        ব্যবধির ব্যবধান h = (b - a) / n = (${b} - ${a}) / ${n} = <span style="color:#38bdf8;">${h.toFixed(6)}</span>
      </div>
      <table class="custom-table" style="font-size:0.85rem;">
        <thead>
          <tr>
            <th>i</th>
            <th>x_i</th>
            <th>y_i = f(x_i)</th>
            <th>শ্রেণিবিভাগ (Category)</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 0; i <= n; i++) {
      let role = '';
      if (i === 0) role = '<span style="color:#fbbf24">y₀ (শুরু)</span>';
      else if (i === n) role = `<span style="color:#fbbf24">y_${n} (শেষ)</span>`;
      else if (i % 2 === 1) role = '<span style="color:#38bdf8">বিজোড় (Odd)</span>';
      else role = '<span style="color:#10b981">জোড় (Even)</span>';

      tableHtml += `
        <tr>
          <td>${i}</td>
          <td>${xVals[i].toFixed(4)}</td>
          <td>${yVals[i].toFixed(6)}</td>
          <td>${role}</td>
        </tr>
      `;
    }
    tableHtml += `</tbody></table>`;

    // 1. Trapezoidal
    let sumTrap = (yVals[0] + yVals[n]) / 2;
    for (let i = 1; i < n; i++) sumTrap += yVals[i];
    const trapResult = sumTrap * h;

    // 2. Simpson's 1/3
    let simp13Result = null;
    if (n % 2 === 0) {
      let sumOdd = 0;
      let sumEven = 0;
      for (let i = 1; i < n; i++) {
        if (i % 2 === 1) sumOdd += yVals[i];
        else sumEven += yVals[i];
      }
      simp13Result = (h / 3) * (yVals[0] + yVals[n] + 4 * sumOdd + 2 * sumEven);
    }

    // 3. Simpson's 3/8
    let simp38Result = null;
    if (n % 3 === 0) {
      let sumMult3 = 0;
      let sumOther = 0;
      for (let i = 1; i < n; i++) {
        if (i % 3 === 0) sumMult3 += yVals[i];
        else sumOther += yVals[i];
      }
      simp38Result = ((3 * h) / 8) * (yVals[0] + yVals[n] + 3 * sumOther + 2 * sumMult3);
    }

    let resultsHtml = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-top:16px;">
        <div style="background:rgba(6,182,212,0.1); border:1px solid #06b6d4; padding:12px; border-radius:8px;">
          <h5 style="color:#38bdf8;">১. Trapezoidal Rule:</h5>
          <div style="font-size:1.2rem; font-weight:bold; color:#fff;">${trapResult.toFixed(6)}</div>
          <small style="color:#94a3b8;">(সব ধরণের n এর জন্য বৈধ)</small>
        </div>
        <div style="background:rgba(16,185,129,0.1); border:1px solid #10b981; padding:12px; border-radius:8px;">
          <h5 style="color:#10b981;">২. Simpson's 1/3 Rule:</h5>
          <div style="font-size:1.2rem; font-weight:bold; color:#fff;">
            ${simp13Result !== null ? simp13Result.toFixed(6) : '<span style="color:#f43f5e">n জোড় নয়!</span>'}
          </div>
          <small style="color:#94a3b8;">${n % 2 === 0 ? '(n = ' + n + ' জোড় সংখ্যা — শর্ত পূরণ হয়েছে)' : 'শর্ত: n জোড় সংখ্যা হতে হবে'}</small>
        </div>
        <div style="background:rgba(245,158,11,0.1); border:1px solid #f59e0b; padding:12px; border-radius:8px;">
          <h5 style="color:#f59e0b;">৩. Simpson's 3/8 Rule:</h5>
          <div style="font-size:1.2rem; font-weight:bold; color:#fff;">
            ${simp38Result !== null ? simp38Result.toFixed(6) : '<span style="color:#f43f5e">n ৩ এর গুণিতক নয়!</span>'}
          </div>
          <small style="color:#94a3b8;">${n % 3 === 0 ? '(n = ' + n + ' ৩ এর গুণিতক — শর্ত পূরণ হয়েছে)' : 'শর্ত: n ৩ এর গুণিতক হতে হবে'}</small>
        </div>
      </div>
    `;

    output.innerHTML = tableHtml + resultsHtml;
  });
}

// 4.5 Finite Difference Table Generator
function initDiffTableSolver() {
  const btn = document.getElementById('btn-run-difftable');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const rawY = document.getElementById('diff-yvals').value;
    const output = document.getElementById('diff-output');
    const yList = rawY.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

    if (yList.length < 2) {
      output.innerHTML = '<span style="color:#f43f5e">কমপক্ষে ২টি y এর মান কমা দিয়ে লিখুন!</span>';
      return;
    }

    const n = yList.length;
    const table = [];
    table[0] = [...yList];

    for (let order = 1; order < n; order++) {
      table[order] = [];
      for (let i = 0; i < n - order; i++) {
        table[order][i] = table[order - 1][i + 1] - table[order - 1][i];
      }
    }

    let html = `<table class="custom-table" style="font-size:0.85rem;"><thead><tr><th>i</th><th>y_i</th>`;
    for (let order = 1; order < n; order++) {
      html += `<th>Δ^${order} y</th>`;
    }
    html += `</tr></thead><tbody>`;

    for (let i = 0; i < n; i++) {
      html += `<tr><td>${i}</td><td style="font-weight:bold; color:#fff;">${table[0][i].toFixed(4)}</td>`;
      for (let order = 1; order < n; order++) {
        if (i < n - order) {
          const val = table[order][i];
          const highlight = (order === 1 && i === 0) ? 'color:#38bdf8; font-weight:bold;' : '';
          html += `<td style="${highlight}">${val.toFixed(4)}</td>`;
        } else {
          html += `<td>-</td>`;
        }
      }
      html += `</tr>`;
    }
    html += `</tbody></table>`;

    html += `<div style="margin-top:10px; color:#10b981; font-size:0.9rem;">
      💡 নিউটনের অগ্রবর্তী (Forward) সূত্রে শীর্ষ সারির মানগুলো ($y_0, \\Delta y_0, \\Delta^2 y_0, ...$) এবং পশ্চাদবর্তী (Backward) সূত্রে শেষ সারির মানগুলো ($y_n, \\nabla y_n, \\nabla^2 y_n, ...$) ব্যবহৃত হয়।
    </div>`;

    output.innerHTML = html;
  });
}

function mathExprToJs(str) {
  return str
    .replace(/\^/g, '**')
    .replace(/sin/g, 'Math.sin')
    .replace(/cos/g, 'Math.cos')
    .replace(/tan/g, 'Math.tan')
    .replace(/ln/g, 'Math.log')
    .replace(/log/g, 'Math.log10')
    .replace(/exp/g, 'Math.exp')
    .replace(/sqrt/g, 'Math.sqrt');
}

/* ==========================================================================
   5. INTERACTIVE EXAM QUIZ (100% TAUGHT TOPICS ONLY)
   ========================================================================== */
const quizQuestions = [
  {
    q: "Newton-Raphson Method এর অভিসারিতার ক্রম (Order of Convergence) কত?",
    options: ["Linear (১ম ক্রম)", "Quadratic (২য় ক্রম)", "Cubic (৩য় ক্রম)", "০.৫"],
    ans: 1,
    exp: "Newton-Raphson Method এর অভিসারিতা দ্বিঘাত বা Quadratic (p = 2)। অর্থাৎ প্রতিটি ধাপে সঠিক দশমিক ঘরের সংখ্যা প্রায় দ্বিগুণ হয়ে যায়।"
  },
  {
    q: "Simpson's 1/3 Rule প্রয়োগ করার আবশ্যিক শর্ত কোনটি?",
    options: ["উপব্যবধি সংখ্যা n অবশ্যই বিজোড় হতে হবে", "উপব্যবধি সংখ্যা n অবশ্যই জোড় (২ এর গুণিতক) হতে হবে", "n অবশ্যই ৩ এর গুণিতক হতে হবে", "যেকোনো n এর জন্যই প্রয়োগ করা যাবে"],
    ans: 1,
    exp: "Simpson's 1/3 Rule দুটি করে উপব্যবধিকে একটি পরাবৃত্ত (Parabola) দিয়ে যুক্ত করে। তাই মোট উপব্যবধি সংখ্যা n অবশ্যই জোড় (Even / multiple of 2) হতে হবে।"
  },
  {
    q: "Gauss Elimination এবং Gauss-Jordan Elimination এর মধ্যে প্রধান পার্থক্য কী?",
    options: [
      "Gauss-Jordan এ Back Substitution প্রয়োজন হয়, কিন্তু Gauss এ হয় না",
      "Gauss Elimination এ Back Substitution লাগে, কিন্তু Gauss-Jordan এ অগমেন্টেড ম্যাট্রিক্স সরাসরি আইডেন্টিটি ম্যাট্রিক্সে রূপান্তর হয় বলে Back Substitution লাগে না",
      "Gauss-Jordan শুধুমাত্র ২ চলকের জন্য প্রযোজ্য",
      "কোনো পার্থক্য নেই"
    ],
    ans: 1,
    exp: "Gauss Elimination ম্যাট্রিক্সকে Upper Triangular এ রূপান্তর করে এবং শেষে ব্যাক সাবস্টিটিউশন করতে হয়। Gauss-Jordan সরাসরি Reduced Row Echelon Form [I | X] এ রূপান্তর করে, ফলে কোনো ব্যাক সাবস্টিটিউশন ছাড়াই উত্তর পাওয়া যায়।"
  },
  {
    q: "Simpson's 3/8 Rule প্রয়োগ করতে হলে n এর মান কেমন হতে হবে?",
    options: ["n অবশ্যই ৩ এর গুণিতক (Multiple of 3)", "n অবশ্যই জোড়", "n অবশ্যই বিজোড়", "n যেকোনো সংখ্যা"],
    ans: 0,
    exp: "Simpson's 3/8 Rule এ ৩ ডিগ্রি কিউবিক পলিনোমিয়াল ব্যবহার করা হয়, তাই উপব্যবধি n অবশ্যই ৩ এর গুণিতক (৩, ৬, ৯...) হতে হবে।"
  },
  {
    q: "প্রদত্ত ডেটা সেটে যদি x এর মানগুলোর মধ্যকার ব্যবধান অসমান (Unequal intervals) হয়, তবে কোন ইন্টারপোলেশন সূত্রটি সবচেয়ে উপযুক্ত?",
    options: ["Newton's Forward Interpolation", "Newton's Backward Interpolation", "Lagrange's Interpolation Formula", "Trapezoidal Rule"],
    ans: 2,
    exp: "Lagrange's Interpolation Formula এবং Divided Difference সূত্র অসমান ব্যবধির জন্য প্রযোজ্য। Newton Forward ও Backward শুধুমাত্র সমান ব্যবধির জন্য প্রযোজ্য।"
  },
  {
    q: "Bisection Method এ যদি f(a) = -4 এবং f(b) = +5 হয়, তবে ১ম আসন্ন মান x₁ কত হবে?",
    options: ["(a - b) / 2", "(a + b) / 2", "a * b / 2", "a / b"],
    ans: 1,
    exp: "Bisection পদ্ধতিতে ব্যবধিকে ঠিক মাঝখানে দ্বিখণ্ডিত করা হয়: x_r = (a + b) / 2।"
  },
  {
    q: "টেইলর সিরিজের মতো অসীম ধারাকে নির্দিষ্ট সংখ্যক পদের পর বাদ দেওয়ার কারণে যে ত্রুটি সৃষ্টি হয় তাকে কী বলে?",
    options: ["Round-off Error", "Truncation Error", "Absolute Error", "Inherent Error"],
    ans: 1,
    exp: "অসীম গাণিতিক প্রক্রিয়াকে নির্দিষ্ট পদে ছেঁটে (truncate) ফেলার জন্য সৃষ্ট ত্রুটিকে Truncation Error বলা হয়।"
  },
  {
    q: "সসীম অন্তর অপারেটরের ক্ষেত্রে Δ এবং Shift Operator E এর মধ্যকার সম্পর্ক কোনটি?",
    options: ["Δ = E + 1", "Δ = E - 1", "Δ = 1 - E", "Δ = E²"],
    ans: 1,
    exp: "যেহেতু E f(x) = f(x+h) এবং Δ f(x) = f(x+h) - f(x) = (E - 1) f(x), সুতরাং Δ = E - 1।"
  },
  {
    q: "Newton-Raphson পদ্ধতির ব্যর্থ হওয়ার প্রধান শর্ত কোনটি?",
    options: ["যদি f'(x) = 0 হয়", "যদি f(x) = 0 হয়", "যদি x > 0 হয়", "যদি f''(x) > 0 হয়"],
    ans: 0,
    exp: "সূত্রে x_{n+1} = x_n - f(x_n)/f'(x_n) থাকে। তাই f'(x_n) = 0 হলে ভাগ অসংজ্ঞায়িত হয়ে যায় (স্পর্শক অনুভূমিক হয়ে x-অক্ষকে আর ছেদ করতে পারে না)।"
  },
  {
    q: "একটি ৩য় মাত্রার বহুপদী (Cubic Polynomial f(x) = x³ - 3x + 1) এর ক্ষেত্রে ৪র্থ অন্তর (4th difference Δ⁴y) এর মান কত হবে?",
    options: ["ধ্রুবক (Constant)", "শূন্য (Zero)", "১", "ঋণাত্মক"],
    ans: 1,
    exp: "n-তম মাত্রার বহুপদীর n-তম অন্তর ধ্রুবক এবং তার পরবর্তী সব উচ্চতর অন্তর (Δ^{n+1}y, Δ^{n+2}y, ...) সর্বদা শূন্য (০) হয়।"
  }
];

function initQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  let score = 0;
  let answered = 0;

  let html = '';
  quizQuestions.forEach((item, qIdx) => {
    html += `
      <div class="quiz-card" id="qcard-${qIdx}">
        <div class="quiz-question-num">প্রশ্ন ${qIdx + 1} / ${quizQuestions.length}</div>
        <div class="quiz-question-text">${item.q}</div>
        <div class="quiz-options-list">
          ${item.options.map((opt, oIdx) => `
            <button class="quiz-option-btn" data-q="${qIdx}" data-opt="${oIdx}">
              <span class="calc-key">${String.fromCharCode(65 + oIdx)}</span> ${opt}
            </button>
          `).join('')}
        </div>
        <div class="quiz-explanation" id="exp-${qIdx}">
          <strong>💡 ব্যাখ্যা:</strong> ${item.exp}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qIdx = parseInt(btn.dataset.q, 10);
      const oIdx = parseInt(btn.dataset.opt, 10);
      const card = document.getElementById(`qcard-${qIdx}`);
      const exp = document.getElementById(`exp-${qIdx}`);

      if (card.dataset.answered) return;
      card.dataset.answered = 'true';
      answered++;

      const correctAns = quizQuestions[qIdx].ans;
      const allBtns = card.querySelectorAll('.quiz-option-btn');

      if (oIdx === correctAns) {
        btn.classList.add('correct');
        score++;
      } else {
        btn.classList.add('wrong');
        allBtns[correctAns].classList.add('correct');
      }

      exp.classList.add('visible');
      updateQuizScoreDisplay(score, answered);
    });
  });
}

function updateQuizScoreDisplay(score, answered) {
  const scoreEl = document.getElementById('quiz-score-badge');
  if (scoreEl) {
    scoreEl.textContent = `স্কোর: ${score} / ${answered} (${quizQuestions.length} টির মধ্যে)`;
  }
}

/* ==========================================================================
   6. KaTeX MATH FORMULAS RENDERING
   ========================================================================== */
function renderMathFormulas() {
  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  }
}
