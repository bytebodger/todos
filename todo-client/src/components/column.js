import Grid from '@material-ui/core/Grid';
import React from 'react';

export default class Column extends React.Component {
   render() {
      return (
         <Grid
            item={true}
            {...this.props}
         >
            {this.props.children}
         </Grid>
      );
   }
}