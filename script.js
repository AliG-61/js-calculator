const display = document.getElementById('display');
const historyEl = document.getElementById('history');
const keys = document.querySelector('.keys');

let current = '0';
let previous = null;
let operator = null;
let justEvaluated = false;

function updateDisplay() {
  display.value = current;
  const hist = previous !== null && operator ? `${previous} ${opSymbol(operator)}` : '';
  historyEl.textContent = hist;
}
function opSymbol(op){
  return ({'+':'+','-':'−','*':'×','/':'÷','%':'%'}[op]||op);
}

function inputNumber(n) {
  if (justEvaluated) { current = '0'; justEvaluated = false; }
  if (n === '.' && current.includes('.')) return;
  if (current === '0' && n !== '.') current = n;
  else current += n;
}
function setOperator(op) {
  if (operator && !justEvaluated) evaluate();
  previous = parseFloat(current);
  operator = op;
  justEvaluated = false;
  current = '0';
}
function evaluate() {
  if (operator === null || previous === null) return;
  const a = previous;
  const b = parseFloat(current);
  let res = 0;

  switch (operator) {
    case '+': res = a + b; break;
    case '-': res = a - b; break;
    case '*': res = a * b; break;
    case '/': res = b === 0 ? NaN : a / b; break;
    case '%': res = a % b; break;
  }
  current = String(Number.isFinite(res) ? +parseFloat(res.toFixed(10)) : 'Error');
  previous = null;
  operator = null;
  justEvaluated = true;
}
function clearAll(){
  current='0'; previous=null; operator=null; justEvaluated=false;
}
function backspace(){
  if (justEvaluated) { current='0'; justEvaluated=false; return; }
  current = current.length>1 ? current.slice(0,-1) : '0';
}

keys.addEventListener('click', e=>{
  const t = e.target.closest('button');
  if(!t) return;

  if (t.dataset.num) inputNumber(t.dataset.num);
  else if (t.dataset.op) setOperator(t.dataset.op);
  else if (t.dataset.action === 'equals') evaluate();
  else if (t.dataset.action === 'clear') clearAll();
  else if (t.dataset.action === 'backspace') backspace();

  updateDisplay();
});

document.addEventListener('keydown', e=>{
  const k = e.key;
  if (!isNaN(k)) { inputNumber(k); }
  else if (k === '.') { inputNumber('.'); }
  else if (['+','-','*','/','%'].includes(k)) { setOperator(k); }
  else if (k === 'Enter' || k === '=') { e.preventDefault(); evaluate(); }
  else if (k === 'Backspace') { backspace(); }
  else if (k.toLowerCase() === 'c') { clearAll(); }

  updateDisplay();
});

// init
updateDisplay();
