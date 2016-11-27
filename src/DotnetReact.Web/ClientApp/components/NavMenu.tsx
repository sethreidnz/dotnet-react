import * as React from 'react';
import { Link } from 'react-router';

export class NavMenu extends React.Component<any, void> {
    public render() {
        return (
            <nav className='navbar navbar-light bg-faded'>
                <button className='navbar-toggler hidden-lg-up' type='button' data-toggle='collapse' data-target='#navbarResponsive' aria-controls='navbarResponsive' aria-expanded='false' aria-label='Toggle navigation'></button>
                <div className='collapse navbar-toggleable-md' id='navbarResponsive'>
                    <a className='navbar-brand' href='#'>Navbar</a>
                    <ul className='nav navbar-nav'>
                        <li className='nav-item active'>
                            <Link to={ '/' } activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Home
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to={ '/counter' } activeClassName='active'>
                                <span className='glyphicon glyphicon-education'></span> Counter
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to={ '/fetchdata' } activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Fetch data
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to={ '/profile' } activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Profile
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
