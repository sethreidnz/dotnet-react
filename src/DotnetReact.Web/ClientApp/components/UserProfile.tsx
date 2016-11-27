import * as React from 'react';
import { Link } from 'react-router';
import { provide } from 'redux-typed';
import { ApplicationState }  from '../store';
import * as UserDetailsState from '../store/UserDetails';

interface RouteParams {
    startDateIndex: string;
}

class UserProfile extends React.Component<UserProfileProps, void> {
    componentWillMount() {
        this.props.requestUserDetails();
    }
    
    componentWillReceiveProps(nextProps: UserProfileProps) {
        this.props.requestUserDetails();
    }

    public render() {
        return <div>
            <h1>User Profile</h1>
            { this.renderUserDetails() }
        </div>;
    }
    
    private renderUserDetails() {
        const firstName = '';
        return <p className='clearfix text-center'>
            FirstName: {firstName}
        </p>;
    }
}

// Build the WeatherForecastProps type, which allows the component to be strongly typed
const provider = provide(
    (state: ApplicationState) => state.weatherForecasts, // Select which part of global state maps to this component
    UserDetailsState.actionCreators                 // Select which action creators should be exposed to this component
).withExternalProps<{ params: RouteParams }>();          // Also include a 'params' property on WeatherForecastProps
type UserProfileProps = typeof provider.allProps;
export default provider.connect(UserProfile);
