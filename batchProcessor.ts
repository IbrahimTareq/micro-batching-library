export const batchProcessor = (jobs: Array<any>): Promise<any[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate processing each job and generating a result
            const results = jobs.map((job) => ({
                id: job.id,
                result: {
                    processed: true
                }
            }));
            resolve(results);
        }, 500); // Simulate a processing delay of 500ms
    });
}