import * as api from '../api/index';
import { AUTH, CREATE_PROFILE } from './constants';

export const signin =
  (formData, openSnackbar, setLoading) => async (dispatch) => {
    try {
      //login the user
      const { data } = await api.signIn(formData);

      dispatch({ type: AUTH, data });
      // setLoading(false)
      openSnackbar('Signin successfull');
      // navigate('/dashboard')
      window.location.href = '/dashboard';
    } catch (error) {
      // console.log(error?.response?.data?.message)
      openSnackbar(error?.response?.data?.message);
      setLoading(false);
    }
  };

export const signup =
  (formData, openSnackbar, setLoading) => async (dispatch) => {
    try {
      //Sign up the user
      const { data } = await api.signUp(formData);
      dispatch({ type: AUTH, data });
      const { info } = await api.createProfile({
        name: data?.result?.name,
        email: data?.result?.email,
        userId: data?.result?._id,
        phoneNumber: '',
        businessName: '',
        contactAddress: '',
        logo: '',
        website: '',
        paymentDetails: '',
      });
      dispatch({ type: CREATE_PROFILE, payload: info });
      window.location.href = '/dashboard';
      // navigate('/dashboard')
      openSnackbar('Sign up successfull');
    } catch (error) {
      console.log(error);
      openSnackbar(error?.response?.data?.message);
      setLoading(false);
    }
  };

export const forgot = (formData) => async (dispatch) => {
  try {
    await api.forgot(formData);
  } catch (error) {
    console.log(error);
  }
};

export const reset = (formData, navigate) => async (dispatch) => {
  try {
    await api.reset(formData);
    navigate('/dashboard');
  } catch (error) {
    alert(error);
  }
};
