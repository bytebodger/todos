import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import components from '../utilities/components';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import TodoTile from './tiles/todo.tile';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {Select} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';

/** @namespace todo.todoId */

const getItemStyle = (isDragging, draggableStyle) => ({
   background : isDragging ? 'lightgreen' : 'white',
   borderRadius : 10,
   margin : `0 0 0 0`,
   padding : 0,
   userSelect : 'none',
   ...draggableStyle
});
const getListStyle = isDraggingOver => ({
   background : isDraggingOver ? 'lightblue' : 'white',
   borderRadius : 10,
   padding : 0,
   width : '100%',
});
export default class Todos extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         newTodoButtonIsDisabled : true,
         newTodoName : {
            helperText : 'Name of new to-do item',
            value : '',
         }
      };
      this.todoList = null;
      this.todos = null;
      components.Todos = this;
   }
   
   static propTypes = {
      todoListId : PropTypes.string,
      todos : PropTypes.array,
   };
   static defaultProps = {
      todoListId : null,
      todos : [],
   };
   
   clearNewTodoName() {
      this.setState({
         newTodoButtonIsDisabled : true,
         newTodoName : {
            helperText : 'Name of new to-do item',
            value : '',
         }
      });
   }
   
   createTodo() {
      const {newTodoName} = this.state;
      const {todoListId} = this.props;
      components.DataLayer.createTodo(newTodoName.value, todoListId);
   }
   
   getTodoTiles() {
      let todoTiles = [];
      this.todos.forEach((todo, index1) => {
         let tile = {};
         tile.todoId = todo.todoId;
         tile.content = (
            <TodoTile
               description={todo.description}
               dueDate={todo.dueDate}
               isComplete={todo.isComplete}
               key={todo.todoId}
               priority={todo.priority}
               sortOrder={todo.sortOrder}
               todoId={todo.todoId}
            />
         );
         todoTiles.push(tile);
      });
      return (
         <DragDropContext onDragEnd={(event) => this.onDragEnd(event)}>
            <Droppable droppableId='droppable'>
               {(provided, snapshot) => (
                  <div
                     {...provided.droppableProps}
                     ref={provided.innerRef}
                     style={getListStyle(snapshot.isDraggingOver)}
                  >
                     {todoTiles.map((todoTile, index) => (
                        <Draggable
                           draggableId={todoTile.todoId}
                           index={index}
                           key={todoTile.todoId}
                        >
                           {(provided, snapshot) => (
                              <div
                                 ref={provided.innerRef}
                                 {...provided.draggableProps}
                                 {...provided.dragHandleProps}
                                 style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                 )}
                              >
                                 {todoTile.content}
                              </div>
                           )}
                        </Draggable>
                     ))}
                     {provided.placeholder}
                  </div>
               )}
            </Droppable>
         </DragDropContext>
      );
   }
   
   loadTodoData() {
      const {todoListId, todos} = this.props;
      const {todoLists} = components.TodosModule.state;
      this.todoList = todoLists.find(todoList => todoList.todoListId === todoListId);
      this.todos = todos.filter(todo => todo.todoListId === todoListId);
   }
   
   onDragEnd(event) {
      if (!event.destination) return;
      const {todoListId} = this.props;
      const todoId = event.draggableId;
      const movedFromIndex = event.source.index;
      const movedToIndex = event.destination.index;
      components.DataLayer.moveTodo(todoId, todoListId, movedFromIndex, movedToIndex);
   }
   
   render() {
      const {todoListId} = this.props;
      if (!todoListId) return null;
      this.loadTodoData();
      const {name} = this.todoList;
      const {newTodoButtonIsDisabled, newTodoName} = this.state;
      return (
         <>
            <div>
               <TextField
                  id={'todoListName'}
                  inputProps={{
                     id : 'todoListNameField',
                     maxLength : 100,
                  }}
                  name={'todoListName'}
                  onChange={(event) => this.updateTodoListName(event)}
                  placeholder={'Name of the To-Do List'}
                  style={{
                     marginTop : 15,
                     width : '100%',
                  }}
                  value={name}
               />
            </div>
            <div>
               <div
                  style={{
                     display : (this.todos !== null && this.todos.length > 1) ? 'inherit' : 'none',
                     marginTop : 20,
                  }}
               >
                  Sort By:
                  <Select
                     name={'sortBy'}
                     onChange={(event) => this.sortBy(event)}
                     style={{
                        marginLeft : 10,
                        width : 150,
                     }}
                     value={''}
                  >
                     <MenuItem value={'priority'}>Priority</MenuItem>
                     <MenuItem value={'dueDate'}>Due Date</MenuItem>
                  </Select>
               </div>
               <div style={{marginTop : 20}}>
                  {this.getTodoTiles()}
               </div>
            </div>
            <div style={{marginTop : 40}}>
               <div style={{float : 'right'}}>
                  <Button
                     disabled={newTodoButtonIsDisabled}
                     onClick={() => this.createTodo()}
                     style={{
                        backgroundColor : '#3F51B5',
                        color : '#eeeeee',
                        marginLeft : '10px',
                        marginTop : '10px',
                        opacity : newTodoButtonIsDisabled ? 0.3 : 1,
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
                     id={'newTodoName'}
                     inputProps={{
                        id : 'newTodoNameField',
                        maxLength : 200,
                        width : '100%',
                     }}
                     label={'Name of New To-Do Item:'}
                     name={'newTodoListName'}
                     onChange={(event) => this.updateNewTodoName(event)}
                     placeholder={'Name of New To-Do Item'}
                     required={true}
                     style={{width : '100%'}}
                     value={newTodoName.value}
                  />
               </div>
            </div>
         </>
      );
   }
   
   sortBy(event = {}) {
      if (!event.target.name) return;
      const {todoListId} = this.props;
      const sortBy = event.target.value;
      components.DataLayer.sortTodos(todoListId, sortBy);
   }
   
   updateNewTodoName(event = {}) {
      if (!event.target.name) return;
      const field = event.target;
      const newValue = field.value.trimStart();
      this.setState({
         newTodoButtonIsDisabled : !newValue,
         newTodoName : {value : newValue},
      });
   }
   
   updateTodoListName(event = {}) {
      if (!event.target.name) return;
      const field = event.target;
      const newValue = field.value.trimStart();
      this.setState({newTodoListName : {value : newValue}});
      if (newValue) {
         const {todoListId} = this.props;
         components.DataLayer.updateTodoListName(newValue, todoListId);
      }
   }
}