// import { createInstance } from "@module-federation/runtime";

// const mf = createInstance({
//   name: "duziolon",
//   remotes: [
//     {
//       name: "chatApp",
//       entry: "http://localhost:3001/remoteEntry.js",
//     },
//   ],
// });

// export default mf;

import React from "react";
import ReactDOM from "react-dom";

import { createInstance } from "@module-federation/runtime";

const mf = createInstance({
  name: "duziolon",

  remotes: [
    {
      name: "chatApp",
      entry: `${process.env.NEXT_PUBLIC_MFE_URL}/remoteEntry.js`,
    },
  ],

  shared: {
    react: {
      version: React.version,
      scope: "default",

      lib: () => React,

      shareConfig: {
        singleton: true,
        requiredVersion: false,
      },
    },

    "react-dom": {
      version: ReactDOM.version,
      scope: "default",

      lib: () => ReactDOM,

      shareConfig: {
        singleton: true,
        requiredVersion: false,
      },
    },
  },
});

export default mf;