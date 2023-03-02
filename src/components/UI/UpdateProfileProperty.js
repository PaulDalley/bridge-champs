import React, { Component } from "react";
import { Modal, Button, TextInput, Icon, ProgressBar } from "react-materialize";
import $ from "jquery";
import toastr from "toastr";

class UpdateProfileProperty extends Component {
  // constructor(props) {
  //     super(props);
  //     console.log(props);
  //     this.state = {
  //         requireConfirmation: true,
  //         getConfirmation: false,
  //         asyncProcessing: false,
  //         [this.props.name]: this.props.current,
  //     }
  // }
  state = {
    requireConfirmation: true,
    getConfirmation: false,
    asyncProcessing: false,
    currentModified: false,
    [this.props.name]: this.props.current,
    [this.props.name + "_original"]: this.props.current,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.state[this.props.name]) {
      this.setState({
        [this.props.name]: nextProps.current,
        [this.props.name + "_original"]: nextProps.current,
      });
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     return (nextProps.current !== this.state[this.props.name]);
  // }

  resetToOriginal = () => {
    this.setState({
      [this.props.name]: this.state[`${this.props.name}_original`],
      currentModified: false,
    });
  };

  handleChange = (e) => {
    // console.log(e.target.name);
    // console.log(e.target.value);
    if (!this.state.currentModified) {
      this.setState({ [e.target.name]: e.target.value, currentModified: true });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.setState({ getConfirmation: true });
    // console.log($(`#confirm-modal-${this.props.name}`));
    // $(`#confirm-modal-${this.props.name}`).click()
  };

  changeConfirmed = () => {
    this.setState({ asyncProcessing: true });
    this.props
      .changeHandler(this.state[this.props.name])
      .then(() => {
        toastr.success(`${this.props.name} updated successfully`);
        this.setState({ getConfirmation: false, asyncProcessing: false });
      })
      .catch((err) => {
        toastr.error(
          `There was a problem updating your ${this.props.name}. Please try again.`
        );
        this.setState({
          [this.props.name]: this.props.current,
          getConfirmation: false,
          asyncProcessing: false,
        });
      });
  };

  render() {
    // console.log(this.props.name);
    // console.log(this.props.current);
    // console.log(this.state);

    return (
      <div>
        <div style={{ position: "relative", width: "45rem", maxWidth: "90vw" }}>
          {/*<Modal*/}
          {/*header='Modal Header'*/}
          {/*trigger={<Button*/}
          {/*id={`confirm-modal-${this.props.name}`}*/}
          {/*style={{ display: 'none' }}>*/}
          {/*</Button>}>*/}
          {/*<Button waves='light'*/}
          {/*className="CreateArticle-delete"*/}
          {/*onClick={(e) => this.generateTokens(e)}*/}
          {/*s={3}*/}
          {/*>*/}
          {/*<Icon left>warning</Icon>CONFIRM*/}
          {/*</Button>*/}
          {/*</Modal>*/}

          {/*{this.state.getConfirmation &&*/}
          {/*<Button waves='light'*/}
          {/*className="CreateArticle-submit"*/}
          {/*style={{position: 'absolute', minWidth: '100%'}}*/}
          {/*onClick={(e) => this.changeConfirmed() }*/}
          {/*s={7}*/}
          {/*>*/}
          {/*{this.state.asyncProcessing &&*/}
          {/*<ProgressBar />*/}
          {/*}*/}
          {/*{!this.state.asyncProcessing &&*/}
          {/*<span>*/}
          {/*<Icon left>check_circle</Icon>*/}
          {/*Confirm change of {this.props.name} to {this.state[this.props.name]}*/}
          {/*</span>*/}
          {/*}*/}
          {/*</Button>}*/}
        </div>

        <form onSubmit={this.handleFormSubmit}>
          <div className="Profile-propertyLabel">{this.props.name}</div>
          <TextInput
            s={12}
            className="Profile-propertyInput"
            type={this.props.type}
            name={this.props.name}
            placeholder={this.props.placeholder}
            // label={this.props.name}
            value={this.state[this.props.name]}
            onChange={this.handleChange}
          ></TextInput>

          {this.state.currentModified &&
            this.state[this.props.name] !==
              this.state[this.props.name + "_original"] && (
              <div className="Profile-saveButtonDiv">
                {this.state.asyncProcessing && <ProgressBar />}

                {!this.state.asyncProcessing && (
                  <Button
                    waves="light"
                    className="CreateArticle-submit"
                    style={{
                      backgroundColor: "darkblue",
                      width: "auto",
                      textTransform: "none",
                      position: "relative",
                    }}
                    onClick={(e) => this.changeConfirmed()}
                  >
                    <span>
                      <Icon className="Profile-saveButtonIcon" left>
                        check_circle
                      </Icon>
                      {/*Confirm change of {this.props.name} to {this.state[this.props.name]}*/}
                      Save Changes
                    </span>
                  </Button>
                )}

                {!this.state.asyncProcessing && (
                  <Button
                    waves="light"
                    className="CreateArticle-submit"
                    style={{
                      backgroundColor: "#F5F5F5",
                      width: "auto",
                      textTransform: "none",
                      position: "relative",
                      color: "darkblue",
                      marginLeft: "1rem",
                    }}
                    onClick={(e) => this.resetToOriginal()}
                  >
                    <span>Cancel</span>
                  </Button>
                )}
              </div>
            )}
        </form>
      </div>
    );
  }
}
export default UpdateProfileProperty;
