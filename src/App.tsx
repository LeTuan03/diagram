import Tab1 from "./components/tab-components/tab1/Tab1";
import { Tab2 } from "./components/tab-components/tab2/Tab2";
import { Tab3 } from "./components/tab-components/tab3/Tab3";
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
    {
      label: "Home 3",
      content: <Tab3 />,
    },
  ]
  return (
    <TabRender tabs={tabs} />
  );
}

export default App;