import fs from "node:fs/promises";
import { cwd } from "node:process";
import path from "node:path";
import assert from "node:assert";

import sortPackageJson from "sort-package-json";

const content = await fs.readFile(path.join(cwd(), "./package.json"));
const json = JSON.parse(content);

const rules = [
  async function log(json) {
    console.log(json);
  },
  async function metadata(json) {
    assert.ok(json.name, "Expected a name");
    assert.ok(json.version, "Expected a version");
    assert.ok(json.keywords, "Expected keywords");
    assert.notDeepStrictEqual(json.keywords, [], "Expected keywords");
    assert.ok(json.description, "Expected a description");
    assert.equal(json.author, "Kristján Oddsson <hi@koddsson.com>");
  },
  async function tooling(json) {
    assert.ok(json.scripts, "expected scripts");
    assert.ok(json.scripts.start, "Expected a start script");
    assert.ok(json.scripts.test, "Expected a test script");
    assert.ok(json.scripts.build, "Expected a build script");

    assert.equal(
      json.prettier,
      "@koddsson/prettier-config",
      `Expected prettier key to be set to '@koddsson/prettier-config' and not '${json.prettier}'`
    );
  },
  async function (json) {
    assert.equal(
      json.license,
      "MIT",
      `Expected license to be 'MIT' and not '${json.license}'`
    );
  },
  async function (json) {
    assert.deepStrictEqual(
      JSON.stringify(json),
      sortPackageJson(JSON.stringify(json)),
      `Expected package.json to be correctly sorted.`
    );
  },
];

const violations = await Promise.allSettled(rules.map((rule) => rule(json)));

console.log(
  violations
    .map((x) => x.reason?.message)
    .filter(Boolean)
    .join("\n")
);
