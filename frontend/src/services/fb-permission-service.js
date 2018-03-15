import { askPermission, getGrantedPermissions } from '../messenger-extensions/messenger-extensions'
import handleError from '../utils/handle-error'

export function ensurePermissions () {
    return getGrantedPermissions()
        .then(res => {
            if (res.permissions && res.permissions.includes('user_profile')) {
                return Promise.resolve()
            } else {
                return Promise.reject(new Error('No permission yet'))
            }
        })
        .catch(() => {
            return askPermission('user_profile')
                .then(res => {
                    if (!res.isGranted) {
                        handleError(new Error('Permission not granted. ' + JSON.stringify(res)))
                    }
                    return Promise.resolve()
                })
        })
}
