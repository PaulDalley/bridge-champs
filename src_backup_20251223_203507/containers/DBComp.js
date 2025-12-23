import React, { Component } from "react";
import {
  TextInput,
  Select,
  Row,
  Button,
  Icon,
  Preloader,
} from "react-materialize"; // Input component deprecated
import $ from "jquery";
import { connect } from "react-redux";

class DBComp extends Component {
  state = {
    howManyTokens: 0,
    daysFree: "0",
    percentOffFirstMonth: "0%",
    requireConfirm: true,
    tokensData: false,
    referrer: "",
    err: "",
    tokensData: [],
    // tokensData: ["scojF", "HUqvZ", "rRVba"],
  };

  confirmGenerateTokens = (e) => {
    let err = false;
    let errMsg = "";
    e.preventDefault();
    if (this.state.referrer === "") {
      errMsg = "Referrer Required";
      err = true;
    }
    if (this.state.howManyTokens === 0) {
      errMsg = "Tokens must be greater than 0, " + errMsg;
      err = true;
    }
    // console.log(this.state);
    if (err) return this.setState({ err: errMsg });
    else this.setState({ requireConfirm: false, err: "" });
  };

  generateTokens = (e) => {
    this.setState({ generatingTokens: true });
    e.preventDefault();
    const { howManyTokens, daysFree, referrer, percentOffFirstMonth } =
      this.state;

    const reqBody = {
      uid: this.props.uid,
      howManyTokens: Number(howManyTokens),
      daysFree: Number(daysFree),
      percentOffFirstMonth,
      referrer,
    };

    console.log(reqBody);

    // const OK = ['LGoDI1jEsidKRyN5aVvcTFA8Svb2', '8vNtPo121PZmzbfivs7xInxu2a62'];
    // if (!OK.includes(reqBody.uid)) {
    //     console.log(true);
    // }
    // else {
    //     console.log("tatas");
    // }

    $.post(
      "https://us-central1-bridgechampions.cloudfunctions.net/generateUserTokens",
      reqBody,
      (data, status) => {
        console.log(status);
        console.log(data);
        this.setState({
          requireConfirm: true,
          howManyTokens: 0,
          daysFree: 0,
          referrer: "",
          tokensData: data,
          lastDaysFree: this.state.daysFree,
          lastReferrer: this.state.referrer,
          generatingTokens: false,
        });
      }
    ).catch((err) => {
      console.log(err);
    });
  };

  handleChange = (e) => {
    // console.log(e.target.name);
    // console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value, requireConfirm: true });
  };

  displayTokens = () => {
    const tokensData = this.state.tokensData.map((token) => (
      <tr key={token}>
        <td>{token}</td>
        <td>{this.state.lastDaysFree}</td>
        <td>{this.state.percentOffFirstMonth}</td>
        <td>{this.state.lastReferrer}</td>
      </tr>
    ));
    return (
      <div>
        <br />
        <h4 style={{ textAlign: "center" }}>Generated Tokens</h4>
        <p>
          Save this table before generating more tokens, you will not be able to
          retrieve these tokens again.
        </p>
        <table>
          <tbody>
            <tr>
              <th>Token</th>
              <th>Days free</th>
              <th>% off</th>
              <th>Referrer</th>
            </tr>
            {tokensData}
          </tbody>
        </table>
      </div>
    );
  };

  render() {
    // console.log(this.props.uid);
    return (
      <div style={{ padding: "4rem 4rem 4rem", margin: "4rem" }}>
        <div>
          <h4>Generate User Access Tokens</h4>
          <Row style={{ paddingTop: "4rem" }}>
            {/*<Input type="number"*/}
            {/*name="daysFree"*/}
            {/*label="How many days of free access?"*/}
            {/*value={this.state.daysFree}*/}
            {/*onChange={this.handleChange}*/}
            {/*s={4}*/}
            {/*/>*/}
            <Select
              //  type="select"
              name="percentOffFirstMonth"
              label="% off first month sub fee"
              value={this.state.percentOffFirstMonth}
              onChange={this.handleChange}
              s={3}
            >
              <option value="0%">0%</option>
              <option value="25%">25%</option>
              <option value="50%">50%</option>
            </Select>
            <Select
              // type="select"
              name="daysFree"
              label="How many EXTRA days of free access beyond 7?"
              value={this.state.daysFree}
              onChange={this.handleChange}
              s={3}
            >
              <option value="0">0</option>
              <option value="3">3</option>
              <option value="7">7</option>
              <option value="14">14</option>
            </Select>

            <TextInput
              type="number"
              name="howManyTokens"
              label="How many tokens do you want?"
              value={this.state.howManyTokens}
              onChange={this.handleChange}
              s={3}
            />
            <TextInput
              name="referrer"
              label="Who is the referrer?"
              value={this.state.referrer}
              onChange={this.handleChange}
              s={3}
            />
            {this.state.requireConfirm && (
              <Button
                className="GenerateBridgeBoard-button"
                onClick={(e) => this.confirmGenerateTokens(e)}
                s={3}
                waves="light"
              >
                Generate Tokens
                <Icon left>add</Icon>
              </Button>
            )}
            {!this.state.requireConfirm && !this.state.generatingTokens && (
              <Button
                waves="light"
                className="CreateArticle-delete"
                onClick={(e) => this.generateTokens(e)}
                s={3}
              >
                <Icon left>warning</Icon>CONFIRM
              </Button>
            )}
            {!this.state.requireConfirm && this.state.generatingTokens && (
              <Button
                waves="light"
                className="CreateArticle-delete"
                onClick={(e) => this.generateTokens(e)}
                s={3}
              >
                <Preloader
                  color="yellow"
                  className="PremiumMembership-signup_button_preloader"
                  size="small"
                />
              </Button>
            )}
          </Row>

          <div
            style={{
              fontSize: "1.5rem",
              color: "red",
              position: "relative",
              top: "-1.5rem",
            }}
          >
            {this.state.err}
          </div>

          {this.state.tokensData && this.displayTokens()}
        </div>
      </div>
    );
  }
}

export default connect(({ auth }) => ({ uid: auth.uid }), null)(DBComp);
