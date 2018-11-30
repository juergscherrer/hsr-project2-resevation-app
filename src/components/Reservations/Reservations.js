import React from 'react';
import PropTypes from 'prop-types';
import { auth, db } from '../../firebase';

import Calendar from './Calendar';
import ReservationForm from './ReservationForm';

import MessageBox from '../MessageBox';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  layout: {
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2
  },
  paper: {
    marginTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  content: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  }
});

const INITIAL_STATE = {
  rentalId: null,
  reservations: [],
  message: null
};

class Reservations extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.setMessage = this.setMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  componentDidMount() {
    this.setState({ rentalId: this.props.match.params.rentalId });
    this.getReservations(this.props.match.params.rentalId);
  }

  getReservations(rentalId) {
    db.collection('reservations')
      .where('rentalId', '==', rentalId)
      .onSnapshot(reservations => {
        this.setState({ reservations: reservations.docs });
      });
  }

  setMessage(msg) {
    this.setState({ message: msg });
  }

  deleteMessage() {
    this.setState({ message: null });
  }

  handleReservation(reservation) {
    console.log(reservation);
  }

  render() {
    const { classes } = this.props;
    const { rentalId, reservations } = this.state;

    return (
      <React.Fragment>
        <div className={classes.layout}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={24}
          >
            <Grid item xs={12} sm={3} display="flex">
              <Paper className={classes.paper}>
                <div className={classes.header}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="headline">
                        Neue Reservation
                      </Typography>
                    </Grid>
                    <Grid item />
                  </Grid>
                </div>

                <div className={classes.content}>
                  <ReservationForm
                    rentalId={this.state.rentalId}
                    setMessage={this.setMessage}
                  />
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={9} display="flex">
              <Paper className={classes.paper}>
                <div className={classes.header}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="headline">Kalender</Typography>
                    </Grid>
                  </Grid>
                </div>
                <div className={classes.content}>
                  <Calendar
                    reservations={reservations}
                    reservation={this.handleReservation}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
          <MessageBox
            open={!!this.state.message}
            message={this.state.message}
            onClose={this.deleteMessage}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Reservations);