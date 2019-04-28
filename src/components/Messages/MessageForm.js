import React, { Component } from 'react';
import { Input, Button, Icon } from 'semantic-ui-react';
import uuid from 'uuid/v4';

import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import { firebase, firebaseStorage, firebaseTypingUsers } from '../../firebase';

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessageForm extends Component {
  state = {
    message: '',
    errors: [],
    loading: false,
    chat: this.props.chat,
    user: this.props.currentUser,
    theme: this.props.theme,
    modal: false,
    uploadState: '',
    uploadTask: null,
    percentUploaded: 0,
    emojiPicker: false,
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ theme: nextProps.theme });
  }

  componentWillUnmount() {
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel();
      this.setState({ uploadTask: null });
    }
  }

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
    const { message, chat, errors, user } = this.state;
    const { getMessagesRef } = this.props;
    if (message) {
      this.messageInputRef.focus();
      getMessagesRef()
        .child(chat.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [] });
          firebaseTypingUsers
            .child(chat.id)
            .child(user.uid)
            .remove();
        })

        .catch(error => {
          console.error(error);
          this.setState({
            loading: false,
            errors: errors.concat(error.message),
          });
          firebaseTypingUsers
            .child(chat.id)
            .child(user.uid)
            .remove();
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

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      this.sendMessage();
    }

    const { message, chat, user } = this.state;

    if (message.length) {
      firebaseTypingUsers
        .child(chat.id)
        .child(user.uid)
        .set(user.displayName);
    } else {
      firebaseTypingUsers
        .child(chat.id)
        .child(user.uid)
        .remove();
    }
  };

  togglePicker = () => {
    this.setState({ emojiPicker: !this.state.emojiPicker });
  };

  colonToUnicode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, '');
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== 'undefined') {
        let unicode = emoji.native;
        if (typeof unicode !== 'undefined') {
          return unicode;
        }
      }
      x = ':' + x + ':';
      return x;
    });
  };

  handleAddEmoji = emoji => {
    const oldMessage = this.state.message;
    const newMessage = this.colonToUnicode(`${oldMessage} ${emoji.colons}`);
    this.setState({ message: newMessage, emojiPicker: false });
    this.messageInputRef.focus();
  };

  render() {
    const {
      chat,
      errors,
      message,
      modal,
      uploadState,
      percentUploaded,
      theme,
      emojiPicker,
    } = this.state;
    return (
      <>
        {emojiPicker && (
          <Picker
            set="apple"
            onSelect={this.handleAddEmoji}
            title="Pick your emoji"
            emoji="point_up"
            style={{ position: 'absolute', bottom: '9vh' }}
          />
        )}
        <Input
          type="text"
          placeholder="Start typing..."
          action
          fluid
          size="huge"
          name="message"
          disabled={chat ? false : true}
          value={message}
          ref={input => (this.messageInputRef = input)}
          className={
            errors.some(error => error.message.includes('message'))
              ? 'error'
              : ''
          }
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}>
          <Button
            disabled={uploadState === 'uploading' || chat ? false : true}
            color={theme}
            icon="cloud upload"
            onClick={this.openModal}
          />
          <Button
            disabled={chat ? false : true}
            onClick={this.togglePicker}
            icon={emojiPicker ? 'close' : 'add'}
          />

          <input />

          <Button
            disabled={chat && message ? false : true}
            color={theme}
            icon
            labelPosition="left"
            onClick={this.sendMessage}>
            <Icon name="send" />
            SEND
          </Button>

          <FileModal
            theme={theme}
            uploadFile={this.uploadFile}
            modal={modal}
            closeModal={this.closeModal}
          />
        </Input>

        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
          attached="bottom"
          theme={theme}
        />
      </>
    );
  }
}

export default MessageForm;
