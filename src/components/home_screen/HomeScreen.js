import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import TodoListLinks from './TodoListLinks'
import { getFirestore } from 'redux-firestore';
import WireframeJson from '../../test/WireframeData.json';

class HomeScreen extends Component {
    handleNewList = () => {
        let newListData = {
            name: 'Unnamed todolist',
            owner: 'Unknown owner',
            items: [],
            time: Date.now(),
        }
        const fireStore = getFirestore();
        let newList = fireStore.collection("todoLists").doc();
        newList.set(newListData);

        this.props.history.push({
            pathname: "todoList/" + newList.id,
            key: newList.id,
        });
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
                            <TodoListLinks Wireframes = "{Wireframes}"/>
                        </div>

                        <div className="col s8">
                            <div className="banner">
                                Wireframer<br />
                                
                        </div>

                            <div style={{ paddingTop: '15px' }} className="home_new_list_container center-align">
                                {/* {<button className="home_new_list_button" onClick={this.handleNewList}>
                                    Create a New To Do List
                                </button>} */}
                                <a onClick={this.handleNewList} className="waves-effect waves-light btn-large grey accent-2 hoverable rounded">
                                    <i className="material-icons right">library_add</i>Create New Wireframe
                                </a>
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