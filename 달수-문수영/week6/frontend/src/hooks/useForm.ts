import { useEffect, useState, type ChangeEvent } from 'react';

type Errors<T> = Partial<Record<keyof T, string>>;
type Touched<T> = Partial<Record<keyof T, boolean>>;

interface UseFormProps<T> {
    initialValues: T;
    validate: (values: T) => Errors<T>;
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [touched, setTouched] = useState<Touched<T>>({});
    const [errors, setErrors] = useState<Errors<T>>({});

    const handleChange = (name: keyof T, text: string) => {
        setValues((prev) => ({ ...(prev as any), [name]: text } as T));
    };

    const handleBlur = (name: keyof T) => {
        setTouched((prev) => ({ ...(prev as any), [name]: true }));
    };

    const getInputProps = (name: keyof T) => {
        const value = (values as any)[name] ?? '';
        const onChange = (
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => handleChange(name, e.target.value);
        const onBlur = () => handleBlur(name);
        return { value, onChange, onBlur };
    };

    useEffect(() => {
        setErrors(validate(values));
    }, [validate, values]);

    return { values, touched, errors, getInputProps } as const;
}

export default useForm;