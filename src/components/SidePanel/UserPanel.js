import React, { Component } from 'react';
import {
  Comment,
  Container,
  Divider,
  Icon,
  Modal,
  Input,
  Grid,
  Button,
  Image,
  Header,
  Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import AvatarEditor from 'react-avatar-editor';

import { firebase, firebaseUsers, firebaseStorage } from '../../firebase';
import { setTheme } from '../../actions';

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    theme: '',
    previewImage: '',
    croppedImage: '',
    uploadedCroppedImage: '',
    blob: '',
    userRef: firebase.auth().currentUser,
    metadata: {
      contentType: 'image/jpeg',
    },
    uploading: false,
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

  handleChangeAvatar = () => {};

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({
      modal: false,
      previewImage: '',
      croppedImage: '',
      blob: '',
    });
  };

  handleCropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imageUrl,
          blob,
        });
      });
    }
  };

  handleChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result, croppedImage: '' });
      });
    }
  };

  uploadCroppedImage = () => {
    this.setState({ uploading: true });
    const { userRef, blob, metadata } = this.state;

    firebaseStorage
      .child(`avatars/user-${userRef.uid}`)
      .put(blob, metadata)
      .then(snap => {
        snap.ref.getDownloadURL().then(downloadURL => {
          this.setState({ uploadedCroppedImage: downloadURL }, () =>
            this.changeAvatar(),
          );
        });
      });
  };

  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadedCroppedImage,
      })
      .then(() => {
        console.log('PhotoURL updated');
        this.closeModal();
        this.setState({ uploading: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ uploading: false });
      });

    firebaseUsers
      .child(this.state.user.uid)
      .update({ avatar: this.state.uploadedCroppedImage })
      .then(() => {
        console.log('User avatar updated');
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const { user, modal, previewImage, croppedImage, uploading } = this.state;
    return (
      <div>
        <Container>
          <Comment.Group>
            <Comment>
              <Comment.Avatar src={user.photoURL} />
              <Comment.Content>
                <Comment.Author as="a">{user.displayName}</Comment.Author>
                <Comment.Actions>
                  <Comment.Action onClick={this.openModal}>
                    Change avatar{' '}
                  </Comment.Action>

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

        <Modal size="small" open={modal} onClose={this.closeModal}>
          <Modal.Header>Change avatar</Modal.Header>
          <Modal.Content>
            <Input
              fluid
              type="file"
              label="New avatar"
              name="previewImage"
              onChange={this.handleChange}
            />
            {previewImage && (
              <Segment>
                <Grid columns={2} stackable textAlign="center">
                  <Grid.Row verticalAlign="middle">
                    <Grid.Column>
                      {previewImage && (
                        <AvatarEditor
                          ref={node => (this.avatarEditor = node)}
                          image={previewImage}
                          width={120}
                          height={120}
                          border={50}
                          scale={1.2}
                        />
                      )}
                    </Grid.Column>

                    <Grid.Column>
                      {croppedImage && (
                        <>
                          <Header>Preview</Header>
                          <Image
                            style={{ margin: '3.5em auto' }}
                            width={100}
                            height={100}
                            src={croppedImage}
                          />
                        </>
                      )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            )}
          </Modal.Content>
          <Modal.Actions>
            {croppedImage && (
              <Button
                color="blue"
                loading={uploading}
                onClick={this.uploadCroppedImage}>
                <Icon name="save" /> Change Avatar
              </Button>
            )}
            {previewImage && (
              <Button
                color="green"
                disabled={uploading}
                onClick={this.handleCropImage}>
                <Icon name="image" /> Preview
              </Button>
            )}

            <Button color="red" disabled={uploading} onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default connect(
  null,
  { setTheme },
)(UserPanel);
