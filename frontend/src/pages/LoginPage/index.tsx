import styled from '@emotion/styled';
import { Block, f7, Page, Icon } from 'framework7-react';
import React, { useEffect, useState } from 'react';
import {
  loginUser,
  registerUser,
  loginWithFacebook,
  loginAsGuest,
} from '../../api';
import { OfflineError } from '../../api/errors';
import Colors from '../../colors';
import { YellowButton, MutedButton } from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import useIfLoggedIn from '../../hooks/useIfLoggedIn';
import ToastService from '../../services/ToastService';
import LocalDatabase from '../../utils/LocalDatabase';
import BirbPNG from './Birb.png';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import HDivider from '../../components/HDivider';

enum Route {
  Default,
  Signup,
  Login,
  Guest,
}

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [route, setRoute] = useState<Route>(Route.Default);

  useIfLoggedIn();

  useEffect(() => {
    f7.views.main.router.allowPageChange = false;

    return () => {
      f7.views.main.router.allowPageChange = true;
    };
  }, []);

  const saveUserAndRedirect = async (
    token: string,
    refreshToken: string,
    userId: string,
    toastMsg: string = 'Signed up successfully!'
  ) => {
    await LocalDatabase.saveAuthToken(token, refreshToken);
    await LocalDatabase.setUserId(userId);
    ToastService.toastBottom(toastMsg);
    f7.views.main.router.allowPageChange = true;
    f7.views.main.router.navigate('/');
  };

  const signup = async () => {
    try {
      setLoading(true);
      const { token, refreshToken, userId } = await registerUser({
        username,
        password,
      });
      await saveUserAndRedirect(token, refreshToken, userId);
    } catch (e) {
      if (e instanceof OfflineError) {
        ToastService.toastBottom(
          'You are offline. Please connect to the Internet before signing up. If you want, you can use some of our features as a guest first.'
        );
      } else {
        if (e.response?.status === 409) {
          ToastService.toastBottom(
            `This email has already been taken. Did you want to sign in instead?`
          );
        } else {
          ToastService.toastBottom('Could not sign up.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      const { token, refreshToken, userId } = await loginUser({
        username,
        password,
      });
      await saveUserAndRedirect(
        token,
        refreshToken,
        userId,
        'Logged in successfully!'
      );
    } catch (e) {
      if (e instanceof OfflineError) {
        ToastService.toastBottom(
          'You are offline. Please connect to the Internet before logging in.'
        );
      } else {
        ToastService.toastBottom('Could not login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onLoginFacebook = async (response: { name: string; id: string }) => {
    try {
      setLoading(true);
      const { name, id: fbId } = response;
      const { token, refreshToken, userId } = await loginWithFacebook({
        name,
        fbId,
      });
      await saveUserAndRedirect(
        token,
        refreshToken,
        userId,
        'Logged in successfully via Facebook!'
      );
    } catch (e) {
      if (e instanceof OfflineError) {
        ToastService.toastBottom(
          'You are offline. Please connect to the Internet before logging in. If you want, you can use some of our features as a guest first.'
        );
      } else {
        if (e.response?.status === 401) {
          ToastService.toastBottom('Wrong email or password.');
        } else {
          ToastService.toastBottom('Could not login.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const onLoginGuest = async () => {
    try {
      setLoading(true);
      const { token, refreshToken, userId } = await loginAsGuest();
      await saveUserAndRedirect(
        token,
        refreshToken,
        userId,
        'Signed in as guest'
      );
    } catch (e) {
      if (e instanceof OfflineError) {
        // do a special thing
        await LocalDatabase.queueGuestAccount();
        ToastService.toastBottom(
          // "You are offline. Please connect to the Internet before logging in."
          'We will create your guest account once you are online. Meanwhile, you will have limited functionality within the application.'
        );

        f7.views.main.router.allowPageChange = true;
        f7.views.main.router.navigate('/');
      } else {
        ToastService.toastBottom('Could not login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (route) {
      case Route.Default:
        return (
          <>
            <h1 className="m-0 blue-text">Welcome,</h1>
            <p className="m-0 blue-text">
              Start your self-care journey with Halcyon.
            </p>
          </>
        );
      case Route.Login:
      case Route.Signup:
        return (
          <>
            <div className="mb-2">
              <label className="blue-text">Email</label>
              <CustomInput
                placeholder="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="blue-text">Password</label>
              <CustomInput
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </>
        );
    }
  };

  const renderButtons = () => {
    switch (route) {
      case Route.Default:
        return (
          <>
            <YellowButton
              className="mb-4"
              style={{ width: '200px' }}
              onClick={() => setRoute(Route.Signup)}
            >
              Sign up
            </YellowButton>

            <YellowButton
              className="mb-4"
              style={{ width: '200px' }}
              onClick={() => setRoute(Route.Login)}
            >
              Log in
            </YellowButton>
          </>
        );
      case Route.Login:
        return (
          <>
            <YellowButton
              style={{ width: '200px' }}
              className="mb-4"
              onClick={login}
              loading={loading}
            >
              Log in
            </YellowButton>
            <p
              className="blue-text pointer"
              onClick={() => setRoute(Route.Signup)}
            >
              Don't have an account? Signup here.
            </p>
          </>
        );
      case Route.Signup:
        return (
          <>
            <YellowButton
              className="mb-4"
              style={{ width: '200px' }}
              onClick={signup}
              loading={loading}
            >
              Sign up
            </YellowButton>
            <p
              className="blue-text pointer"
              onClick={() => setRoute(Route.Login)}
            >
              Already have an account? Login here.
            </p>
          </>
        );
    }
  };

  return (
    <Page style={{ backgroundColor: Colors.tertiaryLight }}>
      <Block
        className="fullwidth"
        style={{
          maxWidth: '400px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          className="fullwidth"
          style={{ height: '300px', position: 'relative' }}
        >
          <Birb />
        </div>
        <div className="fullwidth mt-2 mb-4">{renderContent()}</div>
        <div>{renderButtons()}</div>
        <MutedButton
          className="mb-3"
          style={{ width: '200px' }}
          onClick={onLoginGuest}
        >
          Proceed as guest
        </MutedButton>
        <HDivider>or login with</HDivider>
        <FacebookLogin
          appId="330612548273394"
          autoLoad={false}
          callback={onLoginFacebook}
          disableMobileRedirect={true}
          render={(renderProps: any) => (
            <MutedButton className="mb-4" onClick={renderProps.onClick}>
              <Icon f7="logo_facebook" />
            </MutedButton>
          )}
        />
      </Block>
    </Page>
  );
};

const Birb = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 200px;
  height: 200px;
  transform: translate(-50%, 0%);
  background-image: url(${BirbPNG});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`;

export default LoginPage;
