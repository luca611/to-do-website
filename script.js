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

const todoNotes = JSON.parse(localStorage.getItem('todoNotes')) || [];
const completedNotes = JSON.parse(localStorage.getItem('completedNotes')) || [];

const saveNotesToLocalStorage = () => {
    localStorage.setItem('todoNotes', JSON.stringify(todoNotes));
    localStorage.setItem('completedNotes', JSON.stringify(completedNotes));
};

const createNoteElement = (task, isCompleted) => {
    const listItem = document.createElement('div');
    listItem.classList.add('note');
    const colors = ['blueNote', 'greenNote', 'redNote'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    listItem.classList.add(randomColor);
    const text = document.createElement('p');
    text.textContent = task;
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.addEventListener('click', () => {

        todoNotes.splice(todoNotes.indexOf(task), 1);
        completedNotes.push(task);
        buttons.removeChild(completeButton);
        buttons.removeChild(deleteButton);
        completedList.appendChild(listItem);
        if (todoList.contains(listItem)) {
            todoList.removeChild(listItem);

        }
        saveNotesToLocalStorage();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        if (todoList.contains(listItem)) {
            todoNotes.splice(todoNotes.indexOf(task), 1);
            todoList.removeChild(listItem);
        } else {
            completedNotes.splice(completedNotes.indexOf(task), 1);
            completedList.removeChild(listItem);
        }
        saveNotesToLocalStorage();
    });

    listItem.appendChild(text);

    const buttons = document.createElement('div');
    buttons.classList.add('buttons');
    buttons.appendChild(completeButton);
    buttons.appendChild(deleteButton);
    if(!isCompleted){
        listItem.appendChild(buttons);
    }
    return listItem;
};

const renderTodoNotes = () => {
    todoList.innerHTML = '';
    todoNotes.forEach(task => {
        const listItem = createNoteElement(task, false);
        todoList.appendChild(listItem);
    });
};

const renderCompletedNotes = () => {
    completedList.innerHTML = '';
    completedNotes.forEach(task => {
        const listItem = createNoteElement(task, true);
        completedList.appendChild(listItem);
    });
};

todoForm.addEventListener('submit', event => {
    event.preventDefault();
    const task = todoInput.value.trim();
    if (task !== '') {
        todoNotes.push(task);
        const listItem = createNoteElement(task, false);
        todoList.appendChild(listItem);
        saveNotesToLocalStorage();
        todoInput.value = '';
    }
});

// Render initial notes
renderTodoNotes();
renderCompletedNotes();


//ai

const apiKey = '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'; // Replace with your API key since i'll be deleting this key after a bit (but it's free to create your own so don't be a hungry aah and expect to use mine for your own projects)

async function getGroqChatCompletion(idea) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: [{ role: 'user', content: "suggest one single ativity to do regarding " + idea +" write for it a short phrase with no extras (avoid ** and other markdowns)" }],
            model: 'llama3-70b-8192'
        })
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
}

function generateIdea(){
    let theme = document.getElementById("theme-input").value
    if(theme === ""){
        document.getElementById("ai-response").innerHTML = "Please enter a theme";
        return;
    }

    getGroqChatCompletion(theme).then((response) => {
        const idea = response;
        const listItem = createNoteElement(idea, false);
        todoNotes.push(idea);
        todoList.appendChild(listItem);
        saveNotesToLocalStorage();
        document.getElementById("ai-response").innerHTML = idea;
    });
}