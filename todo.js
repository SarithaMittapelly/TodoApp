$(document).ready(function() {
    var todos = [];
    var status = {
        INCOMPLETE: "Incomplete",
        COMPLETE: "Incomplete"
    };

    var getCount = (function (){
        var count = 0;
        return function(){
            count += 1;
            return count;
        }
    })();

    var getId = function (){
        var count = getCount();
        var id = (todos.length < count && todos.length >= 0) ? todos.length + 1 : count;
        return String(id);
    };

    function Todo(name) {
        this.id = getId(),
            this.name =  name,
            this.status = status.INCOMPLETE;
    }

    $("#main #addTodo #add").click(function(){
        addTodo();
    });

    function addTodo(){
        var value =  $("#main #addTodo #todoName").val();
        $("#main #addTodo #todoName").val("");
        var todoObj = new Todo(value);
        todos.push(todoObj);

        appendTodo(todoObj);
    }

    function appendTodo(todo){
        var $todoList = $("#main #showTodos #todoList");
        var $todoTemplate = $("#main #todo");
        $todoList.append($todoTemplate.html());

        var lastTodo = $todoList.find("li #name").length - 1;
        $todoList.find("li #id")[lastTodo].innerHTML = todo.id;
        $todoList.find("li #name")[lastTodo].innerHTML = todo.name;
        $todoList.find("li #status")[lastTodo].innerHTML = todo.status;

        $("#main #showTodos #todoList .item .action").unbind().click(function(event){
            updateTodo(event);
        });
    }

    function updateTodo(event) {
        event.stopPropagation();
        var action = event.currentTarget.id;
        var parent = $(event.currentTarget.parentElement);
        var $currentTodoEditAction = parent.find("#edit");
        var $currentTodoSaveAction = parent.find("#save");
        var $currentTodoStatus = parent.find("#status");
        var currentTodoID = parent.find("#id").text();
        var currentTodoObj = todos.filter(e => { return (String(e.id) === currentTodoID);});

        if (action === "save") {
            var updatedTodoStatus = parent.find("#status > select option:selected").val();
            if (!!updatedTodoStatus) {
                currentTodoObj[0].status = updatedTodoStatus;
                $currentTodoStatus.text(updatedTodoStatus);
                $currentTodoEditAction.css({'display': 'inline-block'});
                $currentTodoSaveAction.css({'display': 'none'});
            }
        } else if (action === "edit"){
            var $editTemplate = $("#main #editTodoStatus");
            $currentTodoStatus.html($editTemplate.html());
            parent.find("#status > select").val(currentTodoObj[0].status);
            $currentTodoSaveAction.css({'display': 'inline-block'});
            $currentTodoEditAction.css({'display': 'none'});
        } else {
            var parentToRemove = parent;
            todos.splice(todos.indexOf(currentTodoObj[0]), 1);
            todos.forEach(function(e){
                if (e.id > currentTodoObj[0].id) {
                    e.id -= 1;
                    $(parent.next()[0]).find("#id").text(e.id);
                    parent = parent.next();
                }

                return e;
            });

            parentToRemove.remove();
        }
    }

});
