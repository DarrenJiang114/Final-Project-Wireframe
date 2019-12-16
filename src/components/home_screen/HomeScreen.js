import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import TodoListLinks from './TodoListLinks'
import { getFirestore } from 'redux-firestore';
import WireframeJson from '../../test/WireframeData.json';
import {Link} from 'react-router-dom';
import{Modal, Button} from 'react-materialize';

class HomeScreen extends Component {
    state={
        title : "",
        width : "",
        height : ""
    }
    handleNewWireframe = () => {
        let newWF = {
            title: this.state.title,
            width: this.state.width,
            height: this.state.height,
            diagram : [],
        }
        const fireStore = getFirestore();
        let newList = fireStore.collection("Wireframes").doc();
        newList.set(newWF);

        this.props.history.push({
            key: newWF.title,
        });
    }
    handleChange = (e) =>{
        const {target} = e;
        if(target.name == "title"){
            this.state.title = target.value;
        }
        if(target.name == "height"){
            this.state.height = target.value;
        }
        if(target.name == "width"){
            this.state.width = target.value;
        }
        console.log(this.state.title);
    }
    deleteWF = (WF) =>{
        const firestore = getFirestore();
        firestore.collection("Wireframes").doc(WF.id).delete();

    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        const Wireframes = WireframeJson;
        console.log(Wireframes);

        return (
            <div className="z-depth-2" style={{
                backgroundColor: "#55435f", paddingBottom: '70px', borderRadius: '0 0 10px 10px',
                backgroundImage: 'linear-gradient(to bottom, #F5F1F0, #FAE5D3)'
            }}>
                <div className="dashboard container">
                    <div className="row">
                        <div className="col s12 m4">
                            <div>Recent works</div>
                            <TodoListLinks Wireframes = "{Wireframes}" deleteWF = {this.deleteWF}/>
                        </div>

                        <div className="col s8">
                            <div className="banner">
                                Wireframer<br />
                                
                        </div>

                            <div style={{ paddingTop: '15px' }} className="home_new_list_container center-align">
                                {/* {<button className="home_new_list_button" onClick={this.handleNewList}>
                                    Create a New To Do List
                                </button>} */}
                                <a className="waves-effect waves-light btn-large grey accent-2 hoverable rounded modal-trigger"
                                data-target = "addWireframe">
                                    <i className="material-icons right">library_add</i>Create New Wireframe
                                </a>
                                <Modal id= "addWireframe">
                                    <div class = "input-field">
                                        <label>Title</label>
                                        <input className = "active" type= "text" name = "title" onChange = {this.handleChange}></input>
                                    </div>
                                    <div class = "input-field">
                                        <label>Height</label>
                                        <input className = "active" type= "text" name = "height" onChange = {this.handleChange}></input>
                                    </div>
                                    <div class = "input-field">
                                        <label>Width</label>
                                        <input className = "active" type= "text" name = "width" onChange = {this.handleChange}></input>
                                    </div>
                                    <Button className = "modal-close" onClick = {this.handleNewWireframe}>Submit</Button>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'Wireframes'  },
    ]),
)(HomeScreen);