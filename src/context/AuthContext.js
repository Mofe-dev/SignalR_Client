import { createContext } from "react";

const AuthContext = createContext({
  accessToken: null,
  setAccessToken: () => {},
});

export default AuthContext;
