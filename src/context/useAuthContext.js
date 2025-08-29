import { useContext } from "react";
import AuthContext from "./AuthContext";

export default function useAuthContext() {
  return useContext(AuthContext);
}
