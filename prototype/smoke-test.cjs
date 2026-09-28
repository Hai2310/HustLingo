// Dependency-free smoke check for the prototype's main learner/admin paths.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const app = { innerHTML: '' };
const toast = { textContent: '', classList: { add() {}, remove() {} } };
const inputs = {};
const documentListeners = {};
const windowListeners = {};
const storage = new Map();
let currentHash = '';

const context = vm.createContext({
  console,
  structuredClone,
  setTimeout: () => 1,
  clearTimeout() {},
  localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
  document: {
    getElementById: id => ({ app, toast, ...inputs })[id] ?? null,
    addEventListener: (name, handler) => { documentListeners[name] = handler; },
  },
  window: { addEventListener: (name, handler) => { windowListeners[name] = handler; }, scrollTo() {} },
  location: {
    get hash() { return currentHash; },
    set hash(value) { currentHash = value; windowListeners.hashchange?.(); },
  },
});

const source = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
vm.runInContext(source, context, { filename: 'app.js' });

function click(action, data = {}) {
  const node = { dataset: { action, ...data }, disabled: false };
  documentListeners.click({ target: { closest: () => node } });
}

assert.match(app.innerHTML, /Học ít một/);
click('start-quiz', { topic: 'food' });
assert.equal(currentHash, '#learner/quiz/food');
assert.match(app.innerHTML, /assets\/rice\.svg/);
click('select-answer', { value: 'rice' }); click('next-question');
click('select-answer', { value: 'water' }); click('next-question');
click('select-answer', { value: 'bánh mì' }); click('next-question');
assert.equal(currentHash, '#learner/result/food');
assert.match(app.innerHTML, /3\/3/);

click('switch-role');
assert.equal(currentHash, '#admin/overview');
click('go', { page: 'content' });
assert.match(app.innerHTML, /Chủ đề & bài giảng/);
click('edit-topic', { topic: 'family' });
assert.equal(currentHash, '#admin/editor');
inputs['draft-title'] = { value: 'Gia đình thử nghiệm' };
inputs['draft-objective'] = { value: 'Giới thiệu người thân' };
inputs['draft-intro'] = { value: 'Bài học mẫu' };
click('publish-draft');
assert.equal(currentHash, '#admin/content');
assert.match(app.innerHTML, /Gia đình thử nghiệm/);

click('go', { page: 'users' });
click('toggle-user', { user: 'u2' });
assert.equal(vm.runInContext('state.users.find(user => user.id === "u2").status', context), 'disabled');
click('toggle-role', { user: 'u3' });
assert.equal(vm.runInContext('state.users.find(user => user.id === "u3").role', context), 'admin');

console.log('Prototype smoke check passed: learner quiz and admin content/users.');
