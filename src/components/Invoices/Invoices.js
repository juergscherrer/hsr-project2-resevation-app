import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withAuthorization from '../UserAuthentication/withAuthorization';
import MessageBox from '../MessageBox';
import InvoicesList from './InvoicesList';
import { withStyles } from '@material-ui/core/styles/index';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  header: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  }
});

const INITIAL_STATE = {
  message: null,
  isPaid: false
};

class InvoicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.setMessage = this.setMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  setMessage(msg) {
    this.setState({ message: msg });
  }

  deleteMessage() {
    this.setState({ message: null });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Paper className={classes.root}>
          <h1 className={classes.header}>Rechnungen</h1>
          <InvoicesList setMessage={this.setMessage} />

          <MessageBox
            open={!!this.state.message}
            message={this.state.message}
            onClose={this.deleteMessage}
          />
        </Paper>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

InvoicesPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withAuthorization(authCondition)(
  withStyles(styles)(InvoicesPage)
);