import Input from "@mui/material/Input";
import { useFormControl } from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useRef,
  MutableRefObject,
  useMemo,
  useState,
} from "react";

// const EmailInput = forwardRef((props, ref: ForwardedRef<HTMLInputElement>) => {
const EmailInput = () => {
  const { focused } = useFormControl() || {};

  useEffect(() => {
    if (focused) {
      const getChall = async () => {
        const endpoint = "/api/webauthnchallenge";
        const options = {
          method: "GET",
        };

        const response = await fetch(endpoint, options);

        const res = await response.json();

        console.log(res);
        // challRef.current = new Uint8Array(Buffer.from(res.data.challenge));
      };

      getChall();
    }
  }, [focused]);

  return (
    // <TextField
    //   margin="normal"
    //   required
    //   fullWidth
    //   id="email"
    //   name="email"
    //   value={focused}
    // />
    <OutlinedInput
      required
      fullWidth
      label="Email"
      id="email"
      name="email"
      type="email"
      autoComplete="email"
      maxRows={1}
    />
  );
};

export default EmailInput;
