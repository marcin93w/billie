"use strict";
var DebtTypes;
(function (DebtTypes) {
    DebtTypes[DebtTypes["LENT"] = 0] = "LENT";
    DebtTypes[DebtTypes["BORROWED"] = 1] = "BORROWED";
    DebtTypes[DebtTypes["LENT_PAYOFF"] = 2] = "LENT_PAYOFF";
    DebtTypes[DebtTypes["BORROWED_PAYOFF"] = 3] = "BORROWED_PAYOFF";
})(DebtTypes || (DebtTypes = {}));
;
module.exports = DebtTypes;
//# sourceMappingURL=debt-types.js.map