(function () {
    'use strict';

    const ACCOUNT_KEY = 'last_account';

    const toast = document.getElementById('toast');
    const welcomeText = document.getElementById('welcomeText');
    const logoutBtn = document.getElementById('logoutBtn');
    const searchBtn = document.getElementById('searchBtn');
    const createBtn = document.getElementById('createBtn');

    const typeTrigger = document.getElementById('typeTrigger');
    const typeCurrent = document.getElementById('typeCurrent');
    const typeMenu = document.getElementById('typeMenu');
    const searchInput = document.getElementById('searchInput');

    // 显示欢迎词（取已保存的账号，跟随语言切换）
    function updateWelcome() {
        const savedAccount = localStorage.getItem(ACCOUNT_KEY);
        if (!welcomeText) return;
        welcomeText.textContent = savedAccount
            ? (t('ws_prefix') + savedAccount + t('ws_suffix'))
            : (t('ws_prefix') + t('ws_suffix'));
    }
    updateWelcome();

    function showToast(message, type = '') {
        toast.textContent = message;
        toast.className = 'toast' + (type ? ' ' + type : '');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2600);
    }

    /**
     * 为一个输入框 + 下拉框创建历史记录管理
     */
    function createHistoryField(options) {
        const {
            input,
            dropdown,
            toggle,
            storageKey,
            onCommit
        } = options;

        let history = [];
        let activeIndex = -1;

        function load() {
            try {
                const raw = localStorage.getItem(storageKey);
                history = raw ? JSON.parse(raw) : [];
            } catch (e) {
                history = [];
            }
        }

        function save() {
            localStorage.setItem(storageKey, JSON.stringify(history));
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function render(filterText) {
            const term = filterText.toLowerCase().trim();
            const filtered = history.filter(item => item.toLowerCase().includes(term));

            dropdown.innerHTML = '';

            if (filtered.length === 0) {
                dropdown.innerHTML = '<li class="empty-history">' + t('empty_history') + '</li>';
                return;
            }

            filtered.forEach((item) => {
                const li = document.createElement('li');
                li.className = 'history-item';
                li.setAttribute('role', 'option');
                li.innerHTML = `
                    <span class="history-account">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${escapeHtml(item)}
                    </span>
                    <button type="button" class="delete-history" title="删除该记录" aria-label="删除 ${escapeHtml(item)}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                `;
                dropdown.appendChild(li);
            });
        }

        function open() {
            render(input.value);
            dropdown.classList.add('show');
        }

        function close() {
            setTimeout(() => {
                dropdown.classList.remove('show');
                activeIndex = -1;
            }, 150);
        }

        function highlight(items) {
            items.forEach((item, idx) => {
                item.classList.toggle('active', idx === activeIndex);
            });
        }

        function commit(value) {
            value = value.trim();
            if (!value) return;
            const idx = history.indexOf(value);
            if (idx >= 0) history.splice(idx, 1);
            history.unshift(value);
            history = history.slice(0, 10);
            save();
            if (typeof onCommit === 'function') onCommit(value);
        }

        function remove(value) {
            history = history.filter(item => item !== value);
            save();
            render(input.value);
            if (history.length === 0) close();
        }

        // 事件
        input.addEventListener('focus', open);
        input.addEventListener('input', open);
        input.addEventListener('blur', close);

        input.addEventListener('keydown', (e) => {
            if (!dropdown.classList.contains('show')) return;
            const items = dropdown.querySelectorAll('.history-item');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = (activeIndex + 1) % items.length;
                highlight(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = (activeIndex - 1 + items.length) % items.length;
                highlight(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeIndex >= 0 && items[activeIndex]) {
                    const val = items[activeIndex].querySelector('.history-account').textContent.trim();
                    input.value = val;
                    commit(val);
                    dropdown.classList.remove('show');
                } else {
                    commit(input.value);
                    dropdown.classList.remove('show');
                }
            } else if (e.key === 'Escape') {
                dropdown.classList.remove('show');
                activeIndex = -1;
            }
        });

        dropdown.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const item = e.target.closest('.history-item');
            if (!item) return;
            const accountSpan = item.querySelector('.history-account');
            const value = accountSpan.textContent.trim();
            if (e.target.closest('.delete-history')) {
                remove(value);
                return;
            }
            input.value = value;
            commit(value);
            dropdown.classList.remove('show');
        });

        if (toggle) {
            toggle.addEventListener('click', () => {
                dropdown.classList.toggle('show');
                if (dropdown.classList.contains('show')) render(input.value);
            });
        }

        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !dropdown.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
                dropdown.classList.remove('show');
            }
        });

        load();
        return { commit, open, close };
    }

    /* ===== 搜索类型选择 ===== */
    const TYPE_KEY = 'search_type';
    let currentType = localStorage.getItem(TYPE_KEY) || 'supplier';

    function syncTypeUI() {
        const option = typeMenu.querySelector('.type-option[data-value="' + currentType + '"]');
        if (option) {
            const cls = getLang() === 'en' ? '.type-en' : '.type-cn';
            typeCurrent.textContent = option.querySelector(cls).textContent;
            typeMenu.querySelectorAll('.type-option').forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.value === currentType);
            });
        }
    }

    function openTypeMenu() {
        typeMenu.classList.add('show');
        typeTrigger.setAttribute('aria-expanded', 'true');
    }

    function closeTypeMenu() {
        typeMenu.classList.remove('show');
        typeTrigger.setAttribute('aria-expanded', 'false');
    }

    typeTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeMenu.classList.contains('show')) {
            closeTypeMenu();
        } else {
            openTypeMenu();
        }
    });

    typeMenu.addEventListener('click', (e) => {
        const option = e.target.closest('.type-option');
        if (!option) return;
        currentType = option.dataset.value;
        localStorage.setItem(TYPE_KEY, currentType);
        syncTypeUI();
        closeTypeMenu();
    });

    document.addEventListener('click', (e) => {
        if (!typeTrigger.contains(e.target) && !typeMenu.contains(e.target)) {
            closeTypeMenu();
        }
    });

    syncTypeUI();
    document.addEventListener('langchanged', () => {
        updateWelcome();
        syncTypeUI();
    });

    const searchField = createHistoryField({
        input: document.getElementById('searchInput'),
        dropdown: document.getElementById('searchDropdown'),
        toggle: document.getElementById('searchToggle'),
        storageKey: 'search_history'
    });

    searchBtn.addEventListener('click', () => {
        const val = searchInput.value.trim();
        if (!val) {
            showToast(t('toast_search_empty'), 'error');
            searchInput.focus();
            return;
        }
        searchField.commit(val);
        showToast(t('toast_search_by', { type: typeCurrent.textContent, val }), 'success');
    });

    createBtn.addEventListener('click', () => {
        window.location.href = 'create.html';
    });

    logoutBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
})();
