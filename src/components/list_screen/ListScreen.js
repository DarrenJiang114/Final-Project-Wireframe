import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { Modal, Button, icons } from 'react-materialize';


class ListScreen extends Component {
    state = {
        name: '',
        owner: '',
    }

    sortCriteria = 'none';
    changedTime = false;

    updateTime = () => {
        console.log("updating time")
        let fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).update({ time: Date.now() })
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));

        const fireStore = getFirestore();
        let dbitem = fireStore.collection('todoLists').doc(this.props.todoList.id);
        dbitem.update({ [target.id]: target.value });
    }

    addItem = () => {
        console.log("Adding a new item");
        this.props.history.push({
            pathname: this.props.todoList.id + "/item/" + this.props.todoList.items.length,
        });
    }

    deleteList = () => {
        let fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });

        this.props.history.goBack();
    }

    sortByDescription = () => {
        if (this.sortCriteria !== SORT_BY_TASK_INCREASING)
            this.sortCriteria = SORT_BY_TASK_INCREASING
        else
            this.sortCriteria = SORT_BY_TASK_DECREASING;
        this.sortList(this.sortCriteria);
    }

    sortByDueDate = () => {
        if (this.sortCriteria !== SORT_BY_DUE_DATE_INCREASING)
            this.sortCriteria = SORT_BY_DUE_DATE_INCREASING;
        else
            this.sortCriteria = SORT_BY_DUE_DATE_DECREASING;
        this.sortList(this.sortCriteria);
    }

    sortByCompleted = () => {
        if (this.sortCriteria !== SORT_BY_STATUS_INCREASING)
            this.sortCriteria = SORT_BY_STATUS_INCREASING;
        else
            this.sortCriteria = SORT_BY_STATUS_DECREASING;
        this.sortList(this.sortCriteria);
    }

    sortList = (criteria) => {
        console.log("Sorting by: ", this.sortCriteria);
        let newItems = this.generateItemsInSortedOrder(criteria);
        for (let i = 0; i < newItems.length; i++) {
            newItems[i].key = i;
            newItems[i].id = i;
        }

        let firestore = getFirestore();
        firestore.collection("todoLists").doc(this.props.todoList.id).update({ items: newItems });
    }

    generateItemsInSortedOrder = (criteria) => {
        let newItems = Object.assign([], this.props.todoList.items);
        newItems.sort(function (a, b) {
            if (criteria === SORT_BY_TASK_INCREASING)
                return a.description.localeCompare(b.description);
            else if (criteria === SORT_BY_TASK_DECREASING)
                return b.description.localeCompare(a.description);
            else if (criteria === SORT_BY_DUE_DATE_INCREASING)
                return a.due_date.localeCompare(b.due_date);
            else if (criteria === SORT_BY_DUE_DATE_DECREASING)
                return b.due_date.localeCompare(a.due_date);
            else if (criteria === SORT_BY_STATUS_INCREASING)
                return ("" + a.completed).localeCompare("" + b.completed);
            else
                return ("" + b.completed).localeCompare("" + a.completed);
        });
        return newItems;
    }

    render() {
        const auth = this.props.auth;

        let Wireframe = this.props.location.Wireframe;
        console.log(Wireframe);
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        if (!Wireframe){
            return <React.Fragment />
        }
        let LeftRectstyle = {fill: "#FAE5D3" , strokewidth:3 , stroke:"#000000", position: "absolute", 
        top: "100px", left: "10px", z: "-1"};
        let RightRectstyle = {fill: "#FAE5D3" , strokewidth:3 , stroke:"#000000", position: "absolute", 
        top: "100px", left: "800px"};
        let ZoomIn = {position: "relative", z: 1, top: "40px", left: "-140px"}
        let ZoomOut = {position: "relative", z: 1, top: "40px", left: "-145px"}
        let SaveBTN = {position: "relative", z: 1, top: "30px", left: "-140px", font:"6px" }
        let CloseBTN = {position: "relative", z: 1, top: "30px", left: "-140px" }
        let Container = {fill: "#FFFFFF", z: 1, position: "absolute", top: "180px",
        left: "60px"}
        let containerLabel = {position: "absolute", left: "75px", top: "260px"}
        let properties = {position: "relative", left: "700px", top: "10px"}
        let inputPrompt = {position: "absolute", left: "45px", top: "290px"}
        let label = {position: "absolute", left: "90px", top: "310px"}
        return (
            <div>
                <div className="container">
                    <svg width = "255" height = "550" style = {LeftRectstyle}>
                        <rect  width = "220" height = "500"> 
                        </rect> 
                    </svg>
                    <i class = "small material-icons" style ={ZoomIn} >zoom_in</i>
                    <i class = "small material-icons" style ={ZoomOut} >zoom_out</i>
                    <a class="waves-effect waves-light grey btn-small" 
                    style = {SaveBTN}>Save</a>
                    <a class="waves-effect waves-light grey btn-small" 
                    style = {CloseBTN}>Close</a>
                    <svg width = "150" height = "100" style = {Container}>
                        <rect  width = "125" height = "75"> 
                        </rect> 
                    </svg>
                    <span style = {containerLabel}>Container</span>
                    <span style = {inputPrompt}>Prompt for input:</span>
                    <b style = {label}>Label</b>
                </div>
                <div className="container">
                    <svg width = "250" height = "550" style = {RightRectstyle}>
                        <rect  width = "200" height = "500" />
                    </svg>
                    <span style ={properties}>Properties</span>
                    <div className = "input-field" >
                            <input className = "active" type= "text" ></input>
                    </div>
                </div>
            </div>
        );
    }
}

const SORT_BY_TASK_INCREASING = 'sort_by_task_increasing';
const SORT_BY_TASK_DECREASING = 'sort_by_task_decreasing';
const SORT_BY_DUE_DATE_INCREASING = 'sort_by_due_date_increasing';
const SORT_BY_DUE_DATE_DECREASING = 'sort_by_due_date_decreasing';
const SORT_BY_STATUS_INCREASING = 'sort_by_status_increasing';
const SORT_BY_STATUS_DECREASING = 'sort_by_status_decreasing';

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const { Wireframes } = state.firestore.data;
    const Wireframe = Wireframes ? Wireframes[id] : null;
    if (Wireframe)
        Wireframe.id = id;

    return {
        Wireframe,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'Wireframes' },
    ]),
)(ListScreen);