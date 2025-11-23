export default function Button({
                                   children,
                                   variant = "primary",
                                   type = "button",
                                   ...rest
                               }) {
    const className =
        variant === "primary"
            ? "btn btn--primary"
            : variant === "ghost"
                ? "btn btn--ghost"
                : "btn";

    return (
        <button type={type} className={className} {...rest}>
            {children}
        </button>
    );
}
