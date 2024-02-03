type Job = {
  id: string;
  data: string;
};

type JobResult = {
  id: string;
  result: Record<string, any>;
};

export const createMicroBatcher = (batchSize: number, frequency: number) => {
  let jobQueue: Job[] = [];
  let resultResolvers: Map<string, (result: JobResult) => void> = new Map();

  const processJobs = async () => {
    if (jobQueue.length === 0) return;

    const batch = jobQueue.splice(0, batchSize);
  };

  const interval = setInterval(processJobs, frequency);

  function submitJob(job: Job): Promise<JobResult> {
    jobQueue.push(job);
    return new Promise((resolve) => {
      resultResolvers.set(job.id, resolve);
    });
  }

  async function shutdown() {
    clearInterval(interval); 
    await processJobs(); 
    while (jobQueue.length > 0) {
      await processJobs(); 
    }
  }

  return { submitJob, shutdown };
}
