import { memo, useEffect, useRef } from "react";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  // ref?: RefObject<HTMLInputElement | null>;
  focusOnAdd?: boolean;
}

const TextField: React.FC<TextFieldProps> = (props) => {
  const {
    focusOnAdd,
    ...rest
  } = props;

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!focusOnAdd) {
      return;
    }

    if (ref.current) {
      ref.current.focus()
    }
  }, [ ref.current ])

  return (
    <input
      ref={ref}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      type="text"
      {...rest}
    />
  );
};

export const TextFieldMemo = memo(TextField);

export default TextField;