import React from 'react';
import { Button } from 'react-materialize';
import { connect } from 'react-redux';

const Add = ({ history, goto, a }) => {
    return (
        <div>
            { a && <div className="Articles-add_article">
                <Button
                    onClick={(e) => history.push(goto) }
                    floating large
                    className='green darken-5'
                    style={{ right: '1.2rem', top: '-1rem' }}
                    waves='light' icon='add'/>
            </div>  }
        </div>
    );
};
const mapStateToProps = (state) => ({
  a: state.auth.a
});

export default connect(mapStateToProps, null)(Add);