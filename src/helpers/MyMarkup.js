import React from 'react';
import { Matcher } from 'interweave';
import MakeBoard from '../components/BridgeBoard/MakeBoard';

function match(string) {
    const matches = string.match(/<MakeBoard .*\/>/);

    let data = matches.split(" ");
    data[7] += " " + data[8];
    let props = {};
    data.slice(1,-1).forEach((el, idx) => {
        if (idx !== 7) {
            let [key, value] = el.split("=")
            props[key] = value.slice(1, -1)
        }

    });

    if (!matches) {
        return null;
    }

    return {
        match: matches[0],
        ...props
    };
}

// Class
class MyMatcher extends Matcher {
    match(string) {
        return match(string);
    }

    replaceWith(match, props) {
        return (
            <MakeBoard {...props} />
        );
    }

    asTag() {
        return 'MakeBoard';
    }
}

export default MyMatcher;
// const matcher = new CustomMatcher('foo');

// Object
// const matcher = {
//     inverseName: 'noFoo',
//     propName: 'foo',
//     asTag: () => 'MakeBoard',
//     createElement: (match, props) => <MakeBoard {...props} />,
//     match,
// };