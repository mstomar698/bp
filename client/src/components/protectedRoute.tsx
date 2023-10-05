import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../store';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props): JSX.Element {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo ? <>{children}</> : <Navigate to="/signin" />;
}
