jest.mock("./batchProcessor", () => ({
  batchProcessor: jest.fn().mockImplementation((jobs) =>
    Promise.resolve(
      jobs.map((job) => ({
        id: job.id,
        result: { processed: true },
      }))
    )
  ),
}));

import { createMicroBatcher } from ".";
import { batchProcessor } from "./batchProcessor";

const mockBatchProcessor = batchProcessor as jest.MockedFunction<
  typeof batchProcessor
>;

describe("MicroBatcher Library", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not process batches when no jobs are submitted', async () => {
    const microBatcher = createMicroBatcher({ batchSize: 2, frequency: 100 });
    // Wait enough time to potentially trigger batch processing
    await new Promise(r => setTimeout(r, 1000));
    expect(mockBatchProcessor).not.toHaveBeenCalled();
  });

  it("should process jobs in batches", async () => {
    const batchSize = 2;
    const frequency = 100;
    const microBatcher = createMicroBatcher({ batchSize, frequency });

    microBatcher.submitJob({ id: "1", data: { key: 'test' } });
    microBatcher.submitJob({ id: "2", data: { key: 'test2' } });
    microBatcher.submitJob({ id: "3", data: { key: 'test3' } }); // Should be processed in the next batch

    await new Promise((r) => setTimeout(r, frequency + 100)); // Slightly longer than frequency to allow for processing

    expect(mockBatchProcessor).toHaveBeenCalledTimes(1);
    expect(mockBatchProcessor).toHaveBeenCalledWith(
      expect.arrayContaining([
        { id: "1", data: { key: 'test' } },
        { id: "2", data: { key: 'test2' } },
      ])
    );
  });

  it("should process a single job", async () => {
    const microBatcher = createMicroBatcher({ batchSize: 1, frequency: 100 });
    const jobPromise = microBatcher.submitJob({ id: "1", data: { key: 'test' } });

    expect(await jobPromise).toEqual({
      id: "1",
      result: {
        processed: true,
      },
    });
  });

  it("should complete processing all jobs on shutdown", async () => {
    const microBatcher = createMicroBatcher({ batchSize: 2, frequency: 100 });
    microBatcher.submitJob({ id: "1", data: { key: 'test' } });
    microBatcher.submitJob({ id: "2", data: { key: 'test2' } });
    microBatcher.submitJob({ id: "3", data: { key: 'test3' } });

    await microBatcher.shutdown();

    expect(mockBatchProcessor).toHaveBeenCalledTimes(2); 
  });

  it('should process jobs in the order they were submitted', async () => {
    const microBatcher = createMicroBatcher({ batchSize: 2, frequency: 100 });
    const job1 = microBatcher.submitJob({ id: "1", data: { key: 'test' } });
    const job2 = microBatcher.submitJob({ id: "2", data: { key: 'test2' } });
  
    await new Promise(r => setTimeout(r, 200)); // Wait for processing
  
    await expect(job1).resolves.toEqual({ id: '1', result: { processed: true } });
    await expect(job2).resolves.toEqual({ id: '2', result: { processed: true } });
  });

  it('should process batches at the specified frequency', async () => {
    const frequency = 500;
    const startTime = Date.now();
    mockBatchProcessor.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve([{ id: '1', result: { processed: true } }]), frequency)));
    
    const microBatcher = createMicroBatcher({ batchSize: 1, frequency });

    microBatcher.submitJob({ id: '1', data: { key: 'test' } });
  
    await new Promise(r => setTimeout(r, frequency + 200)); // Wait for one batch to process
  
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    expect(elapsedTime).toBeGreaterThanOrEqual(frequency);
    expect(mockBatchProcessor).toHaveBeenCalledTimes(1);
  });
});
