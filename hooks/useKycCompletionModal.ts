import { useCallback, useEffect, useRef, useState } from 'react';
import { InteractionManager } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setSurveyModal } from '@/redux/slice/auth-slice';
import { getTodayISODate, shouldShowOncePerDayModal } from '@/utils/modal-helpers';

export const useSurveyModal = () => {
  const dispatch = useDispatch();

  const surveyModalCompleted = useSelector((state: any) => state.auth.surveyModalCompleted);
  const surveyModalLastDismissed = useSelector((state: any) => state.auth.surveyModalLastDismissed);

  const [shouldShow, setShouldShow] = useState(false);

//   const [hasShownThisSession, setHasShownThisSession] = useState(false);

// useEffect(() => {
//   const task = InteractionManager.runAfterInteractions(() => {
//     if (!surveyModalCompleted && !hasShownThisSession) {
//       setShouldShow(true);
//       setHasShownThisSession(true);
//     }
//   });

//   return () => task.cancel();
// }, [surveyModalCompleted, hasShownThisSession]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      const show = shouldShowOncePerDayModal(surveyModalCompleted, surveyModalLastDismissed);
      setShouldShow(show);
    });

    return () => task.cancel();
  }, [surveyModalCompleted, surveyModalLastDismissed]);

  const markAsCompleted = useCallback(() => {
    dispatch(setSurveyModal({ completed: true, lastDismissed: getTodayISODate() }));
    setShouldShow(false);
  }, [dispatch]);

  const dismissForToday = useCallback(() => {
    dispatch(setSurveyModal({ lastDismissed: getTodayISODate() }));
    setShouldShow(false);
  }, [dispatch]);

  return {
    shouldShow,
    markAsCompleted,
    dismissForToday,
    isCompleted: surveyModalCompleted,
  };
};