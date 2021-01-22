import { Loading } from '@geist-ui/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getCurrentUser } from '../services';
import { loggedUser } from '../store/auth/auth';
import { delay } from '../utils/helpers';

const AuthProvider: React.FC<{}> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [, setUser] = useRecoilState(loggedUser);
  const history = useHistory();

  useEffect(() => {
    const getUser = async () => {
      const accessToken = localStorage.getItem('access-token');

      await delay(300);

      if (!accessToken) {
        setLoading(false);
        history.replace('/host/auth/login');
        return;
      }

      try {
        const { data } = await getCurrentUser();

        setUser(data);
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('access-token');
        }

        history.replace('/host/auth/login');
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
        }}
      >
        <Loading size="large" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
