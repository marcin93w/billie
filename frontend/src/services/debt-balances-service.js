import { getDebtBalances as getDebtBalancesFromApi } from '../services/debts-api-service'

class DebtBalancesService {
    getDebtBalances (context) {
        if (!this.debtBalances) {
            return getDebtBalancesFromApi(context)
                .then(debtBalances => {
                    this.debtBalances = debtBalances
                    return debtBalances
                })
        }
        return Promise.resolve(this.debtBalances)
    }
    getDebtBalanceForUser (context, userId) {
        return this.getDebtBalances(context)
            .then(db => db.status.find(d => d.userId === userId))
    }
}

export default new DebtBalancesService()
