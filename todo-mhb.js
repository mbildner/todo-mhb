var firstRoot = document.getElementById('first-root');
var secondRoot = document.getElementById('second-root');

function dataStoreFactory (modelFactory) {

  var store = []
  var callbacks = [];

  var model = {};

  function processCallbacks () {
    callbacks.forEach(function (func) {
      func(model.getAll());
    });
  }

  model.addChangeCallback = function (callback) {
    callbacks.push(callback);
  };

  model.getAll = function () {
    return store;
  };

  model.get = function (index) {
    return store[index];
  };

  // @todo refactor - build a broadcast function that fires processCallbacks at end
  model.addTask = function (name, isComplete) {
    var task = modelFactory(name, isComplete);
    store.push(task);

    processCallbacks();
  };

  // @todo refactor - build a broadcast function that fires processCallbacks at end
  model.toggleComplete = function (index) {
    store[index].isComplete = !store[index].isComplete;

    processCallbacks();
  };

  return model;
}



function ToDoListWidget (root, dataModel) {

  var VIEW_PARTIAL = '<h2>Add task</h2>' +
    '<input type="text"><button>Add</button>' +
    '<h2>To Do</h2>' +
    '<ol></ol>';

  root.innerHTML = VIEW_PARTIAL;

  var addTaskButton = root.querySelector('button');
  var addTaskInput = root.querySelector('input[type="text"]');
  var todoItemsList = root.querySelector('ol');

  var slice = Array.prototype.slice;

  function toArray (list) {
    return slice.call(list);
  }

  function clearNode (node) {
    while (node.children.length) {
      node.removeChild(node.firstChild);
    }

    return node;
  }

  var TASK_TEMPLATE_STR = '<div class="task {{func:getCompleteClass}}"><span>{{taskName}}</span><input type="checkbox" {{func:getIsChecked}}></div>';
  var BRACES_REGEX = /\{\{(.*?)\}\}/g;

  this.render = function () {
    renderTask(tasks, todoItemsList);
  }

  function handleCheckboxClick (event) {
    var checkbox = event.currentTarget;
    var li = checkbox.parentNode.parentNode;
    var ol = li.parentNode;
    var index = toArray(ol.children).indexOf(li);

    tasks.toggleComplete(index);
    // renderTasks(tasks, ol);
  }

  function attachCheckboxListeners (checkboxes) {
    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener('click', handleCheckboxClick);
    });
  }

  // relies on todoItemsList
  function renderTask (task) {
    var funcs = {};

    funcs.getCompleteClass = function () {
      return task.isComplete ? 'complete' : '';
    };

    funcs.getIsChecked = function () {
      return task.isComplete ? 'checked' : '';
    };

    var replacements = {
      taskName: task.name,
      isChecked: task.isComplete ? 'checked' : ''
    };

    var html = TASK_TEMPLATE_STR.replace(BRACES_REGEX, function (toReplaceWithBraces, toReplace) {
      var isBool;
      var replacementKey;
      var asArray = toReplace.split(':');

      isFunc = (asArray.length > 1 && asArray[0] === 'func');
      replacementKey = asArray[asArray.length-1];

      if (isFunc) {
        return funcs[replacementKey]() || '';
      }
      else {
        return replacements[replacementKey || ''];
      }


    });

    var listItem = document.createElement('li');
    listItem.innerHTML = html;
    todoItemsList.appendChild(listItem);
  }

  function renderTasks (dataModel, rootListNode) {
    var todoItemsList = clearNode(rootListNode);

    dataModel.getAll().forEach(renderTask);

    var todoItemsInputs = toArray(document.getElementsByTagName('input'));

    todoItemsCheckboxes = todoItemsInputs.filter(function (input) {
      return (input.getAttribute('type') === 'checkbox');
    });

    attachCheckboxListeners(todoItemsCheckboxes);
  }

  function addTask (name, isComplete) {
    dataModel.addTask(name, isComplete);
  }

  function initialize (dataModel, rootListNode, addTaskButton) {
    renderTasks(dataModel, todoItemsList);

    addTaskButton.addEventListener('click', function () {
      var taskName = addTaskInput.value;
      var isComplete = false;

      if (!taskName || taskName === '') {return}
      addTask(taskName, isComplete);

    });

    dataModel.addChangeCallback(function () {
      renderTasks(dataModel, todoItemsList);
    });

  }

  initialize(tasks, todoItemsList, addTaskButton);
}


function todoItemFactory (name, isComplete) {
  var todo = {};
  todo.name = name;
  todo.isComplete = isComplete;

  return todo;
}

var tasks = dataStoreFactory(todoItemFactory);

(function () {
  [{name: 'eat chicken', isComplete: false},
    {name: 'read a book', isComplete: true},
    {name: 'eat chicken', isComplete: false}
  ].forEach(function (taskDict) {
    tasks.addTask(taskDict.name, taskDict.isComplete);
  });
})()

var firstTodo = new ToDoListWidget(firstRoot, tasks);
var secondTodo = new ToDoListWidget(secondRoot, tasks);



