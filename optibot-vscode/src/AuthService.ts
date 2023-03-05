import * as vscode from 'vscode';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './config/firebase';
var request = require('request');
var Cookie = require('request-cookies').Cookie;

export default class AuthService {
  context: vscode.ExtensionContext;
  githubProvider = new GithubAuthProvider();
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async loginWithGithub() {
    await signInWithPopup(auth, this.githubProvider)
      .then((result) => {
        console.log(result.user);
        this.context.globalState.update('optibot-user', result.user);
      })
      .catch((error) => console.log(error));
  }
}

export async function getCookie() {
  request.get(
    'http://localhost:3000/',
    function (
      _err: any,
      response: { headers: { [x: string]: any } },
      body: any
    ) {
      var rawcookies = response.headers['set-cookie'];
      for (var i in rawcookies) {
        var cookie = new Cookie(rawcookies[i]);
        console.log(cookie.key, cookie.value, cookie.expires);
      }
    }
  );
}
