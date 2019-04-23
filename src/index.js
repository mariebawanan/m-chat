import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/components/App/App';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import 'semantic-ui-css/semantic.min.css';

const Root = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
				<Route path="/" component={App} />
			</Switch>
		</BrowserRouter>
	);
};

ReactDOM.render(<Root />, document.getElementById('root'));
serviceWorker.unregister();
