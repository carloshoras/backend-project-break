// module.exports = {
//     paths: {
//       "/dashboard": {
//         post: {
//           tags: {
//             Products: "Create a product",
//           },
//           description: "Create Product",
//           operationId: "createProduct",
//           parameters: [],
//           requestBody: {
//             content: {
//               "application/json": {
//                 schema: {
//                   $ref: "#/components/schemas/Product",
//                 },
//               },
//             },
//           },
//           responses: {
//             201: {
//               description: "Product created successfully",
//             },
//             500: {
//               description: "Server error",
//             },
//           },
//         },
//         get: {
//             tags: {
//               Products: "Get all products",
//             },
//             description: "Get all Products",
//             operationId: "getProducts",
//             parameters: [],
//             requestBody: {
//               content: {
//                 "application/json": {
//                   schema: {
//                     $ref: "#/components/schemas/Product",
//                   },
//                 },
//               },
//             },
//             responses: {
//               201: {
//                 description: "Products gotten successfully",
//               },
//               500: {
//                 description: "Server error",
//               },
//             },
//           }
//       },
//     },
//   };
  