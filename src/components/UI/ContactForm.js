import React, { Component } from "react";
import { Row, TextInput, Textarea, Button, Icon } from "react-materialize"; // Input deprecated
import { connect } from "react-redux";
import "./ContactForm.css";
import $ from "jquery";

const url = "https://us-central1-bridgechampions.cloudfunctions.net/contactUs";

class ContactForm extends Component {
  state = {
    firstName: "",
    lastName: "",
    text: "",
    email: "",
    uid: "",
    err: "",
  };

  componentDidMount() {
    const { uid, email, name } = this.props;
    // console.log(" COMPONENT DID MOUNT, my props: ")
    // console.log(this.props);
    this.setState({
      uid: uid || "",
      email: email || "",
      firstName: name || "",
    });
    $("html, body").animate({ scrollTop: 0 }, 800);
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    const { uid, email, firstName, lastName, text } = this.state;
    if (email === "" || firstName === "" || lastName === "" || text === "") {
      this.setState({
        err: "Please fill out all form fields before submitting",
      });
      return;
    } else {
      this.setState({ err: "" });
    }

    const dataBody = {
      uid,
      email,
      firstName,
      lastName,
      text,
    };

    return $.post(url, dataBody, (data, status) => {
      console.log(data);
      console.log(status);
      this.props.history.push("/");
    }).catch((err) => {
      console.log(err);
    });
  };

  render() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <Row>
          <h2 className="ContactUs-header_text">Contact Us</h2>
        </Row>
        <Row>
          <p className="ContactUs-body_text">
            Your feedback and thoughts are very welcome. Let us know if you are
            having any issues or have any suggestions for how we can improve our
            site.
            <br />
            <br />
            Our site uses the latest web technologies, if you are having any
            display or layout issues for any of our content, try upgrading to
            the latest version of your favourite web browser.
          </p>
        </Row>
        <Row className="ContactForm-container">
          <TextInput
            s={12}
            m={6}
            placeholder="First Name"
            className="ContactForm-input"
            name="firstName"
            value={this.state.firstName}
            onChange={this.handleChange}
          />
          <TextInput
            s={12}
            m={6}
            placeholder="Last Name"
            className="ContactForm-input"
            name="lastName"
            value={this.state.lastName}
            onChange={this.handleChange}
          />
          <TextInput
            email={true}
            //type="email"
            placeholder="Email"
            s={12}
            className="ContactForm-input"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <Textarea
            s={12}
            className="ContactForm-input"
            name="text"
            label="What can we help you with?"
            // type="textarea"
            value={this.state.text}
            onChange={this.handleChange}
            style={{ height: "15rem" }}
          />
        </Row>
        <Row>
          <div className="ContactForm-error_message red-suit">
            {this.state.err}
          </div>
        </Row>
        <Row>
          <div className="ContactForm-submit_button center-align">
            <Button className="CreateArticle-submit" waves="light">
              Submit Contact Form
              <Icon left>done_all</Icon>
            </Button>
          </div>
        </Row>
      </form>
    );
  }
}
export default connect(
  ({ auth }) => ({ uid: auth.uid, email: auth.email, name: auth.displayName }),
  null
)(ContactForm);
