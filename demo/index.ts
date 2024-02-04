import { microBatcher as createMicroBatcher } from "../src";

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