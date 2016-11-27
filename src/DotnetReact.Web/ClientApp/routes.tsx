// Dependencies
import * as React from 'react';
import { Router, Route, HistoryBase } from 'react-router';

// Components
import { Layout } from './components/Layout';

// Containers
import Home from './containers/Home';
import FetchData from './containers/FetchData';
import UserProfile from './containers/UserProfile';

export default <Route component={ Layout }>
    <Route path='/' components={{ body: Home }} />
    <Route path='/fetchdata' components={{ body: FetchData }}>
        <Route path='(:startDateIndex)' /> { /* Optional route segment that does not affect NavMenu highlighting */ }
    </Route>
    <Route path='/profile' components={{ body: UserProfile }} />
</Route>;

// Enable Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();
}
