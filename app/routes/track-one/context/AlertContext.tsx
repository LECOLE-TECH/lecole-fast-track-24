import { type ReactElement, useState, useContext, createContext } from "react";
import type { Alert } from "~/lib/types";
import uuid from 'react-uuid';


interface AlertContextType {
  alertArr: Alert[];
  addAlert: (status: "success" | "error" | "info", msg: string) => void;
}

const alertContext = createContext<AlertContextType | undefined>(undefined);

const AlertContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const [alertArr, setAlertArr] = useState<Alert[]>([]);

  const addAlert = (status: "success" | "error" | "info", msg: string) => {
    const newAlert: Alert = { status, msg, alertId: uuid() };

    setAlertArr((prevAlerts) => [...prevAlerts, newAlert]);

    setTimeout(() => {
      setAlertArr((prevAlerts) => prevAlerts.filter((alert) => alert.alertId !== newAlert.alertId));
    }, 4000);
  };

  return <alertContext.Provider value={{ alertArr, addAlert }}>{children}</alertContext.Provider>;
};

const useAlertContext = () => {
  const context = useContext(alertContext);

  if (!context) {
    throw new Error("useAlertContext must be used within an AlertContextProvider");
  }

  return context;
};

export { AlertContextProvider, useAlertContext };