## v0.0.11

- Counts not showing up on a new unsaved file - `Fixed`
- More durable JSON - gets selected JSON object size or Array length even if it contains any script variables
- If the we select one single tag then it shows number of child elements. If we select multiple tags it shows number of selected tags.

## v0.0.10

- support to count selected HTML tag children - For now its count for tags that are selected under `<body>` tag.

## v0.0.9

- removed `data-size-count.statusBar.itemSeperator`
- renamed `data-size-count.statusBar.countsformat` to `data-size-count.statusBar.selectionCountFormat`
- added `data-size-count.statusBar.dataCountFormat`

## v0.0.8

Added Custom Display Format and some additional statusbar settings

- `data-size-count.statusBar.position` - Set Custom Statusbar position.
- `data-size-count.statusBar.priority` - The priority of the statusbar. Higher value means the statusbar should be shown more to the left.
- `data-size-count.statusBar.fileSizeformat` - You can use these variables to custom display format: \${fileSize}.
- `data-size-count.statusBar.countsformat` - You can use these variables to custom display format: \${linesCount} \${wordsCount} \${dataCount} \${dataCountWithBrackets}.
- `data-size-count.statusBar.visibility` - Show/Hide File Size or Selection Count details in statusbar.
- `data-size-count.statusBar.itemSeperator` - Separator between File Size and Selection Counts in statusbar. The default value is 2 blank spaces.

Fixes

- lines count is incorrect when using multi cursor selection - `Fixed`

## v0.0.7

- Changed Details format to `FileSize LinesCount : WordsCount : DataCount`

## v0.0.6

- updated repo url
- Added File Size in status bar
- Added icons to statusbar details

## v0.0.5

- handled malformedJSON selection

## v0.0.4

- bug fix.

## v0.0.3

- code optimized to backward compatible. now available from vs code v1.30

## v0.0.2

- updated MIT `LICENSE`

## v0.0.1

- Initial release
