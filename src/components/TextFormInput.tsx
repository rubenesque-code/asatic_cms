import { FormEvent, useState } from "react";

const TextFormInput = ({
  initialValue = "",
  onUpdate,
  placeholder,
}: {
  initialValue?: string;
  onUpdate: (text: string) => void;
  placeholder: string;
}) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(value);
  };

  return (
    <form css={[]} onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        type="text"
      />
    </form>
  );
};

export default TextFormInput;
