import "./App.css";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
} from "./components/ui/card.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select.tsx";
import { Map } from "./models/map.ts";
import { Agent } from "./models/agent.ts";
import { Button } from "./components/ui/button.tsx";
import { Save } from "lucide-react";

function App() {
  const [maps, setMaps] = useState<Map[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [localStorageConfig, setLocalStorageConfig] = useState<{
    [key: string]: string;
  }>({}); // { mapId: agentId }

  useEffect(() => {
    const config = localStorage.getItem("config");
    if (config) {
      setLocalStorageConfig(JSON.parse(config));
    } else {
      console.log("no config found");
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("https://valorant-api.com/v1/maps"),
      fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true"),
    ])
      .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
      .then(([data1, data2]) => {
        setMaps(data1.data);
        setAgents(data2.data);
      });
  }, []);

  return (
    <>
      <div className={"container mx-auto py-5"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {maps.map((map) => (
            <Card key={map.uuid}>
              <CardContent className={"flex justify-between items-center p-5"}>
                <CardTitle className={"w-full"}>{map.displayName}</CardTitle>
                <Select
                  onValueChange={(value) => {
                    setLocalStorageConfig({
                      ...localStorageConfig,
                      [map.uuid]: value,
                    });
                  }}
                  value={localStorageConfig[map.uuid]}
                >
                  <SelectTrigger
                    className={"flex items-center justify-between"}
                  >
                    <SelectValue placeholder="Select an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.uuid} value={agent.displayName}>
                        <div className="flex items-center">
                          <img
                            src={agent.displayIcon}
                            alt={agent.displayName}
                            className="w-6 h-6 mr-2"
                          />
                          <span>{agent.displayName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>

              {/*<CardFooter>*/}
              {/*  <CardDescription>{map.coordinates}</CardDescription>*/}
              {/*</CardFooter>*/}
            </Card>
          ))}
        </div>

        <div className="flex justify-center items-center mt-5">
          <Button
            variant="outline"
            className={"mr-2"}
            onClick={() => {
              localStorage.setItem(
                "config",
                JSON.stringify(localStorageConfig),
              );
            }}
          >
            <Save className={"w-6 h-6 mr-2"} />
            <span className={"text-sm font-semibold"}>Save</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              console.log("Load local storage");
            }}
          >
            Load
          </Button>
          <Button
            variant="outline"
            className={"ml-2"}
            onClick={() => {
              setLocalStorageConfig({});
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
