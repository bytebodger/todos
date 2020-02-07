import '@date-io/date-fns';
import * as PropTypes from 'prop-types';
import components from '../../utilities/components';
import DateFnsUtils from '@date-io/date-fns';
import FontAwesome from 'react-fontawesome';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import {Checkbox} from '@material-ui/core';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';

export default class TodoTile extends React.Component{
   constructor(props) {
      super(props);
      const {description, dueDate, priority} = this.props;
      this.state = {
         description : {value : description},
         dueDate : new Date(`${dueDate}T00:00:00`),
         priority : {value : priority},
      };
   }
   
   static propTypes = {
      description : PropTypes.string,
      dueDate : PropTypes.string,
      isComplete : PropTypes.bool,
      priority : PropTypes.string,
      sortOrder : PropTypes.number,
      todoId : PropTypes.string,
   };
   static defaultProps = {
      description : null,
      dueDate : null,
      isComplete : false,
      priority : null,
      sortOrder : PropTypes.number,
      todoId : null,
   };
   
   deleteTodo() {
      const {todoId} = this.props;
      components.DataLayer.deleteTodo(todoId);
   }
   
   render() {
      const {isComplete, priority, todoId} = this.props;
      const {description, dueDate} = this.state;
      return (
         <div>
            <div style={{float : 'right'}}>
               <FontAwesome
                  name={'times'}
                  onClick={() => this.deleteTodo()}
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
               style={{
                  backgroundColor : '#541687',
                  border : '1px solid black',
                  borderRadius : 10,
                  color : '#eeeeee',
                  marginBottom : 1,
                  overflow : 'hidden',
                  padding : 10,
                  width : 'auto',
               }}
            >
               <Checkbox
                  checked={isComplete}
                  onClick={() => this.toggleTodoIsComplete()}
                  style={{
                     color : '#eeeeee',
                     float : 'left',
                     marginRight : 5,
                     marginTop : 3,
                     padding : 0,
                  }}
               />
               <div
                  style={{
                     overflow : 'hidden',
                     width : 'auto',
                  }}
               >
                  <TextField
                     inputProps={{
                        maxLength : 200,
                        style : {
                           color : '#eeeeee',
                           textDecoration : isComplete ? 'line-through' : 'inherit',
                           width : '100%',
                        },
                     }}
                     name={'description'}
                     onChange={(event) => this.updateDescription(event)}
                     required={true}
                     style={{width : '100%'}}
                     value={description.value}
                  />
               </div>
               <div style={{marginTop : 5}}>
                  <div style={{float : 'left'}}>
                     Priority:
                     <Select
                        name={'priority'}
                        onChange={(event) => this.updatePriority(event)}
                        style={{
                           marginLeft : 10,
                           width : 100,
                        }}
                        value={priority}
                        SelectDisplayProps={{
                           'aria-label': 'change due date',
                           style : {color : '#eeeeee'},
                        }}
                     >
                        <MenuItem value={'High'}>High</MenuItem>
                        <MenuItem value={'Medium'}>Medium</MenuItem>
                        <MenuItem value={'Low'}>Low</MenuItem>
                     </Select>
                  </div>
                  <div style={{float : 'right'}}>
                     <span style={{
                        position : 'relative',
                        top : 3,
                     }}>Due:</span>
                     <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                           autoOk={true}
                           disableToolbar
                           format={'yyyy-MM-dd'}
                           id={`datePicker-${todoId}`}
                           InputProps={{style : {color : '#eeeeee', width : 150}}}
                           KeyboardButtonProps={{
                              'aria-label': 'change due date',
                              style : {color : '#eeeeee'},
                           }}
                           margin={'none'}
                           minDate={new Date()}
                           name={'datePicker'}
                           onChange={(dateObject) => this.updateDueDate(dateObject)}
                           style={{marginLeft : 5}}
                           value={dueDate}
                           variant={'inline'}
                        />
                     </MuiPickersUtilsProvider>
                  </div>
               </div>
            </div>
         </div>
      );
   }
   
   toggleTodoIsComplete() {
      const {isComplete, todoId} = this.props;
      components.DataLayer.updateTodoIsComplete(todoId, !isComplete);
   }
   
   updateDescription(event = {}) {
      if (!event.target.name) return;
      const field = event.target;
      const newValue = field.value.trimStart();
      this.setState({description : {value : newValue}});
      if (newValue) {
         const {todoId} = this.props;
         components.DataLayer.updateTodoDescription(newValue, todoId);
      }
   }
   
   updateDueDate(dateObject = '') {
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() > 9 ? dateObject.getMonth() + 1 : '0' + (dateObject.getMonth() + 1);
      const day = dateObject.getDate() > 9 ? dateObject.getDate() : '0' + dateObject.getDate() + 1;
      const newDueDate = `${year}-${month}-${day}`;
      this.setState({dueDate : dateObject});
      const {todoId} = this.props;
      components.DataLayer.updateTodoDueDate(newDueDate, todoId);
   }
   
   updatePriority(event = {}) {
      if (!event.target.name) return;
      const newValue = event.target.value;
      const {priority} = this.state;
      if (newValue === priority.value) return;
      this.setState({priority : {value : newValue}});
      const {todoId} = this.props;
      components.DataLayer.updateTodoPriority(newValue, todoId);
   }
}