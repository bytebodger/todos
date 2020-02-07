import Button from '@material-ui/core/Button';
import Column from '../column';
import components from '../../utilities/components';
import is from '../../utilities/is';
import React from 'react';
import Row from '../row';
import TextField from '@material-ui/core/TextField';
import Todos from '../todos';
import TodoLists from '../todo.lists';

export default class TodosModule extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         newTodoListButtonIsDisabled : true,
         newTodoListName : {value : ''},
         todoListId : null,
         todoLists : null,
         todos : null,
      };
      components.TodosModule = this;
   }
   
   addNewTodo(todo) {
      if (!is.aPopulatedObject(todo)) return;
      const {todos} = this.state;
      let updatedTodos = [...todos];
      updatedTodos.push(todo);
      this.setState({todos : updatedTodos});
      components.Todos.clearNewTodoName();
   }
   
   addNewTodoList(todoList) {
      if (!is.aPopulatedObject(todoList)) return;
      const {todoLists} = this.state;
      let updatedTodoLists = [...todoLists];
      updatedTodoLists.push(todoList);
      this.setState({
         newTodoListButtonIsDisabled : true,
         newTodoListName : {value : ''},
         todoLists : updatedTodoLists,
      });
   }
   
   componentDidMount() {
      components.DataLayer.getTodoLists();
      components.DataLayer.getTodos();
   }
   
   createTodoList() {
      const {newTodoListName} = this.state;
      components.DataLayer.createTodoList(newTodoListName.value);
   }
   
   deleteTodoList(todoList = {}) {
      if (!is.aPopulatedObject(todoList)) return;
      let todoLists = [...this.state.todoLists];
      let todos = [...this.state.todos];
      todoLists = todoLists.filter(existingTodoList => existingTodoList.todoListId !== todoList.todoListId);
      todos = todos.filter(existingTodo => existingTodo.todoListId !== todoList.todoListId);
      this.setState({
         newTodoListButtonIsDisabled : true,
         todoLists : todoLists,
         todos : todos,
      })
   }
   
   render() {
      const {newTodoListButtonIsDisabled, newTodoListName, todoListId, todoLists, todos} = this.state;
      if (todoLists === null || todos === null) return null;
      return (
         <>
            <Row>
               <Column xs={6}>
                  <div style={{float : 'right'}}>
                     <Button
                        disabled={newTodoListButtonIsDisabled}
                        onClick={() => this.createTodoList()}
                        style={{
                           backgroundColor : '#3F51B5',
                           color : '#eeeeee',
                           marginLeft : '10px',
                           marginTop : '10px',
                           opacity : newTodoListButtonIsDisabled ? 0.3 : 1,
                        }}
                     >
                        Create
                     </Button>
                  </div>
                  <div
                     style={{
                        overflow : 'hidden',
                        width : 'auto',
                     }}
                  >
                     <TextField
                        id={'newTodoListName'}
                        inputProps={{
                           id : 'newTodoListNameField',
                           maxLength : 100,
                           width : '100%',
                        }}
                        label={'Name of New To-Do List:'}
                        name={'newTodoListName'}
                        onChange={(event) => this.updateNewTodoListName(event)}
                        placeholder={'Name of New To-Do List'}
                        required={true}
                        style={{width : '100%'}}
                        value={newTodoListName.value}
                     />
                  </div>
                  <div style={{marginTop : 20}}>
                     <TodoLists todoLists={todoLists}/>
                  </div>
               </Column>
               <Column xs={6}>
                  <Todos
                     todoListId={todoListId}
                     todos={todos}
                  />
               </Column>
            </Row>
         </>
      );
   }
   
   selectTodoList(todoListId) {
      if (!is.aPopulatedString(todoListId)) return;
      this.setState({todoListId : todoListId});
   }
   
   updateNewTodoListName(event = {}) {
      if (!event.target.name) return;
      const field = event.target;
      const newValue = field.value.trimStart();
      this.setState({
         newTodoListButtonIsDisabled : newValue.length < 1,
         newTodoListName : {value : newValue},
      });
   }
   
   updateTodoDescription(todo = {}) {
      if (!is.aPopulatedObject(todo)) return;
      let todos = [...this.state.todos];
      const targetIndex = todos.findIndex(existingTodo => existingTodo.todoId === todo.todoId);
      todos[targetIndex].description = todo.description;
      this.setState({todos : todos});
   }
   
   updateTodoDueDate(todo = {}) {
      if (!is.aPopulatedObject(todo)) return;
      let todos = [...this.state.todos];
      const targetIndex = todos.findIndex(existingTodo => existingTodo.todoId === todo.todoId);
      todos[targetIndex].dueDate = todo.dueDate;
      this.setState({todos : todos});
   }
   
   updateTodoIsComplete(todo = {}) {
      if (!is.aPopulatedObject(todo)) return;
      let todos = [...this.state.todos];
      const targetIndex = todos.findIndex(existingTodo => existingTodo.todoId === todo.todoId);
      todos[targetIndex].isComplete = todo.isComplete;
      this.setState({todos : todos});
   }
   
   updateTodoListName(todoList = {}) {
      if (!is.aPopulatedObject(todoList)) return;
      let todoLists = [...this.state.todoLists];
      const targetIndex = todoLists.findIndex(existingTodoList => existingTodoList.todoListId === todoList.todoListId);
      todoLists[targetIndex].name = todoList.name.trimStart();
      this.setState({todoLists : todoLists});
   }
   
   updateTodoLists(todoLists = []) {
      if (!is.anArray(todoLists)) return;
      this.setState({todoLists : todoLists});
   }
   
   updateTodoPriority(todo = {}) {
      if (!is.aPopulatedObject(todo)) return;
      let todos = [...this.state.todos];
      const targetIndex = todos.findIndex(existingTodo => existingTodo.todoId === todo.todoId);
      todos[targetIndex].priority = todo.priority;
      this.setState({todos : todos});
   }
   
   updateTodos(todos = []) {
      if (!is.anArray(todos)) return;
      this.setState({todos : todos});
   }
}