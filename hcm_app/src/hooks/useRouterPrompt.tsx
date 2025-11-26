import { useCallback } from 'react';
import {
  useBeforeUnload,
  unstable_usePrompt as usePrompt,
} from 'react-router-dom';

const useRouterPrompt = (when: boolean, message: string) => {
  useBeforeUnload(
    useCallback(
      (e) => {
        if (when) {
          e.preventDefault();
          return (e.returnValue = '');
        }
      },
      [when]
    )
  );

  usePrompt({ when, message });
};

export default useRouterPrompt;
