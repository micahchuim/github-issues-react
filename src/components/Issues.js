import React from 'react';
import '../css/Issues.css';
import * as helper from '../utils/helper';
import { ProgressBar} from 'react-bootstrap';
import IssueList from './IssueList';

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
      per_page: 10,
      sort: "created",
      page: '',
      currentPageNumber: 1,
      currentPage: 1,
      pages: {},
      issues: [],
      loading: true,
      error: null,
      showBody: {},
    };
      
    this.getIssues = this.getIssues.bind(this);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
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

    const { issues, currentPage, per_page } = this.state;

    const currentIssues = helper.getCurrentIssues(issues, per_page, currentPage)

    const pageNumbers = helper.displayPageNumbers(issues, per_page)

    // display pagination
    const renderPageNumbers = pageNumbers.map(number => {
      if(number === currentPage ){
        return(
          <button className="btn btn-outline-primary pageBtn active mt-2 mb-2" key={number} id={number} onClick={this.handleClick}>
            {number}
          </button>
        )
      }else{
        return (
          <button className="btn btn-outline-primary pageBtn mt-2 mb-2" key={number} id={number} onClick={this.handleClick}>
            {number}
          </button>
        );
      }
    });
      
    return (
      < React.Fragment >
        <IssueList currentIssues = {currentIssues} />
        {renderPageNumbers}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="container">
        <nav className="panel">
        <span>Open Github Issues</span>
        <hr></hr>
        {this.state.loading ?
            this.renderLoading()
            : this.renderIssues()}
        </nav>
      </div>);
  }
   
}

export default Issues;  
