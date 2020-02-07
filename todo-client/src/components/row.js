import * as PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import React from 'react';

export default class Row extends React.Component {
   static propTypes = {
      spacing : PropTypes.oneOf(
         [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      ),
   };
   static defaultProps = {
      spacing : 2,
   };
   
   render() {
      return (
         <Grid
            container={true}
            {...this.props}
         >
            {this.props.children}
         </Grid>
      );
   }
}