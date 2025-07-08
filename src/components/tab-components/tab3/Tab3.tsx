import MapWithPieCharts from "./MapWithPieCharts";
import MapWithPins from "./MapWithPins";
import ReciprocalTariffsMap from "./ReciprocalTariffsMap";

export const Tab3 = () => {
    return (
        <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <ReciprocalTariffsMap />
                <MapWithPins />
            </div>
            <MapWithPieCharts />
        </>
    );
};