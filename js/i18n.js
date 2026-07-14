/* 全局中英文切换 */
const I18N = {
    zh: {
        hero_title: '欢迎使用现场稽核评估',
        hero_desc: '公告组件可在首页中心位置即时传达重要消息、更新或推广内容，为您提供无缝方式传递关键信息，如应用更新和其他时效性内容。',
        hero_cta: '配置公告组件',
        form_title: '登录账号',
        form_subtitle: '请输入您的账号和密码继续',
        label_account: '账号',
        label_password: '密码',
        ph_account: '请输入账号',
        ph_password: '请输入密码',
        remember: '保存密码',
        forgot: '忘记密码？',
        btn_login: '登录',
        ws_title: '工作台',
        ws_prefix: '欢迎回来，',
        ws_suffix: ' · 开始你的搜索与创建',
        search_hint: '输入过的名称会以历史下拉形式保存，点击即可复用',
        create_hint: '点击下方按钮直接创建新条目',
        btn_create: '创建',
        back: '返回',
        create_title: '创建',
        create_subtitle: '填写以下信息以新建条目',
        cancel: '取消',
        ph_supplier: '如：上海精密制造有限公司',
        ph_bp: '如：BP-100245',
        ph_contact: '如：张伟',
        ph_email: '如：contact@example.com',
        ph_commodity: '如：电子元器件',
        ph_audit: '如：AF-2026-0001',
        ph_search: '输入关键词搜索（支持中 / 英文）',
        empty_history: '暂无历史记录',
        empty_account: '暂无历史账号',
        toast_account_required: '请输入账号',
        toast_password_required: '请输入密码',
        toast_login_success: '登录成功！',
        toast_search_empty: '请输入搜索关键词',
        toast_search_by: '按「{type}」搜索：{val}',
        toast_create_success: '创建成功！',
        pw_show: '显示密码',
        pw_hide: '隐藏密码',
        btn_create_account: '创建账号',
        reg_title: '创建账号',
        reg_subtitle: '填写以下信息注册新账号',
        reg_form_title: '注册新账号',
        reg_form_subtitle: '账号信息将保存在本设备',
        reg_label_account: '账号',
        reg_label_email: '邮箱',
        reg_label_password: '密码',
        reg_label_confirm: '确认密码',
        ph_reg_account: '请输入账号（至少 3 个字符）',
        ph_reg_email: '请输入邮箱',
        ph_reg_password: '请输入密码（至少 6 位）',
        ph_reg_confirm: '请再次输入密码',
        btn_register: '注册',
        reg_note: '演示站点：账号与密码仅保存在本地浏览器，不会上传服务器。',
        reg_err_account_required: '请输入账号',
        reg_err_account_length: '账号至少 3 个字符',
        reg_err_account_format: '账号只能包含字母、数字、下划线或 @ .',
        reg_err_account_exists: '该账号已被注册',
        reg_err_email_required: '请输入邮箱',
        reg_err_email_format: '邮箱格式不正确',
        reg_err_password_required: '请输入密码',
        reg_err_password_length: '密码至少 6 位',
        reg_err_confirm_required: '请再次输入密码',
        reg_err_confirm_match: '两次输入的密码不一致',
        toast_register_success: '注册成功！请登录',
        toast_login_wrong_password: '密码错误'
    },
    en: {
        hero_title: 'Welcome to Onsite Audit Assessment',
        hero_desc: 'The Announcement Widget can take center stage on the home screen to instantly relay important messages, updates, or promotions. It can offer a seamless way to communicate critical information, such as application updates and other time-sensitive information.',
        hero_cta: 'Configure the Announcements widget',
        form_title: 'Sign In',
        form_subtitle: 'Enter your account and password to continue',
        label_account: 'Account',
        label_password: 'Password',
        ph_account: 'Enter your account',
        ph_password: 'Enter your password',
        remember: 'Save password',
        forgot: 'Forgot password?',
        btn_login: 'Sign In',
        ws_title: 'Workspace',
        ws_prefix: 'Welcome back, ',
        ws_suffix: ' · Start your search and create',
        search_hint: 'Previously entered names are saved as a history dropdown, click to reuse',
        create_hint: 'Click the button below to create a new entry directly',
        btn_create: 'Create',
        back: 'Back',
        create_title: 'Create',
        create_subtitle: 'Fill in the following information to create a new entry',
        cancel: 'Cancel',
        ph_supplier: 'e.g. Shanghai Precision Mfg. Co., Ltd.',
        ph_bp: 'e.g. BP-100245',
        ph_contact: 'e.g. Zhang Wei',
        ph_email: 'e.g. contact@example.com',
        ph_commodity: 'e.g. Electronic Components',
        ph_audit: 'e.g. AF-2026-0001',
        ph_search: 'Enter keywords to search (CN / EN supported)',
        empty_history: 'No history yet',
        empty_account: 'No saved accounts',
        toast_account_required: 'Please enter your account',
        toast_password_required: 'Please enter your password',
        toast_login_success: 'Signed in successfully!',
        toast_search_empty: 'Please enter a search keyword',
        toast_search_by: 'Search by {type}: {val}',
        toast_create_success: 'Created successfully!',
        pw_show: 'Show password',
        pw_hide: 'Hide password',
        btn_create_account: 'Create Account',
        reg_title: 'Create Account',
        reg_subtitle: 'Fill in the details to create a new account',
        reg_form_title: 'Register a new account',
        reg_form_subtitle: 'Your account info is stored on this device',
        reg_label_account: 'Account',
        reg_label_email: 'Email',
        reg_label_password: 'Password',
        reg_label_confirm: 'Confirm Password',
        ph_reg_account: 'Enter account (min 3 characters)',
        ph_reg_email: 'Enter your email',
        ph_reg_password: 'Enter password (min 6 characters)',
        ph_reg_confirm: 'Re-enter your password',
        btn_register: 'Register',
        reg_note: 'Demo only: account & password are stored locally in your browser and never sent to a server.',
        reg_err_account_required: 'Please enter an account',
        reg_err_account_length: 'Account must be at least 3 characters',
        reg_err_account_format: 'Account can only contain letters, digits, _ @ .',
        reg_err_account_exists: 'This account is already registered',
        reg_err_email_required: 'Please enter an email',
        reg_err_email_format: 'Invalid email format',
        reg_err_password_required: 'Please enter a password',
        reg_err_password_length: 'Password must be at least 6 characters',
        reg_err_confirm_required: 'Please confirm your password',
        reg_err_confirm_match: 'Passwords do not match',
        toast_register_success: 'Registered! Please sign in',
        toast_login_wrong_password: 'Incorrect password'
    }
};

function applyLang(lang) {
    lang = lang === 'en' ? 'en' : 'zh';
    document.body.setAttribute('data-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (I18N[lang][key] != null) el.textContent = I18N[lang][key];
    });

    document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
        const key = el.getAttribute('data-i18n-ph');
        if (I18N[lang][key] != null) el.setAttribute('placeholder', I18N[lang][key]);
    });

    document.querySelectorAll('.lang-opt').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });

    localStorage.setItem('lang', lang);
    document.dispatchEvent(new CustomEvent('langchanged', { detail: { lang } }));
}

function initLang() {
    const lang = localStorage.getItem('lang') || 'zh';
    applyLang(lang);
    const switchEl = document.getElementById('langSwitch');
    if (switchEl) {
        switchEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-opt');
            if (!btn) return;
            applyLang(btn.getAttribute('data-lang'));
        });
    }
}

function getLang() {
    return document.body.getAttribute('data-lang') === 'en' ? 'en' : 'zh';
}

function t(key, vars) {
    let str = I18N[getLang()][key];
    if (str == null) str = key;
    if (vars) {
        Object.keys(vars).forEach((k) => {
            str = str.split('{' + k + '}').join(vars[k]);
        });
    }
    return str;
}

initLang();
