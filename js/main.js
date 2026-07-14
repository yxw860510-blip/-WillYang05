(function () {
    'use strict';

    const STORAGE_KEY = 'login_history';
    const ACCOUNT_KEY = 'last_account';
    const PASSWORD_KEY = 'saved_password';
    const REMEMBER_KEY = 'remember_password';
    const REGISTERED_KEY = 'registered_accounts';
    const JUST_REGISTERED_KEY = 'just_registered';

    const accountInput = document.getElementById('account');
    const passwordInput = document.getElementById('password');
    const historyDropdown = document.getElementById('historyDropdown');
    const historyToggle = document.getElementById('historyToggle');
    const togglePassword = document.getElementById('togglePassword');
    const rememberPassword = document.getElementById('rememberPassword');
    const createAccountBtn = document.getElementById('createAccountBtn');
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const toast = document.getElementById('toast');

    let history = [];
    let activeIndex = -1;

    // 读取历史记录
    function loadHistory() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            history = raw ? JSON.parse(raw) : [];
        } catch (e) {
            history = [];
        }
    }

    function saveHistory() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }

    function loadSavedPassword() {
        const shouldRemember = localStorage.getItem(REMEMBER_KEY) === 'true';
        rememberPassword.checked = shouldRemember;

        if (shouldRemember) {
            const savedAccount = localStorage.getItem(ACCOUNT_KEY) || '';
            const savedPassword = localStorage.getItem(PASSWORD_KEY) || '';
            if (savedAccount) {
                accountInput.value = savedAccount;
            }
            if (savedPassword) {
                passwordInput.value = savedPassword;
            }
        }
    }

    function getRegisteredAccount(account) {
        try {
            const list = JSON.parse(localStorage.getItem(REGISTERED_KEY) || '[]');
            return list.find(r => r.account === account) || null;
        } catch (e) {
            return null;
        }
    }

    function showDropdown() {
        renderHistory(accountInput.value);
        historyDropdown.classList.add('show');
    }

    function hideDropdown() {
        setTimeout(() => {
            historyDropdown.classList.remove('show');
            activeIndex = -1;
        }, 150);
    }

    function renderHistory(filterText) {
        const term = filterText.toLowerCase().trim();
        const filtered = history.filter(item => item.account.toLowerCase().includes(term));

        historyDropdown.innerHTML = '';

        if (filtered.length === 0) {
            historyDropdown.innerHTML = '<li class="empty-history">' + t('empty_account') + '</li>';
            return;
        }

        filtered.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.setAttribute('role', 'option');
            li.setAttribute('data-index', index);
            li.innerHTML = `
                <span class="history-account">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    ${escapeHtml(item.account)}
                </span>
                <button type="button" class="delete-history" title="删除该账号" aria-label="删除 ${escapeHtml(item.account)}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;
            historyDropdown.appendChild(li);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function selectAccount(account) {
        accountInput.value = account;
        const record = history.find(item => item.account === account);
        if (record && record.password) {
            passwordInput.value = record.password;
            rememberPassword.checked = true;
        }
        historyDropdown.classList.remove('show');
        activeIndex = -1;
        passwordInput.focus();
    }

    function addOrUpdateHistory(account, password) {
        const existingIndex = history.findIndex(item => item.account === account);
        const record = { account, password: rememberPassword.checked ? password : '' };

        if (existingIndex >= 0) {
            history.splice(existingIndex, 1);
        }
        history.unshift(record);
        history = history.slice(0, 10);
        saveHistory();
    }

    function removeHistory(account) {
        history = history.filter(item => item.account !== account);
        saveHistory();
        renderHistory(accountInput.value);
        if (history.length === 0) {
            hideDropdown();
        }
    }

    function showToast(message, type = '') {
        toast.textContent = message;
        toast.className = 'toast' + (type ? ' ' + type : '');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        btnText.classList.toggle('hidden', isLoading);
        btnLoader.classList.toggle('hidden', !isLoading);
    }

    // 事件监听
    accountInput.addEventListener('focus', showDropdown);

    accountInput.addEventListener('blur', () => {
        hideDropdown();
    });

    accountInput.addEventListener('input', () => {
        showDropdown();
    });

    accountInput.addEventListener('keydown', (e) => {
        if (!historyDropdown.classList.contains('show')) return;

        const items = historyDropdown.querySelectorAll('.history-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % items.length;
            highlightItem(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            highlightItem(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && items[activeIndex]) {
                const account = history.find(item => item.account.toLowerCase().includes(accountInput.value.toLowerCase().trim()))?.account;
                if (account) selectAccount(account);
            }
        } else if (e.key === 'Escape') {
            historyDropdown.classList.remove('show');
            activeIndex = -1;
        }
    });

    function highlightItem(items) {
        items.forEach((item, idx) => {
            item.classList.toggle('active', idx === activeIndex);
        });
    }

    historyDropdown.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const item = e.target.closest('.history-item');
        if (!item) return;

        const accountSpan = item.querySelector('.history-account');
        if (e.target.closest('.delete-history')) {
            const account = accountSpan.textContent.trim();
            removeHistory(account);
            return;
        }

        const account = accountSpan.textContent.trim();
        selectAccount(account);
    });

    historyToggle.addEventListener('click', () => {
        historyDropdown.classList.toggle('show');
        if (historyDropdown.classList.contains('show')) {
            renderHistory(accountInput.value);
        }
    });

    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePassword.querySelector('.eye-open').classList.toggle('hidden', !isPassword);
        togglePassword.querySelector('.eye-closed').classList.toggle('hidden', isPassword);
        togglePassword.setAttribute('aria-label', isPassword ? t('pw_hide') : t('pw_show'));
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const account = accountInput.value.trim();
        const password = passwordInput.value;

        if (!account) {
            showToast(t('toast_account_required'), 'error');
            accountInput.focus();
            return;
        }

        if (!password) {
            showToast(t('toast_password_required'), 'error');
            passwordInput.focus();
            return;
        }

        // 已注册账号：校验密码
        const regRecord = getRegisteredAccount(account);
        if (regRecord && regRecord.password !== password) {
            showToast(t('toast_login_wrong_password'), 'error');
            passwordInput.focus();
            return;
        }

        setLoading(true);

        // 模拟登录请求
        setTimeout(() => {
            setLoading(false);
            addOrUpdateHistory(account, password);

            localStorage.setItem(ACCOUNT_KEY, account);
            localStorage.setItem(REMEMBER_KEY, rememberPassword.checked ? 'true' : 'false');
            if (rememberPassword.checked) {
                localStorage.setItem(PASSWORD_KEY, password);
            } else {
                localStorage.removeItem(PASSWORD_KEY);
            }

            showToast(t('toast_login_success'), 'success');
            console.log('登录信息:', { account, password });
            setTimeout(() => {
                window.location.href = 'search.html';
            }, 700);
        }, 1200);
    });

    // 点击页面其他区域关闭下拉
    document.addEventListener('click', (e) => {
        if (!accountInput.contains(e.target) && !historyDropdown.contains(e.target) && !historyToggle.contains(e.target)) {
            historyDropdown.classList.remove('show');
        }
    });

    // 创建账号 → 跳转到注册页
    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', () => {
            window.location.href = 'register.html';
        });
    }

    // 初始化
    loadHistory();
    loadSavedPassword();

    // 注册成功后自动回填账号并提示
    const justReg = localStorage.getItem(JUST_REGISTERED_KEY);
    if (justReg) {
        accountInput.value = justReg;
        localStorage.removeItem(JUST_REGISTERED_KEY);
        showToast(t('toast_register_success'), 'success');
        passwordInput.focus();
    }
})();
