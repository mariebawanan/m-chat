import React, { Component } from 'react';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';

import mime from 'mime-types';

class FileModal extends Component {
  state = {
    file: null,
    allowed: ['image/png', 'image/jpeg'],
  };

  addFile = event => {
    const file = event.target.files[0];
    if (file) {
      this.setState({ file });
    }
  };

  clearFile = () => {
    this.setState({ file: null });
  };

  isAllowed = filename => this.state.allowed.includes(mime.lookup(filename));

  handleSubmit = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;

    if (file !== null) {
      if (this.isAllowed(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        this.clearFile();
      }
    }
  };

  render() {
    return (
      <Modal
        size="small"
        open={this.props.modal}
        onClose={this.props.closeModal}>
        <Modal.Header>
          <Icon name="file image" />
          Select an image to send
        </Modal.Header>
        <Modal.Content>
          <Input
            fluid
            onChange={this.addFile}
            label="File types: jpg, png"
            name="file"
            type="file"
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color={this.props.theme}
            icon="cloud upload"
            labelPosition="right"
            content="Upload"
            onClick={this.handleSubmit}
          />
          <Button color="grey" onClick={this.props.closeModal}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
