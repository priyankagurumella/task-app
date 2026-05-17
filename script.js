const API = 'https://task-app-qlf8.onrender.com/api';
let token = localStorage.getItem('token');
let userName = localStorage.getItem('userName');

// Check if logged in
if (token) showDashboard();

function showDashboard() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('user-name').innerText = `Hi, ${userName}! 👋`;
  loadTasks();
}

function showRegister() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
}

function showLogin() {
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
}

async function register() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  document.getElementById('reg-msg').innerText = data.msg;
  if (data.success) showLogin();
}

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.name);
    token = data.token;
    userName = data.name;
    showDashboard();
  } else {
    document.getElementById('login-msg').innerText = data.msg;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  location.reload();
}

async function loadTasks() {
  const res = await fetch(`${API}/tasks`, {
    headers: { 'authorization': token }
  });
  const tasks = await res.json();

  document.getElementById('pending-tasks').innerHTML = '';
  document.getElementById('progress-tasks').innerHTML = '';
  document.getElementById('completed-tasks').innerHTML = '';

  tasks.forEach(task => {
    const card = `
      <div class="task-card">
        <h4>${task.title}</h4>
        <p>${task.description}</p>
        <select onchange="updateTask('${task._id}', this.value)">
          <option ${task.status === 'pending' ? 'selected' : ''} value="pending">Pending</option>
          <option ${task.status === 'inprogress' ? 'selected' : ''} value="inprogress">In Progress</option>
          <option ${task.status === 'completed' ? 'selected' : ''} value="completed">Completed</option>
        </select>
        <button onclick="deleteTask('${task._id}')">🗑️ Delete</button>
      </div>
    `;
    if (task.status === 'pending') {
      document.getElementById('pending-tasks').innerHTML += card;
    } else if (task.status === 'inprogress') {
      document.getElementById('progress-tasks').innerHTML += card;
    } else {
      document.getElementById('completed-tasks').innerHTML += card;
    }
  });
}

async function addTask() {
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-desc').value;

  if (!title) { alert('Please enter task title!'); return; }

  await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': token
    },
    body: JSON.stringify({ title, description })
  });

  document.getElementById('task-title').value = '';
  document.getElementById('task-desc').value = '';
  loadTasks();
}

async function updateTask(id, status) {
  await fetch(`${API}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'authorization': token
    },
    body: JSON.stringify({ status })
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'authorization': token }
  });
  loadTasks();
}