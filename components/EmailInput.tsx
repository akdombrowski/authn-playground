import { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useEffect } from "react";

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
      };

      getChall();
    }
  }, [focused]);

  return (
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
