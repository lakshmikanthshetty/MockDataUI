import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { DragAndDrop } from "@progress/kendo-react-common";
import { DraggableRow } from "./draggable-row";
import { DragHandleCell } from "./drag-handle-cell";
import products from "./products.json";
import { MyCommandCell } from "./myCommandCell";
import { Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
export const ReorderContext = React.createContext({
    reorder: () => { },
    dragStart: () => { }
});
const MockDataGenerate = () => {
    const [gridData, setGridData] = React.useState([]);
    const [mockFieldName, setmockFieldName] = React.useState("");
    const [mockFieldDataType, setmockFieldDataType] = React.useState("String");
    const [mockMinValue, setmockMinValue] = React.useState(0);
    const [mockMaxValue, setmockMaxValue] = React.useState(5);
    const [activeItem, setActiveItem] = React.useState(null);
    const [render, setRender] =React.useState(true);
    const editField = "inEdit";
    const reorder = (dataItem, direction) => {
        if (activeItem === dataItem) {
            return;
        }
        let reorderedData = gridData.slice();
        let prevIndex = reorderedData.findIndex((p) => p === activeItem);
        let nextIndex = reorderedData.findIndex((p) => p === dataItem);
        reorderedData.splice(prevIndex, 1);
        reorderedData.splice(
            Math.max(nextIndex + (direction === "before" ? -1 : 0), 0),
            0,
            activeItem || reorderedData[0]
        );
        setGridData(reorderedData);
    };
    React.useEffect(() => { console.log("data--", gridData); }, [gridData.length,gridData,render`   `])
    const dragStart = (dataItem) => {
        setActiveItem(dataItem);
    };
    const remove = (dataItem) => {
        let index = gridData.findIndex(
            (record) => record.id === dataItem.id
        );
        gridData.splice(index, 1);
        setGridData(gridData);

    };

    const enterEdit = (dataItem) => {
        setGridData(
            gridData.map((item) =>
                item.id === dataItem.id
                    ? {
                        ...item,
                        inEdit: true
                    }
                    : item
            )
        );
    };
    const itemChange = (event) => {
        const newData = gridData.map((item) =>
            item.id === event.dataItem.id
                ? {
                    ...item,
                    [event.field || ""]: event.value
                }
                : item
        );
        setGridData(newData);
    };
    const handleEditorMin =(event)=>{
        console.log(event);
        return "number"
    }
    const handleEditorMax =(event)=>{
        console.log("handleEditorMax",event);
        return "number"
    }
    const CommandCell = (props) => (
        <MyCommandCell {...props} edit={enterEdit} remove={remove} />
    ); 
    const handleClick = () => {
        gridData.push({
            id: Math.floor(Math.random() * (9999 - 100 + 1) + 1000),
            mockFieldName: mockFieldName,
            mockFieldDataType: mockFieldDataType,
            mockMinValue: mockMinValue,
            mockMaxValue: mockMaxValue
        })
        setGridData(gridData)
        console.log("grif data-->",gridData)
        setRender(!render)
    }
    return (
        <>
            <div style={{ display: 'flex' }}>
                <Input placeholder="Enter Column Name" value={mockFieldName} onChange={(e) => setmockFieldName(e.target.value)}></Input>
                <DropDownList value={mockFieldDataType} onChange={(event) => (setmockFieldDataType(event.target.value))} data={
                    ["String", "Number", "Decimal", "Date"]
                } />
                <Input type="number" value={mockMinValue} placeholder="Enter Min Range" onChange={(e) => setmockMinValue(e.target.value)}></Input>
                <Input type="number" value={mockMaxValue} placeholder="Enter Max Range" onChange={(e) => setmockMaxValue(e.target.value)}></Input>
            </div>
            <Button onClick={handleClick}>Add Column</Button>
            {gridData.length !== 0 ?
                <ReorderContext.Provider
                    value={{
                        reorder: reorder,
                        dragStart: dragStart
                    }}
                >
                    <DragAndDrop>
                        <Grid
                            style={{
                                height: "400px"
                            }}
                            data={gridData}
                            onItemChange={itemChange}
                            editField={editField}
                            dataItemKey={"id"}
                            rowRender={(row, rowProps) => (
                                <DraggableRow elementProps={row.props} {...rowProps} />
                            )}
                        >
                            <Column  width="50px" cell={DragHandleCell} />
                            <Column field="mockFieldName" title="Column Name" width="250px" />
                            <Column field="mockFieldDataType" title="Data Type" width="200px" />
                            <Column field="mockMinValue" title="Min Range" editor="number" width="200px" />
                            <Column field="mockMaxValue" title="Max Range" editor="number" width="200px" />
                            <Column cell={CommandCell} width="200px" />
                        </Grid>
                    </DragAndDrop>
                </ReorderContext.Provider> : ''}
        </>
    );
};
export default MockDataGenerate;
