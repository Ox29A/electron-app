/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState, useContext } from "react";

interface SelectedAgents {
  [mapUUID: string]: string;
}

interface AgentContextProps {
  selectedAgents: SelectedAgents;
  setSelectedAgent: (mapUUID: string, agentName: string) => void;
  removeSelectedAgent: (mapUUID: string) => void;
  getSelectedAgent: (mapUUID: string) => string | undefined;
}

const AgentContext = createContext<AgentContextProps>({
  selectedAgents: {},
  setSelectedAgent: () => {},
  removeSelectedAgent: () => {},
  getSelectedAgent: () => undefined,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAgentContext = () => useContext(AgentContext);

export type AgentProviderProps = {
  children: React.ReactNode;
};

export const AgentProvider = ({ children }: AgentProviderProps) => {
  const [selectedAgents, setSelectedAgents] = useState<SelectedAgents>({});

  const setSelectedAgent = (mapUUID: string, agentName: string) => {
    console.log('setSelectedAgent', mapUUID, agentName);
    setSelectedAgents((prevSelectedAgents) => ({
      ...prevSelectedAgents,
      [mapUUID]: agentName,
    }));

    console.log(selectedAgents);
  };

  const removeSelectedAgent = (mapUUID: string) => {
    setSelectedAgents((prevSelectedAgents) => {
      const updatedSelectedAgents = { ...prevSelectedAgents };
      delete updatedSelectedAgents[mapUUID];
      return updatedSelectedAgents;
    });

    console.log(selectedAgents);
  };

  const getSelectedAgent = (mapUUID: string) => {
    console.log(selectedAgents, mapUUID);
    return selectedAgents[mapUUID];
  };

  const value: AgentContextProps = {
    selectedAgents,
    setSelectedAgent,
    removeSelectedAgent,
    getSelectedAgent,
  };

  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  );
};
