import path from "path";
import assert from "assert";
import { parseFile } from "../src/parser";

describe("parseFile: python", function () {
  it("should success", async function () {
    const chunks = await parseFile("./tests/data/python.py");
    assert.equal(chunks.length, 2);
    assert.match(chunks[0].code, /def fib.*/);
    assert.match(chunks[1].code, /class Foo.*/);
  });
});

describe("parseFile: typescript", function () {
  it("should success", async function () {
    const chunks = await parseFile("./tests/data/typescript.ts");
    assert.equal(chunks.length, 2);
    assert.match(chunks[0].code, /function logWithDividing.*/);
    assert.match(chunks[1].code, /class Greeter.*/);
  });
});

describe("parseFile: tsx", function () {
  it("should success", async function () {
    const chunks = await parseFile("./tests/data/tsx.tsx");
    assert.equal(chunks.length, 2);
    assert.match(chunks[0].code, /function BarComponent.*/);
    assert.match(chunks[1].code, /class ContainerComponent.*/);
  });
});

describe("parseFile: java", function () {
  it("should success", async function () {
    const chunks = await parseFile("./tests/data/java.java");
    assert.equal(chunks.length, 1);
    assert.match(chunks[0].code, /public class Greeter.*/);
  });
});

describe("parseFile: kotlin", function () {
  it("should success", async function () {
    const chunks = await parseFile("./tests/data/kotlin.kt");
    assert.equal(chunks.length, 2);
    assert.match(chunks[0].code, /fun printWithSpace.*/);
    assert.match(chunks[1].code, /class Greeter.*/);
  });
});
