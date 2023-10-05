import React, { createContext, useReducer } from 'react';

interface StateType {
  fullBox: boolean;
  userInfo: {
    name: string;
    email: string;
    token: string;
    isAdmin: boolean;
  } | null;
}

interface ActionType {
  type: string;
  payload?: any;
}

const userInfoString = localStorage.getItem('userInfo');
const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
const initialState: StateType = {
  fullBox: false,
  userInfo,
};

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
      };
    default:
      return state;
  }
}

export const Store = createContext<{
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function StoreProvider(props: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
