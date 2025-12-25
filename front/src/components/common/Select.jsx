// src/components/common/Select.jsx
export default function Select({
                                   label,
                                   name,
                                   value,
                                   onChange,
                                   options = [],
                                   required,
                                   disabled,
                                   placeholder = "Выберите...",
                               }) {
    return (
        <label className="field">
            {label && <span className="field__label">{label}</span>}

            <select
                className="field__input"
                name={name}
                value={value ?? ""}
                onChange={onChange}
                required={required}
                disabled={disabled}
            >
                <option value="">{placeholder}</option>

                {options.map((opt) => (
                    <option key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
