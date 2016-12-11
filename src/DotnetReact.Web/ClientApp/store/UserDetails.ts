import { fetch, addTask } from 'domain-task';
import { typeName, isActionType, Action, Reducer } from 'redux-typed';
import { ActionCreator } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface UserDetailsState {
    isLoading: boolean;
    hasLoaded: boolean;
    user: UserModel;
}

export interface UserModel {
    firstName: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

@typeName("REQUEST_USER_DETAILS")
class RequestUserDetails extends Action {
    constructor() {
        super();
    }
}

@typeName("RECEIVE_USER_DETAILS")
class RecieveUserDetails extends Action {
    constructor(public user: UserModel) {
        super();
    }
}

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestUserDetails: (): ActionCreator => (dispatch, getState) => {
        const state = getState();
        if(state.userDetails.isLoading || state.userDetails.hasLoaded) return;
        let fetchTask = fetch('/api/User', {
                credentials: 'include',
                 mode: 'no-cors'
            })
            .then(response => response.json())
            .then((user: UserModel) => {
                dispatch(new RecieveUserDetails(user));
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch(new RequestUserDetails());
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const initialState: UserDetailsState = {
    user: null,
    isLoading: false,
    hasLoaded: false
};
export const reducer: Reducer<UserDetailsState> = (state, action) => {
    if (isActionType(action, RequestUserDetails)) {
        return Object.assign({}, state, {
            hasLoaded: false,
            isLoading: true,
            user: null
        });
    } else if (isActionType(action, RecieveUserDetails)) {
        return Object.assign({}, state, {
            hasLoaded: true,
            isLoading: false,
            user: action.user
        });
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    // (or default initial state if none was supplied)
    return state || initialState;
};
