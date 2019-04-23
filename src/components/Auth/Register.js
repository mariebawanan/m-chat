import React, { Component } from 'react';
import { Container, Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import firebase from '../../firebase';

class Register extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		passwordConfirmation: '',
	};

	handleInputChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleSubmit = event => {
		event.preventDefault();
		firebase
			.auth()
			.createUserWithEmailAndPassword(this.state.email, this.state.password)
			.then(createdUser => {
				console.log(createdUser);
			})
			.catch(e => console.error(e.message));
	};

	render() {
		const { email, username, password, passwordConfirmation } = this.state;
		return (
			<Container>
				<Grid columns={2} centered stackable style={{ height: '100vh' }}>
					<Grid.Column width={8} verticalAlign="middle">
						<Header as="h2" color="blue">
							<Icon name="chat" />
							Register to m-Chat
						</Header>
						<Form size="large" onSubmit={this.handleSubmit}>
							<Segment stacked>
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
								/>

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
								/>

								<Button color="blue" fluid size="large">
									Submit
								</Button>
							</Segment>
						</Form>
						<Message>
							Already a user? <Link to="login">Log in</Link>
						</Message>
					</Grid.Column>
				</Grid>
			</Container>
		);
	}
}

export default Register;
