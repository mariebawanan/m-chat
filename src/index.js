import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from '../src/components/App/App';

import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { firebase } from './firebase';

import 'semantic-ui-css/semantic.min.css';

class Root extends Component {
	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				console.log(user);
				this.props.history.push('/');
			}
		});
	}
	render() {
		return (
			<Switch>
				<Route exact path="/login" component={Login} />
				<Route exact path="/register" component={Register} />
				<Route exact path="/" component={App} />
			</Switch>
		);
	}
}

const RootWithAuth = withRouter(Root);

ReactDOM.render(
	<BrowserRouter>
		<RootWithAuth />
	</BrowserRouter>,
	document.getElementById('root'),
);
