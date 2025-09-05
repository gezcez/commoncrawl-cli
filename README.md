# @gezcez/commoncrawl-cli

simple cli tool for commoncrawl.org

### INSTALL
NPM:
```console
npm i -g @gezcez/commoncrawl-cli
```
BUN:
```console
bun i -g @gezcez/commoncrawl-cli
```
### USAGE

```bash
commoncrawl-cli -V, --version # Check version
commoncrawl-cli -H, --help # list commands
commoncrawl-cli -t, --term <search url> # Search term to use
commoncrawl-cli -o, --output <output file> # Output file to save results
commoncrawl-cli -s, --skip <number> # skip crawl indexes
commoncrawl-cli -r, --reverse # if set, it'll fetch indexes from past to present
```
### EXAMPLES
save list of every subdomain under `gezcez.com` to file named `gezcez-urls.txt`, start from older indexes and skip the first 3
```bash
commoncrawl-cli -t *.gezcez.com -o gezcez-urls.txt -s 3 -r
```