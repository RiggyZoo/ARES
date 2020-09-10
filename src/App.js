import React from 'react';
import './App.css';
import axios from 'axios';


class App extends React.Component {

    state = {
        ico:0,
        dataJSON:[],
        error: false
    }


    changeICO = (event) => {
        this.setState({
            ico: event.target.value
        })
    }


    getInfo = async (e) => {
        let ico = this.state.ico
        e.preventDefault()
        if (!isNaN(ico)) {
            let converter = require('xml-js');
            const getDataJson = await axios.get(`http://wwwinfo.mfcr.cz/cgi-bin/ares/darv_std.cgi?ico=${ico}&jazyk=cz&xml=0`)
                .then( data => {
                    return converter.xml2json(data.data,{compact:true, spaces:4});
                })
            this.setState({
                dataJSON: getDataJson,
                error:false
            })
        } else {
            this.setState({
                error: true
            })
        }
    }



    render() {
        const {dataJSON,error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(error|| dataJSON===[])? <View dataJSON={dataJSON}/> : null
        return (

            <div className="App">
                <h1 className='Name'>Aplikace na základě poskytnutého parametru (IČO) získá ze serveru ARES XML data a následně vrátí ve formátu JSON</h1>
                <div>
                    <input type="text" className="form-control input" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Vložte IČO firmy" onChange={this.changeICO}/>
                </div>
                <button className="btn btn-primary" onClick={this.getInfo}>GO TO JSON</button>
                <hr/>
                <div className='json'>
                     <pre>
                         <div className="error">
                           {errorMessage}
                         </div>
                           {content}
                     </pre>
                </div>
            </div>


        );
    }

}

const View = ({dataJSON})=>{
    return (<span>{dataJSON}</span>)

}

const ErrorMessage = () => {
    return (
        <>
            <span>Only numbers available</span>
            </>
    )
}

export default App;




