import React from 'react';

const Footer = (props) => {
  let footerClassName = '';
  if (props.pushFooterToBottom) {
    footerClassName = 'pushFooterToBottom';
  }
  return (
    <footer className={footerClassName}>
      <p>
        View the source code on{' '}
        <a target='_blank'
          href='https://github.com/libeja/nightlife-coordination'>GitHub{' '}
          <i className="fa fa-github" aria-hidden="true"></i>
        </a>
      </p>
      <div className="icons-container">
        <a href="https://github.com/libeja" target="_blank"><i className="fa fa-github-square fa-4x" aria-hidden="true"></i></a>
        <a href="https://www.freecodecamp.com/libeja" target="_blank"><i className="fa fa-free-code-camp fa-4x" aria-hidden="true"></i></a>
        <a href="mailto:jayullman@gmail.com"><i className="fa fa-envelope-o fa-4x" aria-hidden="true"></i></a>
      </div>
      <br />
      <small>Created by Jay</small>
    </footer>
  );
};

export default Footer;
