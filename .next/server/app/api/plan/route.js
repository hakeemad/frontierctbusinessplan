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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/api/server.js\");\n/* harmony import */ var _replit_database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @replit/database */ \"(rsc)/./node_modules/.pnpm/@replit+database@3.0.1/node_modules/@replit/database/dist/index.mjs\");\n\n\nasync function GET() {\n    try {\n        console.log('GET /api/plan - Loading plan data...');\n        const rawData = await _replit_database__WEBPACK_IMPORTED_MODULE_1__[\"default\"].get('plan-data');\n        console.log('Raw data from DB:', rawData);\n        if (rawData) {\n            // Parse JSON if it's a string, otherwise return as-is\n            const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;\n            console.log('Parsed data:', parsedData);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(parsedData);\n        } else {\n            console.log('No data found, returning default structure');\n            const defaultData = {\n                vision: \"\",\n                mission: \"\",\n                logo: null,\n                goalAreas: [],\n                teamMembers: [],\n                savedVersions: [],\n                lastUpdated: new Date().toISOString()\n            };\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(defaultData);\n        }\n    } catch (error) {\n        console.error('GET /api/plan - Error loading plan data:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to load plan data',\n            details: error instanceof Error ? error.message : String(error)\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        console.log('POST /api/plan - Saving plan data...');\n        const planData = await request.json();\n        console.log('Received data:', planData);\n        const dataToSave = {\n            ...planData,\n            lastUpdated: new Date().toISOString()\n        };\n        // Stringify the data before saving to ensure it's stored as JSON\n        const stringifiedData = JSON.stringify(dataToSave);\n        console.log('Stringified data to save:', stringifiedData);\n        const result = await _replit_database__WEBPACK_IMPORTED_MODULE_1__[\"default\"].set('plan-data', stringifiedData);\n        console.log('Save result:', result);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true\n        });\n    } catch (error) {\n        console.error('POST /api/plan - Error saving plan data:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to save plan data',\n            details: error instanceof Error ? error.message : String(error)\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3BsYW4vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUN1RDtBQUN0QjtBQUUxQixlQUFlRTtJQUNwQixJQUFJO1FBQ0ZDLFFBQVFDLEdBQUcsQ0FBQztRQUNaLE1BQU1DLFVBQVUsTUFBTUosd0RBQUVBLENBQUNLLEdBQUcsQ0FBQztRQUM3QkgsUUFBUUMsR0FBRyxDQUFDLHFCQUFxQkM7UUFFakMsSUFBSUEsU0FBUztZQUNYLHNEQUFzRDtZQUN0RCxNQUFNRSxhQUFhLE9BQU9GLFlBQVksV0FBV0csS0FBS0MsS0FBSyxDQUFDSixXQUFXQTtZQUN2RUYsUUFBUUMsR0FBRyxDQUFDLGdCQUFnQkc7WUFDNUIsT0FBT1AscURBQVlBLENBQUNVLElBQUksQ0FBQ0g7UUFDM0IsT0FBTztZQUNMSixRQUFRQyxHQUFHLENBQUM7WUFDWixNQUFNTyxjQUFjO2dCQUNsQkMsUUFBUTtnQkFDUkMsU0FBUztnQkFDVEMsTUFBTTtnQkFDTkMsV0FBVyxFQUFFO2dCQUNiQyxhQUFhLEVBQUU7Z0JBQ2ZDLGVBQWUsRUFBRTtnQkFDakJDLGFBQWEsSUFBSUMsT0FBT0MsV0FBVztZQUNyQztZQUNBLE9BQU9wQixxREFBWUEsQ0FBQ1UsSUFBSSxDQUFDQztRQUMzQjtJQUNGLEVBQUUsT0FBT1UsT0FBTztRQUNkbEIsUUFBUWtCLEtBQUssQ0FBQyw0Q0FBNENBO1FBQzFELE9BQU9yQixxREFBWUEsQ0FBQ1UsSUFBSSxDQUFDO1lBQ3ZCVyxPQUFPO1lBQ1BDLFNBQVNELGlCQUFpQkUsUUFBUUYsTUFBTUcsT0FBTyxHQUFHQyxPQUFPSjtRQUMzRCxHQUFHO1lBQUVLLFFBQVE7UUFBSTtJQUNuQjtBQUNGO0FBRU8sZUFBZUMsS0FBS0MsT0FBb0I7SUFDN0MsSUFBSTtRQUNGekIsUUFBUUMsR0FBRyxDQUFDO1FBQ1osTUFBTXlCLFdBQVcsTUFBTUQsUUFBUWxCLElBQUk7UUFDbkNQLFFBQVFDLEdBQUcsQ0FBQyxrQkFBa0J5QjtRQUU5QixNQUFNQyxhQUFhO1lBQ2pCLEdBQUdELFFBQVE7WUFDWFgsYUFBYSxJQUFJQyxPQUFPQyxXQUFXO1FBQ3JDO1FBRUEsaUVBQWlFO1FBQ2pFLE1BQU1XLGtCQUFrQnZCLEtBQUt3QixTQUFTLENBQUNGO1FBQ3ZDM0IsUUFBUUMsR0FBRyxDQUFDLDZCQUE2QjJCO1FBRXpDLE1BQU1FLFNBQVMsTUFBTWhDLHdEQUFFQSxDQUFDaUMsR0FBRyxDQUFDLGFBQWFIO1FBQ3pDNUIsUUFBUUMsR0FBRyxDQUFDLGdCQUFnQjZCO1FBRTVCLE9BQU9qQyxxREFBWUEsQ0FBQ1UsSUFBSSxDQUFDO1lBQUV5QixTQUFTO1FBQUs7SUFDM0MsRUFBRSxPQUFPZCxPQUFPO1FBQ2RsQixRQUFRa0IsS0FBSyxDQUFDLDRDQUE0Q0E7UUFDMUQsT0FBT3JCLHFEQUFZQSxDQUFDVSxJQUFJLENBQUM7WUFDdkJXLE9BQU87WUFDUEMsU0FBU0QsaUJBQWlCRSxRQUFRRixNQUFNRyxPQUFPLEdBQUdDLE9BQU9KO1FBQzNELEdBQUc7WUFBRUssUUFBUTtRQUFJO0lBQ25CO0FBQ0YiLCJzb3VyY2VzIjpbIi9ob21lL3J1bm5lci93b3Jrc3BhY2UvYXBwL2FwaS9wbGFuL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJ1xuaW1wb3J0IGRiIGZyb20gJ0ByZXBsaXQvZGF0YWJhc2UnXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc29sZS5sb2coJ0dFVCAvYXBpL3BsYW4gLSBMb2FkaW5nIHBsYW4gZGF0YS4uLicpXG4gICAgY29uc3QgcmF3RGF0YSA9IGF3YWl0IGRiLmdldCgncGxhbi1kYXRhJylcbiAgICBjb25zb2xlLmxvZygnUmF3IGRhdGEgZnJvbSBEQjonLCByYXdEYXRhKVxuICAgIFxuICAgIGlmIChyYXdEYXRhKSB7XG4gICAgICAvLyBQYXJzZSBKU09OIGlmIGl0J3MgYSBzdHJpbmcsIG90aGVyd2lzZSByZXR1cm4gYXMtaXNcbiAgICAgIGNvbnN0IHBhcnNlZERhdGEgPSB0eXBlb2YgcmF3RGF0YSA9PT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKHJhd0RhdGEpIDogcmF3RGF0YVxuICAgICAgY29uc29sZS5sb2coJ1BhcnNlZCBkYXRhOicsIHBhcnNlZERhdGEpXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24ocGFyc2VkRGF0YSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ05vIGRhdGEgZm91bmQsIHJldHVybmluZyBkZWZhdWx0IHN0cnVjdHVyZScpXG4gICAgICBjb25zdCBkZWZhdWx0RGF0YSA9IHtcbiAgICAgICAgdmlzaW9uOiBcIlwiLFxuICAgICAgICBtaXNzaW9uOiBcIlwiLFxuICAgICAgICBsb2dvOiBudWxsLFxuICAgICAgICBnb2FsQXJlYXM6IFtdLFxuICAgICAgICB0ZWFtTWVtYmVyczogW10sXG4gICAgICAgIHNhdmVkVmVyc2lvbnM6IFtdLFxuICAgICAgICBsYXN0VXBkYXRlZDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICB9XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oZGVmYXVsdERhdGEpXG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0dFVCAvYXBpL3BsYW4gLSBFcnJvciBsb2FkaW5nIHBsYW4gZGF0YTonLCBlcnJvcilcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBcbiAgICAgIGVycm9yOiAnRmFpbGVkIHRvIGxvYWQgcGxhbiBkYXRhJywgXG4gICAgICBkZXRhaWxzOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcikgXG4gICAgfSwgeyBzdGF0dXM6IDUwMCB9KVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc29sZS5sb2coJ1BPU1QgL2FwaS9wbGFuIC0gU2F2aW5nIHBsYW4gZGF0YS4uLicpXG4gICAgY29uc3QgcGxhbkRhdGEgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKVxuICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlZCBkYXRhOicsIHBsYW5EYXRhKVxuICAgIFxuICAgIGNvbnN0IGRhdGFUb1NhdmUgPSB7XG4gICAgICAuLi5wbGFuRGF0YSxcbiAgICAgIGxhc3RVcGRhdGVkOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9XG4gICAgXG4gICAgLy8gU3RyaW5naWZ5IHRoZSBkYXRhIGJlZm9yZSBzYXZpbmcgdG8gZW5zdXJlIGl0J3Mgc3RvcmVkIGFzIEpTT05cbiAgICBjb25zdCBzdHJpbmdpZmllZERhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhVG9TYXZlKVxuICAgIGNvbnNvbGUubG9nKCdTdHJpbmdpZmllZCBkYXRhIHRvIHNhdmU6Jywgc3RyaW5naWZpZWREYXRhKVxuICAgIFxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRiLnNldCgncGxhbi1kYXRhJywgc3RyaW5naWZpZWREYXRhKVxuICAgIGNvbnNvbGUubG9nKCdTYXZlIHJlc3VsdDonLCByZXN1bHQpXG4gICAgXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgc3VjY2VzczogdHJ1ZSB9KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1BPU1QgL2FwaS9wbGFuIC0gRXJyb3Igc2F2aW5nIHBsYW4gZGF0YTonLCBlcnJvcilcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBcbiAgICAgIGVycm9yOiAnRmFpbGVkIHRvIHNhdmUgcGxhbiBkYXRhJywgXG4gICAgICBkZXRhaWxzOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcikgXG4gICAgfSwgeyBzdGF0dXM6IDUwMCB9KVxuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZGIiLCJHRVQiLCJjb25zb2xlIiwibG9nIiwicmF3RGF0YSIsImdldCIsInBhcnNlZERhdGEiLCJKU09OIiwicGFyc2UiLCJqc29uIiwiZGVmYXVsdERhdGEiLCJ2aXNpb24iLCJtaXNzaW9uIiwibG9nbyIsImdvYWxBcmVhcyIsInRlYW1NZW1iZXJzIiwic2F2ZWRWZXJzaW9ucyIsImxhc3RVcGRhdGVkIiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwiZXJyb3IiLCJkZXRhaWxzIiwiRXJyb3IiLCJtZXNzYWdlIiwiU3RyaW5nIiwic3RhdHVzIiwiUE9TVCIsInJlcXVlc3QiLCJwbGFuRGF0YSIsImRhdGFUb1NhdmUiLCJzdHJpbmdpZmllZERhdGEiLCJzdHJpbmdpZnkiLCJyZXN1bHQiLCJzZXQiLCJzdWNjZXNzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/plan/route.ts\n");

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