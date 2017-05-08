import React, { Component } from 'react';

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchField: ''
    };

    this.handleOnSearchChange = this.handleOnSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOnSearchChange(e) {
    this.setState({ searchField: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.fetchResults(this.state.searchField);
  }

  render() {
    return (
      <div className='searchForm'>
        <p className='formTitle'>Enter your location below to see your local spots</p>
        <form onSubmit={this.handleSubmit}>
          <input 
            onChange={this.handleOnSearchChange}
            value={this.state.searchField}
            className='searchField' ref={(input) => { this.searchField = input; }} 
            placeholder='Enter your location'
          />
        </form>
        <div 
          className='searchButton'
          onClick={this.handleSubmit}
        >
          Go
        </div>
      </div>
    );
  }
}

export default SearchForm;
