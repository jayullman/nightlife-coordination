import React, { Component } from 'react';
import axios from 'axios';

import SearchForm from './SearchForm';
import SearchResult from './SearchResult';

import retrieveFromSessionStorage from '../../controllers/retrieveFromSessionStorage';
import saveToSessionStorage from '../../controllers/saveToSessionStorage';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      message: '',
      username: '',
      isLoggedIn: false,
      // stores all locations user clicked 'I'm going'
      goingLocations: []
    };

    this.fetchResults = this.fetchResults.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.storeLocationInDb = this.storeLocationInDb.bind(this);
    this.handleGoingClick = this.handleGoingClick.bind(this);
  }

  fetchResults(location) {
    axios(`/search/${location}`)
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
    // save results to session storage before redirecting
    if (this.state.results.length > 0) {
      saveToSessionStorage({
        results: JSON.stringify(this.state.results),
        goingLocations: JSON.stringify(this.state.goingLocations)
      });
    }
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
    this.storeLocationInDb(locationID);
    const updatedGoingLocations = [...this.state.goingLocations];
    const indexOfLocation = this.state.goingLocations.indexOf(locationID);

    if (indexOfLocation === -1) {
      updatedGoingLocations.push(locationID);
    } else {
      updatedGoingLocations.splice(indexOfLocation, 1);
    }
    this.setState({
      goingLocations: updatedGoingLocations
    });

    // if user is not logged in:
    if (!this.state.isLoggedIn) {
      this.checkAuth()
        .then((isAuthenticated) => {
          if (!isAuthenticated) {
            this.logIn();
          } else {
            this.setState({ isLoggedIn: true });
            // this.storeLocationInDb(locationID);
          }
        })
        .catch((err) => { console.log(err); });
    }
  }

  componentDidMount() {
    // check for existing sessionStorage
    if (sessionStorage.getItem('results')) {
      const session = retrieveFromSessionStorage();
      this.setState({
        results: session.results,
        goingLocations: session.goingLocations
      });
    }

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
        key={result.id}
        handleGoingClick={this.handleGoingClick}
        result={result}
        goingLocations={this.state.goingLocations}
      />
    );
  
    return (
      <div>
        <span 
          onClick={this.state.isLoggedIn ? this.logOut : this.logIn}
          className='loginoutLink'
        >
          {this.state.isLoggedIn ? 'Log out' : 'Log in'}
        </span>
        <h1>The Nightlife App <i className="fa fa-moon-o" aria-hidden="true"></i></h1>
        <SearchForm
          fetchResults={this.fetchResults}
        />
        {/*<div className='searchResults-container'>
          {results}
        </div>*/}
        <div><p>Logged in: {this.state.isLoggedIn.toString()}</p>
          <p>Last Search: {this.state.lastSearch}</p>
          <h2>Test Form</h2>
          {this.state.username && <h3>Welcome {this.state.username}</h3>}
          <button
            onClick={this.checkAuth}
          >
            Am I authenticated?
        </button>
          <div>
            {this.state.message}
          </div>
          {results}</div>
      </div>
    );
  }
}


export default App;
