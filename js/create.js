(function () {
    'use strict';

    const toast = document.getElementById('toast');
    const form = document.getElementById('createForm');
    const backBtn = document.getElementById('backBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    function showToast(message, type = '') {
        toast.textContent = message;
        toast.className = 'toast' + (type ? ' ' + type : '');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2600);
    }

    function createHistoryField(options) {
        const { input, dropdown, toggle, storageKey } = options;
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
            items.forEach((item, idx) => item.classList.toggle('active', idx === activeIndex));
        }

        function remove(value) {
            history = history.filter(item => item !== value);
            save();
            render(input.value);
            if (history.length === 0) close();
        }

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
                    dropdown.classList.remove('show');
                } else {
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
            const value = item.querySelector('.history-account').textContent.trim();
            if (e.target.closest('.delete-history')) {
                remove(value);
                return;
            }
            input.value = value;
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
    }

    const fields = [
        { id: 'supplierName', key: 'create_field_supplierName' },
        { id: 'bpCode', key: 'create_field_bpCode' },
        { id: 'contactName', key: 'create_field_contactName' },
        { id: 'contactEmail', key: 'create_field_contactEmail' },
        { id: 'commodityType', key: 'create_field_commodityType' },
        { id: 'auditFormNo', key: 'create_field_auditFormNo' }
    ];

    fields.forEach(f => {
        createHistoryField({
            input: document.getElementById(f.id),
            dropdown: document.getElementById('dd_' + f.id),
            toggle: document.querySelector('.dropdown-trigger[data-target="' + f.id + '"]'),
            storageKey: f.key
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const record = {};
        fields.forEach(f => {
            record[f.id] = document.getElementById(f.id).value.trim();
        });

        // 保存各字段历史
        fields.forEach(f => {
            const val = record[f.id];
            if (!val) return;
            let hist = [];
            try {
                hist = JSON.parse(localStorage.getItem(f.key) || '[]');
            } catch (err) {
                hist = [];
            }
            const idx = hist.indexOf(val);
            if (idx >= 0) hist.splice(idx, 1);
            hist.unshift(val);
            hist = hist.slice(0, 10);
            localStorage.setItem(f.key, JSON.stringify(hist));
        });

        // 保存整条记录
        let records = [];
        try {
            records = JSON.parse(localStorage.getItem('create_records') || '[]');
        } catch (err) {
            records = [];
        }
        records.unshift(record);
        records = records.slice(0, 50);
        localStorage.setItem('create_records', JSON.stringify(records));

        showToast(t('toast_create_success'), 'success');
        setTimeout(() => {
            window.location.href = 'search.html';
        }, 800);
    });

    function goBack() {
        window.location.href = 'search.html';
    }

    backBtn.addEventListener('click', goBack);
    cancelBtn.addEventListener('click', goBack);
})();
