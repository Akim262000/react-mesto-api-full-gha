import { useState } from "react";

const Login = ({onLogin}) => {
  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!formValue.email || !formValue.password) {
    //   return;
    // }
    onLogin(formValue);
    // localStorage.setItem("jwt", data.jwt);
    // handleLogin();
    // auth.authorize(formValue.email, formValue.password).then(() => {
    //   navigate("/");
    // });
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Вход</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input type="email" id="email" name="email" autoComplete="email" placeholder="Email" value={formValue.email} onChange={handleChange} required />
        <input type="password" id="password" name="password" autoComplete="password" placeholder="Пароль" minLength="8" value={formValue.password} onChange={handleChange} required />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default Login;
