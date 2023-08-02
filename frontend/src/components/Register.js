import { useState } from "react";
import { Link} from "react-router-dom";


const Register = ({onRegister}) => {
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
    // const {email, password} = formValue;
    e.preventDefault();
    // const { email, password } = formValue;
    // auth.register(email, password).then((res) => {
    //   if (res.ok) {
    //     navigate('/sign-in');
    //   }
    // });
    // auth.register(email, password).then((data) => {
    //   navigate('/sign-in');
    // })
    onRegister(formValue);
  };

  return (
    <>
      <div className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input type="email" id="email" name="email" autoComplete="email" placeholder="Email" value={formValue.email || ''} onChange={handleChange} />
        <input type="password" id="password" name="password" autoComplete="password" placeholder="Пароль" minLength="8" value={formValue.password || ''} onChange={handleChange} />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
      <Link to="/sign-in" className="auth__login-hint">Уже зарегистрированы? Войти</Link>
    </>
  );
};

export default Register;
