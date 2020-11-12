import React from 'react';
import * as helper from '../utils/helper';

const IssueDetails = ({ data }) => {
  const createdAt = helper.getTimeStamp(new Date(data.created_at))
  const user = data.user.login

  let timeStamp = `#${data.number} opened ${createdAt} by ${user}`

  return (
    <React.Fragment>
        {timeStamp}
    </React.Fragment>
)
}

export default IssueDetails