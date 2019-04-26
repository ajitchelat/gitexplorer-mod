import React, { Component } from 'react';
import { Header, Footer, Nav } from 'components';
import Typist from 'react-typist';
import { isMobile } from 'react-device-detect';
import { optionsFirst, optionsSecond, optionsThird } from 'data/index';
import Select from 'react-select';
import clipboard from 'assets/images/clipboard.svg';
import logo from 'assets/images/Citrix_Logo_Black.png';
import classnames from 'classnames';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dark: JSON.parse(localStorage.getItem('light')) || false,
      fastType: JSON.parse(localStorage.getItem('fastType')) || false,
      firstOption: null,
      showSecond: false,
      secondOption: null,
      showThird: false,
      thirdOption: null,
      nb: '',
      usage: '',
      upgradeInfo: [],
      copied: false
    };
  }

  handleToggle = (evt) => {
    const { id } = evt.target;

    this.setState(
      prevState => ({ [id]: !prevState[id] }),
      () => {
        localStorage.setItem(id, this.state[id]);
      }
    );
  };

  onFirstChange = (selectedOption) => {
    if (this.state.secondOption) {
      this.setState({
        firstOption: selectedOption,
        showSecond: true,
        secondOption: null,
        showThird: false,
        nb: '',
        usage: ''
      });
    } else {
      this.setState({ firstOption: selectedOption, showSecond: true });
    }
  };

  onSecondChange = (selectedOption) => {
    if (selectedOption.usage) {
      this.setState({ nb: '', usage: '', upgradeInfo: [] }, () => {
        this.setState({
          secondOption: selectedOption,
          showThird: false,
          nb: selectedOption.nb,
          usage: selectedOption.usage,
          thirdOption: null,
          upgradeInfo: selectedOption.upgradeInfo,
        });
      });
    } else {
      this.setState({
        secondOption: selectedOption,
        showThird: true,
        thirdOption: null,
        nb: '',
        usage: '',
        upgradeInfo: []
      });
    }
  };

  onThirdChange = (selectedOption) => {
    this.setState({ nb: '', usage: '' }, () => {
      this.setState({
        thirdOption: selectedOption,
        nb: selectedOption.nb,
        usage: selectedOption.usage
      });
    });
  };



  render() {
    const {
      dark,
      firstOption,
      secondOption,
      thirdOption,
      showSecond,
      showThird,
      fastType,
      nb,
      usage,
      upgradeInfo,
      copied
    } = this.state;
    const avgTypingDelay = fastType ? 0 : 50;
    let tableColumns = {
      productName: [],
      version: [],
      releaseNotesUrl: [],
      systemRequirements: [],
      sfVersion: [],
      pvsVersion: [],
      licensing: [],
    };

    const productIdMap = (optionsFirst || []).reduce((memo, option) => {
      return {
        ...memo,
        [option.value]: option.label
      }
    }, {});

    if (upgradeInfo) {
      upgradeInfo.forEach(info => {
        const productId = info.label;
        const additionalInfo = optionsThird.upgradeInfo[productId];
        info.value.forEach(versionNumber => {
          tableColumns.productName.push(productIdMap[productId]);
          tableColumns.version.push(additionalInfo[versionNumber].releaseNotesUrl);
          tableColumns.sfVersion.push(additionalInfo[versionNumber].sfVersion);
          tableColumns.pvsVersion.push(additionalInfo[versionNumber].pvsVersion);
          tableColumns.licensing.push(additionalInfo[versionNumber].licensing);
        });
      });
    }

    return (
      <div className={classnames('home', { dark })}>
        <div className="container home__container">
          <Header />
          <div className="content">
            <div className="row">
              <div className="col-5">
                <h1 className="content__title  dark-white">
                  Citrix <span>Upgrade</span> Central
                </h1>
                <p className="content__subtitle dark-grey">
                  Find the version that's right for your Citrix product upgrade
                </p>

                <div className="options">
                  <h3 className="options__title">I want to upgrade:</h3>
                  <div className="options-select-container">
                    <Select
                      placeholder="select product"
                      className="options-select"
                      classNamePrefix="options-select"
                      isSearchable={true}
                      onChange={this.onFirstChange}
                      value={firstOption}
                      options={optionsFirst}
                    />

                    {showSecond ? (
                      <Select
                        placeholder="select version"
                        className="options-select"
                        classNamePrefix="options-select"
                        isSearchable={true}
                        onChange={this.onSecondChange}
                        value={secondOption}
                        options={optionsSecond[firstOption.value]}
                      />
                    ) : null}

                    {showThird ? (
                      <Select
                        placeholder="..."
                        className="options-select"
                        classNamePrefix="options-select"
                        isSearchable={true}
                        onChange={this.onThirdChange}
                        value={thirdOption}
                        options={optionsThird[secondOption.value]}
                      />
                    ) : null}

                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col boards">
                <div
                  className={`board__group board__group--1 ${isMobile && !usage ? ' d-none' : ''}`}
                >
                  <h2 className="board__title  dark-white">You can upgrade to</h2>
                  <div className="board board--1">
                    <pre>
                      {usage.length ? (
                        <Typist avgTypingDelay={avgTypingDelay} cursor={{ show: false }}>
                          {usage}
                        </Typist>
                      ) : (
                        <div />
                      )}
                    </pre>
                  </div>

                  {nb ? (
                    <div className="board__group board__group--2">
                      <h2 className="board__title  dark-white">Note</h2>
                      <div className="board board--2">
                        <pre>
                          <Typist avgTypingDelay={avgTypingDelay} cursor={{ show: false }}>
                            {nb}
                          </Typist>
                        </pre>
                      </div>
                    </div>
                  ) : null}

                  {
                    (upgradeInfo.length > 0) && (
                      <div className="board__group board__group--2">
                        <h2 className="board__title  dark-white">Upgrade Information</h2>
                        <div className="board board--2">
                          <pre>
                            <table id="table">
                              <tbody>
                                <tr>
                                  <td>
                                    Product Name
                                  </td>
                                  {
                                    tableColumns.productName.map((colName, idx) => (<td key={idx}>{colName}</td>))
                                  }
                                </tr>
                                <tr>
                                  <td>
                                    Version
                                  </td>
                                  {
                                    tableColumns.version.map((colName, idx) => (<td key={idx}>{colName ? <a href={colName} target="_blank">{colName}</a> : null}</td>))
                                  }
                                </tr>
                                <tr>
                                  <td class="midrow" colSpan="100%">Minimum Component Version</td>
                                  {

                                  }
                                  </tr>
                                <tr>
                                  <td>StoreFront</td>
                                  {
                                    tableColumns.sfVersion.map((colName, idx) => (<td key={idx}>{colName}</td>))
                                  }
                                </tr>
                                <tr>
                                  <td>Citrix Provisioning</td>
                                  {
                                    tableColumns.pvsVersion.map((colName, idx) => (<td key={idx}>{colName}</td>))
                                  }
                                </tr>
                                <tr>
                                  <td>Citrix License Server</td>
                                  {
                                    tableColumns.licensing.map((colName, idx) => (<td key={idx}>{colName}</td>))
                                  }
                                </tr>
                              </tbody>
                            </table>
                          </pre>
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
            
          </div>
          {/* <Footer dark={dark} /> */}
        </div>
      </div>
    );
  }
}

export default App;
