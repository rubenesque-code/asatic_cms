import InputSelectCombo_ from "^components/InputSelectCombo";

import Input from "./Input";
import Select from "./select";

import { $InputSelectComboContainer } from "^components/related-entity-popover/_styles";

const InputSelectCombo = () => {
  return (
    <$InputSelectComboContainer>
      <InputSelectCombo_>
        <>
          <Input />
          <Select />
        </>
      </InputSelectCombo_>
    </$InputSelectComboContainer>
  );
};

export default InputSelectCombo;
