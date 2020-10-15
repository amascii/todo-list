var todoList = {
  todos: [],
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
  },
  changeTodo: function(position, todoText) { this.todos[position].todoText = todoText;},
  deleteTodo: function(position) { this.todos.splice(position, 1); },
  toggleCompleted: function(position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
  },
  toggleAll: function() {
    var totalTodos = this.todos.length;
    var completedTodos = 0;
    
    // Get number of completed todos.
    this.todos.forEach(function(todo) { if(todo.completed === true) completedTodos++; });
    
    // Case 1: If everything’s true, make everything false.
    // Case 2: Otherwise, make everything true.
    this.todos.forEach( function(todo) { todo.completed = !(completedTodos === totalTodos); });
  }
};

var handlers = {
  addTodo: function() {
    var addTodoTextInput = document.getElementById('mainTextInput');
    if(addTodoTextInput.value != "") {
      todoList.addTodo(addTodoTextInput.value);
      addTodoTextInput.value = '';
      view.displayTodos();
    }
  },
  changeTodo: function(position) {
    var li = document.getElementById(""+position);
    var liTextContent = li.childNodes[2].textContent;
    
    //for(var i = 0; i < 3; i++) li.removeChild(li.childNodes[0]);
    li.removeChild(li.childNodes[2]);
    
    var inputField = document.createElement("input");
    inputField.value = liTextContent;
    inputField.id = "changeTodoInput";
    li.appendChild(inputField);
    inputField.focus();
    inputField.select();
    
    function carryOutChange() {
        var changeTodoInputText = document.getElementById("changeTodoInput").value;
        if(changeTodoInputText === "") changeTodoInputText = liTextContent;
        todoList.changeTodo(position, changeTodoInputText);
        view.displayTodos();
    }
    
    inputField.addEventListener("keyup", function(event) { if(event.keyCode === 13) carryOutChange(); });
    inputField.addEventListener("blur", function(event) { carryOutChange(); });
  },
  deleteTodo: function(position) {
    todoList.deleteTodo(position);
    view.displayTodos();
  },
  toggleCompleted: function(position) {
    todoList.toggleCompleted(position);
    view.displayTodos();
  },
  toggleAll: function() {
    todoList.toggleAll();
    view.displayTodos();
  }
};

var view = {
  displayTodos: function() {
    // reset <ul>
    var todosUl = document.querySelector('ul');
    todosUl.innerHTML = '';
    
    todoList.todos.forEach( function(todo, position) {
      // make <li>
      var todoLi = document.createElement('li');
      todoLi.id = position;
      
      // add deleteButton to <li>
      todoLi.appendChild(this.createDeleteButton());
      
      // add completedButton to <li>
      var completedButton = this.createCompletedButton();
      completedButton.textContent = "a";
      completedButton.id = (todo.completed === true) ? "greenButton" : "redButton";
      //completedButton.style.color = (todo.completed === true) ? "green" : "red";
      //completedButton.style.backgroundColor = (todo.completed === true) ? "green" : "red";
      todoLi.appendChild(completedButton);
      
      // add label with todoText to <li>
      var todoLabel = document.createElement("label");
      todoLabel.textContent = todo.todoText;
      todoLabel.className = "todoLabel";
      if(todo.completed === true) todoLabel.style.textDecoration = "line-through";
      todoLi.appendChild(todoLabel);
      
      // add <li> to <ul>
      todosUl.appendChild(todoLi); 
    }, this);
  },
  createDeleteButton: function() {
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "-";
    deleteButton.className = "deleteButton";
    return deleteButton;
  },
  createCompletedButton: function() {
    var completedButton = document.createElement("button");
    completedButton.className = "completedButton";
    return completedButton;
  },
  setUpEventListeners: function() {
    var todosUl = document.querySelector("ul");
    todosUl.addEventListener("click", function(event) {
      if(event.target.className === "deleteButton") handlers.deleteTodo(parseInt(event.target.parentNode.id));
      else if(event.target.className === "todoLabel") handlers.changeTodo(parseInt(event.target.parentNode.id));
      else if(event.target.className === "completedButton") handlers.toggleCompleted(parseInt(event.target.parentNode.id));
    });
    var mainTextInput = document.getElementById("mainTextInput");
    mainTextInput.addEventListener("keyup", function(event) { if(event.keyCode === 13) handlers.addTodo(); });
  }
};

view.setUpEventListeners();