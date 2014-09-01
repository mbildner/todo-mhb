function clearList (listNode) {
  while (listNode.children.length) {
    listNode.removeChild(listNode.firstChild);
  }

  return listNode;
}

var slice = Array.prototype.slice;

function toArray (list) {
  return slice.call(list);
}

var str = '<div class="task {{func:getCompleteClass}}"><span>{{taskName}}</span><input type="checkbox" {{func:getIsChecked}}></div>';

function handleCheckboxClick (event) {
  var checkbox = event.currentTarget;
  var li = checkbox.parentNode.parentNode;
  var ol = li.parentNode;
  var index = toArray(ol.children).indexOf(li);
  var task = tasks[index];

  task.isComplete = !task.isComplete;
  renderTasks(tasks, ol);

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

  var html = str.replace(/\{\{(.*?)\}\}/g, function (toReplaceWithBraces, toReplace) {
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

function renderTasks (tasksArr, rootListNode) {
  var todoItemsList = clearList(rootListNode);

  tasksArr.forEach(renderTask);

  var todoItemsInputs = toArray(document.getElementsByTagName('input'));

  todoItemsCheckboxes = todoItemsInputs.filter(function (input) {
    return (input.getAttribute('type') === 'checkbox');
  });

  attachCheckboxListeners(todoItemsCheckboxes);
}

function addTask (name, isComplete) {
  tasks.push({
    name: name,
    isComplete: isComplete
  });
}

function initialize (tasks, rootListNode, addTaskButton) {
  renderTasks(tasks, todoItemsList);

  addTaskButton.addEventListener('click', function () {
    var taskName = addTaskInput.value;
    var isComplete = false;

    if (!taskName || taskName === '') {return}

    addTask(taskName, isComplete);
    renderTasks(tasks, todoItemsList);
  });
}

var addTaskButton = document.getElementById('addTaskButton');
var addTaskInput = document.getElementById('addTaskInput');
var todoItemsList = document.getElementById('todoItemsList');

var rootElement = document.getElementById('todo-mhb-root');

var tasks = [
  {name: 'eat chicken', isComplete: false},
  {name: 'read a book', isComplete: true},
  {name: 'eat chicken', isComplete: false}
];

initialize(tasks, todoItemsList, addTaskButton);
