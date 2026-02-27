import { useState, ChangeEvent } from 'react';

export const useForm = <T extends { [key: string]: string | number | boolean }>(initialForm: T) => {
  const [formState, setFormState] = useState<T>(initialForm);

  const onInputChange = (
    eOrName: ChangeEvent<HTMLInputElement> | string,
    value?: string | number | boolean
  ) => {

    if (typeof eOrName !== "string") {
      const { name, value } = eOrName.target;
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }


    const name = eOrName;

    setFormState((prev) => ({
      ...prev,
      [name]: value!,
    }));
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  return {
    ...formState,
    formState,
    setFormState,
    onInputChange,
    onResetForm,
  };
};
