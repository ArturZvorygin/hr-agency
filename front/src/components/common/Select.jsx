export default function Select({
                                   label,
                                   name,
                                   value,
                                   onChange,
                                   options,
                                   required,
                               }) {
    return (
        <label className="field">
            {label && <span className="field__label">{label}</span>}
            <select
                className="field__input"
                name={name}
                value={value}
                onChange={onChange}
                required={required}
            >
                <option value="">Выберите...</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
