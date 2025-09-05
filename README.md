# @gezcez/commoncrawler-cli

simple cli tool for commoncrawler.org

### INSTALL
NPM:
```console
npm i -g @gezcez/commoncrawler-cli
```
BUN:
```console
bun i -g @gezcez/commoncrawler-cli
```
### USAGE

```bash
commoncrawler-cli -V, --version # Check version
commoncrawler-cli -H, --help # list commands
commoncrawler-cli -t, --term <search url> # Search term to use
commoncrawler-cli -o, --output <output file> # Output file to save results
commoncrawler-cli -s, --skip <number> # skip crawl indexes
commoncrawler-cli -r, --reverse` # if set, it'll fetch indexes from past to present
```
### EXAMPLES
save list of every subdomain under `gezcez.com` to file named `gezcez-urls.txt`, start from older indexes and skip the first 3
```bash
commoncrawler-cli -t *.gezcez.com -o gezcez-urls.txt -s 3 -r
```