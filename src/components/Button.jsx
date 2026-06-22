import { forwardRef } from 'react';

const VARIANT_CLASSES = Object.freeze({
  primary: 'btn btn--primary',
  ghost: 'btn btn--ghost',
  danger: 'btn btn--danger',
  'danger-solid': 'btn btn--danger-solid',
  link: 'btn btn--link',
});

/**
 * Unified button primitive. Variant controls visual style; the rest of the
 * props are forwarded to the underlying native button for flexibility.
 */
const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    type,
    className = '',
    children,
    ...rest
  },
  ref,
) {
  const variantClass = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary;
  const resolvedType = Component === 'button' ? type ?? 'button' : type;
  return (
    <Component
      ref={ref}
      type={resolvedType}
      className={`${variantClass} btn--${size} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
});

export default Button;
