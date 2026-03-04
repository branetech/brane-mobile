import { setAppState } from "@/redux/slice/auth-slice";
import { dispatch, useAppState } from "@/redux/store";

type IReduxState<T> = [T, (newValue: T) => void];

export const useReduxState = <T>(
  initialValue: T,
  reference: string,
): IReduxState<T> => {
  const state = useAppState("auth") as any;
  const value: T = [undefined, null].includes(state?.[reference])
    ? initialValue
    : state?.[reference];

  const setValue = (newValue: T) => {
    dispatch(setAppState({ [reference]: newValue }));
  };
  return [value, setValue];
};
