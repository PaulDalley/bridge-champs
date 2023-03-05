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
// import {SideNav, SideNavItem, Button} from 'react-materialize';
import SideDrawer from "./SideDrawer";
import { Dropdown, Button, Divider, Icon } from "react-materialize";

// const photo = require('../../assets/images/logo-small-inv-t.png');

class Nav extends Component {
  state = {
    sideDrawerOpen: false,
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
    // console.log(e);
    // console.log(route);
    this.props.history.push(route);
    // this.props.navigate(route);
  };
  goTo = (route) => {
    this.props.history.push(route);
    // this.props.navigate(route);
  };

  constructor(props) {
    super(props);
    this.state = {};
    // console.log("---- HI FROM NAV ---");
    // console.log(this.props.history);

    // COMMENTED OUT BECAUSE useHistory has been deprecated and withRouter has been deprecated

    this.props.history.listen((location, action) => {
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
    // console.log(sideNavData);
    if (sideNavData.name === "") sideNavData.name = "Anonymous";

    // For tab counts:
    // 3 tabs only if isMobileSize:
    const threeTabsOnly = window.innerWidth <= 1125;

    console.log("--- IN NAV WITH ---");
    console.log(uid);
    console.log(sideNavData);

    return (
      <header style={{ zIndex: 3500 }}>
        <div className="Nav-header">
          <div className="Nav-logo">
            <div onClick={() => this.goTo("/")}>
              <Logo />
            </div>
          </div>
          {/*<i className="material-icons left">input</i>*/}

          <div className="Nav-auth">
            {/*{ !uid &&*/}
            {/*<div className="Nav-auth-icons">*/}
            {/*<div className="Nav-auth-icon"*/}
            {/*onClick={() => this.props.history.push('/login')}>*/}
            {/*/!*<div className="waves-effect waves-light Nav-menu-container">*!/*/}
            {/*<i className="Nav-auth-i fas fa-sign-in-alt left"></i>*/}
            {/*/!*</div>*!/*/}
            {/*<div className="Nav-auth-label">Log in</div>*/}
            {/*</div>*/}
            {/*<div className="Nav-auth-icon"*/}
            {/*onClick={() => this.props.history.push('/membership')}>*/}
            {/*/!*<div className="waves-effect waves-light Nav-menu-container">*!/*/}
            {/*<i className="Nav-auth-i fas fa-user-plus"></i>*/}
            {/*/!*</div>*!/*/}
            {/*<div className="Nav-auth-label">Sign up</div>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*}*/}

            {!uid && (
              <div className="Nav-auth-icons">
                <NavLink
                  className="Nav-auth-icon"
                  to="/login"
                  activeClassName="Nav-active_link"
                >
                  {/*<div className="waves-effect waves-light Nav-menu-container">*/}
                  <i className="waves-effect waves-light Nav-auth-i fas fa-sign-in-alt left"></i>
                  {/*</div>*/}
                  <div className="Nav-auth-label">Log in</div>
                </NavLink>

                <NavLink
                  className="Nav-auth-icon"
                  to="/membership"
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
                  to="/profile"
                  activeClassName="Nav-active_link"
                >
                  <i className="waves-effect waves-light Nav-auth-i far fa-user"></i>
                  <div className="Nav-auth-label">Profile</div>
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
          {/*red, */}
          {/*<Button*/}
          {/*floating large*/}
          {/*className='Nav-menu_button black'*/}
          {/*waves='green' icon='menu' />*/}

          {/*<SideNav*/}
          {/*// trigger={<Button floating large*/}
          {/*// className='Nav-menu_button black'*/}
          {/*// waves='green' icon='menu'/>}*/}
          {/*// options={{closeOnClick: true, draggable: true, menuWidth: 280}}*/}
          {/*// >*/}
          {/*trigger={*/}
          {/*<div className="Nav-menu-container">*/}
          {/*<i className="Nav-menu-button fas fa-bars"></i>*/}
          {/*</div>*/}
          {/*}*/}
          {/*options={{closeOnClick: true, draggable: true, menuWidth: 280}}*/}
          {/*>*/}
          {/*<SideNavItem>*/}
          {/*<img className="Nav-sidenav_logo"*/}
          {/*src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Google-favicon-2015.png/150px-Google-favicon-2015.png"/>*/}
          {/*</SideNavItem>*/}
          {/*<SideNavItem userView*/}
          {/*className="Nav-sidenav_user"*/}
          {/*user={sideNavData}*/}
          {/*/>*/}
          {/*<SideNavItem divider className="Nav-header_divider"/>*/}
          {/*<SideNavItem divider/>*/}
          {/*<SideNavItem onClick={() => this.goTo('/articles')}*/}
          {/*waves*/}
          {/*icon="cloud"*/}
          {/*>Paul</SideNavItem>*/}
          {/*<SideNavItem waves icon="cloud">Likes</SideNavItem>*/}
          {/*<SideNavItem waves icon="cloud">Men</SideNavItem>*/}

          {/*<SideNavItem divider />*/}
          {/*<SideNavItem subheader>Subheader</SideNavItem>*/}
          {/*<SideNavItem waves icon="cloud" href='#!third'>Men</SideNavItem>*/}
          {/*</SideNav>*/}

          {/*<ul id="slide-out" className="Nav-SideNav side-nav">*/}
          {/*<li>*/}
          {/*<div className="Nav-SideNav-UserView user-view">*/}
          {/*<div className="background">*/}
          {/*<img*/}
          {/*src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Google-favicon-2015.png/150px-Google-favicon-2015.png"/>*/}
          {/*</div>*/}
          {/*<a href="#!user"><img className="circle" src={sideNavData.image}/></a>*/}
          {/*<a href="#!name"><span className="white-text name">{sideNavData.name}</span></a>*/}
          {/*<a href="#!email"><span className="white-text email">{sideNavData.email}</span></a>*/}
          {/*</div>*/}
          {/*</li>*/}
          {/*<li>*/}
          {/*<div className="divider"></div>*/}
          {/*</li>*/}
          {/*<li><Link to="/articles">Articles</Link></li>*/}
          {/*<li><Link to="/tournaments">Tournaments</Link></li>*/}
          {/*<li><Link to="/quizzes">Quizzes</Link></li>*/}

          {/*<li><a href="#!"><i className="material-icons">cloud</i>First Link With Icon</a></li>*/}
          {/*<li><a href="#!">Second Link</a></li>*/}
          {/*<li>*/}
          {/*<div className="divider"></div>*/}
          {/*</li>*/}
          {/*<li><a className="subheader">Subheader</a></li>*/}
          {/*<li><a className="waves-effect" href="#!">Third Link With Waves</a></li>*/}
          {/*</ul>*/}
        </div>

        {/*s3 on the li classNames will make them span 3 regardless of screen size.*/}
        <div className="Nav-tabs row z-depth-2 nav-tabs">
          <div className="col s12">
            <ul className="tabs">
              <li onClick={() => this.goTo("/cardPlay")} className="tab col">
                <a id="cardPlay" className="/cardPlay">
                  Card Play
                </a>
                <div className="nav-tabs_underline"></div>
              </li>

              <li onClick={() => this.goTo("/defence")} className="tab col">
                <a id="defence" className="/defence">
                  Defence
                </a>
                <div className="nav-tabs_underline"></div>
              </li>

              <li onClick={() => this.goTo("/bidding")} className="tab col">
                <a id="bidding" className="/bidding">
                  Bidding
                </a>
                <div className="nav-tabs_underline"></div>
              </li>

              {/*<li className="tab col s3"><a className="active">Recent Tournaments</a></li>*/}
              {/*<li onClick={() => this.goTo('/tournaments') } className="tab col">*/}
              {/*<a className="/tournaments">Tournaments</a>*/}
              {/*<div className="nav-tabs_underline"></div>*/}
              {/*</li>*/}
              <li onClick={() => this.goTo("/quizzes")} className="tab col">
                <a className="/quizzes">Quizzes</a>
                <div className="nav-tabs_underline"></div>
              </li>

              <li onClick={() => this.goTo("/articles")} className="tab col">
                <a id="articles" className="/articles">
                  Articles
                </a>
                <div className="nav-tabs_underline"></div>
              </li>

              {/*<li onClick={() => this.goTo('/videos')} className="tab col s3"><a className="/videos">Videos</a></li>*/}
            </ul>
          </div>
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
                onClick={() => this.goTo("/conventions")}
                className="tab col"
                style={{ width: "25rem", height: "6rem", overflow: "visible" }}
              >
                <a className="/conventions">Conventions & System</a>
                <div className="nav-tabs_underline"></div>
              </li>
              <li
                onClick={() => this.goTo("/articles")}
                className="tab col"
                style={{ width: "25rem", height: "6rem", overflow: "visible" }}
              >
                <a id="articles" className="/articles">
                  Articles
                </a>
                <div className="nav-tabs_underline"></div>
              </li>
            </Dropdown>
            </div>  */}
        </div>
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
