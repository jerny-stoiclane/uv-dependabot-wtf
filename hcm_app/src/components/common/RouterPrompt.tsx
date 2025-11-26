import React from 'react';

import useRouterPrompt from '../../hooks/useRouterPrompt';

interface RouterPromptProps {
  when: boolean;
  message: string;
}

const RouterPrompt: React.FC<RouterPromptProps> = ({ when, message }) => {
  useRouterPrompt(when, message);
  return null;
};

export default RouterPrompt;
