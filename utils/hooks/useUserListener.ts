import { setUser } from "@/redux/slice/auth-slice";
import { useAppState } from "@/redux/store";
import { AUTH_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { omit } from "lodash";
import { useDispatch } from "react-redux";

export const useUserListener = () => {
  const { user, contactChecker } = useAppState();
  const dispatch = useDispatch();

  const updateUser = (data: any) => {
    if (typeof data === "object") {
      try {
        dispatch(setUser(Object.assign(omit(user, ["beneficiaries"]), data)));
      } catch (e) {
        // eslint-disable-next-line no-console
        // listener failed
      }
    }
  };

  useRequest(AUTH_SERVICE.PROFILE, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    revalidateOnReconnect: false,
    onDone: ({ data }) => updateUser(data),
  });

  useRequest(TRANSACTION_SERVICE.BENEFICIARIES, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    onDone: ({ data }) => updateUser({ beneficiaries: Array.from(data) }),
  });
};
