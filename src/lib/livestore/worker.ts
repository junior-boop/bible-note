import { schema } from "./schema";
import { makeWorker } from "@livestore/adapter-web/worker";

makeWorker({ schema });
