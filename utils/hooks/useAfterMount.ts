import { useEffect, useState } from "react";

type DependencyList = readonly unknown[];
declare const UNDEFINED_VOID_ONLY: unique symbol;
/**
 * The function returned from an effect passed to {@link React.useEffect useEffect},
 * which can be used to clean up the effect when the component unmounts.
 *
 * @see {@link https://react.dev/reference/react/useEffect React Docs}
 */
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
// NOTE: callbacks are _only_ allowed to return either void, or a destructor.
type EffectCallback = () => void | Destructor;
/**
 *
 * Run any function after component has successfully mounted;
 *
 * @param effect must be a function
 * @param deps
 * @type Hook
 * */
export const useAfterMount = (effect: any, deps: any = []) => {
  const [isMounted, setMounted] = useState<boolean>(false);
  const [_dependencies, setDependencies] = useState<any>();
  useEffect(() => {
    setMounted(true);
    setDependencies(deps);
  }, []);

  useEffect(() => {
    if (isMounted) effect();
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      // deps check
    }
  }, [deps]);
};
