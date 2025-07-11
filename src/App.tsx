import Tab1 from "./components/tab-components/tab1/Tab1";
import { Tab2 } from "./components/tab-components/tab2/Tab2";
import { Tab3 } from "./components/tab-components/tab3/Tab3";
import Tab4 from "./components/tab-components/tab4/Tab4";
import Tab5 from "./components/tab-components/tab5/Tab5";
import Tab6 from "./components/tab-components/tab6/Tab6";
import Tab7 from "./components/tab-components/tab7/Tab7";

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
    {
      label: "Home 4",
      content: <Tab4 />,
    },
     {
      label: "Home 5",
      content: <Tab5 />,
    },
    {
      label: "Home 6",
      content: <Tab7 />,
    }
  ]
  return (
    <TabRender tabs={tabs} />
  );
}

export default App;