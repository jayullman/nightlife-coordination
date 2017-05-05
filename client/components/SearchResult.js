import React from 'react';

const SearchResult = (props) => {
  const { 
    name, 
    image_url, 
    display_phone: phone,
    location,
    id
   } = props.result;

  // check to see if the user is going to this search result
  const isGoing = props.goingLocations.indexOf(id) !== -1;

  return (
    <div className='searchResult'>
      <img className='resultImage' src={image_url} width={100} height={100} />
      <div className='searchResult-info'>
        <h1>{name}</h1>
        <p>{phone}</p>
        <p>{location.address1}</p>
        <p>{location.city}, {location.state} {location.zip_code}</p>
      </div>
      <div
        className='goingButton'
        onClick={props.handleGoingClick.bind(this, id)}
      >
       I'm Going
      </div>
      <div>{isGoing ? 'YES' : 'NO'}</div>
      <div>People going: </div>
    </div>
  );
};

export default SearchResult;
