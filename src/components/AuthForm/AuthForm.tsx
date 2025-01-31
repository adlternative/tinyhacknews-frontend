// src/components/AuthForm.tsx
import React from "react";
import styles from "./AuthForm.module.css";

interface FormField {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface AuthFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  buttonLabel: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, fields, onSubmit, buttonLabel }) => {
  return (
    <div className={styles.formContainer}>
      <h1>{title}</h1>
      <form className={styles.authForm} onSubmit={onSubmit}>
        {fields.map((field) => (
          <div className={styles.formGroup} key={field.name}>
            <label htmlFor={field.name}>{field.label}:</label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              required
            />
          </div>
        ))}
        <button className={styles.submitButton} type="submit">
          {buttonLabel}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;