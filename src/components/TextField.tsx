type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement>

const TextField: React.FC<TextFieldProps> = (props) => {
  return (
    <input
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      type="text"
      {...props}
    />
  );
};

export default TextField;