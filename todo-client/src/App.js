import components from './utilities/components';
import DataLayer from './components/layers/data.layer';
import React from 'react';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

const theme = createMuiTheme({
   typography : {
      useNextVariants : true,
      suppressDeprecationWarnings : true,
   }
});

class App extends React.Component {
   constructor(props) {
      super(props);
      components.App = this;
   }
   
   render() {
      return (
         <MuiThemeProvider theme={theme}>
            <DataLayer/>
         </MuiThemeProvider>
      );
   }
}

export default App;
