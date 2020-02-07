import Button from '@material-ui/core/Button';
import components from '../../utilities/components';
import is from '../../utilities/is';
import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class RegisterModule extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         password : {
            helperText : '',
            showError : false,
            value : '',
         },
         registerButtonIsDisabled : true,
         showFailedRegisterAlert : false,
         username : {
            helperText : '',
            showError : false,
            value : '',
         },
      };
      components.RegisterModule = this;
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
   
   getFailedRegistrationWarning() {
      const {showFailedRegisterAlert} = this.state;
      if (!showFailedRegisterAlert) return null;
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
            Registration attempt FAILED
         </div>
      );
   }
   
   render() {
      const {username, password, registerButtonIsDisabled} = this.state;
      return (
         <>
            {this.getFailedRegistrationWarning()}
            <div style={{fontSize : '1.2em'}}>
               Register
            </div>
            <div style={{marginTop : '20px'}}>
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
                  disabled={registerButtonIsDisabled}
                  onClick={() => this.submitRegistration()}
                  style={{
                     backgroundColor : '#3F51B5',
                     color : '#eeeeee',
                     marginLeft : '150px',
                     opacity : registerButtonIsDisabled ? 0.3 : 1,
                  }}
               >
                  Register
               </Button>
            </div>
         </>
      );
   }
   
   setShowFailedRegistrationAlert(showFailedRegistrationAlert = false) {
      if (!is.aBoolean(showFailedRegistrationAlert)) return;
      this.setState({showFailedRegisterAlert : showFailedRegistrationAlert});
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
   
   submitRegistration() {
      const {username, password} = this.state;
      components.DataLayer.sendRegistration(username.value, password.value);
   }
   
   updatePassword(event = {}) {
      if (!event.target.name) return;
      const field = event.target;
      const {username} = this.state;
      const newValue = field.value.trim();
      this.setState({
         registerButtonIsDisabled : username.value.length < 8 || newValue.length < 8,
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
         registerButtonIsDisabled : password.value.length < 8 || newValue.length < 8,
         username : {
            showError : !field.validity.valid,
            value : newValue,
         },
      });
   }
}