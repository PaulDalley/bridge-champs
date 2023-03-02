import React from 'react';
import { makeDateString } from '../../helpers/helpers';
import { Link } from 'react-router-dom';

const DisplayUserInfo = ({ insertSpacing, uid, name, email, photo, subscriptionExpires, subscriptionActive, totalQuizScore }) => {
  let subscriptionInfo;

  if (name) {
      try {
          name = name.split(" ")[0];
          // console.log(name);
      }
      catch (e) {
          console.log(e);
      }
  }

  // Format subscription info:
    if (subscriptionActive) {
        subscriptionInfo = <div>
            Your subscription is:&nbsp; <span className="Active-Safe-Completed">Active</span>
            <br/>
            {/*{insertSpacing && <span>Billing period ends on {makeDateString(subscriptionExpires) }</span> }*/}
            <span>Billing period ends on {makeDateString(subscriptionExpires) }.</span>
        </div>;
    }
    else if (!subscriptionActive && subscriptionExpires !== undefined) {
        if (Date.now() > subscriptionExpires) {
            subscriptionInfo = <div>
                Your subscription is:&nbsp; <span className="bold-text red-suit">Inactive</span>
                <br/>
                Your subscription expired on {makeDateString(subscriptionExpires) }. Renew <Link to="/membership">Here</Link>
            </div>;

        }
        else {
            subscriptionInfo = <div>
                Your subscription is:&nbsp; <span className="bold-text red-suit ">Inactive</span>
                <br/>
                Your membership access is available until {makeDateString(subscriptionExpires) }.
            </div>;
        }
    }
  else {
      subscriptionInfo = "No subscription active for this account."
  }



  return (
      <div className="SideDrawer-User">
          { photo && <div><img className="SideDrawer-Profile-Image" src={photo} /></div>}
          { !photo && <div>
              <i className="SideDrawer-Profile fas fa-user-circle">
              </i>
          </div>}
          <div className="SideDrawer-name">Hi, {name}</div>
          {insertSpacing && <br/>}
          { totalQuizScore &&
          <div className="SideDrawer-email"
              // SideDrawer-info style={{position: "absolute", top: "20rem"}}
          >
              <span style={{position: 'relative', top: '.2rem' }}
                  className="SideDrawer-score_number" >
                   {totalQuizScore}
              </span>
              <span className="red-suit"
                    style={{fontWeight: '700', fontSize: '95%', position: 'relative', left: '1rem', top: '-1rem'}}>
                  Champion
              </span>
              {/*<span style={{position: 'absolute', top: '12rem', right: '5.7rem'}}>*/}
              <span style={{position: 'relative', top: '.35rem', left: '-4.8rem'}}>
                points
              </span>
          </div> }
          {/*<div className="SideDrawer-email">{email}</div>*/}

          {insertSpacing && <br/>}
          {uid &&
            <div className="SideDrawer-info">{subscriptionInfo}</div>
          }




      </div>
  );
};

export default DisplayUserInfo;