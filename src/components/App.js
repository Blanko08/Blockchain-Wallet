import React, { Component } from 'react';
import daiLogo from '../dai-logo.png';
import './App.css';
import Web3 from 'web3';
import DaiTokenMock from '../abis/DaiTokenMock.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      daiTokenMock: null,
      balance: 0,
      transactions: []
    };

    this.transfer = this.transfer.bind(this);
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if(window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }else{
        console.log('No ethereum browser is installed. Try it installing MetaMask.');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const daiTokenAddress = "0x2e51492161fe244a1012Bebd7A1dB5Ab83bbc570" // Replace DAI address here
    const daiTokenMock = new web3.eth.Contract(DaiTokenMock.abi, daiTokenAddress);
    const balance = await daiTokenMock.methods.balanceOf(this.state.account).call();
    const transactions = await daiTokenMock.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account } });

    this.setState({
      daiTokenMock: daiTokenMock, 
      balance: web3.utils.fromWei(balance.toString(), 'Ether'),
      transactions: transactions
    });
  }

  transfer(recipient, amount) {
    this.state.daiTokenMock.methods.transfer(recipient, amount).send({ from: this.state.account });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style={{ width: "500px" }}>
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={daiLogo} width="150" alt="logo" style={{ marginTop: "15px" }}/>
                </a>
                <h1>{ this.state.balance } DAI</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const recipient = this.recipient.value;
                  const amount = window.web3.utils.toWei(this.amount.value, 'Ether');
                  this.transfer(recipient, amount);
                }}>
                  <div className="form-group mr-sm-2">
                    <input
                      id="recipient"
                      type="text"
                      ref={(input) => { this.recipient = input }}
                      className="form-control"
                      placeholder="Recipient Address"
                      required />
                  </div>
                  <div className="form-group mr-sm-2">
                    <input
                      id="amount"
                      type="text"
                      ref={(input) => { this.amount = input }}
                      className="form-control"
                      placeholder="Amount"
                      required />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">Send</button>
                </form>

                <table className="table" style={{ marginTop: "25px" }}>
                  <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">value</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.transactions.map((tx, index) => {
                      return(
                        <tr key={index}>
                          <td>{ tx.returnValues.to }</td>
                          <td>{ window.web3.utils.fromWei(tx.returnValues.value.toString(), 'Ether') }</td>
                        </tr>
                      );
                    }) }
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
