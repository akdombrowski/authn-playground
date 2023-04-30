import { forwardRef } from "react";

import Button from "@mui/material/Button";

const navBtn = forwardRef((props, ref) => {
  const { href, onClick, ...other } = props;
  return (
    <Button
      onClick={onClick}
      href={href}
      ref={ref}
      {...other}
    />
  );
});

export default navBtn;
