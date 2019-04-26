import React from 'react';
import logo from 'assets/images/Citrix_Logo_Black.png';

export const Header = props => (
    <header className="header">
      <div class="ctx-top-bar"></div>
      <nav class="navbar navbar-default">
        <div class="container">
          <div class="navbar-header">
           <a class="navbar-brand" href="https://www.citrix.com">
            <span><img class="navbar-brand-img" src={logo}></img></span>
          </a><span class="inline-logo-title">| Upgrade Central</span>
          </div>
        </div>
      </nav>
    </header>
);