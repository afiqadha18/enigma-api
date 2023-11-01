exports.validateIp = async (ipaddress) => {
    let isValid = true;
    let ipArray = ipaddress.split('.');

    if (ipArray.length != 4) return isValid = false;  
    if (parseInt(ipArray[0]) < 1 || parseInt(ipArray[0]) > 255) return isValid = false; 
    if (parseInt(ipArray[1]) < 0 || parseInt(ipArray[1]) > 255) return isValid = false;
    if (parseInt(ipArray[2]) < 0 || parseInt(ipArray[2]) > 255) return isValid = false;
    if (parseFloat(ipArray[3]) < 1 || parseInt(ipArray[3]) > 254) return isValid = false;

    if (isNaN(ipArray[0]) || isNaN(ipArray[1]) || isNaN(ipArray[2]) || isNaN(ipArray[3])) return isValid = false; 

    return isValid;
}