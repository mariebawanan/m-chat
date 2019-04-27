import React, { Component } from 'react';
import { Comment, Container, Divider, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { firebase, firebaseUsers } from '../../firebase';
import { setTheme } from '../../actions';

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ user: nextProps.currentUser });
  }

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('sign out');
      });
  };

  handleTheme = color => {
    firebaseUsers
      .child(this.state.user.uid)
      .update({ theme: color })
      .then(() => {
        this.props.setTheme(color);
      });
  };

  render() {
    const { user } = this.state;
    return (
      <div>
        <Container>
          <Comment.Group>
            <Comment>
              <Comment.Avatar src={user.photoURL} />
              <Comment.Content>
                <Comment.Author as="a">{user.displayName}</Comment.Author>
                <Comment.Actions>
                  <Comment.Action>Change avatar </Comment.Action>

                  <Comment.Action onClick={this.handleSignOut}>
                    Log out
                  </Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
            <Comment>
              <Comment.Content>
                <Comment.Actions>
                  <span style={{ fontStyle: 'italic' }}>Theme: </span>
                  <Comment.Action style={{ opacity: 0.8 }}>
                    <Icon
                      name="circle"
                      color="red"
                      onClick={() => this.handleTheme('red')}
                    />
                    <Icon
                      name="circle"
                      color="blue"
                      onClick={() => this.handleTheme('blue')}
                    />
                    <Icon
                      name="circle"
                      color="green"
                      onClick={() => this.handleTheme('green')}
                    />
                    <Icon
                      name="circle"
                      color="orange"
                      onClick={() => this.handleTheme('orange')}
                    />
                    <Icon
                      name="circle"
                      color="teal"
                      onClick={() => this.handleTheme('teal')}
                    />
                    <Icon
                      name="circle"
                      color="violet"
                      onClick={() => this.handleTheme('violet')}
                    />
                    <Icon
                      name="circle"
                      color="black"
                      onClick={() => this.handleTheme('black')}
                    />
                    <Icon
                      name="circle"
                      color="grey"
                      onClick={() => this.handleTheme('grey')}
                    />
                  </Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          </Comment.Group>

          <Divider />
        </Container>
      </div>
    );
  }
}

export default connect(
  null,
  { setTheme },
)(UserPanel);
