var rootElement = document.getElementById('todo-mhb-root');

function TodoWidget (root) {
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

  var str = '<div class="task {{func:getCompleteClass}}"><span>{{taskName}}</span><input type="checkbox" {{func:getIsChecked}}></div>';

  var tasks = [
    {name: 'eat chicken', isComplete: false},
    {name: 'read a book', isComplete: true},
    {name: 'eat chicken', isComplete: false}
  ];

  this.addTask = addTask;
  this.render = function () {
    renderTask(tasks, todoItemsList);
  }


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

    var todoItemsList = clearNode(rootListNode);

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

  initialize(tasks, todoItemsList, addTaskButton);
}


var todoWidget = new TodoWidget(rootElement);

