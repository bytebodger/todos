import components from '../utilities/components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import LoginModule from './modules/login.module';
import LogoutModule from './modules/logout.module';
import React from 'react';
import RegisterModule from './modules/register.module';
import TodosModule from './modules/todos.module';

export default class LeftNavigation extends React.Component {
   constructor(props) {
      super(props);
      components.LeftNavigation = this;
   }
   
   listButtons = [];
   navigation = {
      isLoggedIn : [
         {
            label : 'Log Out',
            module : <LogoutModule/>,
         },
         {
            label : 'To-Do\'s',
            module : <TodosModule/>,
         },
      ],
      isLoggedOut : [
         {
            label : 'Log In',
            module : <LoginModule/>,
         },
         {
            label : 'Register',
            module : <RegisterModule/>,
         },
      ]
   };
   
   populateListButtons() {
      const {isLoggedIn} = components.DisplayLayer.state;
      const module = components.DisplayLayer.state.module;
      this.listButtons = [];
      let buttonConfigs = isLoggedIn ? this.navigation.isLoggedIn : this.navigation.isLoggedOut;
      buttonConfigs.forEach((buttonConfig, index) => {
         let listItemStyle = {};
         let textStyle = {};
         const isThisButtonTheCurrentModule = module ? components.DisplayLayer.getComponentName(module) === components.DisplayLayer.getComponentName(buttonConfig.module) : false;
         if (isThisButtonTheCurrentModule) {
            listItemStyle.backgroundColor = '#444444';
            textStyle.color = '#eeeeee';
         }
         this.listButtons.push(
            <React.Fragment key={`${buttonConfig.label}-listItem`}>
               <ListItem
                  button={true}
                  onClick={() => components.DisplayLayer.updateModule(buttonConfig.module)}
                  style={listItemStyle}
               >
                  <div style={textStyle}>
                     {buttonConfig.label}
                  </div>
               </ListItem>
            </React.Fragment>
         );
      });
   }
   
   render() {
      this.populateListButtons();
      return <List style={{paddingTop : 0}}>{this.listButtons}</List>;
   }
}