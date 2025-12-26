import React from "react";
import { Button, Icon } from "react-materialize";
import { connect } from "react-redux";

const Add = ({ history, goto, a, uid }) => {
  // Only show if user is logged in AND is an admin
  if (!uid || !a) {
    return null;
  }

  return (
    <div className="Articles-add_article">
      <Button
        onClick={(e) => history.push(goto)}
        floating
        large
        className="green darken-2"
        style={{ 
          position: 'fixed',
          right: '2rem', 
          bottom: '2rem',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
        waves="light"
        icon={<Icon>add</Icon>}
        title="Add new article"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  a: state.auth.a,
  uid: state.auth.uid,
});

export default connect(mapStateToProps, null)(Add);
