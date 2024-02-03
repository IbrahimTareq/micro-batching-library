import { batchProcessor } from "./batchProcessor";
import { Job, JobResult } from "./types";

export const microBatcher = ({
  batchSize,
  frequency,
}: {
  batchSize: number;
  frequency: number;
}) => {
  let jobQueue: Job[] = [];
  let resultResolvers: Map<string, (result: JobResult) => void> = new Map();

  const processJobs = async () => {
    if (jobQueue.length === 0) return;

    const batch = jobQueue.splice(0, batchSize);
    const results = await batchProcessor(batch);
    results.forEach((result) => {
      resultResolvers.get(result.id)?.(result);
      resultResolvers.delete(result.id);
    });
  };

  const interval = setInterval(processJobs, frequency);

  const submitJob = (job: Job): Promise<JobResult> => {
    jobQueue.push(job);
    return new Promise((resolve) => {
      resultResolvers.set(job.id, resolve);
    });
  }

  const shutdown = async () => {
    clearInterval(interval); // Stop the scheduled job processing
    await processJobs(); // Process remaining jobs
    while (jobQueue.length > 0) {
      await processJobs(); // Ensure all jobs are processed
    }
  }

  return { submitJob, shutdown };
};
