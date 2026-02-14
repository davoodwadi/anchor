import { formField } from "./ui/form-field.styles";

type Props = {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
};

export function FormField({ label, htmlFor, hint, children }: Props) {
  const { container, label: labelStyle, hint: hintStyle } = formField();

  return (
    <div className={container()}>
      <label htmlFor={htmlFor} className={labelStyle()}>
        {label}
      </label>

      {children}

      {hint && <p className={hintStyle()}>{hint}</p>}
    </div>
  );
}
