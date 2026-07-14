(function () {
    'use strict';

    const REGISTERED_KEY = 'registered_accounts';
    const LOGIN_HISTORY_KEY = 'login_history';
    const JUST_REGISTERED_KEY = 'just_registered';

    const form = document.getElementById('registerForm');
    const accountInput = document.getElementById('regAccount');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    const confirmInput = document.getElementById('regConfirm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const backBtn = document.getElementById('backBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const toast = document.getElementById('toast');

    const errAccount = document.getElementById('errAccount');
    const errEmail = document.getElementById('errEmail');
    const errPassword = document.getElementById('errPassword');
    const errConfirm = document.getElementById('errConfirm');

    function showToast(message, type = '') {
        toast.textContent = message;
        toast.className = 'toast' + (type ? ' ' + type : '');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        btnText.classList.toggle('hidden', isLoading);
        btnLoader.classList.toggle('hidden', !isLoading);
    }

    function setFieldError(input, errEl, msg) {
        if (msg) {
            errEl.textContent = msg;
            errEl.classList.add('show');
            input.classList.add('input-error');
        } else {
            errEl.textContent = '';
            errEl.classList.remove('show');
            input.classList.remove('input-error');
        }
    }

    function accountExists(account) {
        try {
            const list = JSON.parse(localStorage.getItem(REGISTERED_KEY) || '[]');
            return list.some(r => r.account === account);
        } catch (e) {
            return false;
        }
    }

    function getErrors() {
        const account = accountInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirm = confirmInput.value;
        const errors = {};

        if (!account) {
            errors.account = t('reg_err_account_required');
        } else if (account.length < 3) {
            errors.account = t('reg_err_account_length');
        } else if (!/^[A-Za-z0-9_@.]+$/.test(account)) {
            errors.account = t('reg_err_account_format');
        } else if (accountExists(account)) {
            errors.account = t('reg_err_account_exists');
        }

        if (!email) {
            errors.email = t('reg_err_email_required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = t('reg_err_email_format');
        }

        if (!password) {
            errors.password = t('reg_err_password_required');
        } else if (password.length < 6) {
            errors.password = t('reg_err_password_length');
        }

        if (!confirm) {
            errors.confirm = t('reg_err_confirm_required');
        } else if (confirm !== password) {
            errors.confirm = t('reg_err_confirm_match');
        }

        return errors;
    }

    function renderErrors(errors) {
        setFieldError(accountInput, errAccount, errors.account || '');
        setFieldError(emailInput, errEmail, errors.email || '');
        setFieldError(passwordInput, errPassword, errors.password || '');
        setFieldError(confirmInput, errConfirm, errors.confirm || '');
    }

    function bindToggle(btn, input) {
        if (!btn) return;
        btn.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.querySelector('.eye-open').classList.toggle('hidden', !isPassword);
            btn.querySelector('.eye-closed').classList.toggle('hidden', isPassword);
            btn.setAttribute('aria-label', isPassword ? t('pw_hide') : t('pw_show'));
        });
    }

    bindToggle(document.getElementById('togglePassword'), passwordInput);
    bindToggle(document.getElementById('toggleConfirm'), confirmInput);

    // 输入时清除对应字段的错误提示
    const clearMap = [
        [accountInput, errAccount],
        [emailInput, errEmail],
        [passwordInput, errPassword],
        [confirmInput, errConfirm]
    ];
    clearMap.forEach(([inp, errEl]) => {
        inp.addEventListener('input', () => setFieldError(inp, errEl, ''));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const errors = getErrors();
        renderErrors(errors);

        const order = ['account', 'email', 'password', 'confirm'];
        const firstKey = order.find(k => errors[k]);
        if (firstKey) {
            showToast(errors[firstKey], 'error');
            const map = { account: accountInput, email: emailInput, password: passwordInput, confirm: confirmInput };
            map[firstKey].focus();
            return;
        }

        setLoading(true);

        // 模拟注册请求
        setTimeout(() => {
            const account = accountInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // 持久化注册账号
            let list = [];
            try {
                list = JSON.parse(localStorage.getItem(REGISTERED_KEY) || '[]');
            } catch (err) {
                list = [];
            }
            list.push({ account, email, password, createdAt: Date.now() });
            localStorage.setItem(REGISTERED_KEY, JSON.stringify(list));

            // 同步到登录历史下拉
            let hist = [];
            try {
                hist = JSON.parse(localStorage.getItem(LOGIN_HISTORY_KEY) || '[]');
            } catch (err) {
                hist = [];
            }
            if (!hist.some(h => h.account === account)) {
                hist.unshift({ account, password: '' });
                hist = hist.slice(0, 10);
                localStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(hist));
            }

            // 标记登录页自动回填
            localStorage.setItem(JUST_REGISTERED_KEY, account);

            setLoading(false);
            showToast(t('toast_register_success'), 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        }, 1000);
    });

    function goBack() {
        window.location.href = 'index.html';
    }

    backBtn.addEventListener('click', goBack);
    cancelBtn.addEventListener('click', goBack);

    // 语言切换时刷新已显示的错误文案
    document.addEventListener('langchanged', () => {
        const errors = getErrors();
        renderErrors(errors);
    });
})();
