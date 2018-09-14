import React, { Component } from 'react';
import { Link, withRouter, } from 'react-router-dom';

import { auth, db } from '../firebase';
import * as routes from '../constants/routes';

const SignUpPage = ({ history }) =>
    <div>
        <h1>SignUp</h1>
        <SignUpForm history={history} />
    </div>

const INITIAL_STATE = {
    firstname: '',
    lastname: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class SignUpForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const {
            firstname,
            lastname,
            email,
            passwordOne,
        } = this.state;

        const {
            history,
        } = this.props;

        auth.doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                db.doCreateUser(authUser.user.uid, firstname, lastname, email)
                    .then(() => {
                        this.setState({ ...INITIAL_STATE });
                        history.push(routes.DASHBOARD);
                    })
                    .catch(error => {
                        this.setState(byPropKey('error', error));
                    });
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();
    }

    render() {
        const {
            firstname,
            lastname,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            firstname === '' ||
            lastname === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    value={firstname}
                    onChange={event => this.setState(byPropKey('firstname', event.target.value))}
                    type="text"
                    placeholder="First Name"
                />
                <input
                    value={lastname}
                    onChange={event => this.setState(byPropKey('lastname', event.target.value))}
                    type="text"
                    placeholder="Last Name"
                />
                <input
                    value={email}
                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    value={passwordOne}
                    onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                    type="password"
                    placeholder="Password"
                />
                <input
                    value={passwordTwo}
                    onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                    type="password"
                    placeholder="Confirm Password"
                />
                <button disabled={isInvalid} type="submit">
                    Sign Up
                </button>

                { error && <p>{error.message}</p> }
            </form>
        );
    }
}

const SignUpLink = () =>
    <p>
        Don't have an account?
        {' '}
        <Link to={routes.SIGN_UP}>Sign Up</Link>
    </p>

export default withRouter(SignUpPage);

export {
    SignUpForm,
    SignUpLink,
};