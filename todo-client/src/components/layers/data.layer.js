import components from '../../utilities/components';
import DisplayLayer from './display.layer';
import is from '../../utilities/is';
import React from 'react';

const constant = {
   apiUrl : 'http://localhost/todo-api/api.php',
   commonHeaders : {
      cache : 'no-cache',
      credentials : 'include',
      method : 'POST',
      redirect : 'follow',
      referrer : 'no-referrer',
   },
   validPriorityValues : ['High','Medium','Low'],
   validSortByValues : ['priority','dueDate'],
};
export default class DataLayer extends React.Component {
   constructor(props) {
      super(props);
      components.DataLayer = this;
   }
   
   createTodo(newTodoName = '', todoListId = '') {
      if (!is.aPopulatedString(newTodoName) || !is.aPopulatedString(todoListId)) return;
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               createTodo(newTodoName: "${newTodoName}", todoListId: "${todoListId}", userId: "${userId}", sessionId: "${sessionId}") {
                  todoId,
                  todoListId,
                  description,
                  isComplete,
                  sortOrder,
                  priority,
                  dueDate,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.createTodo) {
            components.TodosModule.addNewTodo(json.data.createTodo);
         }
      })
      .catch(error => {
         console.error('failed createTodo()');
         console.error(error);
      });
   }
   
   createTodoList(newTodoListName = '') {
      if (!is.aPopulatedString(newTodoListName)) return;
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               createTodoList(newTodoListName: "${newTodoListName}", userId: "${userId}", sessionId: "${sessionId}") {
                  todoListId,
                  name,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.createTodoList) {
            components.TodosModule.addNewTodoList(json.data.createTodoList);
         }
      })
      .catch(error => {
         console.error('failed createTodoList()');
         console.error(error);
      });
   }
   
   deleteTodo(todoId = '') {
      if (!is.aPopulatedString(todoId)) return;
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               deleteTodo(todoId: "${todoId}", userId: "${userId}", sessionId: "${sessionId}") {
                  todoId,
                  todoListId,
                  description,
                  isComplete,
                  sortOrder,
                  priority,
                  dueDate,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.deleteTodo) {
            if (!is.anArray(json.data.deleteTodo)) {
               components.TodosModule.updateTodos([]);
            } else {
               components.TodosModule.updateTodos(json.data.deleteTodo);
            }
         }
      })
      .catch(error => {
         console.error('failed deleteTodo()');
         console.error(error);
      });
   }
   
   deleteTodoList(todoListId = '') {
      if (!is.aPopulatedString(todoListId)) return;
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               deleteTodoList(todoListId: "${todoListId}", userId: "${userId}", sessionId: "${sessionId}") {
                  todoListId,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.deleteTodoList) {
            if (!is.anObject(json.data.deleteTodoList)) {
               components.TodosModule.deleteTodoList([]);
            } else {
               components.TodosModule.deleteTodoList(json.data.deleteTodoList);
            }
         }
      })
      .catch(error => {
         console.error('failed deleteTodoList()');
         console.error(error);
      });
   }
   
   getTodoLists() {
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               getTodoLists(userId: "${userId}", sessionId: "${sessionId}") {
                  todoListId,
                  name,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.getTodoLists) {
            if (!is.anArray(json.data.getTodoLists)) {
               components.TodosModule.updateTodoLists([]);
            } else {
               components.TodosModule.updateTodoLists(json.data.getTodoLists);
            }
         }
      })
      .catch(error => {
         console.error('failed getTodoLists()');
         console.error(error);
      });
   }
   
   getTodos() {
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               getTodos(userId: "${userId}", sessionId: "${sessionId}") {
                  todoId,
                  todoListId,
                  description,
                  isComplete,
                  sortOrder,
                  priority,
                  dueDate,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.getTodos) {
            if (!is.anArray(json.data.getTodos)) {
               components.TodosModule.updateTodos([]);
            } else {
               components.TodosModule.updateTodos(json.data.getTodos);
            }
         }
      })
      .catch(error => {
         console.error('failed getTodos()');
         console.error(error);
      });
   }
   
   moveTodo(todoId = '', todoListId = '', movedFromIndex = -1, movedToIndex = -1) {
      if (!is.aPopulatedString(todoId) || !is.aPopulatedString(todoListId) || !is.aNonnegativeInteger(movedFromIndex) || !is.aNonnegativeInteger(movedToIndex)) return;
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               moveTodo(todoId: "${todoId}", todoListId: "${todoListId}", movedFromIndex: ${movedFromIndex}, movedToIndex: ${movedToIndex}, userId: "${userId}", sessionId: "${sessionId}") {
                  todoId,
                  todoListId,
                  description,
                  isComplete,
                  sortOrder,
                  priority,
                  dueDate,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.moveTodo) {
            if (!is.anArray(json.data.moveTodo)) {
               components.TodosModule.updateTodos([]);
            } else {
               components.TodosModule.updateTodos(json.data.moveTodo);
            }
         }
      })
      .catch(error => {
         console.error('failed moveTodo()');
         console.error(error);
      });
   }
   
   sendLogin(username = '', password = '') {
      if (!is.aPopulatedString(username) || !is.aPopulatedString(password)) return;
      const query = JSON.stringify({
         query : `
            {
               login(username: "${username}", password: "${password}") {
                  isLoginSuccessful,
                  sessionId,
                  userId,
                  username,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.login) {
            components.DisplayLayer.processLoginResult(json.data.login);
         }
      })
      .catch(error => {
         console.error('failed sendLogin()');
         console.error(error);
      });
   }
   
   sendRegistration(username = '', password = '') {
      if (!is.aPopulatedString(username) || !is.aPopulatedString(password)) return;
      const query = JSON.stringify({
         query : `
            {
               register(username: "${username}", password: "${password}") {
                  isRegistrationSuccessful,
                  sessionId,
                  userId,
                  username,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.register) {
            components.DisplayLayer.processRegistrationResult(json.data.register);
         }
      })
      .catch(error => {
         console.error('failed sendRegistration()');
         console.error(error);
      });
   }
   
   sortTodos(todoListId = '', sortBy = '') {
      if (!is.aPopulatedString(todoListId) || !is.oneOfStrings(sortBy, constant.validSortByValues)) return;
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               sortTodos(todoListId: "${todoListId}", sortBy: "${sortBy}", userId: "${userId}", sessionId: "${sessionId}") {
                  todoId,
                  todoListId,
                  description,
                  isComplete,
                  sortOrder,
                  priority,
                  dueDate,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.sortTodos) {
            if (!is.anArray(json.data.sortTodos)) {
               components.TodosModule.sortTodos([]);
            } else {
               components.TodosModule.updateTodos(json.data.sortTodos);
            }
         }
      })
      .catch(error => {
         console.error('failed sortTodos()');
         console.error(error);
      });
   }
   
   updateTodoDescription(description = '', todoId = '') {
      if (!is.aPopulatedString(description) || !is.aPopulatedString(todoId)) return;
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               updateTodoDescription(description: "${description}", todoId: "${todoId}", userId: "${userId}", sessionId: "${sessionId}") {
                  todoId,
                  description,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.updateTodoDescription) {
            components.TodosModule.updateTodoDescription(json.data.updateTodoDescription);
         }
      })
      .catch(error => {
         console.error('failed updateTodoDescription()');
         console.error(error);
      });
   }
   
   updateTodoDueDate(dueDate = '', todoId = '') {
      if (!is.aPopulatedString(dueDate) || !is.aPopulatedString(todoId)) return;
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               updateTodoDueDate(dueDate: "${dueDate}", todoId: "${todoId}", userId: "${userId}", sessionId: "${sessionId}") {
                  todoId,
                  dueDate,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.updateTodoDueDate) {
            components.TodosModule.updateTodoDueDate(json.data.updateTodoDueDate);
         }
      })
      .catch(error => {
         console.error('failed updateTodoDueDate()');
         console.error(error);
      });
   }
   
   updateTodoIsComplete(todoId = '', isComplete = false) {
      if (!is.aPopulatedString(todoId) || !is.aBoolean(isComplete)) return;
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               updateTodoIsComplete(todoId: "${todoId}", isComplete: ${isComplete}, userId: "${userId}", sessionId: "${sessionId}") {
                  todoId,
                  isComplete,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.updateTodoIsComplete) {
            components.TodosModule.updateTodoIsComplete(json.data.updateTodoIsComplete);
         }
      })
      .catch(error => {
         console.error('failed updateTodoIsComplete()');
         console.error(error);
      });
   }
   
   updateTodoListName(name = '', todoListId = '') {
      if (!is.aPopulatedString(name) || !is.aPopulatedString(todoListId)) return;
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               updateTodoListName(name: "${name}", todoListId: "${todoListId}", userId: "${userId}", sessionId: "${sessionId}") {
                  todoListId,
                  name,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.updateTodoListName) {
            components.TodosModule.updateTodoListName(json.data.updateTodoListName);
         }
      })
      .catch(error => {
         console.error('failed updateTodoListName()');
         console.error(error);
      });
   }
   
   updateTodoPriority(priority = '', todoId = '') {
      if (!is.oneOfStrings(priority, constant.validPriorityValues) || !is.aPopulatedString(todoId)) return;
      const {sessionId, userId} = components.DisplayLayer.state;
      const query = JSON.stringify({
         query : `
            {
               updateTodoPriority(priority: "${priority}", todoId: "${todoId}", userId: "${userId}", sessionId: "${sessionId}") {
                  todoId,
                  priority,
               }
            }
         `
      });
      let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));
      parameters.body = query;
      fetch(constant.apiUrl, parameters)
      .then(response => response.json())
      .then(json => {
         if (json.data && json.data.updateTodoPriority) {
            components.TodosModule.updateTodoPriority(json.data.updateTodoPriority);
         }
      })
      .catch(error => {
         console.error('failed updateTodoPriority()');
         console.error(error);
      });
   }
   
   render() {
      return <DisplayLayer/>;
   }
}
