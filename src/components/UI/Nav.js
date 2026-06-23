import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import Logo from "./Logo";
import $ from "jquery";
import { firebase } from "../../firebase/config";
import { signOut } from "../../store/actions/authActions";
import { withRouter } from "react-router-dom";
// import { withRouter } from "../../hoc/withRouter";
import "./Nav.css";
import SideDrawer from "./SideDrawer";
import { Dropdown, Button, Divider, Icon } from "react-materialize";

// const photo = require('../../assets/images/logo-small-inv-t.png');

class Nav extends Component {
  state = {
    sideDrawerOpen: false,
    biddingDropdownOpen: false,
  };

  componentDidMount() {
    // console.log(this.props.location.pathname);
    // if (this.props.location.pathname !== '/articles') {
    //     console.log("hi");
    //     console.log($('#articles'))
    //     console.log($('li.indicator'))
    //     $('#articles').removeClass('active');
    //     $('li.indicator').remove();
    // }
  }

  logout = () => {
    // Clear post-checkout stored session data so it can't accidentally trigger /success activation later.
    try {
      localStorage.removeItem("postCheckoutSessionId");
      localStorage.removeItem("lastStripeCheckoutSessionId");
      localStorage.removeItem("postCheckoutExpectedUid");
    } catch (e) {
      // ignore
    }
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.history.push("/");
        // this.props.navigate("/");
      });
  };

  authNav = (e, route) => {
    e.preventDefault();
    this.props.history.push(route);
    // this.props.navigate(route);
  };
  goTo = (route) => {
    this.props.history.push(route);
    // this.props.navigate(route);
  };

  // For nav cards rendered as real <a> links: plain left-click → SPA nav (no
  // reload); let modifier/middle clicks fall through so "open in new tab" works.
  navCardClick = (e, route) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    this.goTo(route);
  };

  constructor(props) {
    super(props);
    this.state = { sideDrawerOpen: false };

    // COMMENTED OUT BECAUSE useHistory has been deprecated and withRouter has been deprecated
    this.props.history.listen((location) => {
      let tabLinks = $(".nav-tabs li > a");

      tabLinks.each((idx, el) => {
        let wrappedEl = $(el);

        if (
          wrappedEl.hasClass("/articles") &&
          location.pathname !== "/articles"
        ) {
          $("#articles").removeClass("active");
          $("#articles").removeClass("/active");
          $("li.indicator").remove();
        }

        if (!wrappedEl.hasClass(location.pathname)) {
          wrappedEl.removeClass("active");
          wrappedEl.removeClass("Nav-tab-active");
          $("li.indicator").remove();
        }
        if (wrappedEl.hasClass(location.pathname)) {
          wrappedEl.addClass("Nav-tab-active");
          wrappedEl.addClass("active");
        }
      });
      /*
      // $.each(tabLinks, (el) => {
      //     el.hasClass('/articles');
      // })

      // for (let i = 0; i < tabLinks.length; i++) {
      //     console.log(tabLinks[i]);
      //     // console.log(tabLinks[i].hasClass(this.props.match.path));
      // }
*/
    });
  }

  toggleSideDrawer = () => {
    this.setState((prevState) => ({
      sideDrawerOpen: !prevState.sideDrawerOpen,
    }));
  };

  render() {
    let {
      displayName,
      email,
      uid,
      profilePic,
      subscriptionExpires,
      totalQuizScore,
    } = this.props;
    let sideNavData = {
      // background: 'logo-small-inv.png',
      name: displayName,
      email,
      subscriptionExpires,
      totalQuizScore,
    };
    if (profilePic) {
      sideNavData["image"] = profilePic;
    }

    if (sideNavData.name === "") sideNavData.name = "Anonymous";

    // For tab counts:
    // 3 tabs only if isMobileSize:
    // const threeTabsOnly = window.innerWidth <= 1125;



    // Keep the modern navigation cards visible on /counting too (consistent with other tabs).
    const hideModernTabs = false;
    const pathname = this.props.location?.pathname || "";
    const trainerPaths = [
      "/practice",
      "/cardPlay",
      "/declarer",
      "/defence",
      "/bidding",
      "/counting",
      "/treadmill",
      "/beginner/practice",
    ];
    const articlePaths = [
      "/learn",
      "/learn/beginner",
      "/beginner/articles",
      "/articles",
      "/article/",
      "/cardPlay/articles",
      "/cardPlay/basics",
      "/declarer/articles",
      "/declarer/basics",
      "/defence/articles",
      "/defence/basics",
      "/bidding/advanced",
      "/bidding/basics",
      "/counting/articles",
    ];
    const trainerActive = trainerPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    const articlesActive =
      pathname === "/beginner" ||
      articlePaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    const justPlayActive = pathname === "/just-play" || pathname.startsWith("/just-play/");
    return (
      <header style={{ zIndex: 3500 }}>
        <div className="Nav-header">
          <div className="Nav-logo">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                this.goTo("/");
              }}
              aria-label="Home - Bridge Champions"
              style={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              <Logo />
            </a>
          </div>
          {/*<i className="material-icons left">input</i>*/}

          <div className="Nav-auth">
            {!uid && (
              <div className="Nav-auth-icons">
                <NavLink
                  className="Nav-auth-icon"
                  to="/login"
                  activeClassName="Nav-active_link"
                  onClick={() => {
                    // Avoid stale paywall redirects affecting a normal "log in" action.
                    localStorage.removeItem("contentRedirectId");
                    localStorage.removeItem("contentRedirectType");
                    localStorage.removeItem("contentRedirectAt");
                  }}
                >
                  {/*<div className="waves-effect waves-light Nav-menu-container">*/}
                  <i className="waves-effect waves-light Nav-auth-i fas fa-sign-in-alt left"></i>
                  {/*</div>*/}
                  <div className="Nav-auth-label">Log in</div>
                </NavLink>

                <NavLink
                  className="Nav-auth-icon"
                  to="/signup"
                  activeClassName="Nav-active_link"
                >
                  {/*<div className="waves-effect waves-light Nav-menu-container">*/}
                  <i className="waves-effect waves-light Nav-auth-i fas fa-user-plus"></i>
                  {/*</div>*/}
                  <div className="Nav-auth-label">Sign up</div>
                </NavLink>
              </div>
            )}

            {uid && (
              <div className="Nav-auth-icons">
                <NavLink
                  className="Nav-auth-icon"
                  to="/settings"
                  activeClassName="Nav-active_link"
                >
                  <i className="waves-effect waves-light Nav-auth-i material-icons">settings</i>
                  <div className="Nav-auth-label">Settings</div>
                </NavLink>
                <div className="Nav-auth-icon" onClick={() => this.logout()}>
                  <i className="waves-effect waves-light Nav-auth-i fas fa-sign-out-alt"></i>
                  <div className="Nav-auth-label">Log out</div>
                </div>
              </div>
            )}
            {/*{ !uid && <Link to='/login' className="Nav-auth_buttons waves-effect waves-light btn">Log in</Link>}*/}
            {/*{ !uid && <Link to='/membership' className="Nav-auth_buttons waves-effect waves-light btn">Sign up</Link> }*/}
            {/*{ uid && <a onClick={ () => this.logout() } className="Nav-auth_buttons waves-effect waves-light btn"><i className="material-icons left">input</i>Log out</a> }*/}
          </div>

          {/* HAMBURGER MENU REMOVED */}
          {/* 
          <div
            onClick={this.toggleSideDrawer}
            className={`Nav-menu-container Nav-menu-container-X Nav-menu-container-${this.state.sideDrawerOpen} waves-effect waves-light`}
          >
            <i className="Nav-menu-icon-X fas fa-times"></i>
          </div>

          <div
            id="toggle-side-nav"
            onClick={this.toggleSideDrawer}
            className="waves-effect waves-light Nav-menu-container"
          >
            <i className="Nav-menu-icon material-icons">menu</i>
          </div>

          <SideDrawer
            sideDrawerOpen={this.state.sideDrawerOpen}
            toggleSideDrawer={this.toggleSideDrawer}
            name={sideNavData.name}
            email={sideNavData.email}
            photo={sideNavData.image}
            subscriptionExpires={sideNavData.subscriptionExpires}
            totalQuizScore={sideNavData.totalQuizScore}
            uid={uid}
            subscriptionActive={this.props.subscriptionActive}
          />
          */}
        </div>

        {/* Modern Navigation Cards */}
        {!hideModernTabs && (
          <div className="Nav-tabs-modern">
            <div className="Nav-tabs-container">
              <a
                className={`Nav-tab-card ${trainerActive ? "Nav-tab-active" : ""}`}
                href="/practice"
                onClick={(e) => this.navCardClick(e, "/practice")}
                aria-label="Practical learning section"
              >
                <div className="Nav-tab-icon Nav-tab-icon-trainer">
                  <i className="fas fa-graduation-cap" aria-hidden="true" />
                </div>
                <div className="Nav-tab-label">Practical Learning</div>
              </a>

              <a
                className={`Nav-tab-card ${justPlayActive ? "Nav-tab-active" : ""}`}
                href="/just-play"
                onClick={(e) => this.navCardClick(e, "/just-play")}
                aria-label="Just Play section"
              >
                <span className="Nav-tab-badge">New</span>
                <div className="Nav-tab-icon Nav-tab-icon-justplay">
                  <i className="fas fa-play" aria-hidden="true" />
                </div>
                <div className="Nav-tab-label">Just Play</div>
              </a>

              {/* Full navigation (no SPA intercept): /learn is served by the
                  content app, so let the browser load it rather than rendering
                  a CRA copy. */}
              <a
                className={`Nav-tab-card ${articlesActive ? "Nav-tab-active" : ""}`}
                href="/learn"
                aria-label="Learn section"
              >
                <div className="Nav-tab-icon Nav-tab-icon-articles">
                  <i className="fas fa-newspaper" aria-hidden="true" />
                </div>
                <div className="Nav-tab-label">Learn</div>
              </a>
            </div>
          </div>
        )}
          {/*           
          <div
            style={{
              width: "25rem",
              height: "10rem",
              overflow: "visible",
              position: "absolute",
              display: "flex",
              top: "0.55rem",
              left: "41.5rem",
            }}
          >
            <Dropdown
              id="Dropdown_8"
              options={{
                alignment: "left",
                autoTrigger: true,
                closeOnClick: true,
                constrainWidth: true,
                container: null,
                coverTrigger: true,
                hover: false,
                inDuration: 150,
                onCloseEnd: null,
                onCloseStart: null,
                onOpenEnd: null,
                onOpenStart: null,
                outDuration: 250,
              }}
              style={{
                width: "25rem",
                minWidth: "25rem",
                height: "6rem",
                overflow: "visible",
                color: "black",
              }}
              trigger={
                <Button
                  flat={true}
                  waves={"light"}
                  node="button"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "inherit",
                    textTransform: "capitalize",
                  }}
                >
                  <Icon medium={true}>arrow_drop_down</Icon>
                  <span style={{ paddingLeft: "1rem", fontSize: "1.5rem" }}>
                    Archived
                  </span>
                </Button>
              }
            >
              <li
                onClick={() => this.goTo("/articles")}
                className="tab col"
                style={{ width: "25rem", height: "6rem", overflow: "visible" }}
              >
                <a id="articles" className="/articles">
                  Extra
                </a>
                <div className="nav-tabs_underline"></div>
              </li>
            </Dropdown>
            </div>  */}
      </header>
    );
  }
}

// function mapStateToProps({ posts }, ownProps) {
//     return { post: posts[ownProps.match.params.id] };
// }

// const mapStateToProps = ({ auth }, ownProps) => {
//     console.log(auth);
//     return { id: '1' };
// }

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
  email: state.auth.email,
  displayName: state.auth.displayName,
  profilePic: state.auth.photoURL,
  subscriptionExpires: state.auth.subscriptionExpires,
  subscriptionActive: state.auth.subscriptionActive,
  totalQuizScore: state.auth.totalQuizScore,
});

// const mapStateToProps = ({ auth }, ownProps) => ({
//     uid: auth.uid,
//     displayName: auth.displayName,
//     email: auth.email,
// });

// const connectedComponent = connect(mapStateToProps, null)(Nav)
// export default withRouter(connectedComponent);

export default withRouter(connect(mapStateToProps, { signOut })(Nav));
// export default withRouter(Nav);