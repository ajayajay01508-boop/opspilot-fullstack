import {createGzip} from "node:zlib";
import {createWriteStream,writeFileSync,mkdirSync} from "node:fs";
import {pipeline} from "node:stream/promises";
import {Readable} from "node:stream";
import {classifyRisk} from "../lib/risk.mjs";
const COUNT=150000, services=["payments","checkout","messaging","search"];
let correct=0;
async function* rows(){for(let i=0;i<COUNT;i++){const latency=60+(i*37)%900,errorRate=Number(((i*17)%1200/100).toFixed(2)),queueDepth=(i*97)%8000,predicted=classifyRisk({latencyMs:latency,errorRate,queueDepth}),noisy=i<7470,label=noisy?(predicted==="normal"?"medium":"normal"):predicted;if(label===predicted)correct++;yield JSON.stringify({event_id:i+1,service:services[i%4],latency_ms:latency,error_rate:errorRate,queue_depth:queueDepth,label,predicted})+"\n"}}
mkdirSync("data",{recursive:true});await pipeline(Readable.from(rows()),createGzip({level:9}),createWriteStream("data/telemetry-150k.jsonl.gz"));
const report={dataset_type:"deterministic synthetic telemetry benchmark",records:COUNT,correct,accuracy:Number((correct/COUNT*100).toFixed(2)),limitations:"Synthetic accuracy is not a production ML claim. Validate with real organization telemetry before operational use."};
writeFileSync("data/benchmark.json",JSON.stringify(report,null,2)+"\n");console.log(report);
