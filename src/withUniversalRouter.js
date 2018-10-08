//react
import React from 'react';

//lib
import UniversalRouter from 'universal-router'
import URI from 'urijs'

//local
import history from './history'

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const withUniversalRouter = (WrappedComponent, routes, config={}) => {

    class WithUniversalRouter extends React.Component {

        _initialState() {
            return {
                location: null,
            }
        }

        constructor(props) {
            super(props)
            config.debug && console.log('WithUniversalRouter: constructor()')
            this.state = this._initialState()

            // XXX Location _needs_ to be a _class_
            this._router = new UniversalRouter(routes.map(Location => {
                if (!Location.component)
                    throw(`${Location}.component should be a React element`)
                if (!Location.route)
                    throw(`${Location}.route should be string representing a route`)
                return {
                    path: Location.route, 
                    action: (ctx) => {console.log('ctx', ctx); return new Location(ctx.href)},
                }
            }))
            console.debug('state eq', this.state == this._initialState(), this.state === this._initialState())
        }

        componentDidMount() {
            config.debug && console.log('WithUniversalRouter: compoenentDidMount()')
            this._unlisten = history.listen(this._setHistory.bind(this))
            this._setHistory(window.location.href) // first set is window location
        }

        componentDidUpdate(newprops, newstate) {
            config.debug && console.log('WithUniversalRouter: componentDidUpdate()')
            console.log(this.state, newstate)
        }

        _setHistory(hlocation) { // history type location
            var uri = new URI(hlocation)
            uri.pathname(hlocation.pathname)
            uri.search(hlocation.search)
            //XXX config below is tied into UniversalRouter config in the constructor
            const config = {
                pathname: uri.pathname(), 
                href: uri.normalize().toString()
            }
            console.log('href', config.href, config.pathname)
            this._router.resolve(config)
                .then( ulocation => this._setLocation(ulocation))
        }

        _setLocation(ulocation) { // universal location type
            console.log('set loc', ulocation)
            this.setState({
                location: ulocation,
            })
        }

        render() {
            config.debug && console.log('WithUniversalRouter: render(),', 'location:', this.state.location)
            if (!this.state.location)
                return null
            const cls = this.state.location.constructor
            console.log('cls', cls, cls.component)
            return ( 
                <WrappedComponent 
                    location={this.state.location}
                    component={cls.component}
                />
            )
        }
    }
    WithUniversalRouter.displayName = `WithUniversalRouter(${getDisplayName(WrappedComponent)})`;
    return  WithUniversalRouter
}


export default withUniversalRouter

export { Link } from './Link'
