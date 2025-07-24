import Tab1 from "./components/tab-components/tab1/Tab1";
import { Tab2 } from "./components/tab-components/tab2/Tab2";
import Tab3 from "./components/tab-components/tab3/Tab3";
import Tab4 from "./components/tab-components/tab4/Tab4";
import Tab5 from "./components/tab-components/tab5/Tab5";
import Tab6 from "./components/tab-components/tab6/Tab6";
import Tab7_updated from "./components/tab-components/tab7/Tab7_updated";
import Tab7 from "./components/tab-components/tab7/Tab7";
import Tab9 from "./components/tab-components/tab9/Tab9";


import TabRender from "./components/TabRender";

function App() {

  const tabs = [
    {
      label: "hightchar + d3map",
      content: <Tab3 />,
    },
    {
      label: "chartjs +  hightchartMap",
      content: <Tab7_updated />,
    },
    {
      label: "d3",
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
      content: <Tab6 />,
    },
    {
      label: "Home 7",
      content: <Tab7 />,
    },
    {
      label: "Home 8",
      content: <Tab9 />,
    },
  ]
  return (
    <TabRender tabs={tabs} />
    // <Tab3 />
  );
}

export default App;