import React from 'react';
import { Col, Container, Row} from 'react-bootstrap';
import IssueDetails from './IssueDetails';
import Labels from './Labels';

const IssueList = ({ currentIssues }) => {
  let issuesMap = currentIssues.map((data, index) => {
    return <div key={index}>
          <Container>
            <span data-id={data.id} >
              <Row className="py-2 border">
                <Col md={1}><i className="fa fa-exclamation-circle fa-2x"></i></Col>
                <Col md={11} className="issueDetails">
                  <span className="title">{data.title}</span>
                    <Labels labels={data.labels} />
                  <br/>
                  <span className="timestamp">
                    <IssueDetails data={data} />
                  </span>
                </Col>
              </Row>
            </span>
          </Container>
          </div> 
  })
return (
  <React.Fragment>
    {issuesMap}
  </React.Fragment>
)

}

export default IssueList;