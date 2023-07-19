import axios, { Axios } from "axios";
import React, { useEffect, useState } from "react"
import { Button, Form, Modal } from 'react-bootstrap';

const SingleInputContainer = () => {
    const [mockDataDetails, setMockDataDetails] = useState([]);
    const [mockFieldName, setmockFieldName] = useState('');
    const [mockFieldDataType, setmockFieldDataType] = useState('String');
    const [mockMinValue, setmockMinValue] = useState("0");
    const [mockMaxValue, setmockMaxValue] = useState("5");
    const [render, setRender] = useState(true);
    const [exists, setExists] = useState(false);
    const [fileFormat, setFileFormat] = useState('csv');
    const [dataAmount, setDataAmount] = useState(1000);
    const [loader,setLoader]=useState(false)
    const onChange = (e, id) => {
        const { name, value } = e.target
        // console.log("e-->",name,"---",value);
        const editedData = mockDataDetails.map((item) =>
            item.id === id && name ? { ...item, [name]: value } : item
        )

        setMockDataDetails(editedData)
    }

    const handleClick = () => {
        mockDataDetails.push({
            id: Math.floor(Math.random() * (9999 - 100 + 1) + 1000),
            id: Math.floor(Math.random() * (9999 - 100 + 1) + 1000),
            mockFieldName: mockFieldName,
            mockFieldDataType: mockFieldDataType,
            mockMinValue: mockMinValue,
            mockMaxValue: mockMaxValue
        })
        setMockDataDetails(mockDataDetails)
        setmockFieldName('');
        setmockMinValue('');
        setmockMaxValue('');
        setRender(!render)
    }
    useEffect(() => { }, [mockDataDetails, render])

    const callAPI = () => {
        setLoader(true);
        const result = axios.post(`https://localhost:44381/GetMockData/${dataAmount}/${fileFormat}`, 
            mockDataDetails)
            .then(({ data }) => {
                const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', `file.${fileFormat}`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                setLoader(false);
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    const callMqtt = () => {
        const result = axios.post(`https://localhost:44381/PublishToMQTT/${fileFormat}`, 
            mockDataDetails)
            .then(({ data }) => {
                
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    const onmockFieldNameChange = (e) => {
        // console.log("e-->",name,"---",value);
        mockDataDetails.map((item) =>
            item.mockFieldName === e ? setExists(true) : setExists(false)
        )
        console.log("e-->", exists);
        setmockFieldName(e);
    }
    const handleRemove=(id)=>{
        if(window.confirm('Are you sure to delete?'))
       {
        let index = mockDataDetails.findIndex(
            (record) => record.id === id
        );
        mockDataDetails.splice(index, 1);
        setMockDataDetails(mockDataDetails);
        setRender(!render)
       }
       else setRender(!render)
    }
    return (
        <>
            <div className="first-page">
                <h1 style={{ fontWeight: 'bold', letterSpacing: '2px' }} className="title"><span style={{fontStyle:'italic'}} >Simu</span>Genius</h1>
            <p className="tag-line"style={{marginLeft:'60px'}}>Data Engine Simulator</p>

            <br />
            <div className="form-group row">
                <div className="form-outline w-25">
                    <label className="form-label  fw-bold"  >Attribute Name</label>
                    <input type="text"  required value={mockFieldName} onChange={(e) => onmockFieldNameChange(e.target.value)} className="form-control" />
                </div>
                <div className="form-outline w-25">
                    <label className="form-label fw-bold" >Data Type</label>
                    <select className="form-select mt-0" value={mockFieldDataType} onChange={(e) => setmockFieldDataType(e.target.value)}>
                        <option>String</option>
                        <option>Number</option>
                        <option>Decimal</option>
                        <option>Date</option>
                    </select>
                </div>
                {mockFieldDataType !== 'Date' ?
                    <>
                        <div className="form-outline w-25">
                            <label className="form-label fw-bold" >Min Range</label>
                            <input type="number" value={Number(mockMinValue)} onChange={(e) => setmockMinValue(e.target.value)} className="form-control" />
                        </div>
                        <div className="form-outline w-25">
                            <label className="form-label fw-bold" >Max Range</label>
                            <input type="number" value={Number(mockMaxValue)} onChange={(e) => setmockMaxValue(e.target.value)} className="form-control" />
                        </div>
                    </> :
                    <> <div className="form-outline w-25">
                        <Form.Group controlId="dob">
                            <label className="form-label fw-bold" >Give Min Range</label>
                            <Form.Control type="date" name="dob" value={mockMinValue} placeholder="Date" onChange={(e) => setmockMinValue(e.target.value)} />
                        </Form.Group>
                    </div>
                        <div className="form-outline w-25">
                            <Form.Group controlId="dob">
                                <label className="form-label fw-bold" >Give Max Range</label>
                                <Form.Control type="date" value={mockMaxValue} onChange={(e) => setmockMaxValue(e.target.value)} name="dob" placeholder="Date" />
                            </Form.Group>
                        </div>
                    </>}
            </div>
            <br />
            <div className="form-outline w-25">
                <a href="#" data-toggle="tooltip" data-placement="bottom" title={mockFieldName ? exists ? "Column name already exists" : '' : "Please add atleast 1 column"}> <button type="button"  disabled={mockFieldName ? exists ? true : false : true} onClick={handleClick} className="btn btn-primary add-button" >Add Attribute</button></a>

            </div>
            <br /><br />
            {/* <>{console.log(mockDataDetails)}</> */}
            {
                mockDataDetails.length !== 0 &&
                <div className="card" style={{height:'40vh'}}>
                    <div className="table-responsive">
                        <table className="table table-borderless">
                            <thead>
                                <tr>
                                    <th>Attribute Name</th>
                                    <th>Data Type</th>
                                    <th>Min Range</th>
                                    <th>Max Range</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockDataDetails?.map(({ id, mockFieldName, mockFieldDataType, mockMinValue, mockMaxValue }) => (
                                    <tr key={id}>
                                        <td>
                                            <div className="form-outline">
                                                <input name="mockFieldName" type="text" value={mockFieldName} onChange={(e) => onChange(e, id)} className="form-control" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-outline">
                                                <select name="mockFieldDataType" className="form-select mt-0" value={mockFieldDataType} onChange={(e) => onChange(e, id)}>
                                                    <option>String</option>
                                                    <option>Number</option>
                                                    <option>Decimal</option>
                                                    <option>Date</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td>
                                            {
                                                mockFieldDataType === "Date" ?
                                                    <div className="form-outline">
                                                        <Form.Group controlId="dob">
                                                            <Form.Control name="mockMinValue" value={mockMinValue} type="date" placeholder="Date" onChange={(e) => onChange(e, id)} />
                                                        </Form.Group>
                                                    </div> :
                                                    <div className="form-outline">
                                                        <input name="mockMinValue" type="number" value={Number(mockMinValue)} onChange={(e) => onChange(e, id)} className="form-control" />
                                                    </div>
                                            }
                                        </td>
                                        <td>
                                            {
                                                mockFieldDataType === "Date" ?
                                                    <div className="form-outline">
                                                        <Form.Group controlId="dob">
                                                            <Form.Control name="mockMaxValue" value={mockMaxValue} type="date" placeholder="Date" onChange={(e) => onChange(e, id)} />
                                                        </Form.Group>
                                                    </div> :
                                                    <div className="form-outline">
                                                        <input name="mockMaxValue" type="number" value={Number(mockMaxValue)} onChange={(e) => onChange(e, id)} className="form-control" />
                                                    </div>
                                            }
                                        </td>
                                        <td>
                                            <Button onClick={()=>handleRemove(id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            }
            <br/>
            

        </div>
        {mockDataDetails.length !== 0 && <div className="form-group row second-container" style={{ display: 'flex' }}>

        <div className="form-outline w-25">
            <select className="form-select mt-0" value={fileFormat} onChange={(e) => setFileFormat(e.target.value)}>
                <option>csv</option>
                <option>tsv</option>
                <option>json</option>
                <option>xml</option>
            </select>
        </div>

        <div className="form-outline w-25">
            <input type="number" placeholder="Data Count" required value={dataAmount} onChange={(e) => setDataAmount(e.target.value)} className="form-control" />
        </div>
        
        <div className="form-outline w-25">
            <Button onClick={callAPI}>{loader?"Loading...":"Generate Data"}</Button>
        </div>
        <div className="form-outline w-25">
            <Button onClick={callMqtt}>MQTT</Button>
        </div>
    </div>}</>
    )
}

export default SingleInputContainer;