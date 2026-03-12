import React, { Component } from 'react';

import Auxiliary from './Auxiliary';
import Nav from './UI/Nav';
import Footer from './UI/Footer';
import BackToTop from './UI/BackToTop';

class Layout extends Component {
    render () {
        return (
            <Auxiliary>
                <Nav />
                <main>
                    {this.props.children}
                </main>
                <Footer />
                <BackToTop />
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
