import "./App.css";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
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
  const [config, setConfig] = useState<{ [key: string]: string }>({}); // { mapId: agentId }

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

  // load config from json
  useEffect(() => {
    // read config from json
    fetch("/config.json")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        console.log("config", data);
      });
  }, []);

  return (
    <>
      <div className={"container mx-auto py-5"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {maps.map((map) => (
            <Card key={map.uuid}>
              <CardHeader className={"flex justify-between items-center"}>
                <CardTitle>{map.displayName}</CardTitle>
                <img src={map.splash} alt={map.displayName} />
              </CardHeader>

              <CardContent className={"flex justify-between items-center"}>
                <Select
                  onValueChange={(value) => {
                    setConfig({ ...config, [map.uuid]: value });
                  }}
                  value={config[map.uuid]}
                >
                  <SelectTrigger>
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

              <CardFooter>
                <CardDescription>{map.coordinates}</CardDescription>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center items-center mt-5">
          <Button
            variant="outline"
            className={"mr-2"}
            onClick={() => {
              // sendMessage();
            }}
          >
            <Save className={"w-6 h-6 mr-2"} />
            <span className={"text-sm font-semibold"}>Save</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              fetch("/config.json")
                .then((res) => res.json())
                .then((data) => {
                  setConfig(data);
                });
            }}
          >
            Load
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
