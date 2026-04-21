"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) setCompareList([]);
  }, [session]);

  const addToCompare = (property) => {
    if (!session) return;
    if (compareList.length >= 4) {
      alert("You can compare up to 4 properties at a time.");
      return;
    }
    if (compareList.find((p) => (p.id || p._id) === (property.id || property._id))) return;
    setCompareList([...compareList, property]);
  };

  const removeFromCompare = (property) => {
    setCompareList(compareList.filter(
      (p) => (p.id || p._id) !== (property.id || property._id)
    ));
  };

  const clearCompare = () => setCompareList([]);

  const isInCompare = (property) =>
    !!compareList.find((p) => (p.id || p._id) === (property.id || property._id));

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
