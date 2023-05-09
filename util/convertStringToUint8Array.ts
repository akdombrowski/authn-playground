export const convertStringToUint8Array = (
  str: string,
  splitOnValue: string,
  radix: number | undefined
): Uint8Array | null => {
  let uInt8ArrayResult = null;
  // intentionally only using 2 equals signs
  // because null == undefined so if splitOnValue == null then it's also
  // true that splitOnValue == undefined
  // if splitOnValue is null (or undefined), then split on every char
  const strSplit =
    splitOnValue == null ? str.split("") : str.split(splitOnValue);
  try {
    // if radix is 0 or undefined, it is assumed to be 10 unless the value starts with 0x or 0X in which case 16 is assumed
    const convertedToNumsArr = Array.from(strSplit, (x, i) => {
      const parsedInt = Number.parseInt(x, radix);
      if (Number.isNaN(parsedInt)) {
        throw new Error(
          "couldn't convert a value in the array to an integer: " +
            x +
            " at inded " +
            i
        );
      }

      return parsedInt;
    });
    uInt8ArrayResult = new Uint8Array(convertedToNumsArr);
  } catch (e) {}

  // Might be null if str contains non-integer chars
  return uInt8ArrayResult;
};

export default convertStringToUint8Array;