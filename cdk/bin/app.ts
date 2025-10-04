import * as cdk from "aws-cdk-lib"
import { SentinelStack } from "../lib/stack.ts"

const app = new cdk.App()
new SentinelStack(app, "SentinelStack")