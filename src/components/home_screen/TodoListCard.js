import React from 'react';
import {icons, Modal} from 'react-materialize';
import { Redirect, Link } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
class TodoListCard extends React.Component {
    state ={

    }
    x = (wf) => {
        console.log(wf);
    }
    loadWF =() =>{
        console.log("yrtr");
    }
    render() {
        let card = {width: "auto"}
        let Wireframe = this.props.Wireframe;
        console.log("TodoListCard, todoList.id: " + this.props.Wireframe.title);
        let del = {position: "relative", left: "-40px", top: "60px", cursor:  "pointer"};
        let confirmDelete = {position: "relative", top: "80px", left: "-50px"}
        console.log(Wireframe);
        return (
            <div>
            <i  class = "material-icons modal-trigger" data-target = "ConfirmDelete" style = {del} >close</i>
            <Link onClick = {this.loadWF}to={{pathname: ('/Wireframe/' + Wireframe.title), Wireframe: {Wireframe}}}>
            <div className="card z-depth-2 rounded grey lighten-4 todo-list-link hoverable" style = {card}>
                <div className="card-content grey-text text-darken-4 item_card">
                    {Wireframe.title}
                </div>
            </div>
            </Link>
            <Modal id = "ConfirmDelete">
                <span>Are you sure you want to delete this Wireframe?</span>
                <div class = "modal-footer">
                 <button onClick = {this.props.deleteWF.bind(this, Wireframe)} style = {confirmDelete} class="waves-effect waves-black btn-flat modal-close">Delete</button>
                 </div>
            </Modal>
            </div>
        );
    }
}
export default TodoListCard;