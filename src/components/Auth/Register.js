import React, { Component } from 'react';
import {
  Container,
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import md5 from 'md5';

import { connect } from 'react-redux';
import { setUser } from '../../actions';

import { firebase, firebaseUsers } from '../../firebase';

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleInputError = (errors, element) =>
    errors.some(error => error.message.toLowerCase().includes(element))
      ? 'error'
      : '';

  isFormEmpty = ({ username, email, password, passwordConfirmation }) =>
    !username.length ||
    !email.length ||
    !password.length ||
    !passwordConfirmation.length;

  validatePassword = ({ password, passwordConfirmation }) => {
    if (password.length < 6)
      return { message: 'Password must be at least 6 characters' };
    else if (password !== passwordConfirmation)
      return { message: 'Passwords do not match' };
    else return '';
  };

  isFormValid = () => {
    let errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      error = { message: 'Fill in all fields' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      error = this.validatePassword(this.state);
      if (error) {
        this.setState({ errors: errors.concat(error) });
        return false;
      }
    }
    return true;
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}> {error.message}</p>);

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email,
              )}?d=identicon`,
            })
            .then(() => {
              this.props.setUser(createdUser.user);
              this.saveUser(createdUser).then(() => {
                this.setState(
                  {
                    loading: false,
                  },
                  () => this.props.history.push('/'),
                );
              });
            });
        })
        .catch(e => {
          let error = { message: e.message };
          this.setState({ errors: this.state.errors.concat(error) });
          this.setState({ loading: false });
        });
    }
  };

  saveUser = createdUser => {
    return firebaseUsers.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };

  componentWillUnmount() {
    firebaseUsers.off();
  }

  render() {
    const {
      email,
      username,
      password,
      passwordConfirmation,
      errors,
      loading,
    } = this.state;
    return (
      <Container>
        <style>
          {`
            html, body {
              background-color: #16ab39 !important;
            }
          `}
        </style>
        <Grid columns={2} centered stackable style={{ height: '100vh' }}>
          <Grid.Column verticalAlign="middle">
            <Header style={{ fontSize: '100px', color: '#fff' }}>
              register.
            </Header>
          </Grid.Column>
          <Grid.Column width={8} verticalAlign="middle">
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  fluid
                  size="big"
                  type="email"
                  name="email"
                  icon="mail"
                  iconPosition="left"
                  placeholder="Email Address"
                  value={email}
                  onChange={this.handleInputChange}
                  className={this.handleInputError(errors, 'email')}
                />

                <Form.Input
                  fluid
                  size="big"
                  type="text"
                  name="username"
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                  value={username}
                  onChange={this.handleInputChange}
                  className={this.handleInputError(errors, 'username')}
                />

                <Form.Input
                  fluid
                  size="big"
                  type="password"
                  name="password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleInputChange}
                  className={this.handleInputError(errors, 'password')}
                />

                <Form.Input
                  fluid
                  size="big"
                  type="password"
                  name="passwordConfirmation"
                  icon="repeat"
                  iconPosition="left"
                  placeholder="Password Confirmation"
                  value={passwordConfirmation}
                  onChange={this.handleInputChange}
                  className={this.handleInputError(errors, 'password')}
                />

                <Button
                  className={loading ? 'loading' : ''}
                  disabled={loading}
                  color="green"
                  fluid
                  size="large">
                  Submit
                </Button>
              </Segment>
            </Form>
            {this.state.errors.length > 0 && (
              <Message error>
                <h3>Error</h3>
                {this.displayErrors(errors)}
              </Message>
            )}
            <Message>
              Already a user? <Link to="login">Log in</Link>
            </Message>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default connect(
  null,
  { setUser },
)(Register);
