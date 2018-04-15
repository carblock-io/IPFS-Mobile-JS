#!/bin/bash
      # Helper script for Gradle to call node on macOS in case it is not found
      export PATH=$PATH:/Users/lizi/.nvm/versions/node/v8.7.0/lib/node_modules/npm/bin/node-gyp-bin:/Users/lizi/Documents/IPFS/IPFS_Mobile/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/lizi/Documents/IPFS/IPFS_Mobile/node_modules/.bin:/Users/lizi/.nvm/versions/node/v8.7.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
      node $@
    