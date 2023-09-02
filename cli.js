#!/usr/bin/env node

import fs from "node:fs/promises";
import { cwd } from "node:process";
import path from "node:path";
import { env, exit } from "node:process";

import { validatePackageJson } from "./sort-package-json";

const DEBUG = !!env.DEBUG;

if (DEBUG) {
  console.log(cwd());
  console.log(path.join(cwd(), "package.json"));
  console.log("---");
}

const content = await fs.readFile(path.join(cwd(), "package.json"));
const json = JSON.parse(content);

const violations = await validatePackageJson(json);
const errors = violations.map((x) => x.reason?.message).filter(Boolean);

if (errors.length) {
  console.error(errors.join("\n"));
  exit(1);
}
