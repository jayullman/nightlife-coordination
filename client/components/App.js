import React, { Component } from 'react';
import axios from 'axios';

import SearchForm from './SearchForm';
import SearchResult from './SearchResult';

import retrieveFromSessionStorage from '../../helpers/retrieveFromSessionStorage';
import saveToSessionStorage from '../../helpers/saveToSessionStorage';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      message: '',
      username: '',
      isLoggedIn: false,
      // stores all locations user clicked 'I'm going'
      goingLocations_thisUser: [],
      attendedLocations_allUsers: [],
      lastLocationClicked: ''
    };

    this.fetchResults = this.fetchResults.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.updateLocationInDb = this.updateLocationInDb.bind(this);
    this.handleGoingClick = this.handleGoingClick.bind(this);
    this.retrieveUserInfoFromDB = this.retrieveUserInfoFromDB.bind(this);
    this.retrieveWhoIsGoingFromDB = this.retrieveWhoIsGoingFromDB.bind(this);
  }

  fetchResults(location) {
    axios(`/search/${location}`)
      .then(({ data }) => {
        console.log(data);
        // TODO: Find user in db and update this.state.goingLocations
        
        if (this.state.isLoggedIn) {
          this.retrieveUserInfoFromDB();
        }
        this.retrieveWhoIsGoingFromDB();
        
        this.setState({
          results: data
        });
      })
      .catch((err) => {
        console.log(err);
        alert('Could not find location');
      });
  }

  retrieveUserInfoFromDB() {
    axios('retrieveUserInfo')
      .then(({ data }) => {
        console.log('user info: ', data);
        this.setState({ 
          goingLocations_thisUser: data.placesGoing,
          username: data.username
        });
      });
  }

  retrieveWhoIsGoingFromDB() {
    axios('/whoisgoing')
      .then(({ data }) => {
        this.setState({ attendedLocations_allUsers: data.locations })        
      })
  }

  checkAuth() {
    const url = '/amiauthenticated';

    return axios(url)
      .then(({ data }) => data.isAuthenticated)
      .catch((err) => {
        console.log(err);
      });
  }

  logIn() {
    // save results to session storage before redirecting
    if (this.state.results.length > 0) {
      saveToSessionStorage({
        results: JSON.stringify(this.state.results),
        attendedLocations_allUsers: JSON.stringify(this.state.attendedLocations_allUsers),
        // this will store the location last clicked that prompted a redirect so the click
        // can be registered when the page is reloaded
        lastLocationClicked: JSON.stringify(this.state.lastLocationClicked)
      });
    }
    console.log('log in');
    window.location.href = '/auth/twitter';
  }

  logOut() {
    this.setState({ isLoggedIn: false });
    axios('/logout');
  }

  updateLocationInDb(locationID) {
    axios.post('/going', {
      locationID

      // after location is updated, retreieve updated db and update state
    })
      .then((data) => {
        console.log(data);
        this.retrieveWhoIsGoingFromDB();
      });
  }

  handleGoingClick(locationID) {
    function updateInfoIfLoggedIn() {
      const updatedGoingLocations_thisUser = [...this.state.goingLocations_thisUser];
      const indexOfLocation = this.state.goingLocations_thisUser.indexOf(locationID);

      // either pushes or removes locationID from goingLocations
      if (indexOfLocation === -1) {
        updatedGoingLocations_thisUser.push(locationID);
      } else {
        updatedGoingLocations_thisUser.splice(indexOfLocation, 1);
      }
      this.setState({
        goingLocations_thisUser: updatedGoingLocations_thisUser
      });
      this.updateLocationInDb(locationID);
    }

    // if user is not logged in:
    if (!this.state.isLoggedIn) {
      this.setState({ lastLocationClicked: locationID });
      this.checkAuth()
        .then((isAuthenticated) => {
          if (!isAuthenticated) {
            this.logIn();
          } else {
            console.log('hmmm');
            this.setState({ isLoggedIn: true });
            updateInfoIfLoggedIn.call(this);
          }
        })
        .catch((err) => { console.log(err); });

    // if user is logged in:
    } else {
      updateInfoIfLoggedIn.call(this);
    }
  }

  componentDidMount() {
    // check for existing sessionStorage
    if (sessionStorage.getItem('results')) {
      const session = retrieveFromSessionStorage();
      this.setState({
        results: session.results,
        attendedLocations_allUsers: session.attendedLocations_allUsers
      });

      // reselect the last location clicked before redirecting
      this.handleGoingClick(session.lastLocationClicked);
    }

    console.log('mounted');
    this.checkAuth()
      .then((isAuthenticated) => {
        console.log(isAuthenticated);
        if (isAuthenticated) {
          this.setState({ isLoggedIn: true });
          this.retrieveUserInfoFromDB();
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
        goingLocations={this.state.goingLocations_thisUser}
        attendedLocations={this.state.attendedLocations_allUsers}
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
          <div>
            {this.state.message}
            {this.state.attendedLocations_allUsers.length > 0 && 'Hello!' }
          </div>
          {results}</div>
      </div>
    );
  }
}

export default App;
