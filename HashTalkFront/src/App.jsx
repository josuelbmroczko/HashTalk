import Cadastro from "./pages/Cadastro/Cadastro";
import Perfil from "./pages/Perfil/Perfil";

function App() {
  return (
    <>
      <Cadastro />

      <hr
        style={{
          margin: "80px 0",
          border: "1px solid #E2E8F0"
        }}
      />

      <Perfil />
    </>
  );
}

export default App;