import Column from './column';
import components from '../utilities/components';
import LeftNavigation from './left.navigation';
import React from 'react';
import Row from './row';

export default class FixedTemplate extends React.Component {
   constructor(props) {
      super(props);
      this.maxHeight = null;
      components.FixedTemplate = this;
   }
   
   config = {
      content : {padding : 20},
      header : {height : 50},
      navigation : {width : 200},
   };
   
   getUserName() {
      const {isLoggedIn, username} = components.DisplayLayer.state;
      if (!isLoggedIn) return null;
      return (
         <div
            style={{
               float : 'right',
               fontSize : '0.7em',
            }}
         >
            Logged in as: {username}
         </div>
      );
   }
   
   render() {
      const {windowHeight} = components.DisplayLayer.state;
      if (!this.maxHeight) { this.maxHeight = windowHeight - this.config.header.height; }
      return (
         <>
            <div style={{
               backgroundColor : '#3F51B5',
               boxShadow : '0 0 8px 0 rgba(0, 0, 0, 0.6), 0 0 20px 0 rgba(0, 0, 0, 0.6)',
               color : '#eeeeee',
               fontSize : '1.5em',
               height : this.config.header.height,
               position : 'fixed',
               top : 0,
               width : '100%',
               zIndex : 1000,
            }}>
               <Row>
                  <Column
                     style={{
                        marginTop : 8,
                        paddingLeft : 20,
                        paddingTop : 5,
                     }}
                     xs={6}
                  >
                     To-Do Application
                  </Column>
                  <Column
                     style={{
                        marginTop : 8,
                        paddingRight : 20,
                        paddingTop : 5,
                     }}
                     xs={6}
                  >
                     {this.getUserName()}
                  </Column>
               </Row>
            </div>
            <div style={{
               backgroundColor : '#ffffff',
               height : '100%',
               position : 'fixed',
               top : this.config.header.height,
               width : this.config.navigation.width,
            }}>
               <LeftNavigation/>
            </div>
            <div
               id={'mainContentArea'}
               style={{
                  display : 'flex',
                  height : this.maxHeight,
                  marginLeft : this.config.navigation.width,
                  marginTop : this.config.header.height,
                  overflow : 'auto',
                  width : `calc(100%} - ${this.config.navigation.width}px)`,
               }}
            >
               <div style={{
                  margin : this.config.content.padding,
                  width : '100%',
               }}>
                  {components.DisplayLayer.state.module}
               </div>
            </div>
         </>
      );
   }
}