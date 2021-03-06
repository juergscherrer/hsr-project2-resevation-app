import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import RentalUsersListItem from './RentalUsersListItem';
import RentalUsersSearch from './RentalUsersSearch';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { getUserRentalsWithRental } from '../../firebase/queries/userRentals';

const styles = theme => ({
  header: {
    paddingLeft: `${theme.spacing.unit * 3}px`
  }
});

const INITIAL_STATE = {
  rentalId: '',
  userRentals: null,
  error: null
};

class RentalUsersList extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.unsubscribeUserRental = null;
  }

  componentDidMount() {
    if (this.props.rentalId) {
      this.getUserRentals().catch(error => {
        this.props.setMessage(
          `Rental konnte nicht geladen werden. Fehlermeldung: ${error}`
        );
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.rentalId !== prevProps.rentalId) {
      this.unsubscriber();
      this.getUserRentals().catch(error => {
        this.props.setMessage(
          `Rental konnte nicht geladen werden. Fehlermeldung: ${error}`
        );
      });
    }
  }

  componentWillUnmount() {
    this.unsubscriber();
    this.setState({ ...INITIAL_STATE });
  }

  unsubscriber = () => {
    this.unsubscribeUserRental && this.unsubscribeUserRental();
  };

  getUserRentals = async () => {
    const userRentalsRef = await getUserRentalsWithRental(this.props.rentalId);
    const userRentalSnap = userRentalsRef.onSnapshot(userRentals => {
      this.setState({ userRentals: userRentals.docs });
    });
    this.unsubscribeUserRental = userRentalSnap;
    return userRentalSnap;
  };

  render() {
    const { classes } = this.props;
    const { userRentals } = this.state;

    let list;

    if (userRentals) {
      list = (
        <div>
          <List>
            {userRentals.map((userRental, index) => {
              return (
                <RentalUsersListItem
                  userRental={userRental}
                  key={index}
                  setMessage={this.props.setMessage}
                  userIsManager={this.props.userIsManager}
                />
              );
            })}
          </List>
        </div>
      );
    }

    return (
      <div>
        <div className={classes.header}>
          <h3>Benuzter</h3>
        </div>
        {this.props.userIsManager && (
          <RentalUsersSearch
            rentalId={this.props.rentalId}
            setMessage={this.props.setMessage}
          />
        )}
        {list}
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(RentalUsersList));
