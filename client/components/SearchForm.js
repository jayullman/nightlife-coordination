import React, { Component } from 'react';

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchField: ''
    };

    this.handleOnSearchChange = this.handleOnSearchChange.bind(this);
  }

  handleOnSearchChange(e) {
    console.log(e.target.value);
    this.setState({ searchField: e.target.value });
  }

  render() {
    return (
      <div className='searchForm'>
      <p className='formTitle'>Enter your location below to see your local spots</p>
      <input 
        onChange={this.handleOnSearchChange}
        value={this.state.searchField}
        className='searchField' ref={(input) => { this.searchField = input; }} 
        placeholder='Enter your location'
      />
      </div>
    );
  }
}

export default SearchForm;
