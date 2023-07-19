import '@progress/kendo-theme-default/dist/all.css';
import React from 'react';
import { TileLayout } from '@progress/kendo-react-layout';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';

const KendoChartTile = (props) => {
    const [data, setData] = React.useState([
        {
            col: 1,
            colSpan: 4,
            rowSpan: 1,
        },
        {
            col: 1,
            colSpan: 4,
            rowSpan: 1,
        },
        {
            col: 1,
            colSpan: 4,
            rowSpan: 1,
        },
        {
            col: 1,
            colSpan: 4,
            rowSpan: 1,
        }
    ]);
    
    
    const tiles = [{

        item: <><Input label='Input-1' type='string'></Input><br/>
        <DropDownList data={['string','number','date-time']}></DropDownList></>,
        resizable: false,

    }, {


        item: <><Input label='Input-2' type='string'></Input><br/>
        <DropDownList data={['string','number','date-time']}></DropDownList></>,
        resizable: false,
        style: { color: 'orange' }

    }, {

        item: <><Input label='Inpu-3' type='string'></Input><br/>
        <DropDownList data={['string','number','date-time']}></DropDownList></>,
        resizable: false,
        style: { color: 'orange' }

    }, {


        item: <><Input required label='Input-4' type='string'></Input><br/>
        <DropDownList data={['string','number','date-time']}></DropDownList></>,
        resizable: false,
        style: { color: 'green' }
    },];
    const handleReposition = (e) => {
        setData(e.value);
        console.log(e.value);
    };

    return <><h2 style={{display:'flex',justifyContent:'center'}}>Customizable Dashboard</h2>
    <TileLayout columns={4} rowHeight={100} gap={{
        rows: 10,
        columns: 10
    }} items={tiles} positions={data} onReposition={handleReposition} /></>;
};
export default KendoChartTile;
