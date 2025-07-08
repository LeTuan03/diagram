import Tab1 from "./components/tab-components/tab1/Tab1";
import { Tab2 } from "./components/tab-components/tab2/Tab2";
import TabRender from "./components/TabRender";

function App() {

  const tabs = [
    {
      label: "Home 1",
      content: <Tab1 />,
    },
    {
      label: "Home 2",
      content: <Tab2 />,
    },
  ]
  return (
    <TabRender tabs={tabs} />
  );
}

export default App;