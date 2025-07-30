/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/plan/route";
exports.ids = ["app/api/plan/route"];
exports.modules = {

/***/ "(rsc)/./app/api/plan/route.ts":
/*!*******************************!*\
  !*** ./app/api/plan/route.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/api/server.js\");\n/* harmony import */ var _replit_database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @replit/database */ \"(rsc)/./node_modules/.pnpm/@replit+database@3.0.1/node_modules/@replit/database/dist/index.mjs\");\n\n\nconst db = new _replit_database__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\nasync function GET() {\n    try {\n        console.log('GET /api/plan - Loading plan data...');\n        const rawData = await db.get('plan');\n        console.log('Raw data from DB:', rawData);\n        if (rawData) {\n            // Handle both new format (direct object) and old format (with ok/value wrapper)\n            let parsedData;\n            if (typeof rawData === 'string') {\n                parsedData = JSON.parse(rawData);\n            } else if (rawData.ok && rawData.value) {\n                // Handle old Replit DB format\n                parsedData = typeof rawData.value === 'string' ? JSON.parse(rawData.value) : rawData.value;\n            } else {\n                parsedData = rawData;\n            }\n            console.log('Parsed data:', parsedData);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(parsedData);\n        } else {\n            console.log('No data found, returning default structure');\n            const defaultData = {\n                vision: \"\",\n                mission: \"\",\n                goals: [],\n                measures: [],\n                actions: [],\n                team: [],\n                logoUrl: \"\",\n                lastUpdated: new Date().toISOString()\n            };\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(defaultData);\n        }\n    } catch (error) {\n        console.error('GET /api/plan - Error loading plan data:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to load plan data',\n            details: error instanceof Error ? error.message : String(error)\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        console.log('POST /api/plan - Saving plan data...');\n        const planData = await request.json();\n        console.log('Received data:', planData);\n        // Handle both old format (logo, goalAreas, teamMembers) and new format (logoUrl, goals, measures, actions, team)\n        const dataToSave = {\n            vision: planData.vision || \"\",\n            mission: planData.mission || \"\",\n            goals: planData.goals || planData.goalAreas || [],\n            measures: planData.measures || [],\n            actions: planData.actions || [],\n            team: planData.team || planData.teamMembers || [],\n            logoUrl: planData.logoUrl || planData.logo || \"\",\n            lastUpdated: new Date().toISOString()\n        };\n        const stringifiedData = JSON.stringify(dataToSave);\n        console.log('Stringified data to save:', stringifiedData);\n        const result = await db.set('plan', stringifiedData);\n        console.log('Save result:', result);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            data: dataToSave\n        });\n    } catch (error) {\n        console.error('POST /api/plan - Error saving plan data:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to save plan data',\n            details: error instanceof Error ? error.message : String(error)\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFRRixNQUFNRyxPQUFPLEdBQUdDLE9BQU9KO1FBQzNELEdBQUc7WUFBRUssUUFBUTtRQUFJO0lBQ25CO0FBQ0YiLCJzb3VyY2VzIjpbIi9ob21lL3J1bm5lci93b3Jrc3BhY2UvYXBwL2FwaS9wbGFuL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJ1xuaW1wb3J0IERhdGFiYXNlIGZyb20gJ0ByZXBsaXQvZGF0YWJhc2UnXG5cbmNvbnN0IGRiID0gbmV3IERhdGFiYXNlKClcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZygnR0VUIC9hcGkvcGxhbiAtIExvYWRpbmcgcGxhbiBkYXRhLi4uJylcbiAgICBjb25zdCByYXdEYXRhID0gYXdhaXQgZGIuZ2V0KCdwbGFuJylcbiAgICBjb25zb2xlLmxvZygnUmF3IGRhdGEgZnJvbSBEQjonLCByYXdEYXRhKVxuICAgIFxuICAgIGlmIChyYXdEYXRhKSB7XG4gICAgICAvLyBIYW5kbGUgYm90aCBuZXcgZm9ybWF0IChkaXJlY3Qgb2JqZWN0KSBhbmQgb2xkIGZvcm1hdCAod2l0aCBvay92YWx1ZSB3cmFwcGVyKVxuICAgICAgbGV0IHBhcnNlZERhdGFcbiAgICAgIGlmICh0eXBlb2YgcmF3RGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcGFyc2VkRGF0YSA9IEpTT04ucGFyc2UocmF3RGF0YSlcbiAgICAgIH0gZWxzZSBpZiAocmF3RGF0YS5vayAmJiByYXdEYXRhLnZhbHVlKSB7XG4gICAgICAgIC8vIEhhbmRsZSBvbGQgUmVwbGl0IERCIGZvcm1hdFxuICAgICAgICBwYXJzZWREYXRhID0gdHlwZW9mIHJhd0RhdGEudmFsdWUgPT09ICdzdHJpbmcnID8gSlNPTi5wYXJzZShyYXdEYXRhLnZhbHVlKSA6IHJhd0RhdGEudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZERhdGEgPSByYXdEYXRhXG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZygnUGFyc2VkIGRhdGE6JywgcGFyc2VkRGF0YSlcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihwYXJzZWREYXRhKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnTm8gZGF0YSBmb3VuZCwgcmV0dXJuaW5nIGRlZmF1bHQgc3RydWN0dXJlJylcbiAgICAgIGNvbnN0IGRlZmF1bHREYXRhID0ge1xuICAgICAgICB2aXNpb246IFwiXCIsXG4gICAgICAgIG1pc3Npb246IFwiXCIsXG4gICAgICAgIGdvYWxzOiBbXSxcbiAgICAgICAgbWVhc3VyZXM6IFtdLFxuICAgICAgICBhY3Rpb25zOiBbXSxcbiAgICAgICAgdGVhbTogW10sXG4gICAgICAgIGxvZ29Vcmw6IFwiXCIsXG4gICAgICAgIGxhc3RVcGRhdGVkOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgIH1cbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihkZWZhdWx0RGF0YSlcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignR0VUIC9hcGkvcGxhbiAtIEVycm9yIGxvYWRpbmcgcGxhbiBkYXRhOicsIGVycm9yKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IFxuICAgICAgZXJyb3I6ICdGYWlsZWQgdG8gbG9hZCBwbGFuIGRhdGEnLCBcbiAgICAgIGRldGFpbHM6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSBcbiAgICB9LCB7IHN0YXR1czogNTAwIH0pXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZygnUE9TVCAvYXBpL3BsYW4gLSBTYXZpbmcgcGxhbiBkYXRhLi4uJylcbiAgICBjb25zdCBwbGFuRGF0YSA9IGF3YWl0IHJlcXVlc3QuanNvbigpXG4gICAgY29uc29sZS5sb2coJ1JlY2VpdmVkIGRhdGE6JywgcGxhbkRhdGEpXG4gICAgXG4gICAgLy8gSGFuZGxlIGJvdGggb2xkIGZvcm1hdCAobG9nbywgZ29hbEFyZWFzLCB0ZWFtTWVtYmVycykgYW5kIG5ldyBmb3JtYXQgKGxvZ29VcmwsIGdvYWxzLCBtZWFzdXJlcywgYWN0aW9ucywgdGVhbSlcbiAgICBjb25zdCBkYXRhVG9TYXZlID0ge1xuICAgICAgdmlzaW9uOiBwbGFuRGF0YS52aXNpb24gfHwgXCJcIixcbiAgICAgIG1pc3Npb246IHBsYW5EYXRhLm1pc3Npb24gfHwgXCJcIixcbiAgICAgIGdvYWxzOiBwbGFuRGF0YS5nb2FscyB8fCBwbGFuRGF0YS5nb2FsQXJlYXMgfHwgW10sXG4gICAgICBtZWFzdXJlczogcGxhbkRhdGEubWVhc3VyZXMgfHwgW10sXG4gICAgICBhY3Rpb25zOiBwbGFuRGF0YS5hY3Rpb25zIHx8IFtdLFxuICAgICAgdGVhbTogcGxhbkRhdGEudGVhbSB8fCBwbGFuRGF0YS50ZWFtTWVtYmVycyB8fCBbXSxcbiAgICAgIGxvZ29Vcmw6IHBsYW5EYXRhLmxvZ29VcmwgfHwgcGxhbkRhdGEubG9nbyB8fCBcIlwiLFxuICAgICAgbGFzdFVwZGF0ZWQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH1cbiAgICBcbiAgICBjb25zdCBzdHJpbmdpZmllZERhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhVG9TYXZlKVxuICAgIGNvbnNvbGUubG9nKCdTdHJpbmdpZmllZCBkYXRhIHRvIHNhdmU6Jywgc3RyaW5naWZpZWREYXRhKVxuICAgIFxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRiLnNldCgncGxhbicsIHN0cmluZ2lmaWVkRGF0YSlcbiAgICBjb25zb2xlLmxvZygnU2F2ZSByZXN1bHQ6JywgcmVzdWx0KVxuICAgIFxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGRhdGFUb1NhdmUgfSlcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdQT1NUIC9hcGkvcGxhbiAtIEVycm9yIHNhdmluZyBwbGFuIGRhdGE6JywgZXJyb3IpXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgXG4gICAgICBlcnJvcjogJ0ZhaWxlZCB0byBzYXZlIHBsYW4gZGF0YScsIFxuICAgICAgZGV0YWlsczogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpIFxuICAgIH0sIHsgc3RhdHVzOiA1MDAgfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIkRhdGFiYXNlIiwiZGIiLCJHRVQiLCJjb25zb2xlIiwibG9nIiwicmF3RGF0YSIsImdldCIsInBhcnNlZERhdGEiLCJKU09OIiwicGFyc2UiLCJvayIsInZhbHVlIiwianNvbiIsImRlZmF1bHREYXRhIiwidmlzaW9uIiwibWlzc2lvbiIsImdvYWxzIiwibWVhc3VyZXMiLCJhY3Rpb25zIiwidGVhbSIsImxvZ29VcmwiLCJsYXN0VXBkYXRlZCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsImVycm9yIiwiZGV0YWlscyIsIkVycm9yIiwibWVzc2FnZSIsIlN0cmluZyIsInN0YXR1cyIsIlBPU1QiLCJyZXF1ZXN0IiwicGxhbkRhdGEiLCJkYXRhVG9TYXZlIiwiZ29hbEFyZWFzIiwidGVhbU1lbWJlcnMiLCJsb2dvIiwic3RyaW5naWZpZWREYXRhIiwic3RyaW5naWZ5IiwicmVzdWx0Iiwic2V0Iiwic3VjY2VzcyIsImRhdGEiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/plan/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fplan%2Froute&page=%2Fapi%2Fplan%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fplan%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fplan%2Froute&page=%2Fapi%2Fplan%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fplan%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_runner_workspace_app_api_plan_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/plan/route.ts */ \"(rsc)/./app/api/plan/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/plan/route\",\n        pathname: \"/api/plan\",\n        filename: \"route\",\n        bundlePath: \"app/api/plan/route\"\n    },\n    resolvedPagePath: \"/home/runner/workspace/app/api/plan/route.ts\",\n    nextConfigOutput,\n    userland: _home_runner_workspace_app_api_plan_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNS4yLjRfcmVhY3QtZG9tQDE5LjEuMV9yZWFjdEAxOS4xLjFfX3JlYWN0QDE5LjEuMS9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZwbGFuJTJGcm91dGUmcGFnZT0lMkZhcGklMkZwbGFuJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGcGxhbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNKO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FwcC9hcGkvcGxhbi9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvcGxhbi9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3BsYW5cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3BsYW4vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FwcC9hcGkvcGxhbi9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fplan%2Froute&page=%2Fapi%2Fplan%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fplan%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1","vendor-chunks/@replit+database@3.0.1"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fplan%2Froute&page=%2Fapi%2Fplan%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fplan%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();