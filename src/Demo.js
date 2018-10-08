/* eslint react/prop-types: 0 */  // --> OFF
import React from 'react';

import withUniversalRouter, {Link} from './withUniversalRouter'

const love = () => ( <div> (｡◕‿◕｡) </div>)
const notmuch = () => (<div> (ಠ_ಠ) </div>)
const notfound = () => (<div> ⊙﹏⊙ </div>)

class INeedLove {
    static route = '/ineedlove';
    static component = love
}

class NotSoMuch {
    static route = '/notsomuch';
    static component = notmuch
}

class NotFound {
    static route = '(.*)';
    static component = notfound
}

const Demo = (props) => {console.log('comp', props.component); return(
    <div>
        <h1>
            <Link  to='/ineedlove'>i need love</Link><br/>
            <Link  to='/notsomuch'>not so much</Link><br/>
            <a href='/'>a real anchor forces a real reload</a>
            {React.createElement(props.component, {location: props.location})}
        </h1>
    </div>
)}

export default withUniversalRouter(Demo, [INeedLove, NotSoMuch, NotFound], {debug:true})

