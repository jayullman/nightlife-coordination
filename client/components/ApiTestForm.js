import React, { Component } from 'react';

import axios from 'axios';

import SearchResult from './SearchResult';

class ApiTestForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      message: '',
      // isLoggedIn: false,
      username: '',
      isLoggedIn: false,
    };

    this.checkAuth = this.checkAuth.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.handleGoingClick = this.handleGoingClick.bind(this);
    this.storeLocationInDb = this.storeLocationInDb.bind(this);
  }

  fetchResults() {
    axios('/searchtest')
      .then(({ data }) => {
        console.log(data);
        this.setState({
          results: data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // TODO: use sessionstorage to persist data between page reloads and redirects
  checkAuth() {
    const url = '/amiauthenticated';
    
    return axios(url)
      .then(({ data }) => data.isAuthenticated) 
      .catch((err) => {
        console.log(err);
      }); 
    // axios('/whoami')
    //   .then(({ data }) => {
    //     console.log(data)
    //     this.setState({
    //       username: data.name
    //     });
    //   });
  }

  logIn() {
    console.log('log in');
    window.location.href = '/auth/twitter';
  }

  logOut() {
    this.setState({ isLoggedIn: false });
    axios('/logout');
  }

  storeLocationInDb(locationID) {
    axios.post('/going', {
      locationID
    });
  }

  handleGoingClick(locationID) {
    // console.log(e); 
    console.log(locationID);

    if (this.state.isLoggedIn) {
      this.storeLocationInDb(locationID);
    } else {
      this.checkAuth()
        .then((isAuthenticated) => {
          if (!isAuthenticated) {
            this.logIn();
          } else {
            this.setState({ isLoggedIn: true });
            this.storeLocationInDb(locationID);
          }
        })
        .catch((err) => { console.log(err); });
    }

    // check if user is logged in
    // route to twitter auth page if not
  }

  componentDidMount() {
    console.log('mounted');
    this.checkAuth()
      .then((isAuthenticated) => {
        console.log(isAuthenticated);
        if (isAuthenticated) {
          this.setState({ isLoggedIn: true });
        } else {
          this.setState({ isLoggedIn: false });
        }
      });
  }

  render() {
    const results = this.state.results.map(result => 
      <SearchResult 
        handleGoingClick={this.handleGoingClick}
        result={result}
      />
    );
    return (
      <div>
        <p>Logged in: {this.state.isLoggedIn.toString()}</p>
        <p>Last Search: {this.state.lastSearch}</p>
        <h2>Test Form</h2>
        { this.state.username && <h3>Welcome {this.state.username}</h3> }
        <button
          onClick={this.fetchResults}
        >
          Get Portland Results
        </button>
        <button
          onClick={this.checkAuth}
        >
          Am I authenticated?
        </button>
        <button
          onClick={this.logIn}
        >
          Log in
        </button>
        <button
          onClick={this.logOut}
        >
          Log Out
        </button>
        <div>
          {this.state.message}
        </div>
        {results}
      </div>
    );
  }
}

export default ApiTestForm;
