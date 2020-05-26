import React, { Component } from 'react'

export default class Container extends Component {
    render() {
      return (
  
        <div className="container">
          <header className="header">
            <div className="logo-container">
              <img src="./img/teaicon.png" alt="teaIcon" className="logo-img" />
              <h1 className="logo-text">

                tea<span className="logo-highlight">gether</span>

              </h1>
            </div>
          </header>
          <div className="content-container">
            <div className="active-users-panel" id="active-user-container">
              <h2 className="panel-title">🎈 ongoing tea parties 🎈</h2>
            </div>
            <video autoPlay muted className="local-video" id="local-video">
            </video>
            <div className="video-chat-container">
              <h2 className="talk-info" id="talking-with-info">	
              </h2>
              <div className="video-container">
                <video autoPlay className="remote-video" id="remote-video" />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
