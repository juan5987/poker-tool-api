const verifPassword = (password) => {

    let isLowercase = false;
    let isUppercase = false;
    let isNumber = false;
    let isLengthOK = false;
    let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    for(let i = 0; i < password.length; i++){

        let character = password.charAt(i);
        if( isNaN(character) && !format.test(character) && character === character.toUpperCase()) isUppercase = true;
        if( isNaN(character) && !format.test(character) && character === character.toLowerCase()) isLowercase = true;
        if( !isNaN(character)) isNumber = true;
        if(password.length >= 8) isLengthOK = true;
    }

    return isLowercase && isUppercase && isNumber && isLengthOK;
}

module.exports = verifPassword;