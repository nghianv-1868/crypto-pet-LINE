import React from 'react';
import './LineLogin.css';

import axios from 'axios';
import url from 'url';
import qs from 'qs';
import querystring from 'querystring';
import jwt from 'jsonwebtoken';
import { compose } from 'redux';
const crypto = require('crypto');
require('dotenv').config();

const clientID = process.env.REACT_APP_LINE_LOGIN_CHANNEL_ID;
const clientSecret = process.env.REACT_APP_LINE_LOGIN_CHANNEL_SECRET;
const redirectURI = 'http://localhost:3000/lineLogin';
const nonce = crypto.randomBytes(20).toString('hex');
const state = crypto.randomBytes(20).toString('hex');

class LineLogin extends React.Component {
  lineLogin() {
    // Build query string.
    let query = querystring.stringify({
      response_type: 'code',
      client_id: clientID,
      state: state,
      scope: 'profile openid',
      nonce: nonce,
      prompt: 'consent',
      bot_prompt: 'normal',
    });

    // Build the Line authorise URL.
    let lineAuthoriseURL =
      'https://access.line.me/oauth2/v2.1/authorize?' + query + '&redirect_uri=' + redirectURI;
    // Redirect to external URL.
    window.location.href = lineAuthoriseURL;
  }

  getAccessToken(callbackURL) {
    var url_parts = url.parse(callbackURL, true);
    var query = url_parts.query;

    if (query.hasOwnProperty('code')) {
      let reqBody = {
        grant_type: 'authorization_code',
        code: query.code,
        redirect_uri: redirectURI,
        client_id: clientID,
        client_secret: clientSecret,
      };
      let reqConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      axios
        .post('https://api.line.me/oauth2/v2.1/token', qs.stringify(reqBody), reqConfig)
        .then(async res => {
          localStorage.setItem('access_token', res.data.access_token);
          const headers = {
            Authorization: 'Bearer ' + res.data.access_token,
          };
          try {
            let info = await axios({
              url: 'https://api.line.me/v2/profile',
              method: 'GET',
              headers,
            });
            console.log(JSON.stringify(info.data));
            // res.json(info.data);
          } catch (err) {
            console.log(err);
            // res.status(400).json(err);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  componentDidMount() {
    this.getAccessToken(window.location.href);
  }

  render() {
    return (
      <div className='LineLogin'>
        <div onClick={this.lineLogin} className='line-button'></div>
      </div>
    );
  }
}

export default compose()(LineLogin);
