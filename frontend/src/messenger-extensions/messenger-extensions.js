let loadedModule
if (process.env.NODE_ENV === 'development') {
    loadedModule = require('./messenger-extensions.dev.js')
} else {
    loadedModule = require('./messenger-extensions.prod.js')
}

export const beginShareFlow = loadedModule.beginShareFlow
export const getContext = loadedModule.getContext
export const requestCloseBrowser = loadedModule.requestCloseBrowser
export const askPermission = loadedModule.askPermission
export const getGrantedPermissions = loadedModule.getGrantedPermissions
