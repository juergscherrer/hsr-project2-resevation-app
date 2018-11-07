import React from 'react';
import RentalListItem from './RentalListItem';
import { db } from '../../firebase';
import { auth } from '../../firebase/index';

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});


class RentalList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rentals: [],

        };

        this.openDetails = this.openDetails.bind(this);
    }

    componentDidMount() {
        db.getUserRentals(auth.currentUser().uid).on('value', userRental => {
            console.log('user_rentals', userRental.val());
            this.setState({ rentals: userRental.val()});
        })
    }

    componentWillUnmount() {
        this.setState({rentals: null});
    }

    openDetails(rentalId){
        this.props.openDetails(rentalId);
    }

    render() {
        const {classes} = this.props;
        const {rentals} = this.state;

        let list = '';
        if(rentals){
            list =
                <div className={classes.root}>
                    <List>
                        {Object.keys(rentals).map(key =>
                            <RentalListItem openDetails={this.openDetails} rental={rentals[key]} key={key} rentalId={key}/>
                        )}
                    </List>
                </div>
        }

        return (
            <div>{list}</div>

        );
    }
}


RentalList.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(RentalList);