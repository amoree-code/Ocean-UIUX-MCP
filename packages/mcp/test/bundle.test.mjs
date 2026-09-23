import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { test } from "node:test"

import { PLACEHOLDER } from "../src/registry.mjs"

const dir = path.resolve(import.meta.dirname, "../registry")
const index = JSON.parse(fs.readFileSync(path.join(dir, "registry.json"), "utf8"))

test("every item file exists and ships content", () => {
  assert.ok(index.items.length >= 80, `expected >= 80 items, got ${index.items.length}`)
  for (const { name } of index.items) {
    const item = JSON.parse(fs.readFileSync(path.join(dir, `${name}.json`), "utf8"))
    assert.ok(item.files.length, `${name}: no files`)
    for (const f of item.files) assert.ok(f.content?.length, `${name}: empty ${f.path}`)
  }
})

test("registry dependencies are placeholders that resolve inside the bundle", () => {
  for (const { name } of index.items) {
    const item = JSON.parse(fs.readFileSync(path.join(dir, `${name}.json`), "utf8"))
    for (const dep of item.registryDependencies ?? []) {
      assert.ok(dep.startsWith(`${PLACEHOLDER}/`), `${name}: dependency not relocatable: ${dep}`)
      const file = dep.slice(PLACEHOLDER.length + 1)
      assert.ok(fs.existsSync(path.join(dir, file)), `${name}: dependency ${file} missing from bundle`)
    }
  }
})

test("no machine-specific paths leak into the bundle", () => {
  for (const f of fs.readdirSync(dir)) {
    const src = fs.readFileSync(path.join(dir, f), "utf8")
    assert.doesNotMatch(src, /\/Users\/|\/home\/[a-z]|C:\\\\Users/, `${f} contains an absolute user path`)
  }
})

test("every catalog component has a description and a usage example", () => {
  const previews = path.resolve(import.meta.dirname, "../previews")
  for (const item of index.items.filter((i) => i.categories?.length)) {
    assert.ok(item.description, `${item.name}: no description`)
    for (const slug of item.meta?.examples ?? []) {
      assert.ok(fs.existsSync(path.join(previews, `${slug}.tsx`)), `${item.name}: missing example ${slug}`)
    }
  }
})
