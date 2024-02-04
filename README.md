# Micro Batcher

This is a micro batching library that has been created with the following requirements in mind:

- allows the caller to submit a single Job, which returns a JobResult 
- accepts Jobs in batches using a BatchProcessor which is implemented as a separate dependency
- allows configuration of the batching behaviour via size and frequency 
- exposes a shutdown method which exits the batching operation after all previously accepted jobs are processed

## Technical notes

There are 3 files that exist as part of this library - `index.ts`, `batchProcessor.ts` and `types.ts`. 

### `index.ts`

This is where the core logic lives. There are two functions that are exposed from here - `submitJob` and `shutdown`. The first one is responsible for adding individual jobs to the batch eg: `microBatcher.submitJob({ id: "1", data: { key: 'test' } })`. The second one is used to exit the processing gracefully ensuring that all previous jobs are first processed eg: `microBatcher.shutdown()`.

### `batchProcessor.ts`

This is a mock batch processor that is used as a dependency in the above file. It takes in a batch of jobs, processes them and outputs the result. A `500ms` delay is added to simulate real-life processing delays.

### `types.ts`

This file contains the `Job` and `JobResult` types that is used across both the files above.

## Prerequisites

You will need to install the following packages to be able to run this library:
- npx - https://www.npmjs.com/package/npx
- tsx - https://www.npmjs.com/package/tsx

## How to

The first step is to initialise the micro batcher by passing in the batch size and the frequency in milliseconds eg: `createMicroBatcher({ batchSize: 2, frequency: 3000 })`. Next, you'll need to submit a job to the micro batcher eg: `microBatcher.submitJob({ id: "1", data: { key: 'test' } })`. You can submit as many jobs as you like and the micro batcher will periodically process jobs in batches based on the configuration. Finally, you can call the shutdown function to end the processing eg: `microBatcher.shutdown()`. All the aforementioned steps are included in the example below:

```
const microBatcher = createMicroBatcher({ batchSize: 2, frequency: 3000 });

(async () => {
	const jobResults = await Promise.all([
	microBatcher.submitJob({ id: "1", data: { key: 'test' } }),
	microBatcher.submitJob({ id: "2", data: { key: 'test2' } }),
	microBatcher.submitJob({ id: "3", data: { key: 'test3' } }),
	microBatcher.submitJob({ id: "4", data: { key: 'test4' } }),
	microBatcher.submitJob({ id: "5", data: { key: 'test5' } }),
	microBatcher.submitJob({ id: "6", data: { key: 'test6' } }),
]);

console.log("Final result: ", jobResults); 
await microBatcher.shutdown(); 
})();
```

The above code has been added to [`demo/index.ts`](demo/index.ts). You can run it via the following the command - `yarn demo`.