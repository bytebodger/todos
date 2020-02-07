import * as PropTypes from 'prop-types';
import components from '../../utilities/components';
import FontAwesome from 'react-fontawesome';
import React from 'react';

export default class TodoListTile extends React.Component{
   static propTypes = {
      name : PropTypes.string,
      todoListId : PropTypes.string,
   };
   static defaultProps = {
      name : null,
      todoListId : null,
   };
   
   deleteTodoList() {
      const {todoListId} = this.props;
      components.DataLayer.deleteTodoList(todoListId);
   }
   
   render() {
      const {name, todoListId} = this.props;
      return (
         <div>
            <div style={{float : 'right'}}>
               <FontAwesome
                  name={'times'}
                  onClick={() => this.deleteTodoList()}
                  style={{
                     color : '#a3170d',
                     cursor : 'pointer',
                     fontSize : '2em',
                     marginLeft : 5,
                     marginTop : 7,
                  }}
               />
            </div>
            <div
               onClick={() => components.TodosModule.selectTodoList(todoListId)}
               style={{
                  backgroundColor : '#09611f',
                  border : '1px solid black',
                  borderRadius : 10,
                  color : '#eeeeee',
                  cursor : 'pointer',
                  marginBottom : 1,
                  overflow : 'hidden',
                  padding : 10,
                  width : 'auto',
               }}
            >
               {name}
            </div>
         </div>
      );
   }
}