export const batchProcessor = (jobs: Array<any>): Promise<any[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const results = jobs.map((job) => ({
                id: job.id,
                result: {
                    processed: true
                }
            }));
            resolve(results);
        }, 500);
    });
}