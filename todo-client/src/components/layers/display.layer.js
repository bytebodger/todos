import components from '../../utilities/components';
import FixedTemplate from '../fixed.template';
import is from '../../utilities/is';
import local from '../../utilities/local';
import LoginModule from '../modules/login.module';
import LogoutModule from '../modules/logout.module';
import React from 'react';
import RegisterModule from '../modules/register.module';
import TodosModule from '../modules/todos.module';
/** @namespace component.type.Naked */
/** @namespace result.isLoginSuccessful */
/** @namespace result.isRegistrationSuccessful */
/** @namespace result.userId */

export default class DisplayLayer extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isLoggedIn : local.setDefault('isLoggedIn', false),
         module : null,
         sessionId : local.setDefault('sessionId', null),
         userId : local.setDefault('userId', null),
         username : local.setDefault('username', null),
         windowHeight : window.innerHeight,
      };
      components.DisplayLayer = this;
   }
   
   componentDidMount() {
      this.loadDefaultModule();
   }
   
   getComponentName(component) {
      if (component.type) {
         if (component.type.Naked) { return component.type.Naked.name; }
         return component.type.name;
      }
      return '';
   }
   
   loadDefaultModule() {
      let previousModule = null;
      let previousModuleName = local.getItem('moduleName');
      if (
         !previousModuleName
         || previousModuleName === this.getComponentName(<LoginModule/>)
         || previousModuleName === this.getComponentName(<LogoutModule/>)
      ) {
         previousModule = <LoginModule/>;
      }
      if (!previousModule) {
         this.modules.forEach(module => {
            if (previousModule) return;
            if (previousModuleName === this.getComponentName(module)) { previousModule = module; }
         });
      }
      this.updateModule(previousModule);
   }
   
   logout() {
      local.setItem('isLoggedIn', false);
      local.setItem('sessionId', null);
      local.setItem('userId', null);
      local.setItem('username', null);
      this.setState({
         isLoggedIn : false,
         sessionId : null,
         userId : null,
         username : null,
      });
   }
   
   moduleReference = {
     login : <LoginModule/>,
     logout : <LogoutModule/>,
     register : <RegisterModule/>,
     todoLists : <TodosModule/>,
   };
   
   modules = [
      <LoginModule/>,
      <LogoutModule/>,
      <RegisterModule/>,
      <TodosModule/>,
   ];
   
   processLoginResult(result) {
      if (!is.aPopulatedObject(result)) return;
      local.setItem('isLoggedIn', result.isLoginSuccessful);
      local.setItem('sessionId', result.sessionId);
      local.setItem('userId', result.userId);
      local.setItem('username', result.username);
      this.setState({
         isLoggedIn : result.isLoginSuccessful,
         sessionId : result.sessionId,
         userId : result.userId,
         username : result.username,
      });
      if (!result.isLoginSuccessful) {
         components.LoginModule.setShowFailedLoginAlert(true);
      } else {
         this.updateModule(<TodosModule/>);
      }
   }
   
   processRegistrationResult(result) {
      if (!is.aPopulatedObject(result)) return;
      local.setItem('isLoggedIn', result.isRegistrationSuccessful);
      local.setItem('sessionId', result.sessionId);
      local.setItem('userId', result.userId);
      local.setItem('username', result.username);
      this.setState({
         isLoggedIn : result.isRegistrationSuccessful,
         sessionId : result.sessionId,
         userId : result.userId,
         username : result.username,
      });
      if (!result.isRegistrationSuccessful) {
         components.RegisterModule.setShowFailedRegistrationAlert(true);
      } else {
         this.updateModule(<TodosModule/>);
      }
   }
   
   render() {
      return <FixedTemplate/>;
   }
   
   updateModule(module) {
      const moduleName = this.getComponentName(module);
      if (this.state.module && moduleName === this.getComponentName(this.state.module)) return;
      local.setItem('moduleName', moduleName);
      this.setState({module : module});
   }
}