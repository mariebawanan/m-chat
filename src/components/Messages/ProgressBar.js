import React from 'react';
import { Progress } from 'semantic-ui-react';

const ProgressBar = ({ uploadState, percentUploaded, theme }) =>
  uploadState === 'uploading' && (
    <Progress
      className="message-progress"
      percent={percentUploaded}
      progress
      indicating
      size="small"
      inverted
      color={theme}
    />
  );

export default ProgressBar;
