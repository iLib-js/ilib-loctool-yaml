/*
 * testYamlFileType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016-2017, HealthTap, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (!YamlFileType) {
    var YamlFileType = require("../YamlFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var path = require("path");

var p = new CustomProject({
    sourceLocale: "en-US",
    plugins: [
        path.join(process.cwd(), "YamlFileType")
    ]
}, "./test/testfiles", {
    locales:["en-GB"],
    yaml: {
        mappings: {
            "foo.yml": {
                template: "resources/[locale]/foo.yml"
            },
            "**/strings.yaml": {
                template: "[dir]/strings.[locale].yaml"
            },
            "**/test/strings.y?(a)ml": {
                template: "[dir]/[basename]/[locale].[extension]"
            },
            "**/*.y?(a)ml": {
                template: "resources/[locale]/[filename]"
            }
        }
    }
});

var p2 = new CustomProject({
    sourceLocale: "en-US",
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./test/testfiles", {
    locales:["en-GB"],
    flavors: ["ASDF"]
});

module.exports.yamlfiletype = {
    testYamlFileTypeConstructor: function(test) {
        test.expect(1);

        var yft = new YamlFileType(p);

        test.ok(yft);

        test.done();
    },

    testYamlFileTypeHandlesYml: function(test) {
        test.expect(2);

        var yft = new YamlFileType(p);
        test.ok(yft);

        test.ok(yft.handles("foo.yml"));

        test.done();
    },

    testYamlFileTypeHandlesYaml: function(test) {
        test.expect(2);

        var yft = new YamlFileType(p);
        test.ok(yft);

        test.ok(yft.handles("foo.yaml"));

        test.done();
    },

    testYamlFileTypeHandlesAnythingFalse: function(test) {
        test.expect(4);

        var yft = new YamlFileType(p);
        test.ok(yft);

        test.ok(!yft.handles("foo.tmpl.html"));
        test.ok(!yft.handles("foo.html.haml"));
        test.ok(!yft.handles("foo.js"));

        test.done();
    },

    testYamlFileTypeHandlesNoResourceFiles: function(test) {
        test.expect(2);

        var yft = new YamlFileType(p);
        test.ok(yft);

        test.ok(!yft.handles("resources/ru-RU/foo.yml"));

        test.done();
    },

    testYamlFileTypeHandlesSourceLocaleFilesInSubfolders: function(test) {
        test.expect(2);

        var yft = new YamlFileType(p);
        test.ok(yft);

        test.ok(yft.handles("subfolder/strings.en-US.yaml"));

        test.done();
    },

    testYamlFileTypeHandlesNoLocalizedFilesInSubfolders: function(test) {
        test.expect(2);

        var yft = new YamlFileType(p);
        test.ok(yft);

        test.ok(!yft.handles("subfolder/strings.ru-RU.yaml"));

        test.done();
    },

    testYamlFileTypeHandlesFilesNamedForALocale: function(test) {
        test.expect(4);

        var yft = new YamlFileType(p);
        test.ok(yft);

        test.ok(yft.handles("en-US.yml"));
        test.ok(yft.handles("de-DE.yml"));
        test.ok(yft.handles("en.yml"));

        test.done();
    },

    testYamlFileTypeHandlesResourceFilesInSubdirs: function(test) {
        test.expect(2);

        var yft = new YamlFileType(p);
        test.ok(yft);

        test.ok(yft.handles("resources/ru-RU/subdir/foo.yml"));

        test.done();
    },

    testYamlFileTypeHandlesBasenameDirMapping: function(test) {
        test.expect(3);

        var yft = new YamlFileType(p);
        test.ok(yft);

        test.ok(yft.handles("test/strings.yaml"));
        test.ok(!yft.handles("test/strings/ru-RU.yaml"));

        test.done();
    }
};
