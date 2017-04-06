import ActionTypes from './action_types';
import auth from './../../ffi/api/auth';
import { resetDashData } from './app_action';

export const loginSuccess = (res) => (
  {
    type: ActionTypes.LOGIN_SUCCESS,
    user: res
  }
);

export const setErrorMessage = (msg) => ({
  type: ActionTypes.SET_ERROR_MESSAGE,
  msg
});

export const clearErrorMessage = () => ({
  type: ActionTypes.CLEAR_ERROR_MESSAGE
});

export const loginError = (err) => (
  {
    type: ActionTypes.LOGIN_ERROR,
    error: err
  }
);

export const registerSuccess = (res) => ({
  type: ActionTypes.REGISTER_SUCCESS,
  user: res
});

export const registerError = (err) => ({
  type: ActionTypes.REGISTER_ERROR,
  error: err
});

export const setAuthProcessing = () => ({
  type: ActionTypes.AUTH_PROCESSING
});

export const cancelAuthReq = () => ({
  type: ActionTypes.AUTH_CANCEL
});

export const setRegisterStateNext = user => ({
  type: ActionTypes.REGISTER_STATE_NEXT,
  user
});

export const setRegisterStateBack = () => ({
  type: ActionTypes.REGISTER_STATE_BACK
});

export const setRegisterState = navState => ({
  type: ActionTypes.SET_REGISTER_STATE,
  navState
});

export const resetUser = () => ({
  type: ActionTypes.RESET_USER
});

export const setInviteCode = (invite) => ({
  type: ActionTypes.SET_INVITE_CODE,
  invite
});

export const login = payload => (
  dispatch => {
    dispatch(setAuthProcessing());
    auth.login(payload.accountSecret, payload.accountPassword)
    .then(() => {
      dispatch(loginSuccess(payload));
      dispatch(resetDashData());
    }, (err) => {
      dispatch(loginError({
        errorCode: err
      }));
    });
  }
);

export const register = payload => (
  dispatch => {
    dispatch(setAuthProcessing());
    auth.register(payload.accountSecret, payload.accountPassword, payload.inviteToken)
    .then(() => {
      dispatch(registerSuccess(payload));
    }, (err) => {
      dispatch(registerError({ errorCode: err }));
    });
  }
);

export const logout = userData => (
  dispatch => {
    window.msl.clearAllSessions();
    window.msl.networkStateChange(0);
    window.msl.reconnect(userData);
    dispatch(resetDashData());
    dispatch({
      type: ActionTypes.LOGOUT
    });
  }
);
