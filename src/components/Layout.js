import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxiliary from './Auxiliary';
import Nav from './UI/Nav';
import Footer from './UI/Footer';

class Layout extends Component {
    render () {
        return (
            <Auxiliary>
                <Nav />
                <main>
                    {this.props.children}
                </main>
                <Footer />
            </Auxiliary>
        )
    }
}
export default Layout;

// const mapStateToProps = state => {
//     return {
//         isAuthenticated: state.auth.token !== null
//     };
// };
//
// export default connect( mapStateToProps )( Layout );
