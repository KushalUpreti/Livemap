import "./styles/Bem.css";

export default function App() {
  return (
    <main>
      <header className="header">
        <div className="logo">
          <img
            src="https://bit.ly/3N3pTe4"
            alt="logo"
            className="logo__image"
          />
          <p className="logo__text">Company Logo</p>
        </div>

        <form className="search-form">
          <input className="search-form__input" />
          <button className="search-form__button">Search</button>
        </form>

        <form className="auth-form">
          <input type="submit" value="Logout" className="auth-form__logout" />
        </form>
      </header>

      <aside className="aside">
        <nav className="navigation">
          <ul className="navigation__list">
            <li className="navigation__item navigation__item_active">
              <a href="#" className="navigation__link">
                Home
              </a>
            </li>
            <li className="navigation__item">
              <a href="#" className="navigation__link">
                Orders
              </a>
            </li>
            <li className="navigation__item">
              <a href="#" className="navigation__link">
                Analytics
              </a>
            </li>
            <li className="navigation__item">
              <a href="#" className="navigation__link">
                Customers
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <section className="content">
        <div className="article">
          <img
            src="https://bit.ly/3FGpJa1"
            alt="dummy image"
            className="article__image article__image_float-left"
          />
          <div>
            <h2 className="article__heading">This is article heading</h2>
            <p className="article__paragraph">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero
              soluta corrupti quae et sed consectetur possimus , rem reiciendis
              maxime culpa? Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Sit voluptas, rem nostrum distinctio mollitia error iure
              ratione id accus amus! Culpa tenetur molestiae in maiores fuga
              aliquam dolores quasi error exercitationem tempora. Ea rem alias
              porro consequatur animi a co nsectetur cum deserunt esse, rerum
              natus enim error quasi saepe maxime asperiores!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
