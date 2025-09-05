#!/usr/bin/env node
import { version } from "./package.json"
import { Command } from "commander"
import { appendFile, writeFile } from "node:fs"
const program = new Command()
const URLS = {
	"list-crawls": "https://index.commoncrawl.org/collinfo.json"
}
interface ICrawlEntry {
	urlkey: string
	timestamp: string
	url: string
	mime: string
	"mime-detected": string
	status: "200" | `${number}`
	digest: string
	length: `${number}`
	offset: `${number}`
	filename: string
	languages: string
	encoding: "UTF-8" | string
}
interface ICrawlIndex {
	id: string
	name: string
	timegate: string
	"cdx-api": string
	from: string
	to: string
}
async function fetchJSON(
	input: string | URL | Request,
	init?: RequestInit
): Promise<any> {
	const result = await fetch(input, init)
	const json = (await result.json()) as any
	return json
}
program.name("@gezcez/commoncrawl-cli").description("simple cli tool for commoncrawl.org").version(version)

program
	.alias("ca")
	.command("check-all")
	.description("searches every index with the given term")
	.option("-t, --term <search url>", "Search term to use")
	.option("-o, --output <output file>", "Output file to save results")
	.option("-s, --skip <number>", "skip crawl indexes")
   .option("-r, --reverse","if set, it'll fetch indexes from past to present")
	.action(async (args: { term: string; output: string; skip: string;reverse:string }) => {
		const { term, output, skip,reverse } = args
		let skip_index = 0
		if (skip) {
			try {
				skip_index = parseInt(skip)
			} catch {
				console.error(
					`ERROR: skip index '${skip}}' is not valid, must be an integer`
				)
			}
		}
		if (!term) {
			console.error("ERROR: term is missing, use cc-cli -t <term>")
			return
		}
		if (output) {
			await writeFile(output, "", (cb) => {
				if (cb?.errno) {
					console.error(`ERROR: ${cb.message}`)
					return
				}
			})
		}
		console.log(`[CC-CLI] Searching term: ${term}`)
		console.log("[...] Fetching index")
		let start = Date.now()
		let keys = await (await __fetchCrawlIndexes())
      if (reverse) {
         keys = keys.reverse()
      }
		overwrite(`[${Date.now() - start}ms] Found ${keys.length} keys`)
		if (skip_index) {
			console.log(`[...] Skipping ${skip_index} indexes`)
		}
		console.log(`[...] Fetching results`)
		start = Date.now()
		const results = await fetchResultsFromIndexes(
			keys.slice(skip_index),
			term,
			skip_index,
			output
		)
		console.log(`[${Date.now() - start}ms] Found ${results.length} results`)
	})

async function fetchResultsFromIndexes(
	cdx_urls: string[],
	term: string,
	i: number = 0,
	outfile?: string
) {
	const results = []
	const length = cdx_urls.length
	for (const url of cdx_urls) {
		i += 1
      await sleep(5)
		const result = await __fetchCrawlKey(url, term, `${i}/${length}`,results.length)
		if (outfile) {
			await handleResultSave(result, outfile)
		}
		results.push(result)
	}
	return results.reduce((a, b) => a.concat(b), [])
}
async function __fetchCrawlKey(cdx_url: string, term: string, i: string,total_result_count:number) {
	const url = `${cdx_url}?${new URLSearchParams({ url: term, output: "json" })}`
	overwrite(`[${i}] ::${total_result_count} results:: Fetching ${url}`)
	const result = await fetch(url)
	const text = await result.text()
	if (text.startsWith("<")) {
		await sleep(5)
	}
	const jsons = text
		.split("\n")
		.map((e) => e.startsWith("{") && JSON.parse(e))
		.filter((e) => !!e) as ICrawlEntry[]
	if ((jsons.at(0) as any)?.message?.includes("No Captures")) return []
	return jsons
}
async function sleep(seconds: number) {
   const start = Date.now()
	while (start + seconds * 1000 < Date.now()) {
      // nothing
      overwrite("Sleeping", seconds, "seconds")

	}
	return true
}
async function handleResultSave(results: ICrawlEntry[], outfile: string) {
	console.log(`[...] Writing ${results.length} results`)
	await appendFile(outfile, results.map((e) => e.url).join("\n"), (cb) => {
		if (cb?.errno) {
			console.error(`ERROR: ${cb.message}`)
		}
	})
}
async function __fetchCrawlIndexes() {
	const result = (await fetchJSON(URLS["list-crawls"], {
		headers: { "User-Agent": `@gezcez/commoncrawl-cli ${version}` }
	})) as ICrawlIndex[]
	return result.map((e: any) => e["cdx-api"]) as string[]
}
async function main() {
	program.parse(process.argv)
}
function overwrite(message?: any, ...optionalParams: any[]) {
	process.stdout.write("\x1b[1A")
	process.stdout.write("\x1b[2K")
	process.stdout.write(message + "\n")
}
main()
