import Button from '@material-ui/core/Button';
import components from '../../utilities/components';
import is from '../../utilities/is';
import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class LoginModule extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         loginButtonIsDisabled : true,
         password : {
            helperText : '',
            showError : false,
            value : '',
         },
         showFailedLoginAlert : false,
         username : {
            helperText : '',
            showError : false,
            value : '',
         },
      };
      components.LoginModule = this;
   }
   
   checkPasswordOnBlur() {
      const {username, password} = this.state;
      const usernameLength = username.value.length;
      const passwordLength = password.value.length;
      this.setState({
         password : {
            helperText : usernameLength > 0 && passwordLength > 0 && passwordLength < 8 ? 'Minimum of 8 characters' : '',
            showError : usernameLength > 0 && passwordLength > 0 && passwordLength < 8,
            value : password.value,
         },
      });
   }
   
   checkUserNameOnBlur() {
      const {username} = this.state;
      const usernameLength = username.value.length;
      this.setState({
         username : {
            helperText : usernameLength > 0 && usernameLength < 8 ? 'Minimum of 8 characters' : '',
            showError : usernameLength > 0 && usernameLength < 8,
            value : username.value,
         },
      });
   }
   
   getFailedLoginWarning() {
      const {showFailedLoginAlert} = this.state;
      if (!showFailedLoginAlert) return null;
      return (
         <div
            style={{
               backgroundColor : '#a3170d',
               borderRadius : 10,
               color : 'white',
               marginBottom : 20,
               padding : 10,
            }}
         >
            Login attempt FAILED
         </div>
      );
   }
   
   render() {
      const {username, password, loginButtonIsDisabled} = this.state;
      return (
         <>
            {this.getFailedLoginWarning()}
            <Button
               onClick={() => components.DataLayer.sendLogin('GUEST-WKHTkVatv8', 'GUEST-WKHTkVatv8')}
               style={{
                  backgroundColor : '#3F51B5',
                  color : '#eeeeee',
               }}
            >
               Start new 'Guest' session
            </Button>
            <div style={{
               marginLeft : '75px',
               marginTop : '50px',
            }}>
               Or Login:
            </div>
            <div style={{marginTop : '50px'}}>
               <TextField
                  error={username.showError}
                  FormHelperTextProps={{
                     error : username.showError,
                  }}
                  helperText={username.helperText}
                  id={'username'}
                  inputProps={{
                     id : 'usernameField',
                     maxLength : 50,
                     style : {width : '240px'}
                  }}
                  label={'Username:'}
                  name={'username'}
                  onBlur={() => this.checkUserNameOnBlur()}
                  onChange={(event) => this.updateUserName(event)}
                  onFocus={() => this.showUserNameHelperTextOnFocus()}
                  placeholder={'Username'}
                  required={true}
                  value={username.value}
               />
            </div>
            <div style={{marginTop : '25px'}}>
               <TextField
                  error={password.showError}
                  FormHelperTextProps={{
                     error : password.showError,
                  }}
                  helperText={password.helperText}
                  id={'password'}
                  inputProps={{
                     id : 'passwordField',
                     maxLength : 50,
                     style : {width : '240px'}
                  }}
                  label={'Password:'}
                  name={'password'}
                  onBlur={() => this.checkPasswordOnBlur()}
                  onChange={(event) => this.updatePassword(event)}
                  onFocus={() => this.showPasswordHelperTextOnFocus()}
                  placeholder={'Password'}
                  required={true}
                  type={'password'}
                  value={password.value}
               />
            </div>
            <div style={{marginTop : '25px'}}>
               <Button
                  disabled={loginButtonIsDisabled}
                  onClick={() => this.submitLogin()}
                  style={{
                     backgroundColor : '#3F51B5',
                     color : '#eeeeee',
                     marginLeft : '175px',
                     opacity : loginButtonIsDisabled ? 0.3 : 1,
                  }}
               >
                  Login
               </Button>
            </div>
         </>
      );
   }
   
   setShowFailedLoginAlert(showFailedLoginAlert = false) {
      if (!is.aBoolean(showFailedLoginAlert)) return;
      this.setState({showFailedLoginAlert : showFailedLoginAlert});
   }
   
   showPasswordHelperTextOnFocus() {
      const {password} = this.state;
      if (password.value.length >= 8) return;
      this.setState({
         password : {
            helperText : 'Minimum of 8 characters',
            showError : password.showError,
            value : password.value,
         },
      });
   }
   
   showUserNameHelperTextOnFocus() {
      const {username} = this.state;
      if (username.value.length >= 8) return;
      this.setState({
         username : {
            helperText : 'Minimum of 8 characters',
            showError : username.showError,
            value : username.value,
         }
      });
   }
   
   submitLogin() {
      const {username, password} = this.state;
      components.DataLayer.sendLogin(username.value, password.value);
   }
   
   updatePassword(event = {}) {
      if (!event.target.name) return;
      const field = event.target;
      const {username} = this.state;
      const newValue = field.value.trim();
      this.setState({
         loginButtonIsDisabled : username.value.length < 8 || newValue.length < 8,
         password : {
            showError : !field.validity.valid,
            value : newValue,
         },
      });
   }
   
   updateUserName(event = {}) {
      if (!event.target.name) return;
      const field = event.target;
      const {password} = this.state;
      const newValue = field.value.trim();
      this.setState({
         loginButtonIsDisabled : password.value.length < 8 || newValue.length < 8,
         username : {
            showError : !field.validity.valid,
            value : newValue,
         },
      });
   }
}