function auto_verify(verification_name, verification_amount, verification_account, verification_status) {
    verification_amount = parseFloat(verification_amount)
    let value_of_verification_account = parseInt(verification_account.value)
    for (const fil in filter_list) {
        let account = filter_list[fil][0].konto
        let filter_names = filter_list[fil][0].filter_str.split('|')
        if (value_of_verification_account == 1799 || value_of_verification_account == 1910) {
            if (verification_amount < 0) {
                //console.log(verification_amount)
                for (const filter_name of filter_names) {
                    //console.log(filter_name)
                    if (filter_name.length != 0) {
                        //(console.log(account + " : " + filter_name+ " -> " + verification_amount)
                        if (verification_name.includes(filter_name)) {
                            //verification_account = account
                            console.log(account + " : " + filter_name+ " -> " + verification_amount)
                            verification_account.value = account
                            verification_status.innerText = "Ny verifierad"
                            verification_status.style.color = "#FFA233"
                            break
                        }
                    }
                }
            }
        }
    }
    return String(verification_account)
}

function varify_ai() {
    let verifications = document.getElementsByClassName("verification")
    for (let verification of verifications) {
        let verification_account = verification.getElementsByClassName("verification_account")[0]
        let verification_status = verification.getElementsByClassName("verification_status")[0]
        let verification_name = verification.getElementsByClassName("verification_name")[0].value
        let verification_amount = verification.getElementsByClassName("verification_amount")[0].getAttribute("data")
        auto_verify(verification_name, verification_amount, verification_account, verification_status)
    }

}