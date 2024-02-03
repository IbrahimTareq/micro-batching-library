# Micro Batcher

This is a micro batching library that has been created with the following requirements in mind:

● allows the caller to submit a single Job, which returns a JobResult 
● accepts Jobs in batches using a BatchProcessor which is implemented as a separate dependency
● allows configuration of the batching behaviour via size and frequency 
● exposes a shutdown method which exits the batching operation after all previously accepted jobs are processed

## Prerequisites

You will need to install the following packages to be able to run this library:
- npx - https://www.npmjs.com/package/npx
- tsx - https://www.npmjs.com/package/tsx