import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Formulario } from "./pages/Formulario";

import { Listado } from "./pages/Listado";

const App = () => {
  return (
    <Router>
      <div className="container">
        <h1>Mantenedor Personas</h1>
        <hr />
        

        <div className="row">
          <div className="col">
            <Routes>
              <Route path="/" element={<Listado />}></Route>
              <Route path="/listado" element={<Listado />}></Route>
              <Route path="/persona" element={<Formulario />}></Route>
              <Route path="/persona/:id" element={<Formulario />}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
