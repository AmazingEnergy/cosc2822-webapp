import useRouteElements from "./routes/useRouteElements";

const App = () => {
  const elements = useRouteElements()

  return (
    <>
      {elements}
    </>
  );
}

export default App