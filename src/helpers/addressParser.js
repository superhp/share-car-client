var addressParser =
{
  parseAlgolioAddress: function (address) {
    var firstDigit = address.match(/\d/);
    var indexOfFirstDigit = address.indexOf(firstDigit);
    var indexOfFirstSpace = address.indexOf(" ");

    var streetNo = address.substring(indexOfFirstDigit, indexOfFirstSpace);
    var streetName = address.substring(indexOfFirstSpace + 1);
    return {
      number: streetNo,
      name: streetName
    };
  },
  parseCustomAddress: function (address) {
    var array = address.split(", ");
    if (array.length === 3) {// some locations don't have house number (bridges for example)
      return {
        number: array[0],
        street: array[1],
        city: array[2]
      }
    }
    return {
      number: "",
      street: array[0],
      city: array[1]
    }
  }
}
export default addressParser;