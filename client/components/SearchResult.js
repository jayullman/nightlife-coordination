import React from 'react';

const SearchResult = (props) => {
  const { 
    name, 
    image_url, 
    display_phone: phone,
    location
   } = props.result;
  return (
    <div className='searchResult'>
      <img className='resultImage' src={image_url} width={100} height={100} />
      <h1>{name}</h1>
      <p>{phone}</p>
      <p>{location.address1}</p>
      <p>{location.city}, {location.state} {location.zip_code}</p>
      <div
        className='goingButton'
        onClick={props.handleGoingClick}
      >
        I'm Going!
      </div>
    </div>
  );
};

export default SearchResult;
