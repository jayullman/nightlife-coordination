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
      username: ''
    };

    this.checkAuth = this.checkAuth.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
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

  checkAuth() {
    axios('/amiauthenticated')
      .then(({ data }) => {
        this.setState({
          message: data.message
        });
      })
      .catch((err) => {
        console.log(err);
      }); 
    axios('/whoami')
      .then(({ data }) => {
        console.log(data)
        this.setState({
          username: data.name
        });
      });
  }

  logIn() {
    console.log('log in');
    window.location.href = '/auth/twitter';
  }

  logOut() {
    axios('/logout');
  }

  render() {
    const results = this.state.results.map(result => 
      <SearchResult 
        handleGoingClick={() => { console.log('going!'); }}
        result={result}
      />
    );
    return (
      <div>
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
