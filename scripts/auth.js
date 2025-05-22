function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    if (!username || !password) {
        errorMessage.textContent = 'Vui lòng điền đầy đủ thông tin!';
        return;
    }

    if (!document.getElementById('terms').checked) {
        errorMessage.textContent = 'Vui lòng đồng ý với điều khoản!';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        errorMessage.textContent = 'Tên đăng nhập hoặc mật khẩu không đúng!';
        return;
    }

    localStorage.setItem('loggedInUser', username);
    window.location.href = 'dashboard.html';
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const code = document.getElementById('code').value;
    const errorMessage = document.getElementById('errorMessage');

    if (code !== 'DeadEndtop1') {
        errorMessage.textContent = 'Mã không đúng. Vui lòng nhập "DeadEndtop1"';
        return;
    }

    if (!username || !password) {
        errorMessage.textContent = 'Vui lòng điền đầy đủ thông tin!';
        return;
    }

    if (!document.getElementById('terms').checked) {
        errorMessage.textContent = 'Vui lòng đồng ý với điều khoản!';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.username === username)) {
        errorMessage.textContent = 'Tên đăng nhập đã tồn tại!';
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', username);
    window.location.href = 'dashboard.html';
}