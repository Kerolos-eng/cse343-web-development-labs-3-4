(() => {
  const STORAGE_KEY = 'cse343-daybook-tasks-v1';
  const form = document.querySelector('#todo-form');
  const input = document.querySelector('#todo-input');
  const list = document.querySelector('#todo-list');
  const emptyState = document.querySelector('#empty-state');
  const remaining = document.querySelector('#remaining');
  const countBadge = document.querySelector('#count-badge');
  const allCount = document.querySelector('#all-count');
  const progressRing = document.querySelector('.progress-ring');
  const progressValue = document.querySelector('#progress-value');
  const toast = document.querySelector('#toast');
  const today = document.querySelector('#today');
  let activeFilter = 'all';
  let toastTimer;

  class TaskList {
    constructor() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        this.items = Array.isArray(saved) ? saved.filter((item) => item && typeof item.id === 'string' && typeof item.text === 'string' && typeof item.completed === 'boolean') : [];
      } catch {
        this.items = [];
      }
    }
    save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items)); }
    add(text) {
      this.items.unshift({ id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, completed: false, createdAt: Date.now() });
      this.save();
    }
    toggle(id) {
      this.items = this.items.map((item) => item.id === id ? { ...item, completed: !item.completed } : item);
      this.save();
    }
    update(id, text) {
      this.items = this.items.map((item) => item.id === id ? { ...item, text } : item);
      this.save();
    }
    remove(id) { this.items = this.items.filter((item) => item.id !== id); this.save(); }
    clearCompleted() { this.items = this.items.filter((item) => !item.completed); this.save(); }
    clearAll() { this.items = []; this.save(); }
    visible(filter) {
      if (filter === 'active') return this.items.filter((item) => !item.completed);
      if (filter === 'completed') return this.items.filter((item) => item.completed);
      return this.items;
    }
  }

  const tasks = new TaskList();
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 1800);
  };
  const render = () => {
    const shown = tasks.visible(activeFilter);
    const total = tasks.items.length;
    const done = tasks.items.filter((task) => task.completed).length;
    const left = total - done;
    list.innerHTML = shown.map((task) => `
      <li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${escapeHtml(task.id)}">
        <button class="check-button" data-action="toggle" aria-label="${task.completed ? 'Mark as active' : 'Mark as completed'}" aria-pressed="${task.completed}">
          ${task.completed ? '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 8 3.1 3L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        </button>
        <button class="task-label" data-action="edit" aria-label="Edit task: ${escapeHtml(task.text)}">${escapeHtml(task.text)}</button>
        <button class="delete-button" data-action="delete" aria-label="Delete task: ${escapeHtml(task.text)}">×</button>
      </li>`).join('');
    emptyState.classList.toggle('visible', shown.length === 0);
    emptyState.querySelector('strong').textContent = total === 0 ? 'Your list is clear.' : activeFilter === 'active' ? 'Nothing left to do.' : 'No completed tasks yet.';
    emptyState.querySelector('small').textContent = total === 0 ? 'Add a task above to get started.' : 'Try another filter or add a new task.';
    remaining.textContent = `${left} ${left === 1 ? 'task' : 'tasks'} left`;
    countBadge.textContent = `${total} ${total === 1 ? 'TASK' : 'TASKS'}`;
    allCount.textContent = total;
    const percent = total ? Math.round(done / total * 100) : 0;
    progressValue.textContent = `${percent}%`;
    progressRing.style.setProperty('--progress', `${percent}%`);
    document.querySelector('#clear-completed').disabled = done === 0;
    document.querySelector('#clear-all').disabled = total === 0;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    tasks.add(text);
    input.value = '';
    activeFilter = 'all';
    document.querySelectorAll('.filter').forEach((button) => {
      const selected = button.dataset.filter === activeFilter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    render(); input.focus(); showToast('Task added to your list.');
  });

  document.querySelector('.filters').addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach((filterButton) => {
      const selected = filterButton === button;
      filterButton.classList.toggle('active', selected);
      filterButton.setAttribute('aria-pressed', String(selected));
    });
    render();
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const item = button.closest('[data-id]');
    const id = item.dataset.id;
    if (button.dataset.action === 'toggle') { tasks.toggle(id); render(); }
    if (button.dataset.action === 'delete') { tasks.remove(id); render(); showToast('Task deleted.'); }
    if (button.dataset.action === 'edit') beginEdit(item, id, button.textContent);
  });

  list.addEventListener('dblclick', (event) => {
    const label = event.target.closest('.task-label');
    if (label) beginEdit(label.closest('[data-id]'), label.closest('[data-id]').dataset.id, label.textContent);
  });
  function beginEdit(item, id, oldText) {
    if (!item) return;
    const editor = document.createElement('input');
    editor.className = 'edit-input'; editor.type = 'text'; editor.maxLength = 120; editor.value = oldText;
    editor.setAttribute('aria-label', 'Edit task');
    const label = item.querySelector('.task-label');
    label.replaceWith(editor); editor.focus(); editor.select();
    let finished = false;
    const finish = (save) => {
      if (finished) return; finished = true;
      const text = editor.value.trim();
      if (save && text) { tasks.update(id, text); showToast('Task updated.'); }
      render();
    };
    editor.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') finish(true);
      if (event.key === 'Escape') finish(false);
    });
    editor.addEventListener('blur', () => finish(true));
  }

  document.querySelector('#clear-completed').addEventListener('click', () => {
    const count = tasks.items.filter((task) => task.completed).length;
    if (!count) return;
    tasks.clearCompleted(); render(); showToast(`${count} completed ${count === 1 ? 'task' : 'tasks'} cleared.`);
  });
  document.querySelector('#clear-all').addEventListener('click', () => {
    if (!tasks.items.length) return;
    tasks.clearAll(); render(); showToast('Your list has been cleared.');
  });

  today.textContent = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date()).toUpperCase();
  render();
})();
