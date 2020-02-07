import * as PropTypes from 'prop-types';
import components from '../utilities/components';
import is from '../utilities/is';
import React from 'react';
import TodoListTile from './tiles/todo.list.tile';

export default class TodoLists extends React.Component {
   constructor(props) {
      super(props);
      components.TodoLists = this;
   }
   
   static propTypes = {
      todoLists : PropTypes.array,
   };
   static defaultProps = {
      todoLists : [],
   };
   
   getTodoListTiles() {
      const {todoLists} = this.props;
      let todoListTiles = [];
      todoLists.forEach((todoList, index1) => {
         todoListTiles.push(
            <TodoListTile
               key={todoList.todoListId}
               name={todoList.name}
               todoListId={todoList.todoListId}
            />
         );
      });
      return todoListTiles;
   }
   
   render() {
      const {todoLists} = this.props;
      if (!is.aPopulatedArray(todoLists)) return null;
      return (
         <>
            {this.getTodoListTiles()}
         </>
      );
   }
}