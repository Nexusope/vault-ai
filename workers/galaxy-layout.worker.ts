import type { Idea } from "../lib/data";
import { buildGalaxyGraph } from "../lib/galaxy";

type WorkerScope = {
  onmessage: ((event: MessageEvent<Idea[]>) => void) | null;
  postMessage: (value: ReturnType<typeof buildGalaxyGraph>) => void;
};

const workerScope = self as unknown as WorkerScope;
workerScope.onmessage = (event) => workerScope.postMessage(buildGalaxyGraph(event.data));
