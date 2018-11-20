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

    // debug messages
    config.deubg = config.debug || false
    // where to to log in debug mode
    config.console = config.console || console
    // sets window.location for redirect 
    config.hard_404_path  = config.hard_404_path || null

    class WithUniversalRouter extends React.Component {

        _initialState() {
            return {
                location: null,
            }
        }

        constructor(props) {
            
            super(props)
            config.debug && config.console.log('WithUniversalRouter: constructor()')
            this.state = this._initialState()

            // XXX location_class _needs_ to be a _class_
            this._router = new UniversalRouter(routes.map(route => {
                const loc = route.location_class
                if (!loc) {
                    console.warn('Route:', route)
                    throw(`Route.location_class should be a class, not ${route.location_class}`)
                }
                if (!loc.route) {
                    console.warn('Location:', loc)
                    throw(`lcoation_class.route should be string representing a route, not ${loc.route}`)
                }
                //dont check for compoenent if were just a redirect
                if (!loc.redirect && !route.component) {
                    console.warn('Location:', route)
                    throw(`route.component should be a React element, not ${route.component}`)
                }

                return {
                    path: loc.route, 
                    action: (ctx) => {return new loc(route.component, ctx.href, config)},
                }
            }))
        }

        componentDidMount() {
            config.debug && config.console.log('WithUniversalRouter: compoenentDidMount()')
            this._unlisten = history.listen(this._setHistory.bind(this))
            const href = window.location.href
            this._setHistory(href) // first set is window location
        }

        componentDidUpdate() {
            config.debug && config.console.log('WithUniversalRouter: componentDidUpdate()')
        }

        _setHistory(hlocation) { // history type location
            var uri = new URI(hlocation)
            uri.pathname(hlocation.pathname)
            // init hlocation is just a string
            if (typeof hlocation.search === 'string')
                uri.search(hlocation.search)
            //XXX config below is tied into UniversalRouter config in the constructor
            const url_config = {
                pathname: uri.pathname(), 
                href: uri.normalize().toString()
            }
            this._router.resolve(url_config)
                .then( ulocation => this._setLocation(ulocation))
                .catch((error) => {
                    if (config.hard_404_path) {
                        console.warn(error)
                        //window.location = config.hard_404_path
                    } else  {
                        throw error
                    }
                })

        }

        _setLocation(ulocation) { // universal location type
            this.setState({
                location: ulocation,
            })
        }

        render() {
            config.debug && config.console.log('WithUniversalRouter: render(),', 'location:', this.state.location)
            const location = this.state.location
            if (!location)
                return null
            const cls = location.constructor
            if (cls.redirect) {
                window.location = cls.redirect
                return null
            } else {
                return ( 
                    <WrappedComponent 
                        location={location}
                        component={location.component}
                    />
                )
            }
        }
    }
    WithUniversalRouter.displayName = `WithUniversalRouter(${getDisplayName(WrappedComponent)})`;
    return  WithUniversalRouter
}


export default withUniversalRouter

