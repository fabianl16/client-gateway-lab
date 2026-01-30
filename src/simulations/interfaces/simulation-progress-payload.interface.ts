import { JobStatus } from "src/common/constants";
import { UUID } from "src/common/types";

export interface SimulationProgressPayload {
    job_id:    UUID;
    status:   JobStatus;
    progress: number;
    url: string;
}
