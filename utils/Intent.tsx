import { setAppState } from "@/redux/slice/auth-slice";
import { setIntentState } from "@/redux/slice/intentSlice";
import { dispatch } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { router } from "expo-router";

class Intent {
  NO_PHONE_NUMBER_ACTION: string = "no-phone";
  NO_EMAIL_ACTION: string = "no-email";
  NO_USERNAME_ACTION: string = "no-user-name";
  NO_NAME: string = "no-name";
  UNVERIFIED: string = "unverified";
  NO_USER_PIN: string = "no-user-pin";
  DONE: string = "done";
  NO_UNIVERSITY: string = "no-university";

  private action: string = "";
  private router: boolean = false;
  private callback: () => void = () => null;
  private route: string = "";
  private static instance: Intent;

  private constructor() {}

  public static getInstance(): Intent {
    if (!Intent.instance) {
      Intent.instance = new Intent();
    }
    return Intent.instance;
  }

  setAction(action: string) {
    this.action = action;
    return this;
  }

  setCallback(callback: () => void) {
    this.callback = callback;
    return this;
  }

  start() {
    if (this.route) {
      router.push(`${this.route}?intent=${this.action}` as any);
      return;
    }
    dispatch(
      setAppState({ contactChecker: this.action, callback: this.callback }),
    );
    dispatch(
      setIntentState({
        action: this.action,
        callback: this.callback,
        route: this.route,
      }),
    );
  }

  fulFillCallback() {
    const fulfillIntent = createAsyncThunk(
      "intent/fulfill",
      (type, { getState }) => {
        // @ts-ignore
        const { callback } = getState().intent;
        if (typeof callback === "function") {
          callback && callback();
        }
        this.reset();
      },
    );
    dispatch(fulfillIntent());
  }

  useRoute(route: string = "") {
    this.route = route;
    return this;
  }

  init() {
    const loadIntent = createAsyncThunk("intent/load", (type, { getState }) => {
      // @ts-ignore
      const { action, callback, route } = getState().intent;
      this.route = route;
      this.callback = callback;
      this.action = action;
    });
    // dispatch(loadIntent())
    return this;
  }

  private reset() {
    dispatch(setIntentState({ action: "", callback: () => null, route: "" }));
    this.route = "";
    this.callback = () => null;
    this.action = "";
  }
}

const intentInstance = Intent.getInstance();
export default intentInstance;
