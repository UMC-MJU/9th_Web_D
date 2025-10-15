import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
    initValue: T;
    validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({initValue, validate}: UseFormProps<T>) {
    const [values, setValues] = useState(initValue);
    const [touched, setTouched] = useState<Record<string, boolean>>()
    const [errors, setErrors] = useState<Record<string, string>>()

    const handleChange = (name: keyof T, text: string) => {
        setValues({
            ...values,
            [name] : text,
        })
    };

    const handleBluer = (name: keyof T) => {
        setTouched({
            ...touched,
            [name] : true,
        })
    };

    const getInputProps = (name: keyof T) => {
        const value = values[name];
        const onChange = (e: ChangeEvent<HTMLInputElement>) => handleChange(name, e.target.value);
        const onBlur = () => handleBluer(name);
        return {value, onChange, onBlur};
    };

    useEffect(() => {
        const newErrors = validate(values);
        setErrors(newErrors);
    },[validate, values])

    return { values, errors, touched, getInputProps };
}

export default useForm;