import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const NavigationContext = createContext(null);

function currentPath() {
  return window.location.pathname;
}

export function NavigationProvider({ children }) {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    function handlePopState() {
      setPath(currentPath());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(nextPath, { replace = false } = {}) {
    if (nextPath === currentPath()) {
      return;
    }

    if (replace) {
      window.history.replaceState({}, "", nextPath);
    } else {
      window.history.pushState({}, "", nextPath);
    }

    setPath(nextPath);
  }

  const value = useMemo(() => ({ path, navigate }), [path]);

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }

  return context;
}
