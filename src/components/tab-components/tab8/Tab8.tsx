import React, { useEffect, useMemo, useState } from "react";
import MapChart from "./TabChart";
import CylinderChart from "./Bieudocot";
import ColumnsChart from "./Bieudocotdung";
// import Bieudobubble from "./Bieudobubble";

type Position = [number, number];


const Tab8: React.FC = () => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [selectedProvince, setSelectedProvince] = useState<{
        name: string;
        coordinates: Position;
        population?: string;
    } | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 font-sans relative">
            <div className="flex items-center justify-center h-full w-full">
                <div className="grid grid-cols-12 gap-6 h-full">
                    <div className="col-span-3 space-y-6">
                        <CylinderChart />
                        <ColumnsChart />
                        {/* <Bieudobubble /> */}
                    </div>
                    <div className="col-span-6">
                        <MapChart />
                    </div>
                    <div className=" col-span-3 space-y-6"></div>
                </div>
            </div>
            <div className="flex items-center justify-center h-full w-full">
               {/* <BieuDoLineChart /> */}
            </div>
        </div>
    );
};

export default Tab8;
