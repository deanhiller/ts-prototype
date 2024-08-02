  import { useState, ChangeEvent, FormEvent } from "react";
  import { ReactComponent as Logo } from "./logo.svg";
  import {baseClient} from "./utils/data-utils";
  import FormInput from './components/form-input/form-input';

  import './App.css';
  import {LoginRequest, User} from "./apis/base/base";

  // TypeScript declarations
  type UserState = {
    id: number,
    name: string,
    email: string,
    password: string
  }

  const defaultFormFields = {
    email: '',
    password: '',
  }

  const App = () => {
    // react hooks
    const [user, setUser] = useState<UserState | null>()
    const [formFields, setFormFields] = useState(defaultFormFields)
    const { email, password } = formFields

    const resetFormFields = () => {
      return (
        setFormFields(defaultFormFields)
      );
    }

    // handle input changes
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      setFormFields({...formFields, [name]: value })
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      try {
        const loginReq = new LoginRequest();
        loginReq.user = new User();
        loginReq.user.password = password;
        loginReq.user.name = email;

        const loginResponse = await baseClient.login(loginReq);
        if(!loginResponse.loginSuccess) {
          //if network exception thrown, it shows different error
          throw new Error("Incorrect username/password combination");
        }

        const res: UserState = {
          id: 1,
          name: email,
          email: email,
          password: 'notAgoodIdeaToPutHere'
        };

        setUser(res);
        resetFormFields()
      } catch (error) {
        alert('User Sign In Failed.'+error);
      }
    };

    const reload = () => {
      setUser(null);
      resetFormFields()
    };

    return (
      <div className='App-header'>
        <h1>
          { user && `Welcome! ${user.name}`}
        </h1>
        <div className="card">
          <Logo className="logo" />
          <h2>Sign In2</h2>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              type="email"
              required
              name="email"
              value={email}
              onChange={handleChange}
            />
            <FormInput
              label="Password"
              type='password'
              required
              name='password'
              value={password}
              onChange={handleChange}
            />
            <div className="button-group">
              <button type="submit">Sign In</button>
              <span>
                <button type="button" onClick={reload}>Clear</button>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  export default App;
