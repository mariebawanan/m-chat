import React from 'react';
import { Progress } from 'semantic-ui-react';

const ProgressBar = ({ uploadState, percentUploaded }) =>
  uploadState === 'uploading' && (
    <Progress
      className="message-progress"
      percent={percentUploaded}
      progress
      indicating
      size="small"
      inverted
      color="green"
    />
  );

export default ProgressBar;
