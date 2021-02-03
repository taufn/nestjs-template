import * as dotenv from "dotenv";

import { Env } from "../classes";

// ensure the env variables are loaded (e.g. during tests)
dotenv.config({ path: Env.getEnvFilePath() });
