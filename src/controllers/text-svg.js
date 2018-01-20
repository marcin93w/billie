const 
    express = require('express'),
    router = express.Router(),
    TextToSVG = require('text-to-svg'),
    debtTypes = require('../debt-manager/debt-types');

function getGenderSuffix (userGender) {
    return userGender === 'male' ? '' : 'a'
}

function createInviteText (userName, userGender, debtType, amount) {
    switch (debtType) {
    case debtTypes.BORROWED:
        return `${userName} pożyczył${getGenderSuffix(userGender)} od ciebie ${amount} zł`
    case debtTypes.LENT:
        return `${userName} pożyczył${getGenderSuffix(userGender)} ci ${amount} zł`
    case debtTypes.BORROWED_PAYOFF:
        return `${userName} oddał${getGenderSuffix(userGender)} ci ${amount} zł`
    case debtTypes.LENT_PAYOFF:
        return `${userName} otrzymał${getGenderSuffix(userGender)} od ciebie ${amount} zł`
    }
}

router.route('/image/:userName/:userGender/:debtType/:amount').get((req, res) => {
    const textToSVG = TextToSVG.loadSync();
 
    const attributes = {fill: 'grey', stroke: 'black'};
    const options = {x: 0, y: 0, fontSize: 28, anchor: 'top', attributes: attributes};
    const text = createInviteText(req.params.userName, req.params.userGender, parseInt(req.params.debtType), req.params.amount)

    const svg = textToSVG.getSVG(text, options);
    
    res.status(200).send(svg);
});

module.exports = router;