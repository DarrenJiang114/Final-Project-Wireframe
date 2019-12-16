import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import TodoListCard from './TodoListCard';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
class TodoListLinks extends React.Component {
    render() {
        const fireStore = getFirestore();
        const Wireframes = this.props.Wireframes;
        console.log(Wireframes);
        return (
            <div className="todo-lists section">
                {Wireframes && Wireframes.map(Wireframe => (
        
                        <TodoListCard Wireframe={Wireframe} deleteWF = {this.props.deleteWF}/>
                    
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        Wireframes: state.firestore.ordered.Wireframes,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{collection : "Wireframes"}])
    )
    (TodoListLinks);