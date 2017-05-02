import React from 'react';

import ApiTestForm from './ApiTestForm';
import SearchForm from './SearchForm';

const App = () => (
  <div>
    <h1>The Nightlife App <i className="fa fa-moon-o" aria-hidden="true"></i></h1>
    <SearchForm />
    <ApiTestForm />
  </div>
);

export default App;
