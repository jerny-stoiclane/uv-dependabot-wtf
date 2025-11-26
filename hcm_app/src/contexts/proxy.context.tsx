import React, { useEffect, useState } from 'react';

import ProxyBlockModal from '../components/common/ProxyBlockModal';

interface ProxyBlockProviderProps {
  children: React.ReactNode;
}

const ProxyBlockProvider: React.FC<ProxyBlockProviderProps> = ({
  children,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'POST' | 'DELETE' | undefined>();

  useEffect(() => {
    const handleProxyBlock = (event: CustomEvent) => {
      setActionType(event.detail.actionType);
      setModalOpen(true);
    };

    // Listen for proxy block events
    window.addEventListener('proxyBlock', handleProxyBlock as EventListener);

    return () => {
      window.removeEventListener(
        'proxyBlock',
        handleProxyBlock as EventListener
      );
    };
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    setActionType(undefined);
  };

  return (
    <>
      {children}
      <ProxyBlockModal
        open={modalOpen}
        onClose={handleCloseModal}
        actionType={actionType || undefined}
      />
    </>
  );
};

export default ProxyBlockProvider;
