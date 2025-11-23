export default function Input({
                                  label,
                                  type = "text",
                                  name,
                                  value,
                                  onChange,
                                  placeholder,
                                  required,
                              }) {
    return (
        <label className="field">
            {label && <span className="field__label">{label}</span>}
            <input
                className="field__input"
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </label>
    );
}
