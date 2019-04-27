import React, { Component } from 'react';
import { Input, Button, Icon } from 'semantic-ui-react';
import uuid from 'uuid/v4';
import { firebase, firebaseStorage } from '../../firebase';

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessageForm extends Component {
  state = {
    message: '',
    errors: [],
    loading: false,
    chat: this.props.chat,
    user: this.props.currentUser,
    modal: false,
    uploadState: '',
    uploadTask: null,
    percentUploaded: 0,
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = (fileURL = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      content: this.state.message,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
    };

    if (fileURL !== null) {
      message['image'] = fileURL;
    } else {
      message['content'] = this.state.message;
    }

    return message;
  };

  sendFileMessage = (fileURL, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileURL))
      .then(() => {
        this.setState({
          uploadState: 'done',
        });
      })
      .catch(error => {
        this.setState({
          errors: this.state.errors.concat(error),
        });
      });
  };

  getPath = () => {
    if (this.props.isPrivateChat) {
      return `chat/private-${this.state.chat.id}`;
    } else {
      return 'chat/public';
    }
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.chat.id;
    const ref = this.props.getMessagesRef();
    const filepath = `${this.getPath()}/${uuid()}.jpg`;

    this.setState(
      {
        uploadState: 'uploading',
        uploadTask: firebaseStorage.child(filepath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          'state_changed',
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100,
            );
            this.setState({ percentUploaded });
          },
          error => {
            this.setState({
              errors: this.state.errors.concat(error),
              uploadState: 'error',
              uploadTask: null,
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadURL => {
                this.sendFileMessage(downloadURL, ref, pathToUpload);
              })
              .catch(error => {
                this.setState({
                  errors: this.state.errors.concat(error),
                  uploadState: 'error',
                  uploadTask: null,
                });
              });
          },
        );
      },
    );
  };

  sendMessage = () => {
    const { message, chat, errors } = this.state;
    const { getMessagesRef } = this.props;
    if (message) {
      getMessagesRef()
        .child(chat.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [] });
        })
        .catch(error => {
          console.error(error);
          this.setState({
            loading: false,
            errors: errors.concat(error.message),
          });
        });
    } else {
      this.setState({
        errors: errors.concat({ message: 'Add a message' }),
      });
    }
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const { errors, message, modal, uploadState, percentUploaded } = this.state;
    return (
      <>
        <Input
          type="text"
          placeholder="Start typing..."
          action
          fluid
          size="huge"
          name="message"
          value={message}
          className={
            errors.some(error => error.message.includes('message'))
              ? 'error'
              : ''
          }
          onChange={this.handleChange}>
          <Button icon="plus" />
          <Button
            disabled={uploadState === 'uploading'}
            color="blue"
            icon="cloud upload"
            onClick={this.openModal}
          />

          <input />

          <Button
            color="green"
            icon
            labelPosition="left"
            onClick={this.sendMessage}>
            <Icon name="send" />
            SEND
          </Button>

          <FileModal
            uploadFile={this.uploadFile}
            modal={modal}
            closeModal={this.closeModal}
          />
        </Input>
        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
          attached="bottom"
        />
      </>
    );
  }
}

export default MessageForm;
