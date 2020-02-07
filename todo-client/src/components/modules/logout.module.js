import components from '../../utilities/components';
import React from 'react';

export default class LogoutModule extends React.Component {
   constructor(props) {
      super(props);
      components.LogoutModule = this;
   }
   
   componentDidMount() {
      components.DisplayLayer.logout();
   }
   
   render() {
      return (
         <>
            <div style={{marginBottom : 20}}>Thank you for using the To-Do Application!</div>
            <div>You are now logged out.</div>
         </>
      );
   }
}