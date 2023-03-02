import React from 'react';
import {Button, Preloader} from 'react-materialize';

import {
    CardElement,
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    PostalCodeElement,
    PaymentRequestButtonElement,
    StripeProvider,
    Elements,
    injectStripe,
} from 'react-stripe-elements';

const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/bridgechampions.appspot.com/o/logo-white-smaller.png?alt=media&token=335dce2a-bb25-49ef-bcd6-87ba38212bb6';
// const K = "sk_test_xrD2h5kXNEnOAr6uLgHwlvMk";
// const planId = "prod_CaO9pAb9VQ0QNI";
// import {InjectedCheckoutForm, StripeProvider, Elements, CardForm, CardElement, injectStripe} from 'react-stripe-elements';
const stripeKey = "pk_test_0oEg1KoEe7MkbdIe0LyU7oUD";


const handleBlur = () => {
    console.log('[blur]');
};
const handleChange = change => {
    console.log('[change]', change);
};
const handleClick = () => {
    console.log('[click]');
};
const handleFocus = () => {
    console.log('[focus]');
};
const handleReady = () => {
    console.log('[ready]');
};

const createOptions = (fontSize) => {
    return {
        style: {
            base: {
                fontSize,
                color: '#424770',
                letterSpacing: '0.025em',
                fontFamily: 'Source Code Pro, Menlo, monospace',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };
};


class _CardForm extends React.Component {
    handleSubmit = ev => {
        ev.preventDefault();
        this.props.stripe.createToken().then(payload => console.log(payload));
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Card details
                    <CardElement
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onReady={handleReady}
                        {...createOptions(this.props.fontSize)}
                    />
                </label>
                <Button
                    className="PremiumMembership-paypal_signup_button*/
                               PremiumMembership-signup_button_cc"
                    waves='light'>Pay with Credit Card
                </Button>
            </form>
        );
    }
}
const CardForm = injectStripe(_CardForm);

class Checkout extends React.Component {
    constructor() {
        super();
        this.state = {
            elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
        };


        window.addEventListener('resize', () => {
            if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
                this.setState({elementFontSize: '14px'});
            } else if (
                window.innerWidth >= 450 &&
                this.state.elementFontSize !== '18px'
            ) {
                this.setState({elementFontSize: '18px'});
            }
        });
    }

    render() {
        const {elementFontSize} = this.state;
        return (
            <div className="Checkout">
                <h2>All-in-one Card Form</h2>
                <Elements>
                    <CardForm fontSize={elementFontSize}/>
                </Elements>
            </div>
        );
    }
}

class StripeButton extends React.Component {
    state = {
        stripe: null,
    }

    componentDidMount() {
        // componentDidMount only runs in a browser environment.
        // In addition to loading asynchronously, this code is safe to server-side render.

        // You can inject a script tag manually like this,
        // or you can use the 'async' attribute on the Stripe.js v3 <script> tag.
        const stripeJs = document.createElement('script');
        stripeJs.src = 'https://js.stripe.com/v3/';
        stripeJs.async = true;
        stripeJs.onload = () => {
            // The setTimeout lets us pretend that Stripe.js took a long time to load
            // Take it out of your production code!
            setTimeout(() => {
                this.setState({
                    stripe: window.Stripe(stripeKey),
                });
            }, 500);
        };
        document.body && document.body.appendChild(stripeJs);
    }


    render() {
        return (
            <div>
                {this.state.stripe && <Button
                    className="PremiumMembership-paypal_signup_button
                               PremiumMembership-signup_button_cc"
                    waves='light'>Pay with Credit Card
                </Button>}
                {!this.state.stripe && <Button
                    className="PremiumMembership-paypal_signup_button*/
                               PremiumMembership-signup_button_cc
                               PremiumMembership-signup_button_loading"

                    waves='light'>
                        <Preloader color="yellow" className="PremiumMembership-signup_button_preloader" size='small'/>
                </Button>}
                {/*{this.state.stripe && <Button*/}
                    {/*className="PremiumMembership-paypal_signup_button*/}
                               {/*PremiumMembership-signup_button_cc*/}
                               {/*PremiumMembership-signup_button_loading"*/}

                    {/*waves='light'>*/}
                    {/*<Preloader color="yellow" className="PremiumMembership-signup_button_preloader" size='small'/>*/}
                {/*</Button>}*/}

                {/*{this.state.stripe !== null && <StripeProvider stripe={this.state.stripe}>*/}
                    {/*<Checkout />*/}
                {/*</StripeProvider>}*/}

            </div>
        );


    }
}

export default StripeButton;


