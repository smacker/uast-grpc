<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [protoToMap][1]
    -   [Parameters][2]
-   [roleToString][3]
    -   [Parameters][4]
-   [Client][5]
    -   [Parameters][6]
    -   [parse][7]
        -   [Parameters][8]
    -   [version][9]
-   [initLibuast][10]
    -   [Parameters][11]
-   [Libuast][12]
    -   [isInitialized][13]
    -   [filter][14]
        -   [Parameters][15]

## protoToMap

Creates mapping to each node in the tree with unique id.

### Parameters

-   `uast` **pb.Node** uast tree.

Returns **[object][16]&lt;[number][17], pb.Node>** object with keys as unique ids starting with 0 and values are pointers to nodes.

## roleToString

Returns TitleCaseName of a role.

### Parameters

-   `roleId` **[number][17]** role number identifier

## Client

Create a gRPC client.

### Parameters

-   `addr` **[string][18]** web gRPC address.

### parse

Queries the Babelfish server and receives the UAST response for the specified file.

#### Parameters

-   `code` **[string][18]** input source code
-   `filename` **[string][18]?** name of the parsing file
-   `language` **[string][18]?** language name

Returns **pb.ParseResponse** 

### version

Queries the Babelfish server for version and runtime information.

Returns **pb.VersionResponse** 

## initLibuast

Creates new instance of libuast.

### Parameters

-   `options` **[object][16]?** Emscripten Module [creation attributes][19]

Returns **[Libuast][20]** instance of the library

## Libuast

some desc

### isInitialized

Returns status of the library.

Returns **[Promise][21]** Promise is resolved when WASM is initialized or rejected in case of error.

### filter

Filters UAST tree using xpath query.

#### Parameters

-   `id` **[string][18]** Root node id.
-   `mapping` **[Object][16]&lt;[number][17], pb.Node>** UAST tree mapping.
-   `query` **[string][18]** xpath query.

Returns **[Array][22]&lt;[number][17]>** list of node ids that satisfy the given query.

[1]: #prototomap

[2]: #parameters

[3]: #roletostring

[4]: #parameters-1

[5]: #client

[6]: #parameters-2

[7]: #parse

[8]: #parameters-3

[9]: #version

[10]: #initlibuast

[11]: #parameters-4

[12]: #libuast

[13]: #isinitialized

[14]: #filter

[15]: #parameters-5

[16]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[17]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[18]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[19]: http://kripken.github.io/emscripten-site/docs/api_reference/module.html#affecting-execution

[20]: #libuast

[21]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[22]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array