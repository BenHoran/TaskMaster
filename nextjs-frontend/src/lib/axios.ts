import axios from "axios";
import { login, logout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/router";

interface CreateApiParams {
  dispatch?: React.Dispatch<any>;
  user?: { access_token?: string; refresh_token?: string };
  router?: ReturnType<typeof useRouter>;
}

const createApi = ({ dispatch, user, router }: CreateApiParams) => {
  const api = axios.create({
    baseURL: "",
  });

  api.interceptors.request.use(
    (config) => {
      const token = user?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = user?.refresh_token;
          if (refreshToken && dispatch) {
            const response = await axios.post(
              "/api/refresh",
              {},
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              }
            );
            const { access_token } = response.data;

            dispatch(login({ access_token }));

            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return axios(originalRequest);
          }
        } catch (error) {
          if (dispatch) {
            dispatch(logout());
            router.push("/login");
          }
        }
      }
      if (error.response && error.response.status === 403) {
        if (dispatch) {
          console.log(error);
          dispatch(logout());
          router.push("/login");
        }
      }
      return Promise.reject(error);
    }
  );
  return api;
};

export default createApi;
