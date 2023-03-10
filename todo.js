// Variables
let todoItems = []
const todoInput = document.querySelector('.todo-input')
const completedTodosDiv = document.querySelector('.completed-todos')
const uncompletedTodosDiv = document.querySelector('.uncompleted-todos')
const audio = new Audio('mp3/plop.mp3')

// Get todo list on first boot
window.onload = () => {
    const storageTodoItems = localStorage.getItem('todoItems')
    if (storageTodoItems) {
        todoItems = JSON.parse(storageTodoItems)
    }

    render()
}

// Get the content typed into the input
todoInput.addEventListener('keyup', (e) => {
    const value = e.target.value.trim()
    if (value && e.key === 'Enter') {
        addTodo(value)

        todoInput.value = ''
        todoInput.focus()
    }
})

// Add todo
function addTodo(text) {
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    })

    saveAndRender()
}

// Remove todo
function removeTodo(id) {
    todoItems = todoItems.filter(todo => todo.id !== Number(id))

    saveAndRender()
}

// Mark as completed
function markAsCompleted(id) {
    todoItems = todoItems.map(todo => {
        if (todo.id === Number(id)) {
            todo.completed = true
        }

        return todo
    })

    audio.play()

    saveAndRender()
}

// Mark as uncompleted
function markAsUncompleted(id) {
    todoItems = todoItems.map(todo => {
        if (todo.id === Number(id)) {
            todo.completed = false
        }

        return todo
    })

    saveAndRender()
}

// Save in local storage
function save() {
    localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

// Render
function render() {
    const uncompletedTodos = todoItems.filter(item => !item.completed)
    const completedTodos = todoItems.filter(item => item.completed)

    completedTodosDiv.innerHTML = ''
    uncompletedTodosDiv.innerHTML = ''

    if (uncompletedTodos.length > 0) {
        uncompletedTodos.forEach(todo => {
            uncompletedTodosDiv.appendChild(createTodoElement(todo))
        })
    } else {
        uncompletedTodosDiv.innerHTML = `<div class='empty'>No uncompleted task </div>`
    }

    if (completedTodos.length > 0) {
        completedTodosDiv.innerHTML = `<div class='completed-title'>Completed (${completedTodos.length} / ${todoItems.length}) </div>`
        completedTodos.forEach(todo => {
            completedTodosDiv.appendChild(createTodoElement(todo))
        })
    }
}

// Save and render
function saveAndRender() {
    save()
    render()
}

// Create todo list item
function createTodoElement(todo) {
    // Create todo list container
    const todoDiv = document.createElement('div')
    todoDiv.dataset.id = todo.id
    todoDiv.className = 'todo-item'

    // Create todo item text
    const todoTextSpan = document.createElement('span')
    todoTextSpan.textContent = todo.text

    // Checkbox for list
    const todoInputCheckBox = document.createElement('input')
    todoInputCheckBox.type = 'checkbox'
    todoInputCheckBox.checked = todo.completed
    todoInputCheckBox.addEventListener('click', (e) => {
        const id = e.target.closest('.todo-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
    })

    // Delete button for list
    const todoRemoveBtn = document.createElement('a')
    todoRemoveBtn.href = '#'
    todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24"
                                height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M18 6l-12 12"></path>
                                <path d="M6 6l12 12">
                                </path>
                                </svg>`
    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        removeTodo(id)
    }

    todoTextSpan.prepend(todoInputCheckBox)
    todoDiv.appendChild(todoTextSpan)
    todoDiv.appendChild(todoRemoveBtn)

    return todoDiv
}