import { useState } from 'react';

import { smoothScrollTo } from '../utils/scroll';

export const useScrollToSection = (sections) => {
  const [activeSection, setActiveSection] = useState(
    sections.length > 0 ? sections[0].id : ''
  );

  const scrollToSection = (id) => {
    const section = sections.find((s) => s.id === id);
    if (section && section.ref.current) {
      const headerOffset = 70;
      const elementPosition = section.ref.current?.getBoundingClientRect().top;
      if (elementPosition === undefined) {
        return;
      }
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      smoothScrollTo(offsetPosition);
      setActiveSection(id);
    }
  };

  return { scrollToSection, activeSection, setActiveSection };
};
