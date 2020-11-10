import React from 'react';
import '../css/Issues.css';
import * as helper from '../utils/helper';
import { Col, Container, Row , ProgressBar} from 'react-bootstrap';
import IssueDetails from './IssueDetails';

const headers = {
    headers: {
        Authorization: "token e359ef605cbdf330a70659af7cbce43b2f3bce5c",
        Accept: "application/vnd.github.v3+json,application/vnd.github.machine-man-preview+json",
    }
};

const baseUrl = "https://api.github.com/repos"



class Issues extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            repo: this.props.repo,
            listFilter: { state: "open", choice: "issues" },
            since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            per_page: 40,
            sort: "created",
            page: '',
            currentPageNumber: 1,
            pages: {},
            issues: [],
            loading: true,
            error: null,
            showBody: {},
        };
        
        this.getIssues = this.getIssues.bind(this);
    }

    componentDidMount() {
        this.getIssues();
    }

    /**
     * Fetch issues 
     */
    getIssues() {
        // 7 days ago from today 
        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        
        const params = helper.encodeQueryString({ state: this.state.listFilter.state, since: since, per_page: 40, sort: "created" })
        
        let linkHeaders = ''
        
        let userRepositoryIssues = `${this.props.user}/${this.props.repo}/issues`
        let fullUrl = `${baseUrl}/${userRepositoryIssues}${params}${this.state.page}`

        fetch(fullUrl, headers)
            .then(response => {
                if (response.headers.get('Link')) {
                    linkHeaders = helper.parseLinkHeader(response.headers.get('Link'))
                }
                if (response.ok) return response.json();
                throw new Error('Request failed.');
            })
            .then(data => {
                // set our state with the response
                this.setState({
                    pages: linkHeaders,
                    issues: data,
                    loading: false,
                    error: null,
                    showBody: {},
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: error
                });
            });
    }

    // Render a loading bar during HTTP Request
    renderLoading() {
        return <ProgressBar animated now={100}/>;
    }

    // Render an error message
    renderError() {
        return (
            <div>
                Something is wrong: {this.state.error.message}
            </div>
        );
    }

    // Render issues
    renderIssues() {
        if (this.state.error) {
            return this.renderError();
        }

        return (
            < React.Fragment >
                {
                    this.state.issues.map(function (data, index) {
                       return <Container>
                                    <span data-id={data.id} >
                                        <Row>
                                            <Col md={1}><i className="fa fa-exclamation-circle fa-3x"></i></Col>
                                            <Col md={11} className="issueDetails"><span className="title">{data.title}</span>
                                                        <br/>
                                                        <span className="timestamp">
                                                            <IssueDetails data={data} />
                                                        </span>
                                            </Col>
                                        </Row>
                                </span>
                                </Container>

                    })

                }
            
            </React.Fragment>
        );
    }

    render() {

        return (
            <div className="container">
                <nav className="panel">
                <span>Issues</span>
                <hr></hr>
                {this.state.loading ?
                    this.renderLoading()
                    : this.renderIssues()}
                </nav>
            </div>);
    }
   
}

export default Issues;
