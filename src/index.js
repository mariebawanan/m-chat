import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';

import { Provider, connect } from 'react-redux';
import store from './store';
import { setUser, clearUser, clearChat, clearTheme, setTheme } from './actions';

import App from '../src/components/App/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Spinner from './Spinner';

import { firebase, firebaseUsers } from './firebase';

import 'semantic-ui-css/semantic.min.css';

class Root extends Component {
  setUserTheme = user => {
    firebaseUsers.child(user.uid).on('value', snap => {
      let theme =
        snap.exists() && snap.val().theme ? snap.val().theme : 'green';
      this.props.setTheme(theme);
    });
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        this.setUserTheme(user);
        this.props.history.push('/');
      } else {
        this.props.history.push('/login');
        this.props.clearUser();
        this.props.clearChat();
        this.props.clearTheme();
      }
    });
  }

  render() {
    return this.props.loading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/" component={App} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.user.loading,
});

const RootWithAuth = withRouter(
  connect(
    mapStateToProps,
    { setUser, clearUser, clearChat, clearTheme, setTheme },
  )(Root),
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <RootWithAuth />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
