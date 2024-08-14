const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const pageId = link.getAttribute('data-page');
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === `${pageId}-page`) {
                page.classList.add('active');
            }
        });
    });
});

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');

todoForm.addEventListener('submit', event => {
    event.preventDefault();
    const task = todoInput.value.trim();
    if (task !== '') {
        const listItem = document.createElement('div');
        const text = document.createElement('p');
        text.textContent = task;
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.addEventListener('click', () => {
            completedList.appendChild(listItem);
            listItem.removeChild(completeButton);
        });
        listItem.appendChild(text);
        listItem.appendChild(completeButton);
        todoList.appendChild(listItem);
        todoInput.value = '';
    }
});