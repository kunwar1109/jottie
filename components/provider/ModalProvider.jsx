"use client";

import { useEffect, useState } from "react";
import { SettingsModal } from "../modals/SettingsModal";

export const ModalProvider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <SettingsModal />
    </>
  );
};
