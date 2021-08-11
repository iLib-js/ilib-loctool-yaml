# ilib-loctool-yaml

Ilib loctool plugin to parse and localize YAML files.

This plugin can parse and localize **.yml** files. Optionally,
schema file can be provided to configure plugin's behavior
for a given source file, such as localized file path
and name or excluded keys.

## Configuration

By default, plugin will localize source `.yml` and `.yaml` files,
e.g. `/project/en.yml`,  and write localized file
to a subfolder: `/project/resources/ru-RU/en.yml`.

The plugin will look for the `yaml` property within the `settings`
of your `project.json` file. The following settings are
used within the json property:

- mappings: a mapping between file matchers and an object that gives
  info used to localize the files that match it. This allows different
  json files within the project to be processed with different schema.
  The matchers are
  a [micromatch-style string](https://www.npmjs.com/package/micromatch),
  similar to the the `includes` and `excludes` section of a
  `project.json` file. The value of that mapping is an object that
  can contain the following properties:
  - schema: schema file to use with that matcher. See more information
    about schema files below.
  - template: a path template to use to generate the path to
    the translated output files. The template replaces strings
    in square brackets with special values, and keeps any characters
    intact that are not in square brackets. The default template,
    if not specified is "resources/[localeDir]/[filename]".
    The plugin recognizes and replaces the following strings
    in template strings:
    - [dir] the original directory where the matched source file
      came from. This is given as a directory that is relative
      to the root of the project. eg. "foo/bar/strings.json" -> "foo/bar"
    - [filename] the file name of the matching file.
      eg. "foo/bar/strings.json" -> "strings.json"
    - [basename] the basename of the matching file without any extension
      eg. "foo/bar/strings.json" -> "strings"
    - [extension] the extension part of the file name of the source file.
      etc. "foo/bar/strings.json" -> "json"
    - [locale] the full BCP-47 locale specification for the target locale
      eg. "zh-Hans-CN" -> "zh-Hans-CN"
    - [language] the language portion of the full locale
      eg. "zh-Hans-CN" -> "zh"
    - [script] the script portion of the full locale
      eg. "zh-Hans-CN" -> "Hans"
    - [region] the region portion of the full locale
      eg. "zh-Hans-CN" -> "CN"
    - [localeDir] the full locale where each portion of the locale
      is a directory in this order: [langage], [script], [region].
      eg, "zh-Hans-CN" -> "zh/Hans/CN", but "en" -> "en".
    - [localeUnder] the full BCP-47 locale specification, but using
      underscores to separate the locale parts instead of dashes.
      eg. "zh-Hans-CN" -> "zh_Hans_CN"

Example configuration:
```json
{
  "settings": {
    "yaml": {
      "mappings": {
        "**/source.yml": {
          "template": "resources/[localeDir]/source.yaml"
        },
        "src/**/strings.yaml": {
          "schema": "strings-schema.json",
          "template": "[dir]/strings.[locale].yaml"
        }
      }
    }
  }
}
```

In the above example, any file named `souce.yml` will be parsed.
The output files are saved to the `resources` directory.

Also files named `strings.yaml` that are located in directory `src`
or any of its subdirectories will be parsed using configuration from
`string-schema.json`

## Schema file

Schema file is a `.json` file that alternates default behavior of
yaml parser. In the schema file the following configration options
may be provided:

- `excluded_keys` - an array of keys that must be excluded from a
  ResultSet of the parsing. It only allows the direct key exclusion, i.e.
  a sequence of keys can not be used.
- `comment_prefix` - a string that defines prefix for context comment for
  translators. Only comments that start with the provided string will
  be extracted and added to ResultSet, all other are ignored.

Example of schema file:
```json
{
  "excluded_keys": [
    "testKey",
    "anotherExcludedKey"
  ],
  
  "comment_prefix": "L10N:" 
}
```

## Providing context comments

The plugin automatically parses yaml comments and assigns them
to corresponding strings as context comments.

A context comment must be placed above the source string.
It's also possible to use multiline comments.

**Same line comments are ignored!**

```yaml
header_text: "Header" #ignored comment
# Comment for article_title.
article_title: "Article:"
# Comment for article_summary,
# it includes view count and edit count values.
article_summary: "Stats: {view_count} views, {edit_count} edits"
```

Comments are trimmed upon extraction, therefore there's no
difference between these two comments.
```yaml
#comment
first: "first"
#     comment <some extra space chars here>
second: "second"
```

Multiline comments will preserve line breaks as well as spaces
on a new line (only space chars at the beginning of the
first line and at the end of the last is trimmed):

```yaml
#    Multiline comment
#    with some extra spaces in between <some extra space chars here>
```
would be parsed as
`Multiline comment\n    with some extra spaces in between`

## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.3.0
- Add support for mappings in yaml config that allows custom output
file naming and use of schema per-mapping
- Add `comment_prefix` key to the schema that allows to specify prefix
for context comments that are extracted along with source strings

### v1.2.0
- Add support of yaml comments that enables providing context
comments for translators

### v1.1.1

- Fix a bug where the pseudo locales were not initialized properly.
  This fix gets the right set of locales from the project settings to
  see if any of them are pseudo locales.


