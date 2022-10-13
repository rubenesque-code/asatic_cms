import InputSelectCombo_ from "^components/InputSelectCombo";

import Input from "./Input";
import Select from "./Select";
import { $Container } from "../_styles/inputSelectCombo";

const InputSelectCombo = () => {
  return (
    <$Container>
      <InputSelectCombo_>
        <>
          <Input />
          <Select />
        </>
      </InputSelectCombo_>
    </$Container>
  );
};

export default InputSelectCombo;
