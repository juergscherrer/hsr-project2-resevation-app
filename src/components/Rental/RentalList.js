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

        this.editRental = this.editRental.bind(this);
    }

    // componentDidMount() {
    //     db.getRentals().on('value', snap => {
    //         this.setState({rentals: snap.val()})
    //     });
    // }

    componentDidMount() {
        db.getUserRentals(auth.currentUser().uid).on('child_added', snap => {
            db.getRentals().child(snap.key).on('value', rental => {
                console.log('jetzt');
                this.setState(prevState => ({
                    rentals: [...prevState.rentals, rental.val()]
                }));
            });
        })
    }

    componentWillUnmount() {
        this.setState({rentals: null});
    }

    editRental(rental){
        this.props.editRental(rental);
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
                            <RentalListItem handleEditClick={this.editRental}rental={rentals[key]} key={key} rentalId={key}/>
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