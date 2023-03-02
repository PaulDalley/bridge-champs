import React, { Component } from "react";
import { Row, Col, Modal, Button, Icon } from "react-materialize";
import "./Homepage.css";
import Add from "../containers/Add";
import $ from "jquery";
import { Link } from "react-router-dom";
import DailyFreeSingleton from "./HomePage/DailyFreeSingleton";
import AnimatedButton from "./UI/AnimatedButton";
import TopTen from "./HomePage/TopTen";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { withRouter } from "../hoc/withRouter";
import Walkthrough, { WalkthroughStep } from "./UI/Walkthrough";
import { AnimatedInfoComponent } from "./UI/AnimatedInfoComponent";

const photo = require("../assets/images/logo-small-inv-t-greybg.png");

class HomePage extends Component {
  state = {
    successPage: false,
    walkthrough: false,
    showInfo: true,
  };

  tenArticles = (articles) => {
    this.setState({ articles });
  };

  componentDidMount() {
    // console.log(this.props.uid);

    // if (!this.props.uid) {
    //     setTimeout(() => {
    //         this.setState({showInfo: true});
    //     }, 2000);
    // }

    if (this.props.success) {
      this.setState({ successPage: true });
      setTimeout(() => {
        $("#success_modal_trigger").click();
      }, 35);
    }
    if (this.props.error) {
      if (this.props.error) {
        setTimeout(() => {
          $("#error_modal_trigger").click();
        }, 35);
      }
    }
  }

  render() {
    // console.log(this.props);
    // console.log(this.props.subscriptionExpires);
    // console.log(new Date());
    // console.log(this.props.subscriptionExpires === undefined || (this.props.subscriptionExpires < new Date()));
    // console.log(new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)));
    // console.log(this.props.subscriptionExpires < new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)));

    let whenSubExpiresMinus2Days = undefined;
    if (this.props.subscriptionExpires) {
      whenSubExpiresMinus2Days =
        new Date(this.props.subscriptionExpires).getTime() -
        2 * 24 * 60 * 60 * 1000;
      // console.log(whenSubExpiresMinus2Days);
      // if (new Date() > whenSubExpiresMinus2Days) {
      //     console.log("REUP");
      // }
    }
    // (whenSubExpiresMinus2Days !== undefined && (new Date() > whenSubExpiresMinus2Days))

    // console.log(this.props.location.pathname);
    // const pathName = this.props.location.pathname;
    // if (pathName == "/success")  // <- SHOW A MODAL WITH A SUCCESSFUL REGISTRATION MESSAGE.
    return (
      <div className="HomePage-container">
        {/*<div className="Walkthrough-stepBox"*/}
        {/*style={{*/}
        {/*position: 'absolute',*/}
        {/*top: "2px",*/}
        {/*left: "2px",*/}
        {/*opacity: '0.75',*/}
        {/*paddingLeft: '2rem',*/}
        {/*marginLeft: '2rem'*/}
        {/*}}*/}
        {/*>*/}
        {/*<div className="Walkthrough-close"*/}
        {/*onClick={() => {} }*/}
        {/*>*/}
        {/*<i className="material-icons">close</i>*/}
        {/*</div>*/}
        {/*<div className="Walkthrough-stepBox-header">Sign up for:</div>*/}
        {/*<hr style={{*/}
        {/*textAlign: 'center',*/}
        {/*backgroundColor: "#8d0018",*/}
        {/*height: '.45rem',*/}
        {/*width: "95%",*/}
        {/*fontSize: "3rem",*/}
        {/*}}/>*/}
        {/*<ul className="HomePage-sales_info">*/}
        {/*<li className="HomePage-sales_info_li"><span className="black-suit">♣</span> Access to all quizzes and articles.</li>*/}
        {/*<li className="HomePage-sales_info_li"><span className="red-suit">♥</span> Expert answers to your bidding questions.</li>*/}
        {/*<li className="HomePage-sales_info_li"><span className="black-suit">♠</span> 1 week free trial, no commitment.</li>*/}
        {/*<li className="HomePage-sales_info_li"><span className="red-suit">♦</span> New content daily.</li>*/}
        {/*<li className="HomePage-sales_info_li"><span className="black-suit">♣</span> Content sorted by difficulty, perfect for both the beginner and expert.</li>*/}
        {/*</ul>*/}

        {/*</div>*/}

        {this.state.walkthrough && (
          <Walkthrough
            exitWalkthrough={() => this.setState({ walkthrough: false })}
            history={this.props.history}
            articles={this.state.articles}
          />
        )}

        <Add goto="create/db" history={this.props.history} />

        {this.props.success && (
          <Modal
            trigger={
              <Button
                id="success_modal_trigger"
                style={{ opacity: 0, zIndex: -1, position: "absolute" }}
              >
                btn
              </Button>
            }
          >
            <h1>Your subscription was processed successfully</h1>
            <p style={{ fontSize: "2rem" }}>
              {" "}
              Welcome to your BridgeChampions.com membership. Your payment
              should have been processed immediately, giving you instant access
              to all our content. If not, please allow a few minutes for your
              transaction to be verified with our servers.
              <br />
              <br />
              From the team at BridgeChampions and our contributing players, we
              hope you enjoy it!
            </p>
            <br />
            <br />
            <div className="center-align">
              <img
                src={photo}
                style={{
                  height: "10rem",
                  width: "auto",
                  opacity: ".75",
                  borderRadius: "35%",
                }}
              />
            </div>
          </Modal>
        )}

        {this.props.error && (
          <Modal
            trigger={
              <Button
                id="error_modal_trigger"
                style={{ opacity: 0, zIndex: -1, position: "absolute" }}
              >
                btn
              </Button>
            }
          >
            <h1>There was some problem processing your subscription.</h1>
            <p style={{ fontSize: "2rem" }}>
              Please check the status of your payment on PayPal.com or with your
              credit card provider to see if the transaction occurred.
              <br />
              <br />
              If it did not, free to try subscribing again{" "}
              <Link to="/membership">here</Link>.
            </p>
            <p style={{ fontSize: "2rem" }}>
              If your payment was successfully processed and you cannot access
              our subscriber content, then please contact support using the
              Contact us form in the footer below. We appreciate your patience
              in this regard.
            </p>
            <br />
            <br />
          </Modal>
        )}

        <br />
        <div
          className="HomePage-banner_action_buttons"
          style={{ zIndex: "1001" }}
        >
          <AnimatedButton
            style={{ margin: "2.5rem" }}
            jumpTo=""
            buttonText="Explore"
            color="green" // "white"
            whenClicked={() => this.setState({ walkthrough: true })}
            // scrollTo="#HomePage-Start"
          />

          {(this.props.subscriptionExpires === undefined ||
            !this.props.uid ||
            (whenSubExpiresMinus2Days !== undefined &&
              new Date() > whenSubExpiresMinus2Days)) &&
            !this.state.successPage && (
              <AnimatedButton
                style={{ margin: "2.5rem" }}
                jumpTo=""
                buttonText="Sign up"
                color="red"
                gotoOnClick={"/membership"}
                history={this.props.history}
                // extraContent="For Free Trial Week."
                //extraContent={<span>1 Week Free Trial.<br/>No commitments.</span>}
              />
            )}
          {/* 
          {!this.props.uid && this.state.showInfo && (
            <div
              style={{
                zIndex: "1000",
                position: "absolute",
                maxWidth: "80%",
                maxHeight: "80%",
              }}
            >
              <div
                className="AnimatedInfoComponent-x"
                style={{
                  zIndex: "9000",
                  fontSize: "4.25rem",
                  fontWeight: "bold",
                  position: "relative",
                  top: "16.75rem",
                  left: "88%",
                  cursor: "pointer",
                }}
                onClick={() => this.setState({ showInfo: false })}
              >
                <Icon
                  className="material-icons AnimatedInfoComponent-x-icon"
                  style={{
                    fontSize: "5.25rem",
                    fontWeight: "bold",
                    color: "black !important",
                  }}
                >
                  close
                </Icon>
              </div>

              <AnimatedInfoComponent
          
              />
            </div>
          )} */}
        </div>

        <div className="HomePage-banner">
          {/*<DailyFreeSingleton />*/}

          <h1 className="HomePage-banner_text_header">
            Welcome to
            <br /> Bridge Champions
          </h1>
          <div className="HomePage-banner_text_subheader">
            {/*Where expert Bridge knowledge is only ever a few clicks away.*/}
            Winning bridge made simple.
          </div>
        </div>
        <div
          id="HomePage-Start"
          className="HomePage-SeparationLine HomePage-SeparationLine-top"
        ></div>
        <div className="HomePage-content">
          <div>
            {/*<p>*/}
            {/*The best in the world break down exactly what they are thinking about in the bidding and the play. Our experts provide educational articles and fresh analysis from hands that they have recently played.*/}
            {/*</p>*/}
            {/*<h2 className="HomePage-profile_title">*/}
            {/*<h1 style={{textShadow: "#8d0018 1px 0 10px", fontSize: '5rem', letterSpacing: '.2rem', textAlign: 'center', textDecoration: "none", paddingBottom: '1rem'}}>*/}

            <DailyFreeSingleton />

            <TopTen
              a={this.props.a}
              history={this.props.history}
              passUpArticlesRef={this.tenArticles}
            />
          </div>
        </div>

        <br />
      </div>
    );
  }
}
export default withRouter(
  connect(
    ({ auth }) => ({
      subscriptionActive: auth.subscriptionActive,
      subscriptionExpires: auth.subscriptionExpires,
      a: auth.a,
      uid: auth.uid,
    }),
    null
  )(HomePage)
);
