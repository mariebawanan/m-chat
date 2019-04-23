import React, { Component } from 'react';
import { Container, Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { firebase } from '../../firebase';

class Login extends Component {
	state = {
		email: '',
		password: '',
		errors: [],
		loading: false,
	};

	handleInputChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleInputError = (errors, element) =>
		errors.some(error => error.message.toLowerCase().includes(element)) ? 'error' : '';

	isFormEmpty = ({ email, password }) => !email.length || !password.length;

	isFormValid = ({ email, password }) => email && password;

	displayErrors = errors => errors.map((error, i) => <p key={i}> {error.message}</p>);

	handleSubmit = event => {
		event.preventDefault();
		if (this.isFormValid(this.state)) {
			this.setState({ errors: [], loading: true });
			firebase
				.auth()
				.signInWithEmailAndPassword(this.state.email, this.state.password)
				.then(signedInUser => {
					console.log(signedInUser);
					this.setState({ loading: false });
				})
				.catch(e => {
					let error = { message: e.message };
					this.setState({ errors: this.state.errors.concat(error), loading: false });
				});
		}
	};

	render() {
		const { email, password, errors, loading } = this.state;
		return (
			<Container>
				<Grid columns={2} centered stackable style={{ height: '100vh' }}>
					<Grid.Column width={8} verticalAlign="middle">
						<Header as="h2" color="orange">
							<Icon name="user" />
							Login to m-Chat
						</Header>
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
									type="password"
									name="password"
									icon="lock"
									iconPosition="left"
									placeholder="Password"
									value={password}
									onChange={this.handleInputChange}
									className={this.handleInputError(errors, 'password')}
								/>

								<Button
									className={loading ? 'loading' : ''}
									disabled={loading}
									color="orange"
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
							Not yet registered? <Link to="/register">Register</Link>
						</Message>
					</Grid.Column>
				</Grid>
			</Container>
		);
	}
}

export default Login;
