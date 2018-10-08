/* eslint react/prop-types: 0 */  // --> OFF
import React from 'react';
import ReactDOM from 'react-dom';
import Highlight from 'react-highlight'

import RouterDemo from './Demo'
const fs = require('fs');
const router_code = fs.readFileSync (__dirname + '/../src/' + 'Demo.js', 'utf8')

const Demo = (props) => (
    <div className='demo-wrapper'>
        <h3>{props.title}</h3>
        <div className='demo-target-wrapper'>
            {props.children}
        </div>
        <Highlight className='javascript'>{props.source}</Highlight>
    </div>
)

class App extends React.Component {

    render()  {return(
        <div className='app-wrapper'>
            <Demo title='withUniveralRouter Demo' source={router_code} ><RouterDemo /></Demo>
        </div>
    )}
}

ReactDOM.render(<App />, document.querySelector('#app'))


