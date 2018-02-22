import { askPermission, getGrantedPermissions } from '../messenger-extensions/messenger-extensions'

export function ensurePermissions () {
    return getGrantedPermissions()
        .then(res => {
            if (res.permissions && res.permissions.includes('user_profile')) {
                return Promise.resolve()
            } else {
                return askPermission('user_profile')
            }
        })
        .catch(() => {
            return askPermission('user_profile')
        })
}
