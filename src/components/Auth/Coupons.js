import React, { Component } from 'react';
import { Row, Button, Icon, Preloader } from 'react-materialize';
import $ from 'jquery';

class Coupons extends Component {
    state = {
        token: "",
        message: "",
        error: "",
        submitted: false,
        toggleCoupon: false,
        tokenValidating: false,
        tokenValid: false,
    }

    validateUserToken = () => {
        this.setState({ message: "", error: "" });
        const url = "https://us-central1-bridgechampions.cloudfunctions.net/validateUserToken";
        return $.post(
            url,
            {token: this.state.token},
            (data, status) => {
                // console.log(status);
                // console.log(data);
                let userMessage = `Token validated`;
                if (data.percentOffFirstMonth && data.percentOffFirstMonth !== "0%") {
                    userMessage += `: ${data.percentOffFirstMonth} off your first month.`;
                }
                this.setState({ tokenValid: true, tokenValidating: false, message: userMessage} );
                $('#token-input-textbox').attr("disabled", "disabled");
                $('.PremiumMembership-token-input').addClass('PremiumMembership-token-input-submitted');
                this.props.passDataUp(
                    this.state.token,
                    Number(data.daysFree),
                    data.percentOffFirstMonth,
                    data.paypalButtonUrl,
                );
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    error: "Your token was invalid, try again",
                    tokenValidating: false,
                    tokenSubmitted: false,
                    // token: "",
                });
            });
    }

    handleTokenInputChange = e => {
        // console.log(e.target.name);
        // console.log(e.target.value);
        this.setState({[e.target.name]: e.target.value.toUpperCase() });
    }
    submitToken = (e) => {
        this.setState({tokenSubmitted: true, tokenValidating: true});
        e.preventDefault();
        // const token = this.state.token;
        // console.log(this.state.token);
        this.validateUserToken();
        // setTimeout(() => {
            // SUCCESS:
            // this.setState({ tokenValid: true, tokenValidating: false, message: "Token validated"} );
            // $('#token-input-textbox').attr("disabled", "disabled");
            // $('.PremiumMembership-token-input').addClass('PremiumMembership-token-input-submitted');

            // error:
            // $('.PremiumMembership-token-input').addClass('PremiumMembership-token-input-invalid');
            // this.setState({
            //     error: "Your token was invalid, try again",
            //     tokenValidating: false,
            //     tokenSubmitted: false,
            //     // token: "",
            // });

        // }, 2000);
    }

    render() {
        return (
            <div style={{ minHeight: '7rem', }}>
                {/*COUPON INPUT FORM:*/}
                { !this.state.toggleCoupon &&
                    <div onClick={() => this.setState({ toggleCoupon: true })}
                         style={{ fontWeight: 'bold', fontSize: '2rem', cursor: 'pointer', color: '#0f9d58', position: 'relative', top: '1.5rem', marginBottom: '2rem' }}
                    >
                        Have a coupon?
                    </div>
                }

                { this.state.toggleCoupon && !this.state.submitted &&
                <Row className="PremiumMembership-token-input">
                    <div className="PremiumMembership-token-message"
                         style={{fontSize: '1.4rem'}}
                    >
                        {this.state.tokenMessage}
                    </div>
                    <input id="token-input-textbox"
                           className="PremiumMembership-token-input-box"
                           name="token"
                           type="text"
                           label="input token"
                           placeholder="Enter Coupon"
                           value={this.state.token}
                           onChange={this.handleTokenInputChange}
                    />
                    {/*APPLY BUTTON*/}
                    { !this.state.tokenSubmitted &&
                    <Button className="CreateArticle-submit PremiumMembership-token-button"
                            onClick={(e) => this.submitToken(e)}
                            style={{
                                fontSize: "1.3rem",
                                textTransform: 'none',
                                height: '4.8rem',
                                width: '11rem'
                            }}
                            waves='light'
                    >Apply
                        <Icon left>done_all</Icon>
                    </Button>}

                    {/*PRELOADER FOR TOKEN LOADING*/}
                    {this.state.tokenSubmitted && this.state.tokenValidating &&
                    <Button
                        className="CreateArticle-submit PremiumMembership-token-button"
                        waves='light'
                        style={{
                            fontSize: "1.3rem",
                            textTransform: 'none',
                            height: '4.8rem',
                            width: '11rem'
                        }}>
                        <Preloader color="yellow"
                                   className="PremiumMembership-signup_button_preloader"
                                   size='small'/>
                    </Button>
                    }

                    {this.state.tokenSubmitted && this.state.tokenValid &&
                    <Button
                        className="CreateArticle-submit PremiumMembership-token-button"
                        waves='light'
                        style={{
                            fontSize: "6rem",
                            color: "#00E676",
                            backgroundColor: "black",
                            textTransform: 'none',
                            height: '4.8rem',
                            width: '13rem'
                        }}>
                        <i className="material-icons PremiumMembership-large-icon"
                           style={{fontSize: "4.2rem !important"}}
                        >check_circle</i>
                    </Button>
                    }

                </Row>
                }
                {this.state.message &&
                <div
                    style={{ fontWeight: 'bold', fontSize: '1.8rem', color: '#0f9d58', position: 'relative', top: '-1.5rem', }}
                >
                    {this.state.message}
                </div>
                }
                {this.state.error &&
                <div
                    style={{ fontWeight: 'bold', fontSize: '1.8rem', color: 'red', position: 'relative', top: '-1.5rem', }}
                >
                    {this.state.error}
                </div>}
            </div>
        );
    }
}

export default Coupons;